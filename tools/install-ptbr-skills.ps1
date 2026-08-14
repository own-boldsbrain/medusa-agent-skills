<#
.SYNOPSIS
    Materializes the translated skills as the active skills at a target location.

.DESCRIPTION
    Agent runtimes only load SKILL.md, so the SKILL.pt-BR.md files in this repo are
    inert until they are materialized under the canonical name. This script copies each
    skill directory and, in the copy, promotes every translated file to its base name:

        SKILL.pt-BR.md              -> SKILL.md
        reference/workflows.pt-br.md -> reference/workflows.md

    The English file it supersedes is dropped. Files with no translation are copied
    verbatim, so a partially translated skill still installs completely.

    Suffix matching is case-insensitive: this repo contains both `.pt-BR.md` and
    `.pt-br.md`. Markdown bodies are rewritten so references that name a translated
    file explicitly still resolve after the rename.

.PARAMETER TargetPath
    Directory that receives the skill folders. Defaults to the personal Claude Code
    skills directory (~/.claude/skills), which loads them in every project.

.PARAMETER Skill
    Optional skill names to install. Defaults to all of them.

.PARAMETER Language
    Translation suffix to promote. Defaults to pt-BR.

.PARAMETER Force
    Replace skill folders that already exist at the target.

.PARAMETER ListOnly
    Report what would be installed without writing anything.

.EXAMPLE
    .\tools\install-ptbr-skills.ps1

.EXAMPLE
    .\tools\install-ptbr-skills.ps1 -Skill building-with-medusa,db-migrate -Force

.EXAMPLE
    .\tools\install-ptbr-skills.ps1 -TargetPath C:\path\to\project\.claude\skills -ListOnly
#>
[CmdletBinding()]
param(
    [string]$TargetPath = (Join-Path $HOME ".claude/skills"),

    [string[]]$Skill,

    [string]$Language = "pt-BR",

    [switch]$Force,

    [switch]$ListOnly
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$pluginsPath = Join-Path $repoRoot "plugins"

if (-not (Test-Path -LiteralPath $pluginsPath -PathType Container)) {
    throw "Plugins directory not found: $pluginsPath"
}

# `.pt-BR.md` and `.pt-br.md` both occur in this repo, so match without regard to case.
$escapedLanguage = [regex]::Escape($Language)
$translatedSuffix = [regex]::new("\.$escapedLanguage\.md$", "IgnoreCase")
$referenceSuffix = [regex]::new("\.$escapedLanguage\.md", "IgnoreCase")

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

function Get-SkillDirectories {
    Get-ChildItem -LiteralPath $pluginsPath -Directory | ForEach-Object {
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
    } | Sort-Object Skill
}

# Decides, for one skill folder, which source file supplies each destination file.
function Resolve-SkillPlan {
    param([string]$SourcePath)

    $files = Get-ChildItem -LiteralPath $SourcePath -Recurse -File

    # Destination paths that a translated file will claim; the English original is dropped.
    $supersededDestinations = [System.Collections.Generic.HashSet[string]]::new(
        [System.StringComparer]::OrdinalIgnoreCase
    )

    foreach ($file in $files) {
        $relative = [System.IO.Path]::GetRelativePath($SourcePath, $file.FullName)
        if ($translatedSuffix.IsMatch($relative)) {
            [void]$supersededDestinations.Add($translatedSuffix.Replace($relative, ".md"))
        }
    }

    foreach ($file in $files) {
        $relative = [System.IO.Path]::GetRelativePath($SourcePath, $file.FullName)

        if ($translatedSuffix.IsMatch($relative)) {
            [PSCustomObject]@{
                Source      = $file.FullName
                Destination = $translatedSuffix.Replace($relative, ".md")
                Kind        = "translated"
            }
            continue
        }

        # An English file whose translation will take its place at the destination.
        if ($supersededDestinations.Contains($relative)) {
            continue
        }

        [PSCustomObject]@{
            Source      = $file.FullName
            Destination = $relative
            Kind        = "untranslated"
        }
    }
}

$availableSkillDirs = @(Get-SkillDirectories)

if (-not $availableSkillDirs) {
    throw "No skills were found under $pluginsPath"
}

if ($Skill -and $Skill.Count -gt 0) {
    $requested = @($Skill | ForEach-Object { $_.Trim() } | Where-Object { $_ })
    $availableNames = @($availableSkillDirs.Skill)
    $missing = @($requested | Where-Object { $_ -notin $availableNames })

    if ($missing) {
        throw "Unknown skill(s): $($missing -join ', '). Available: $($availableNames -join ', ')"
    }

    $selectedSkillDirs = @($availableSkillDirs | Where-Object { $_.Skill -in $requested })
}
else {
    $selectedSkillDirs = $availableSkillDirs
}

if (-not $ListOnly) {
    New-Item -ItemType Directory -Path $TargetPath -Force | Out-Null
    $TargetPath = (Resolve-Path -LiteralPath $TargetPath).Path
}

$installed = foreach ($skillDir in $selectedSkillDirs) {
    $plan = @(Resolve-SkillPlan -SourcePath $skillDir.SourcePath)
    $translatedCount = @($plan | Where-Object { $_.Kind -eq "translated" }).Count
    $untranslated = @($plan | Where-Object { $_.Kind -eq "untranslated" -and $_.Destination -like "*.md" })
    $destinationPath = Join-Path $TargetPath $skillDir.Skill

    if (-not $ListOnly) {
        if (Test-Path -LiteralPath $destinationPath) {
            if (-not $Force) {
                throw "Destination already exists: $destinationPath. Re-run with -Force to replace it."
            }

            Remove-Item -LiteralPath $destinationPath -Recurse -Force
        }

        foreach ($item in $plan) {
            $destinationFile = Join-Path $destinationPath $item.Destination
            New-Item -ItemType Directory -Path (Split-Path -Parent $destinationFile) -Force | Out-Null

            if ($item.Destination -like "*.md") {
                # Point references at the promoted names, e.g. `reference/schema.pt-BR.md`.
                $content = [System.IO.File]::ReadAllText($item.Source)
                $content = $referenceSuffix.Replace($content, ".md")
                [System.IO.File]::WriteAllText($destinationFile, $content, $utf8NoBom)
            }
            else {
                Copy-Item -LiteralPath $item.Source -Destination $destinationFile
            }
        }
    }

    [PSCustomObject]@{
        Skill        = $skillDir.Skill
        Plugin       = $skillDir.Plugin
        Files        = $plan.Count
        Translated   = $translatedCount
        Untranslated = $untranslated.Count
    }
}

$installed = @($installed | Sort-Object Skill)
$installed | Format-Table -AutoSize

$gaps = @($installed | Where-Object { $_.Untranslated -gt 0 })
if ($gaps) {
    Write-Warning ("Markdown left in the source language for: {0}" -f (($gaps.Skill) -join ', '))
}

Write-Host ""
if ($ListOnly) {
    Write-Host ("Would install {0} skill(s) to {1}" -f $installed.Count, $TargetPath)
}
else {
    Write-Host ("Installed {0} skill(s) ({1} translated file(s)) to {2}" -f `
        $installed.Count, ($installed | Measure-Object -Property Translated -Sum).Sum, $TargetPath)
}
