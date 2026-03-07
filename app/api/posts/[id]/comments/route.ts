import { NextResponse } from "next/server"
import { getCommentsByPostId, addComment } from "@/lib/db"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const comments = await getCommentsByPostId(Number(id))
  return NextResponse.json(comments)
}

// intentionally vulnerable - no sanitization on comment content (stored XSS)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { authorName, content } = await request.json()

    if (!authorName || !content) {
      return NextResponse.json(
        { error: "Author name and content are required" },
        { status: 400 }
      )
    }

    // intentionally vulnerable - stores raw HTML/JS without sanitization
    const comment = await addComment(Number(id), authorName, content)

    return NextResponse.json(comment, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
