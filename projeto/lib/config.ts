// Configuração corrigida para funcionar em build e runtime
export const API_URL =
  typeof window !== "undefined"
    ? "" // No cliente, usar rotas relativas
    : process.env.NODE_ENV === "production"
      ? process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://your-app.vercel.app" // Substitua pelo seu domínio
      : "http://localhost:3000" // Desenvolvimento

// Para debug
export const IS_PRODUCTION = process.env.NODE_ENV === "production"
export const IS_CLIENT = typeof window !== "undefined"
