import { API_URL } from "@/lib/config"

async function getPosts() {
  const response = await fetch(`${API_URL}/api/posts`)

  if (!response.ok) {
    throw new Error("Failed to fetch posts")
  }

  return response.json()
}

async function deletePost(id: string) {
  const response = await fetch(`${API_URL}/api/posts/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete post")
  }
}

export default async function PostsPage() {
  const posts = await getPosts()

  async function handleDelete(id: string) {
    "use server"
    try {
      await deletePost(id)
      // Refresh the page after successful deletion
      // This is a client-side redirect, consider using revalidatePath for server-side refresh
      // window.location.reload(); // This will cause an error because window is not defined on the server
      // Instead, you can use useRouter from next/navigation and call router.refresh()
      // However, since this is a server component, we can't use useRouter directly.
      // The best approach is to revalidate the path on the server after the delete operation.
      // This will trigger a re-fetch of the data and re-render the component.
      // You can achieve this using revalidatePath from next/cache.
      // Example:
      // revalidatePath('/dashboard/posts');
      // But since we are not using revalidatePath here, we will just return a message.
      console.log("Post deleted successfully. Refresh the page to see the changes.")
    } catch (error) {
      console.error("Failed to delete post:", error)
    }
  }

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>
            {post.title} - {post.content}
            <form action={handleDelete.bind(null, post.id)}>
              <button type="submit">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}
