"use client"

import type React from "react"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-guard"
import { API_URL } from "@/lib/config"
import type { Post } from "@/types"

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { user, isLoading: authLoading } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [published, setPublished] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const router = useRouter()
  const postId = Number.parseInt(resolvedParams.id)

  useEffect(() => {
    const fetchPost = async () => {
      // Só buscar o post se não estiver carregando autenticação e tiver usuário
      if (!authLoading && user) {
        try {
          console.log("🔍 Buscando post para edição:", postId)
          const response = await fetch(`${API_URL}/api/posts/${postId}`)
          if (response.ok) {
            const data = await response.json()
            console.log("📝 Post carregado:", data.title)
            setPost(data)
            setTitle(data.title)
            setContent(data.content || "")
            setPublished(data.published)
          } else {
            setError("Post não encontrado")
          }
        } catch (err) {
          console.error("❌ Erro ao carregar post:", err)
          setError("Erro ao carregar o post")
        } finally {
          setIsFetching(false)
        }
      } else if (!authLoading && !user) {
        // Se não está carregando auth mas não há usuário, parar loading
        setIsFetching(false)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId, user, authLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!title.trim()) {
      setError("O título é obrigatório")
      return
    }

    if (!user) {
      setError("Você precisa estar logado para editar um post")
      return
    }

    // Verificar se o usuário é o autor do post
    if (post && post.authorId !== user.id) {
      setError("Você não tem permissão para editar este post")
      return
    }

    setIsLoading(true)

    try {
      console.log("💾 Atualizando post:", postId)
      const response = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          published,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Falha ao atualizar post")
      }

      console.log("✅ Post atualizado com sucesso")
      setSuccess("Post atualizado com sucesso!")

      // Redirecionar após um breve delay para mostrar a mensagem de sucesso
      setTimeout(() => {
        router.push("/dashboard/posts")
      }, 1500)
    } catch (err: any) {
      console.error("❌ Erro ao atualizar post:", err)
      setError(err.message || "Ocorreu um erro ao atualizar o post. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar loading durante verificação de auth
  if (authLoading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
        <h2 style={{ marginBottom: "1rem" }}>Carregando...</h2>
        <p>Verificando autenticação...</p>
      </div>
    )
  }

  // Se não há usuário, mostrar erro
  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
        <h2 style={{ marginBottom: "1rem" }}>Erro de autenticação</h2>
        <p style={{ marginBottom: "2rem" }}>Você precisa estar logado para editar posts.</p>
        <button onClick={() => router.push("/login")} className="button button-primary">
          Fazer Login
        </button>
      </div>
    )
  }

  if (isFetching) {
    return (
      <div>
        <div style={{ marginBottom: "2rem" }}>
          <div className="skeleton" style={{ height: "2.5rem", width: "40%", marginBottom: "0.5rem" }}></div>
          <div className="skeleton" style={{ height: "1.25rem", width: "60%" }}></div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="skeleton" style={{ height: "1.5rem", width: "30%" }}></div>
            <div className="skeleton" style={{ height: "1rem", width: "50%", marginTop: "0.5rem" }}></div>
          </div>
          <div className="card-content">
            <div style={{ marginBottom: "1.5rem" }}>
              <div className="skeleton" style={{ height: "1rem", width: "15%", marginBottom: "0.5rem" }}></div>
              <div className="skeleton" style={{ height: "2.5rem", width: "100%" }}></div>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <div className="skeleton" style={{ height: "1rem", width: "20%", marginBottom: "0.5rem" }}></div>
              <div className="skeleton" style={{ height: "10rem", width: "100%" }}></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div className="skeleton" style={{ height: "1.5rem", width: "3rem" }}></div>
              <div className="skeleton" style={{ height: "1rem", width: "20%" }}></div>
            </div>
          </div>
          <div className="card-footer">
            <div className="skeleton" style={{ height: "2.5rem", width: "6rem" }}></div>
            <div className="skeleton" style={{ height: "2.5rem", width: "8rem" }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !post) {
    return (
      <div>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#1f2937" }}>
            Erro ao Carregar Post
          </h1>
          <p style={{ color: "#6b7280" }}>Não foi possível carregar o post solicitado</p>
        </div>

        <div className="card">
          <div className="card-content" style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.5 }}>❌</div>
            <h3 style={{ marginBottom: "1rem", color: "#374151" }}>Post não encontrado</h3>
            <p style={{ marginBottom: "2rem", color: "#6b7280" }}>{error}</p>
            <button onClick={() => router.back()} className="button button-primary">
              ← Voltar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#1f2937" }}>Editar Post</h1>
        <p style={{ color: "#6b7280" }}>Atualize as informações do seu post</p>
      </div>

      {/* Breadcrumb */}
      <div style={{ marginBottom: "1.5rem", fontSize: "0.875rem", color: "#6b7280" }}>
        <button
          onClick={() => router.push("/dashboard")}
          style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer" }}
        >
          Dashboard
        </button>
        {" > "}
        <button
          onClick={() => router.push("/dashboard/posts")}
          style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer" }}
        >
          Posts
        </button>
        {" > "}
        <span>Editar</span>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Detalhes do Post</h2>
          <p className="card-description">Edite as informações do seu post</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-content">
            {error && (
              <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
                <strong>Erro:</strong> {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" style={{ marginBottom: "1.5rem" }}>
                <strong>Sucesso:</strong> {success}
              </div>
            )}

            {/* Informações do Post */}
            {post && (
              <div
                style={{
                  background: "#f8fafc",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1.5rem",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
                  Informações do Post
                </h4>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  <p style={{ margin: "0.25rem 0" }}>
                    <strong>ID:</strong> #{post.id}
                  </p>
                  <p style={{ margin: "0.25rem 0" }}>
                    <strong>Autor:</strong> {post.author?.name || user.name}
                  </p>
                  <p style={{ margin: "0.25rem 0" }}>
                    <strong>Criado em:</strong>{" "}
                    {post.createdAt ? new Date(post.createdAt).toLocaleString("pt-BR") : "Data desconhecida"}
                  </p>
                  <p style={{ margin: "0.25rem 0" }}>
                    <strong>Status atual:</strong>{" "}
                    {post.published ? (
                      <span className="badge badge-success">Publicado</span>
                    ) : (
                      <span className="badge badge-warning">Rascunho</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Título *
              </label>
              <input
                id="title"
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do post"
                required
                style={{ fontSize: "1rem" }}
              />
              <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                Escolha um título claro e descritivo para seu post
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="content" className="form-label">
                Conteúdo
              </label>
              <textarea
                id="content"
                className="form-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Digite o conteúdo do post..."
                style={{ minHeight: "250px", fontSize: "0.95rem", lineHeight: "1.6" }}
              />
              <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                Escreva o conteúdo completo do seu post. Você pode usar quebras de linha para organizar o texto.
              </small>
            </div>

            <div className="form-group">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <label style={{ position: "relative", display: "inline-block", width: "3rem", height: "1.5rem" }}>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    style={{
                      opacity: 0,
                      width: 0,
                      height: 0,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: published ? "#3b82f6" : "#cbd5e1",
                      borderRadius: "1.5rem",
                      transition: "0.3s",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        content: "",
                        height: "1.125rem",
                        width: "1.125rem",
                        left: published ? "1.625rem" : "0.1875rem",
                        bottom: "0.1875rem",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        transition: "0.3s",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                  </span>
                </label>
                <div>
                  <label htmlFor="published" className="form-label" style={{ margin: 0, cursor: "pointer" }}>
                    Publicar post
                  </label>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>
                    {published
                      ? "✅ O post será visível publicamente"
                      : "📝 O post ficará como rascunho (não visível publicamente)"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <button type="button" className="button button-outline" onClick={() => router.back()} disabled={isLoading}>
              ← Cancelar
            </button>
            <button type="submit" className="button button-primary" disabled={isLoading} style={{ minWidth: "140px" }}>
              {isLoading ? (
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
                  Salvando...
                </span>
              ) : (
                "💾 Atualizar Post"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Preview do Post */}
      {title && (
        <div className="card" style={{ marginTop: "2rem" }}>
          <div className="card-header">
            <h3 className="card-title">Preview do Post</h3>
            <p className="card-description">Veja como seu post aparecerá</p>
          </div>
          <div className="card-content">
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                padding: "1.5rem",
                backgroundColor: "#fafafa",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937" }}>{title}</h2>
                {published ? (
                  <span className="badge badge-success">Publicado</span>
                ) : (
                  <span className="badge badge-warning">Rascunho</span>
                )}
              </div>
              <p
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "0.875rem",
                  color: "#6b7280",
                }}
              >
                por {user?.name} • {new Date().toLocaleDateString("pt-BR")}
              </p>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6",
                  color: "#374151",
                }}
              >
                {content || <em style={{ color: "#9ca3af" }}>Nenhum conteúdo ainda...</em>}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
