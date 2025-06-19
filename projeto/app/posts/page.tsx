"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { Post } from "@/types"
import { formatDate } from "@/lib/utils"

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("🔄 Buscando posts públicos...")

        // Usar rota relativa no cliente
        const response = await fetch("/api/posts")

        console.log("📡 Resposta da API:", response.status)

        if (response.ok) {
          const data = await response.json()
          // Filtrar apenas posts publicados
          const publishedPosts = data.filter((post: Post) => post.published)
          console.log("✅ Posts públicos carregados:", publishedPosts.length)
          setPosts(publishedPosts)
        } else {
          console.error("❌ Erro ao buscar posts:", response.status)
        }
      } catch (error) {
        console.error("❌ Erro ao buscar posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Header da página */}
      <header className="header">
        <div className="container header-content">
          <Link href="/" className="logo">
            Blog App
          </Link>
          <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link href="/posts" className="button button-outline">
              📖 Posts
            </Link>
            <Link href="/login" className="button button-outline">
              Login
            </Link>
            <Link href="/register" className="button button-primary">
              Registrar
            </Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem", color: "#1f2937" }}>
            Posts do Blog
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#6b7280", maxWidth: "600px", margin: "0 auto" }}>
            Explore os posts mais recentes da nossa comunidade de escritores.
          </p>
        </div>

        {isLoading ? (
          <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))" }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card">
                <div className="card-header">
                  <div className="skeleton" style={{ height: "1.5rem", width: "75%", marginBottom: "0.5rem" }}></div>
                  <div className="skeleton" style={{ height: "1rem", width: "50%" }}></div>
                </div>
                <div className="card-content">
                  <div className="skeleton" style={{ height: "6rem", width: "100%" }}></div>
                </div>
                <div className="card-footer">
                  <div className="skeleton" style={{ height: "1rem", width: "33%" }}></div>
                  <div className="skeleton" style={{ height: "2rem", width: "5rem" }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))" }}>
            {posts.map((post) => (
              <div key={post.id} className="card" style={{ height: "fit-content" }}>
                <div className="card-header">
                  <h2 className="card-title" style={{ fontSize: "1.25rem", lineHeight: "1.4" }}>
                    {post.title}
                  </h2>
                  <p className="card-description">por {post.author?.name || "Autor desconhecido"}</p>
                </div>
                <div className="card-content">
                  <p
                    style={{
                      color: "#6b7280",
                      lineHeight: "1.6",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.content || "Sem conteúdo"}
                  </p>
                </div>
                <div className="card-footer">
                  <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
                    {post.createdAt ? formatDate(post.createdAt) : "Data desconhecida"}
                  </p>
                  <Link href={`/posts/${post.id}`} className="button button-primary">
                    Ler mais →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.5 }}>📝</div>
            <h3 style={{ marginBottom: "1rem", color: "#374151" }}>Nenhum post publicado ainda</h3>
            <p style={{ marginBottom: "2rem", color: "#6b7280" }}>
              Seja o primeiro a compartilhar suas ideias com a comunidade!
            </p>
            <Link href="/login" className="button button-primary">
              Faça login para criar um post
            </Link>
          </div>
        )}
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
