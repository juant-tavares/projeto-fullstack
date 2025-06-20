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
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
