"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { SidebarNav } from "./Navbar"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        setIsAuthenticated(response.ok)
      } catch {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [pathname])

  const isAuthPage = pathname === '/login' || pathname === '/register'
  const showSidebar = isAuthenticated === true && !isAuthPage

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {showSidebar && <SidebarNav />}
      <div className="flex-1 overflow-auto bg-gray-100">
        {children}
      </div>
    </div>
  )
}

