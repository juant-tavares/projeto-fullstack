// Configuração para produção na Vercel
export const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : ""
    : "http://localhost:3000"

// Para debug
export const IS_PRODUCTION = process.env.NODE_ENV === "production"
export const DATABASE_URL = process.env.DATABASE_URL
