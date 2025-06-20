"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { API_URL } from "@/lib/config"
import type { Post } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Seus Posts</h2>
          <p className="text-muted-foreground">Gerencie suas publicações</p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Post
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Posts</CardTitle>
          <CardDescription>Lista de todos os seus posts</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{post.title}</h3>
                      <Badge variant={post.published ? "default" : "outline"}>
                        {post.published ? "Publicado" : "Rascunho"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{post.content || "Sem conteúdo"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/posts/edit/${post.id}`}>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o post.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeletePost(post.id)}>Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">Você ainda não criou nenhum post.</p>
              <Link href="/dashboard/posts/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar seu primeiro post
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
