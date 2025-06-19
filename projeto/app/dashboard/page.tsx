import { API_URL } from "@/lib/config"

async function getPosts() {
  const res = await fetch(`${API_URL}/api/posts`)

  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

async function getUsers() {
  const res = await fetch(`${API_URL}/api/users`)

  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export default async function Page() {
  const [postsRes, usersRes] = await Promise.all([fetch(`${API_URL}/api/posts`), fetch(`${API_URL}/api/users`)])

  const posts = await postsRes.json()
  const users = await usersRes.json()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Posts: {posts.length}</p>
      <p>Users: {users.length}</p>
    </div>
  )
}
