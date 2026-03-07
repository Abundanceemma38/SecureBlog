"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, LogOut, LayoutDashboard, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"

export function SiteHeader() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: number; username: string } | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setUser(data.user)
        }
      })
      .catch(() => {})
  }, [])

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">
            SecureBlog
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              Blog
            </Button>
          </Link>
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <span className="mx-2 text-sm text-muted-foreground">
                {user.username}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link href="/blog" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Blog
              </Button>
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleLogout()
                    setMobileOpen(false)
                  }}
                  className="w-full justify-start gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
