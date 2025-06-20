// Detectar se está na Vercel ou local
export const API_URL =
  process.env.NODE_ENV === "production"
    ? "" // Na Vercel, usar rotas relativas
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
