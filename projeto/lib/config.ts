// CORRIGIDO: Configuração da API
export const API_URL =
  process.env.NODE_ENV === "production"
    ? "" // Usar rotas relativas em produção
    : "http://localhost:3000"

// Para debug
export const IS_PRODUCTION = process.env.NODE_ENV === "production"
export const DATABASE_URL = process.env.DATABASE_URL
