import { API_URL } from "@/lib/config"

async function getPosts() {
  const response = await fetch(`${API_URL}/api/posts`)

  if (!response.ok) {
    throw new Error("Failed to fetch posts")
  }

  return response.json()
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
