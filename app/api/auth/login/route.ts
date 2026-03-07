// app/api/login/route.ts
import { NextResponse } from "next/server"
import { loginUser } from "@/lib/db"
import { cookies } from "next/headers"

// intentionally vulnerable - SQL injection and weak sessions
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    // --- LOGIN ---
    // Vulnerable: loginUser simulates SQL injection
    const user = await loginUser(username, password)

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // --- SESSION HANDLING (VULNERABLE) ---
    const cookieStore = await cookies()

cookieStore.set("session_user_id", String(user.id), {
  // intentionally vulnerable - no httpOnly, no secure, no sameSite
  path: "/",
  maxAge: 60 * 60 * 24, // 24 hours
})

cookieStore.set("session_username", user.username, {
  path: "/",
  maxAge: 60 * 60 * 24,
})

/*
  Hidden flag for the XSS challenge
  Only admins receive this cookie
*/
if (user.username === "admin") {
  cookieStore.set("debug_flag", "FLAG{xss_cookie_snatcher}", {
    path: "/",
    maxAge: 60 * 60 * 24,
  })
}

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      sqliBypass: user._sqliBypass || false, // intentionally vulnerable - flag for SQLi
    })
  } catch (err) {
    console.error("[LOGIN ERROR]", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}