"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { API_URL } from "@/lib/config" // IMPORTANTE: Importar a config

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("🔐 Tentando fazer login para:", email)

      // CORRIGIDO: Usar API_URL em vez de localhost hardcoded
      const response = await fetch(`${API_URL}/api/users`)

      if (!response.ok) {
        setError("Falha ao buscar usuários")
        return
      }

      const users = await response.json()
      const user = users.find((u: any) => u.email === email)

      if (!user) {
        console.log("❌ Usuário não encontrado para email:", email)
        setError("Usuário não encontrado")
        return
      }

      console.log("✅ Usuário encontrado:", user.name)

      // Limpar qualquer dado anterior e salvar novo usuário
      localStorage.removeItem("user")
      localStorage.setItem("user", JSON.stringify(user))

      console.log("💾 Usuário salvo no localStorage")
      console.log("🔄 Redirecionando para dashboard...")

      // Pequeno delay para garantir que o localStorage foi atualizado
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
    } catch (err: any) {
      console.error("❌ Erro de login:", err)
      setError("Falha ao fazer login. Verifique suas credenciais.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: "1rem",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-header">
          <h1 className="card-title">Login</h1>
          <p>Entre com seu email para acessar sua conta</p>
        </div>
        <div className="card-content">
          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                padding: "0.75rem",
                borderRadius: "4px",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="button button-primary"
              style={{ width: "100%", marginTop: "1rem" }}
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
        <div className="card-footer" style={{ justifyContent: "center" }}>
          <div style={{ textAlign: "center", fontSize: "0.875rem" }}>
            Não tem uma conta?{" "}
            <Link href="/register" style={{ color: "#3b82f6", textDecoration: "none" }}>
              Registre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
