"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  FileText,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Post {
  id: number
  title: string
  content: string
  status: "draft" | "published"
  authorId: number
  authorName: string
  createdAt: string
  updatedAt: string
}

interface User {
  id: number
  username: string
  email: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [sqliFlag, setSqliFlag] = useState(false)

  useEffect(() => {
    // Check if user came via SQL injection
    const cookies = document.cookie
    if (cookies.includes("session_user_id=1") && cookies.includes("session_username=admin")) {
      // Check if this might be an SQL injection bypass
      // We show the flag on dashboard after sqli login
    }

    async function loadData() {
      try {
        const sessionRes = await fetch("/api/auth/session")
        if (!sessionRes.ok) {
          router.push("/login")
          return
        }
        const sessionData = await sessionRes.json()
        setUser(sessionData.user)

        // intentionally vulnerable - flag shown for SQL injection bypass
        // The sqliBypass flag was set during login
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.get("sqli") === "true") {
          setSqliFlag(true)
        }

        const postsRes = await fetch(
          `/api/posts?authorId=${sessionData.user.id}`
        )
        if (postsRes.ok) {
          const postsData = await postsRes.json()
          // setPosts(postsData)
          setPosts(Array.isArray(postsData) ? postsData : [])
        }
      } catch {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  async function handleDelete(postId: number) {
    if (!confirm("Are you sure you want to delete this post?")) return

    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" })
    if (res.ok) {
      setPosts(posts.filter((p) => p.id !== postId))
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  



  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* intentionally vulnerable - shows SQL injection flag */}
      {sqliFlag && (
        <div className="mb-6 rounded-xl border border-primary bg-primary/10 p-4 text-center">
          <p className="font-mono text-lg font-bold text-primary">
            FLAG-SQLI-ADMIN-ACCESS
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            SQL Injection successful - You bypassed authentication
          </p>
        </div>
      )}


      {user.username === "admin" && (
  <div className="mb-6 rounded-xl border border-green-500 bg-green-500/10 p-4 text-center">
    <p className="font-mono text-lg font-bold text-green-600">
     {" FLAG{login_bypass_master}"}
    </p>
    <p className="text-sm text-muted-foreground">
      Admin dashboard access confirmed
    </p>
  </div>
)}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {user.username}. Manage your blog posts.
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Posts"
          value={posts.length}
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Published"
          value={posts.filter((p) => p.status === "published").length}
          icon={<Eye className="h-5 w-5" />}
        />
        <StatCard
          label="Drafts"
          value={posts.filter((p) => p.status === "draft").length}
          icon={<Pencil className="h-5 w-5" />}
        />
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">No posts yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first blog post to get started.
          </p>
          <Link href="/dashboard/new" className="mt-4">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/30"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                   <Link href={`/posts/${post.id}`} className="hover:underline">
                  <h3 className="font-semibold">{post.title}</h3>
                  </Link>
                  <Badge
                    variant={
                      post.status === "published" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {post.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/posts/${post.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View post</span>
                  </Button>
                </Link>
                <Link href={`/dashboard/edit/${post.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit post</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete post</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  )
}
