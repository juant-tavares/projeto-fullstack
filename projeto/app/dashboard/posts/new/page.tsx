"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-guard"
import { API_URL } from "@/lib/config"

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [published, setPublished] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("O título é obrigatório")
      return
    }

    if (!user) {
      setError("Você precisa estar logado para criar um post")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          published,
          authorId: user.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Falha ao criar post")
      }

      router.push("/dashboard/posts")
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao criar o post. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#1f2937" }}>Novo Post</h1>
        <p style={{ color: "#6b7280" }}>Crie um novo post para o blog</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header">
            <h2 className="card-title">Detalhes do Post</h2>
            <p className="card-description">Preencha as informações do seu novo post</p>
          </div>
          <div className="card-content">
            {error && (
              <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
                <strong>Erro:</strong> {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Título
              </label>
              <input
                id="title"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do post"
                required
              />
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
                placeholder="Digite o conteúdo do post"
                style={{ minHeight: "200px" }}
              />
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
                    Publicar imediatamente
                  </label>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>
                    {published ? "O post será visível publicamente" : "O post ficará como rascunho"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button type="button" className="button button-outline" onClick={() => router.back()}>
              Cancelar
            </button>
            <button type="submit" className="button button-primary" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
