"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { API_URL } from "@/lib/config"
import type { Post } from "@/types"
import { formatDate } from "@/lib/utils"
import { UserNav } from "@/components/user-nav"

interface PageProps {
  params: { id: string }
}

interface User {
  id: number
  email: string
  name: string
}

export default function PostPage({ params }: PageProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const postId = Number.parseInt(params.id)

  useEffect(() => {
    // Verificar se o usuário está logado
    const checkUser = () => {
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("user")
        if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
          try {
            const userData = JSON.parse(savedUser)
            if (userData && userData.id && userData.email) {
              setUser(userData)
            }
          } catch (error) {
            console.error("Erro ao fazer parse do usuário:", error)
          }
        }
      }
    }

    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts/${postId}`)
        if (response.ok) {
          const data = await response.json()

          if (!data.published) {
            setError("Este post não está disponível")
            return
          }

          setPost(data)
        } else {
          setError("Post não encontrado")
        }
      } catch (err) {
        setError("Erro ao carregar o post")
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
    if (postId) {
      fetchPost()
    }
  }, [postId])

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        {/* Header */}
        <header className="header">
          <div className="container header-content">
            <Link href={user ? "/dashboard" : "/"} className="logo">
              Blog App
            </Link>
            {user ? (
              <UserNav />
            ) : (
              <nav style={{ display: "flex", gap: "1rem" }}>
                <Link href="/login" className="button button-outline">
                  Login
                </Link>
              </nav>
            )}
          </div>
        </header>

        <main className="container" style={{ paddingTop: "2rem", paddingBottom: "3rem", maxWidth: "800px" }}>
          <div className="skeleton" style={{ height: "2.5rem", width: "75%", marginBottom: "1rem" }}></div>
          <div className="skeleton" style={{ height: "1.5rem", width: "50%", marginBottom: "2rem" }}></div>

          <div className="card">
            <div className="card-content">
              <div className="skeleton" style={{ height: "1rem", width: "100%", marginBottom: "1rem" }}></div>
              <div className="skeleton" style={{ height: "1rem", width: "100%", marginBottom: "1rem" }}></div>
              <div className="skeleton" style={{ height: "1rem", width: "75%" }}></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        {/* Header */}
        <header className="header">
          <div className="container header-content">
            <Link href={user ? "/dashboard" : "/"} className="logo">
              Blog App
            </Link>
            {user ? (
              <UserNav />
            ) : (
              <nav>
                <Link href="/posts" className="button button-outline">
                  ← Voltar aos posts
                </Link>
              </nav>
            )}
          </div>
        </header>

        <main className="container" style={{ paddingTop: "3rem", textAlign: "center", maxWidth: "600px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.5 }}>❌</div>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#374151" }}>Oops!</h1>
          <p style={{ color: "#6b7280", marginBottom: "2rem", fontSize: "1.125rem" }}>{error}</p>
          <Link href="/posts" className="button button-primary">
            ← Voltar aos posts
          </Link>
        </main>
      </div>
    )
  }

  if (!post) {
    return null
  }

  // Verificar se o usuário logado é o autor do post
  const isAuthor = user && post.authorId === user.id

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <header className="header">
        <div className="container header-content">
          <Link href={user ? "/dashboard" : "/"} className="logo">
            Blog App
          </Link>
          {user ? (
            <UserNav />
          ) : (
            <nav style={{ display: "flex", gap: "1rem" }}>
              <Link href="/login" className="button button-outline">
                Login
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Navegação rápida */}
      <div className="container" style={{ paddingTop: "1rem" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/posts" className="button button-outline button-sm">
            ← Voltar aos posts
          </Link>
          {user && (
            <>
              {isAuthor && (
                <Link href={`/dashboard/posts/edit/${post.id}`} className="button button-primary button-sm">
                  ✏️ Editar Post
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Conteúdo do Post */}
      <main className="container" style={{ paddingTop: "2rem", paddingBottom: "3rem", maxWidth: "800px" }}>
        <article>
          <header style={{ marginBottom: "2rem" }}>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#1f2937",
                lineHeight: "1.2",
              }}
            >
              {post.title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#6b7280", fontSize: "0.875rem" }}>
              <span>
                por <strong>{post.author?.name || "Autor desconhecido"}</strong>
                {isAuthor && <span style={{ color: "#3b82f6", marginLeft: "0.5rem" }}>(você)</span>}
              </span>
              <span>•</span>
              <span>{post.createdAt ? formatDate(post.createdAt) : "Data desconhecida"}</span>
            </div>
          </header>

          <div className="card">
            <div className="card-content" style={{ padding: "2rem" }}>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.8",
                  color: "#374151",
                  fontSize: "1.125rem",
                }}
              >
                {post.content ? (
                  post.content
                ) : (
                  <p style={{ fontStyle: "italic", color: "#9ca3af", textAlign: "center", padding: "2rem" }}>
                    Este post não tem conteúdo.
                  </p>
                )}
              </div>
            </div>
          </div>

          <footer style={{ marginTop: "3rem", textAlign: "center" }}>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              {user ? (
                <Link href="/dashboard/posts/new" className="button button-primary">
                  ➕ Criar seu post
                </Link>
              ) : (
                <Link href="/register" className="button button-primary">
                  Criar uma conta
                </Link>
              )}
            </div>
          </footer>
        </article>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "2rem 0", backgroundColor: "white" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
            © 2024 Blog App. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
