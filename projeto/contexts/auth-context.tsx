"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { API_URL } from "@/lib/config"

interface User {
  id: number
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Verificar se estamos no cliente
        if (typeof window === "undefined") {
          setIsLoading(false)
          return
        }

        console.log("🔍 Inicializando autenticação...")

        // Aguardar um pouco para garantir que o DOM esteja pronto
        await new Promise((resolve) => setTimeout(resolve, 100))

        const savedUser = localStorage.getItem("user")
        console.log("📦 Dados do localStorage:", savedUser)

        if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
          try {
            const userData = JSON.parse(savedUser)
            console.log("👤 Usuário encontrado:", userData)

            // Validar se os dados do usuário são válidos
            if (userData && userData.id && userData.email) {
              setUser(userData)
              console.log("✅ Usuário carregado com sucesso")
            } else {
              console.log("❌ Dados do usuário inválidos, removendo...")
              localStorage.removeItem("user")
            }
          } catch (parseError) {
            console.error("❌ Erro ao fazer parse dos dados:", parseError)
            localStorage.removeItem("user")
          }
        } else {
          console.log("❌ Nenhum usuário válido encontrado")
        }
      } catch (error) {
        console.error("❌ Erro na inicialização:", error)
      } finally {
        console.log("✅ Inicialização concluída")
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log("🔐 Tentando fazer login para:", email)

      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("📡 Resposta do servidor:", response.status)

      if (!response.ok) {
        const data = await response.json()
        console.error("❌ Erro na resposta:", data)
        throw new Error(data.error || "Falha ao fazer login")
      }

      const userData = await response.json()
      console.log("✅ Login bem-sucedido:", userData)

      // Validar dados antes de salvar
      if (!userData || !userData.id || !userData.email) {
        throw new Error("Dados de usuário inválidos recebidos do servidor")
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      console.log("💾 Usuário salvo no localStorage")
    } catch (error: any) {
      console.error("❌ Erro de login:", error)
      throw error
    }
  }

  const logout = () => {
    console.log("🚪 Fazendo logout...")
    setUser(null)
    localStorage.removeItem("user")
    console.log("✅ Logout concluído")
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
  }

  console.log("🔄 AuthContext render:", {
    hasUser: !!user,
    userName: user?.name,
    isLoading,
  })

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
