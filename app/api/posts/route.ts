import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  getAllPublishedPosts,
  getPostsByAuthor,
  createPost,
  prisma,
} from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const authorId = searchParams.get("authorId")

  if (authorId) {
    const posts = await getPostsByAuthor(Number(authorId))
    return NextResponse.json(posts)
  }

  const posts = await getAllPublishedPosts()
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // use Prisma directly so registered users are found
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { title, content, status } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    const post = await createPost(
      title,
      content,
      status || "draft",
      user.id,
      user.username
    )

    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}