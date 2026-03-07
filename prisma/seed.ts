import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" })
const prisma = new PrismaClient({ adapter })

async function main() {
    // await prisma.post.deleteMany()
    // await prisma.comment.deleteMany()
    // await prisma.user.deleteMany()
    // --- USERS ---
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", email: "admin@blog.com", password: "admin123", note: "FLAG{login_bypass_master}" },
  })

  await prisma.user.upsert({
    where: { username: "alice" },
    update: {},
    create: { username: "alice", email: "alice@blog.com", password: "alice123" },
  })

  await prisma.user.upsert({
    where: { username: "bob" },
    update: {},
    create: { username: "bob", email: "bob@blog.com", password: "bob123" },
  })

  // fetch real IDs from DB
  const admin = await prisma.user.findUnique({ where: { username: "admin" } })
  const alice = await prisma.user.findUnique({ where: { username: "alice" } })
  const bob   = await prisma.user.findUnique({ where: { username: "bob" } })

  if (!admin || !alice || !bob) throw new Error("Users not found after seeding")

  // --- POSTS ---
  const postsData = [
  { title: "Welcome to the Security Blog", content: "This is your first post", status: "published", authorId: admin.id, authorName: "admin" },
  { title: "Morning Routines That Improve Productivity", content: "Many successful people start their day with a structured morning routine.", status: "published", authorId: admin.id, authorName: "admin" },
  { title: "Why Traveling Alone Can Be a Great Experience", content: "Traveling alone gives you the opportunity to explore new places.", status: "published", authorId: admin.id, authorName: "admin" },
  { title: "Simple Ways to Learn Programming Faster", content: "Learning programming can feel overwhelming.", status: "published", authorId: alice.id, authorName: "alice" },
  { title: "Best Street Foods to Try in Different Cities", content: "Street food offers a unique way to experience local culture.", status: "published", authorId: bob.id, authorName: "bob" },
  { title: "Notes From a Late Night Coding Session", content: "Draft posts should not be public.\n\nFLAG{draft_post_leak}", status: "draft", authorId: admin.id, authorName: "admin" },
  { title: "Inside a Real SQL Injection Attack: From Discovery to Database Dump", content: "We walk through a complete attack chain — from initial reconnaissance and service fingerprinting, to bypassing WAF rules, chaining blind injection payloads, and ultimately exfiltrating sensitive data from the backend database — all inside a deliberately vulnerable lab environment built to mirror real-world targets. No theory. No hand-waving. This is exactly what attackers do, step by step, and understanding it is the only way to build defences that actually hold.", status: "published", authorId: alice.id, authorName: "alice" },
  { title: "SQL Injection Deep Dive", content: "SQL injection remains one of the most devastating and widely exploited vulnerabilities in web security. Despite being well-documented for decades, it continues to appear in production systems at an alarming rate. In this piece, we dissect the full spectrum of attack vectors — from classic in-band injection to time-based blind techniques — explore evasion strategies attackers use to slip past filters and WAFs, and examine the defensive architectures that actually work when implemented correctly.", status: "published", authorId: alice.id, authorName: "alice" },
  { title: "Understanding OWASP Top 10", content: "A comprehensive guide to the OWASP Top 10 — the most critical web application security risks that every developer, architect, and security engineer should have a firm grasp of. We go beyond the definitions. For each vulnerability class, we walk through how real-world exploitation actually unfolds, what the attack looks like from both sides, and what meaningful remediation requires. If you build for the web, this is not optional reading.", status: "published", authorId: admin.id, authorName: "admin" },
  { title: "Getting Started with Cybersecurity", content: "An introduction to cybersecurity for developers and curious minds who want to understand the field beyond the buzzwords. We cover the foundational principles — confidentiality, integrity, availability — and build up to the mental models that actually shape how security professionals think about protecting systems, networks, and data from digital threats. If you are just getting started, this is where the thinking begins.", status: "published", authorId: admin.id, authorName: "admin" },
]

for (const post of postsData) {
  await prisma.post.upsert({
    where: { title: post.title },
    update: {},
    create: post,
  })
}

  console.log("🌱 Database seeded successfully")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())