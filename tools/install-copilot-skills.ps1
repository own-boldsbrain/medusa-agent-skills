[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$TargetPath,

    [string[]]$Skill,

    [switch]$Force
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptRoot
$pluginsPath = Join-Path $repoRoot "plugins"

if (-not (Test-Path -LiteralPath $pluginsPath -PathType Container)) {
    throw "Plugins directory not found: $pluginsPath"
}

if (-not (Test-Path -LiteralPath $TargetPath)) {
    New-Item -ItemType Directory -Path $TargetPath -Force | Out-Null
}

$resolvedTarget = (Resolve-Path -LiteralPath $TargetPath).Path
$targetSkillsPath = Join-Path $resolvedTarget ".github\skills"

New-Item -ItemType Directory -Path $targetSkillsPath -Force | Out-Null

$availableSkillDirs = Get-ChildItem -LiteralPath $pluginsPath -Directory |
    ForEach-Object {
        $pluginDir = $_
        $skillsDir = Join-Path $pluginDir.FullName "skills"

        if (Test-Path -LiteralPath $skillsDir -PathType Container) {
            Get-ChildItem -LiteralPath $skillsDir -Directory | ForEach-Object {
                [PSCustomObject]@{
                    Plugin     = $pluginDir.Name
                    Skill      = $_.Name
                    SourcePath = $_.FullName
                }
            }
        }
    } |
    Sort-Object Skill

if (-not $availableSkillDirs) {
    throw "No skills were found under $pluginsPath"
}

if ($Skill -and $Skill.Count -gt 0) {
    $requested = $Skill | ForEach-Object { $_.Trim() } | Where-Object { $_ }
    $availableNames = $availableSkillDirs.Skill
    $missing = $requested | Where-Object { $_ -notin $availableNames }

    if ($missing) {
        throw "Unknown skill(s): $($missing -join ', '). Available: $($availableNames -join ', ')"
    }

    $selectedSkillDirs = $availableSkillDirs | Where-Object { $_.Skill -in $requested }
}
else {
    $selectedSkillDirs = $availableSkillDirs
}

$exported = @(
    foreach ($skillDir in $selectedSkillDirs) {
    $destinationPath = Join-Path $targetSkillsPath $skillDir.Skill

    if (Test-Path -LiteralPath $destinationPath) {
        if (-not $Force) {
            throw "Destination already exists: $destinationPath. Re-run with -Force to replace it."
        }

        Remove-Item -LiteralPath $destinationPath -Recurse -Force
    }

    Copy-Item -LiteralPath $skillDir.SourcePath -Destination $destinationPath -Recurse

    [PSCustomObject]@{
        Skill       = $skillDir.Skill
        Plugin      = $skillDir.Plugin
        Destination = $destinationPath
    }
}
)

$exported |
    Sort-Object Skill |
    Format-Table -AutoSize

Write-Host ""
Write-Host ("Exported {0} skill(s) to {1}" -f $exported.Count, $targetSkillsPath)
