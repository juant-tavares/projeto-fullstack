"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const navigationItems = [
  {
    title: "Visão Geral",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: "🏠",
      },
    ],
  },
  {
    title: "Conteúdo",
    items: [
      {
        title: "Meus Posts",
        href: "/dashboard/posts",
        icon: "📝",
      },
      {
        title: "Novo Post",
        href: "/dashboard/posts/new",
        icon: "➕",
      },
      {
        title: "Posts públicos",
        href: "/posts",
        icon: "👁️",
      },
    ],
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <nav className="sidebar-nav">
          {navigationItems.map((section) => (
            <div key={section.title} className="nav-section">
              <h3 className="nav-section-title">{section.title}</h3>
              <ul className="nav-menu">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href} className="nav-item">
                      <Link
                        href={item.href}
                        className={`nav-link ${isActive ? "active" : ""}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          {/* Quick actions na parte inferior */}
          <div className="sidebar-footer">
            <h3 className="nav-section-title">Voltar ao início</h3>
            <div className="quick-actions">
              <Link href="/" className="button button-outline button-sm">
                🏠 Ir para Página Inicial
              </Link>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
