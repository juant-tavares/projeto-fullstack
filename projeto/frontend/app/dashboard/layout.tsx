import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { UserNav } from "@/components/user-nav"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <header className="header">
          <div className="container header-content">
            <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>Blog Dashboard</h1>
            <UserNav />
          </div>
        </header>

        <div className="dashboard-container">
          <DashboardSidebar />
          <main className="dashboard-main">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
