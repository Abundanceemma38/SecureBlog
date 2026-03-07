import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/db"

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("session_user_id")?.value
  const username = cookieStore.get("session_username")?.value

  if (!userId || !username) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  // intentionally vulnerable - weak session checking
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  })

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  })
}