"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import type { Post } from "@/types"

export default function PostsPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      console.log("🔄 Buscando posts...")
      // Usar rota relativa
      const response = await fetch("/api/posts")

      console.log("📡 Resposta da API:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Posts carregados:", data.length)
        setPosts(data)
      } else {
        console.error("❌ Erro ao buscar posts:", response.status)
      }
    } catch (error) {
      console.error("❌ Erro ao buscar posts:", error)
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
      console.log("🗑️ Deletando post:", id)

      // Usar rota relativa
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        console.log("✅ Post deletado com sucesso")
        // Atualizar a lista de posts após a exclusão
        setPosts(posts.filter((post) => post.id !== id))
      } else {
        console.error("❌ Erro ao deletar post:", response.status)
      }
    } catch (error) {
      console.error("❌ Erro ao excluir post:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Seus Posts</h2>
          <p className="text-muted-foreground">Gerencie suas publicações</p>
        </div>
        <Link href="/dashboard/posts/new">
          <button className="button button-primary">➕ Novo Post</button>
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Todos os Posts</h3>
          <p className="card-description">Lista de todos os seus posts</p>
        </div>
        <div className="card-content">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: "5rem", width: "100%" }}></div>
              ))}
            </div>
          ) : userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{post.title}</h3>
                      <span className={`badge ${post.published ? "badge-success" : "badge-warning"}`}>
                        {post.published ? "Publicado" : "Rascunho"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{post.content || "Sem conteúdo"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/posts/edit/${post.id}`}>
                      <button className="button button-outline button-sm">✏️ Editar</button>
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">Você ainda não criou nenhum post.</p>
              <Link href="/dashboard/posts/new">
                <button className="button button-primary">➕ Criar seu primeiro post</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
