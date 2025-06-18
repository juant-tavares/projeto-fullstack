"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-guard"

interface Post {
  id: number
  title: string
  content?: string
  published: boolean
  authorId: number
  author?: { name: string }
  createdAt?: string
}

interface User {
  id: number
  email: string
  name: string
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // Só buscar dados se não estiver carregando autenticação e tiver usuário
      if (!authLoading && user) {
        try {
          console.log("🔄 Buscando dados do dashboard...")

          const [postsRes, usersRes] = await Promise.all([
            fetch(`http://localhost:3000/api/posts`),
            fetch(`http://localhost:3000/api/users`),
          ])

          if (postsRes.ok && usersRes.ok) {
            const postsData = await postsRes.json()
            const usersData = await usersRes.json()

            console.log("✅ Dados carregados:", { posts: postsData.length, users: usersData.length })

            setPosts(postsData)
            setUsers(usersData)
          }
        } catch (error) {
          console.error("❌ Erro ao buscar dados:", error)
        } finally {
          setIsLoading(false)
        }
      } else if (!authLoading && !user) {
        // Se não está carregando auth mas não há usuário, parar loading
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, authLoading])

  // Filtrar posts do usuário atual
  const userPosts = posts.filter((post) => post.authorId === user?.id)
  const publishedPosts = posts.filter((post) => post.published)

  // Se ainda está verificando autenticação, mostrar loading
  if (authLoading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
        <h2 style={{ marginBottom: "1rem" }}>Carregando...</h2>
        <p>Verificando autenticação...</p>
      </div>
    )
  }

  // Se não há usuário (não deveria acontecer por causa do AuthGuard)
  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
        <h2 style={{ marginBottom: "1rem" }}>Erro de autenticação</h2>
        <p>Usuário não encontrado. Redirecionando...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#1f2937" }}>Dashboard</h1>
        <p style={{ color: "#6b7280", fontSize: "1rem" }}>Bem-vindo ao seu painel de controle, {user.name}!</p>
      </div>

      {/* Cards de Estatísticas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div className="card">
          <div className="card-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0, fontWeight: "500" }}>Posts Publicados</p>
                <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "0.5rem 0", color: "#1f2937" }}>
                  {isLoading ? "..." : publishedPosts.length}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>Visíveis ao público</p>
              </div>
              <div style={{ fontSize: "3rem", opacity: 0.6 }}>📖</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0, fontWeight: "500" }}>Seus Posts</p>
                <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "0.5rem 0", color: "#1f2937" }}>
                  {isLoading ? "..." : userPosts.length}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>Publicados e em rascunho</p>
              </div>
              <div style={{ fontSize: "3rem", opacity: 0.6 }}>✍️</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0, fontWeight: "500" }}>Usuários</p>
                <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "0.5rem 0", color: "#1f2937" }}>
                  {isLoading ? "..." : users.length}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>Comunidade ativa</p>
              </div>
              <div style={{ fontSize: "3rem", opacity: 0.6 }}>👥</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div className="card-header">
          <h2 className="card-title">Ações Rápidas</h2>
          <p className="card-description">Acesse rapidamente as principais funcionalidades</p>
        </div>
        <div className="card-content">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <Link href="/dashboard/posts/new" className="button button-primary">
              ➕ Criar Novo Post
            </Link>
            <Link href="/dashboard/posts" className="button button-outline">
              📝 Gerenciar Posts
            </Link>
            <Link href="/posts" className="button button-outline">
              👁️ Ver Posts Públicos
            </Link>
          </div>
        </div>
      </div>

      {/* Posts Recentes */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Seus Posts Recentes</h2>
          <p className="card-description">Gerencie suas publicações mais recentes</p>
        </div>
        <div className="card-content">
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
              <p>Carregando posts...</p>
            </div>
          ) : userPosts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {userPosts.slice(0, 5).map((post) => (
                <div key={post.id} className="post-item">
                  <div className="post-info">
                    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: "600" }}>{post.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {post.published ? (
                        <span className="badge badge-success">✅ Publicado</span>
                      ) : (
                        <span className="badge badge-warning">📝 Rascunho</span>
                      )}
                      <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString("pt-BR") : ""}
                      </span>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <Link href={`/dashboard/posts/edit/${post.id}`} className="button button-outline button-sm">
                      ✏️ Editar
                    </Link>
                    {post.published && (
                      <Link href={`/posts/${post.id}`} className="button button-outline button-sm">
                        👁️ Ver
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <Link href="/dashboard/posts" className="button button-primary">
                  Ver Todos os Posts ({userPosts.length})
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.5 }}>📝</div>
              <h3 style={{ marginBottom: "1rem", color: "#374151" }}>Nenhum post ainda</h3>
              <p style={{ marginBottom: "2rem", color: "#6b7280" }}>
                Você ainda não criou nenhum post. Que tal começar agora?
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
