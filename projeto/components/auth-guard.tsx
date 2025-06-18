"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window === "undefined") {
          setIsLoading(false)
          return
        }

        console.log("🔍 useAuth: Verificando autenticação...")

        // Aguardar um pouco para garantir que o DOM esteja pronto
        await new Promise((resolve) => setTimeout(resolve, 50))

        const savedUser = localStorage.getItem("user")
        console.log("📦 useAuth: Dados salvos:", !!savedUser)

        if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
          try {
            const userData = JSON.parse(savedUser)
            console.log("👤 useAuth: Dados do usuário:", userData.name)

            if (userData && userData.id && userData.email) {
              setUser(userData)
              console.log("✅ useAuth: Usuário autenticado:", userData.name)
            } else {
              console.log("❌ useAuth: Dados inválidos, limpando...")
              localStorage.removeItem("user")
              router.push("/login")
            }
          } catch (parseError) {
            console.error("❌ useAuth: Erro ao fazer parse:", parseError)
            localStorage.removeItem("user")
            router.push("/login")
          }
        } else {
          console.log("❌ useAuth: Nenhum usuário encontrado, redirecionando...")
          router.push("/login")
        }
      } catch (error) {
        console.error("❌ useAuth: Erro na inicialização:", error)
        router.push("/login")
      } finally {
        console.log("✅ useAuth: Inicialização concluída")
        setIsLoading(false)
      }
    }

    initAuth()
  }, [router])

  return { user, isLoading }
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <h2 style={{ marginBottom: "0.5rem", color: "#374151" }}>Verificando autenticação...</h2>
          <p style={{ color: "#6b7280" }}>Aguarde um momento</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // O redirecionamento já foi feito no useAuth
  }

  return <>{children}</>
}
