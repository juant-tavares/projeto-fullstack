#!/bin/bash
echo "🗑️ Limpando banco de dados e migrações..."

# Parar qualquer processo que possa estar usando o banco
echo "Parando processos..."

# Remover banco de dados
rm -f prisma/dev.db
rm -f prisma/dev.db-journal

# Remover pasta de migrações
rm -rf prisma/migrations

echo "✅ Limpeza concluída!"
echo "Agora execute: npx prisma migrate dev --name init"
