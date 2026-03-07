"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Post {
  id: number
  title: string
  content: string
  status: "draft" | "published"
  authorId: number
  authorName: string
  createdAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Articles about cybersecurity, web development, and more.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          No published posts yet.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <article className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm">
                <div className="mb-3 flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">
                    {post.status}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    {post.authorName}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {post.content}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Read more
                  <ArrowRight className="h-4 w-4" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
