import type React from "react"

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Blog App</h1>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
