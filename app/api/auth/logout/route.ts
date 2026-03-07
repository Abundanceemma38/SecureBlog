import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete("session_user_id")
  cookieStore.delete("session_username")
  return NextResponse.json({ success: true })
}
