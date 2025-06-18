"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-guard"
import { API_URL } from "@/lib/config"

export function UserNav() {
  const { user } = useAuth()
  const router = useRouter()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showProfileMenu])

  const handleLogout = () => {
    console.log("🚪 Fazendo logout...")
    localStorage.removeItem("user")
    setShowProfileMenu(false)
    router.push("/")
  }

  const handleDeleteAccount = async () => {
    if (!user) {
      console.error("❌ Usuário não encontrado no contexto")
      alert("Erro: Usuário não encontrado. Faça login novamente.")
      return
    }

    setIsDeleting(true)

    try {
      console.log("🗑️ Deletando conta do usuário:", {
        id: user.id,
        name: user.name,
        email: user.email,
      })

      // Verificar se o usuário existe antes de tentar deletar
      const checkResponse = await fetch(`${API_URL}/api/users/${user.id}`)

      if (!checkResponse.ok) {
        console.error("❌ Usuário não encontrado na API:", user.id)
        throw new Error("Usuário não encontrado no servidor. Talvez já tenha sido deletado.")
      }

      const userData = await checkResponse.json()
      console.log("✅ Usuário encontrado na API:", userData)

      // Agora deletar o usuário
      const deleteResponse = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "DELETE",
      })

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json()
        console.error("❌ Erro na resposta de delete:", errorData)
        throw new Error(errorData.error || "Falha ao deletar conta")
      }

      console.log("✅ Conta deletada com sucesso")

      // Limpar localStorage
      localStorage.removeItem("user")

      // Fechar modais
      setShowDeleteModal(false)
      setShowProfileMenu(false)

      // Mostrar mensagem de sucesso
      alert("Conta deletada com sucesso!")

      // Redirecionar para login após um breve delay
      setTimeout(() => {
        router.push("/login")
      }, 1000)
    } catch (err: any) {
      console.error("❌ Erro ao deletar conta:", err)
      const errorMessage = err.message || "Erro desconhecido ao deletar conta"
      alert("Erro ao deletar conta: " + errorMessage)
      setShowDeleteModal(false)
    } finally {
      setIsDeleting(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/login" className="button button-outline">
          Login
        </Link>
        <Link href="/register" className="button button-primary">
          Registrar
        </Link>
      </div>
    )
  }

  return (
    <>
      <div ref={menuRef} style={{ position: "relative" }}>
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "500",
            transition: "all 0.2s ease",
          }}
          title={`Perfil de ${user.name}`}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
        >
          {getInitials(user.name)}
        </button>

        {showProfileMenu && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: "0",
              marginTop: "0.5rem",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              minWidth: "200px",
              zIndex: 50,
              animation: "fadeIn 0.15s ease-out",
            }}
          >
            <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e5e7eb" }}>
              <p style={{ margin: 0, fontWeight: "500", fontSize: "0.875rem" }}>{user.name}</p>
              <p style={{ margin: 0, color: "#666", fontSize: "0.75rem" }}>{user.email}</p>
              <p style={{ margin: 0, color: "#999", fontSize: "0.65rem" }}>ID: {user.id}</p>
            </div>

            <div style={{ padding: "0.5rem 0" }}>
              <Link
                href="/dashboard"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  textDecoration: "none",
                  color: "#374151",
                  fontSize: "0.875rem",
                  transition: "background-color 0.15s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                onClick={() => setShowProfileMenu(false)}
              >
                📊 Dashboard
              </Link>

              <Link
                href="/dashboard/posts"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  textDecoration: "none",
                  color: "#374151",
                  fontSize: "0.875rem",
                  transition: "background-color 0.15s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                onClick={() => setShowProfileMenu(false)}
              >
                📝 Meus Posts
              </Link>

              <Link
                href="/posts"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  textDecoration: "none",
                  color: "#374151",
                  fontSize: "0.875rem",
                  transition: "background-color 0.15s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                onClick={() => setShowProfileMenu(false)}
              >
                👁️ Posts Públicos
              </Link>
            </div>

            <div style={{ borderTop: "1px solid #e5e7eb", padding: "0.5rem 0" }}>
              <button
                onClick={() => {
                  setShowDeleteModal(true)
                  setShowProfileMenu(false)
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  width: "100%",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#dc2626",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background-color 0.15s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                disabled={isDeleting}
              >
                🗑️ Apagar Conta
              </button>

              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  width: "100%",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#dc2626",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background-color 0.15s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                🚪 Sair
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmação */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteModal(false)
            }
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "500px",
              margin: 0,
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            <div className="card-header">
              <h2 className="card-title" style={{ color: "#dc2626" }}>
                ⚠️ Confirmar Exclusão da Conta
              </h2>
              <p className="card-description">Esta ação não pode ser desfeita!</p>
            </div>
            <div className="card-content">
              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h3 style={{ margin: "0 0 1rem 0", color: "#dc2626", fontSize: "1rem" }}>O que será deletado:</h3>
                <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#7f1d1d" }}>
                  <li>Sua conta de usuário</li>
                  <li>Todos os seus posts</li>
                </ul>
              </div>

              <p style={{ marginBottom: "1.5rem", color: "#374151", fontWeight: "500" }}>
                Tem certeza de que deseja apagar permanentemente sua conta <strong>{user.name}</strong>?
              </p>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="button button-outline"
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button onClick={handleDeleteAccount} className="button button-danger" disabled={isDeleting}>
                  {isDeleting ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: "1rem",
                          height: "1rem",
                          border: "2px solid transparent",
                          borderTop: "2px solid currentColor",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      ></span>
                      Deletando...
                    </span>
                  ) : (
                    "Ok"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}
