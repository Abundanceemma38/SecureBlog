"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Calendar,
  User,
  ArrowLeft,
  Loader2,
  MessageSquare,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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

interface Comment {
  id: number
  postId: number
  authorName: string
  content: string
  createdAt: string
}

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentAuthor, setCommentAuthor] = useState("")
  const [commentContent, setCommentContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState<{
    id: number
    username: string
  } | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Check session (optional - posts are viewable without login)
        const sessionRes = await fetch("/api/auth/session")
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json()
          if (sessionData.authenticated) {
            setCurrentUser(sessionData.user)
            setCommentAuthor(sessionData.user.username)
          }
        }

        // intentionally vulnerable - no ownership check for drafts (IDOR)
        const postRes = await fetch(`/api/posts/${id}`)
        if (!postRes.ok) {
          router.push("/blog")
          return
        }
        const postData = await postRes.json()
        setPost(postData)

        const commentsRes = await fetch(`/api/posts/${id}/comments`)
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json()
          setComments(commentsData)
        }
      } catch {
        router.push("/blog")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, router])

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentAuthor || !commentContent) return
    setSubmitting(true)

    try {
      // intentionally vulnerable - no sanitization on comment content
      const res = await fetch(`/api/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: commentAuthor,
          content: commentContent,
        }),
      })

      if (res.ok) {
        const newComment = await res.json()
        setComments([newComment, ...comments])
        setCommentContent("")
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!post) return null

  const isDraft = post.status === "draft"
  const isOwnDraft =
    isDraft && currentUser && currentUser.id === post.authorId

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {/* intentionally vulnerable - IDOR flag shown when accessing other user's draft */}
      {isDraft && !isOwnDraft && (
        <div className="mb-6 rounded-xl border border-primary bg-primary/10 p-4">
          <div className="flex items-center gap-2 text-primary">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-mono text-lg font-bold">
              FLAG-IDOR-UNAUTHORIZED-ACCESS
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            You are viewing a draft post that does not belong to you. IDOR
            vulnerability exploited successfully.
          </p>
        </div>
      )}

      {isDraft && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2 text-sm text-warning-foreground">
          <AlertTriangle className="h-4 w-4" />
          This post is a draft and is not publicly listed.
        </div>
      )}

      <article>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge
            variant={post.status === "published" ? "default" : "secondary"}
          >
            {post.status}
          </Badge>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            {post.authorName}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight">
          {post.title}
        </h1>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          {post.content.split("\n").map((paragraph, i) => (
            <p
              key={i}
              className="mb-4 leading-relaxed text-foreground/85"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      <Separator className="my-10" />

      {/* Comments Section */}
      <section>
        <div className="mb-6 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-xl font-bold">
            Comments ({comments.length})
          </h2>
        </div>

        {/* Comment form */}
        <form
          onSubmit={handleSubmitComment}
          className="mb-8 flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
        >
          <h3 className="font-semibold">Leave a comment</h3>
          <div className="flex flex-col gap-2">
            <Label htmlFor="author">Name</Label>
            <Input
              id="author"
              type="text"
              placeholder="Your name"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="comment">Comment</Label>
            {/* intentionally vulnerable - hint about XSS */}
            <Textarea
              id="comment"
              placeholder="Write your comment... (HTML is supported)"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={3}
              required
            />
          </div>
          <Button type="submit" disabled={submitting} className="self-start">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </form>

        {/* Comments list */}
        {comments.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No comments yet. Be the first to comment.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold">
                    {comment.authorName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {/* intentionally vulnerable - renders raw HTML (stored XSS) */}
                <div
                  className="text-sm leading-relaxed text-foreground/85"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
