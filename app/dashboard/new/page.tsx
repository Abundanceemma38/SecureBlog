"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => {
        if (!r.ok) {
          router.push("/login")
          return
        }
        setAuthenticated(true)
      })
      .catch(() => router.push("/login"))
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, status }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to create post")
        setLoading(false)
        return
      }

      router.push("/dashboard")
    } catch {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="mb-8 text-3xl font-bold tracking-tight">Create New Post</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Write your post content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={status === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus("draft")}
            >
              Draft
            </Button>
            <Button
              type="button"
              variant={status === "published" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus("published")}
            >
              Published
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Post"
            )}
          </Button>
          <Link href="/dashboard">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
