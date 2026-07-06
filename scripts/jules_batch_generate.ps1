# scripts/jules_batch_generate.ps1

$ErrorActionPreference = "Stop"

Write-Host "Iniciando processo em lote de geracao de exemplos via Jules..." -ForegroundColor Cyan

$skills = Get-ChildItem -Path "plugins" -Recurse -Filter "SKILL.pt-br.md"

if ($skills.Count -eq 0) {
    Write-Host "Nenhuma skill encontrada!" -ForegroundColor Red
    exit 1
}

Write-Host ("Encontradas {0} skills para processar." -f $skills.Count) -ForegroundColor Green

foreach ($skill in $skills) {
    # Resolve the relative paths
    $skillPath = Resolve-Path -Relative $skill.FullName
    $skillDir = Resolve-Path -Relative $skill.DirectoryName
    
    # Clean the .\ prefix if present for cleaner paths in prompts
    $skillPath = $skillPath -replace '^\.\\', ''
    $skillDir = $skillDir -replace '^\.\\', ''
    
    Write-Host "Processando: $skillDir" -ForegroundColor Yellow

    $prompt = "Leia o arquivo '$skillPath'. Com base nas instrucoes e responsabilidades desta skill, gere um arquivo contendo um dicionario de dados JSON com exemplos praticos, payloads e cenarios aplicaveis. Salve o arquivo em '$skillDir/reference/examples.json'. (Crie o diretorio 'reference' caso ele nao exista). Nao altere outros arquivos da base."
    
    # Run jules new
    Write-Host "  > Enviando sessao para Jules..."
    jules new $prompt
    
    # Small delay to ensure clean API interactions
    Start-Sleep -Seconds 2
}

Write-Host "Processamento em lote concluido! Acesse as Pull Requests ou o dashboard do Jules para acompanhar as sessoes." -ForegroundColor Cyan
