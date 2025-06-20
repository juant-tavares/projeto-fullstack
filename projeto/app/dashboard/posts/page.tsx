"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-guard"
import { API_URL } from "@/lib/config"
import type { Post } from "@/types"

export default function PostsPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Erro ao buscar posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // Filtrar posts do usuário atual
  const userPosts = posts.filter((post) => post.authorId === user?.id)

  const handleDeletePost = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Atualizar a lista de posts após a exclusão
        setPosts(posts.filter((post) => post.id !== id))
      }
    } catch (error) {
      console.error("Erro ao excluir post:", error)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#1f2937" }}>
              Seus Posts
            </h1>
            <p style={{ color: "#6b7280" }}>Gerencie suas publicações</p>
          </div>
          <Link href="/dashboard/posts/new" className="button button-primary">
            ➕ Novo Post
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Todos os Posts</h2>
          <p className="card-description">Lista de todos os seus posts</p>
        </div>
        <div className="card-content">
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
              <p>Carregando posts...</p>
            </div>
          ) : userPosts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {userPosts.map((post) => (
                <div key={post.id} className="post-item">
                  <div className="post-info">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600" }}>{post.title}</h3>
                      {post.published ? (
                        <span className="badge badge-success">Publicado</span>
                      ) : (
                        <span className="badge badge-warning">Rascunho</span>
                      )}
                    </div>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: "0.875rem" }}>
                      {post.content ? post.content.substring(0, 100) + "..." : "Sem conteúdo"}
                    </p>
                  </div>
                  <div className="action-buttons">
                    <Link href={`/dashboard/posts/edit/${post.id}`} className="button button-outline button-sm">
                      ✏️ Editar
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm("Tem certeza que deseja excluir este post?")) {
                          handleDeletePost(post.id)
                        }
                      }}
                      className="button button-danger button-sm"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.5 }}>📝</div>
              <h3 style={{ marginBottom: "1rem", color: "#374151" }}>Você ainda não criou nenhum post</h3>
              <p style={{ marginBottom: "2rem", color: "#6b7280" }}>
                Que tal começar agora e compartilhar suas ideias?
              </p>
              <Link href="/dashboard/posts/new" className="button button-primary">
                ➕ Criar seu primeiro post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
