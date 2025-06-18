"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { API_URL } from "@/lib/config"
import type { Post } from "@/types"
import { formatDate } from "@/lib/utils"

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const postId = Number.parseInt(resolvedParams.id)

  useEffect(() => {
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

    if (postId) {
      fetchPost()
    }
  }, [postId])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <div className="mb-6">
          <div className="skeleton" style={{ height: "40px", width: "75%", marginBottom: "8px" }}></div>
          <div className="skeleton" style={{ height: "24px", width: "50%" }}></div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="skeleton" style={{ height: "32px", width: "100%", marginBottom: "8px" }}></div>
            <div className="skeleton" style={{ height: "16px", width: "33%" }}></div>
          </div>
          <div className="card-content">
            <div className="skeleton" style={{ height: "16px", width: "100%", marginBottom: "16px" }}></div>
            <div className="skeleton" style={{ height: "16px", width: "100%", marginBottom: "16px" }}></div>
            <div className="skeleton" style={{ height: "16px", width: "75%" }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <div className="text-center py-8">
          <h1 className="text-2xl mb-4">Oops!</h1>
          <p className="text-muted mb-6">{error}</p>
          <Link href="/posts" className="btn btn-primary">
            ← Voltar aos posts
          </Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <Link href="/posts" className="btn btn-outline mb-4">
          ← Voltar aos posts
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h1 className="card-title text-3xl">{post.title}</h1>
          <p className="card-description text-lg">
            por {post.author?.name || "Autor desconhecido"} •{" "}
            {post.createdAt ? formatDate(post.createdAt) : "Data desconhecida"}
          </p>
        </div>
        <div className="card-content">
          <div style={{ whiteSpace: "pre-wrap" }}>
            {post.content ? post.content : <p className="text-muted">Este post não tem conteúdo.</p>}
          </div>
        </div>
        <div className="card-footer">
          <div className="text-sm text-muted">Post #{post.id}</div>
          <Link href="/posts" className="btn btn-outline">
            Ver mais posts
          </Link>
        </div>
      </div>
    </div>
  )
}
