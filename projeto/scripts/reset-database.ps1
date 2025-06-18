# Script PowerShell para Windows
Write-Host "🗑️ Limpando banco de dados e migrações..." -ForegroundColor Yellow

# Remover pasta de migrações
if (Test-Path "prisma\migrations") {
    Remove-Item -Recurse -Force "prisma\migrations"
    Write-Host "✅ Pasta migrations removida" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Pasta migrations não encontrada" -ForegroundColor Blue
}

# Remover banco de dados
if (Test-Path "prisma\dev.db") {
    Remove-Item -Force "prisma\dev.db"
    Write-Host "✅ Banco dev.db removido" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Arquivo dev.db não encontrado" -ForegroundColor Blue
}

# Remover journal do banco
if (Test-Path "prisma\dev.db-journal") {
    Remove-Item -Force "prisma\dev.db-journal"
    Write-Host "✅ Journal removido" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Arquivo journal não encontrado" -ForegroundColor Blue
}

Write-Host "✅ Limpeza concluída!" -ForegroundColor Green
Write-Host "Agora execute: npx prisma migrate dev --name init" -ForegroundColor Cyan
