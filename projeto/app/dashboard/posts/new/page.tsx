"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

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
      // Usar rota relativa
      const response = await fetch("/api/posts", {
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

  if (!user) {
    return <div>Você precisa estar logado para criar um post.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Novo Post</h2>
        <p className="text-muted-foreground">Crie um novo post para o blog</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header">
            <h3 className="card-title">Detalhes do Post</h3>
            <p className="card-description">Preencha as informações do seu novo post</p>
          </div>
          <div className="card-content space-y-4">
            {error && <div className="alert alert-error">{error}</div>}

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
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                <label htmlFor="published" className="form-label" style={{ margin: 0 }}>
                  Publicar imediatamente
                </label>
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
