export interface User {
  id: number
  email: string
  name: string
  posts?: Post[]
}

export interface Post {
  id: number
  title: string
  content?: string
  published: boolean
  authorId: number
  author?: User
  createdAt?: string
}

export interface Comment {
  id: number
  content: string
  postId: number
  authorId: number
  author?: User
  post?: Post
  createdAt?: string
}
