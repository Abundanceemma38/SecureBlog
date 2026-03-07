import { NextResponse } from "next/server"
import { registerUser } from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const result = await registerUser(username, email, password)

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const cookieStore = await cookies()

    cookieStore.set("session_user_id", String(result.id), {
      path: "/",
      maxAge: 60 * 60 * 24,
    })

    cookieStore.set("session_username", result.username, {
      path: "/",
      maxAge: 60 * 60 * 24,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: result.id,
        username: result.username,
        email: result.email,
      },
    })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}