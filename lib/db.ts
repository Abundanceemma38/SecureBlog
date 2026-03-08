import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

// --- PRISMA SINGLETON ---
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function makePrisma() {
  const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? makePrisma()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export interface User {
  id: number;
  username: string;
  email: string;
  password: string; // intentionally vulnerable - plaintext passwords
  createdAt: string;
  note?: string | null;
  role?: string | null;
  _sqliBypass?: boolean
}

export interface Post {
  id: number;
  title: string;
  content: string;
  status: "draft" | "published";
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  postId: number;
  authorName: string;
  content: string; // intentionally vulnerable - stored without sanitization
  createdAt: string;
}

// --- PERSIST USERS, POSTS, COMMENTS ACROSS HOT RELOADS ---
declare global {
  var __users: User[];
  var __posts: Post[];
  var __comments: Comment[];
  var __nextUserId: number;
  var __nextPostId: number;
  var __nextCommentId: number;
}

globalThis.__users = globalThis.__users || [
  { id: 1, username: "admin", email: "admin@blog.com", password: "admin123", createdAt: new Date().toISOString(), note: "FLAG{login_bypass_master}" },
  { id: 2, username: "alice", email: "alice@blog.com", password: "alice123", createdAt: new Date().toISOString() },
  { id: 3, username: "bob", email: "bob@blog.com", password: "bob123", createdAt: new Date().toISOString() },
];
export const users: User[] = globalThis.__users;

globalThis.__posts = globalThis.__posts || [
  {
    id: 1,
    title: "Morning Routines That Improve Productivity",
    content: "Many successful people start their day with a structured morning routine. ... routine-ref-3921.",
    status: "published",
    authorId: 1,
    authorName: "admin",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 2,
    title: "Why Traveling Alone Can Be a Great Experience",
    content: "Traveling alone gives you the opportunity to explore new places ... travel-log-8812.",
    status: "published",
    authorId: 1,
    authorName: "admin",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 3,
    title: "Simple Ways to Learn Programming Faster",
    content: "Learning programming can feel overwhelming ... code-note-440.",
    status: "published",
    authorId: 2,
    authorName: "alice",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 4,
    title: "Best Street Foods to Try in Different Cities",
    content: "Street food offers a unique way to experience local culture ... sf-note-1182.",
    status: "published",
    authorId: 3,
    authorName: "bob",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 5,
    title: "Notes From a Late Night Coding Session",
    content: "Sometimes the best coding sessions happen late at night ... lab-ref-idor-551., Draft posts should not be public.\n\nFLAG{draft_post_leak}\n\nNeed to fix this later.",
    status: "draft",
    authorId: 1,
    authorName: "admin",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 6,
    title: "Weekend Thoughts",
    content: "Weekends are a great time to slow down and reflect ... note-a19f-flag-732.",
    status: "draft",
    authorId: 2,
    authorName: "alice",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 7,
    title: "Why Reading Daily Improves Your Thinking",
    content: "Reading books regularly can expand your knowledge ... book-track-229.",
    status: "published",
    authorId: 3,
    authorName: "bob",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 8,
    title: "How Technology Is Changing Everyday Life",
    content: "Technology has changed the way people communicate ... sys-note-flag-8831.",
    status: "published",
    authorId: 2,
    authorName: "alice",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];
export const posts: Post[] = globalThis.__posts;

globalThis.__comments = globalThis.__comments || [
  { id: 1, postId: 1, authorName: "alice", content: "Great introduction to cybersecurity! Very informative.", createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 2, postId: 2, authorName: "bob", content: "The OWASP Top 10 is essential reading for every developer.", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 3, postId: 3, authorName: "bob", content: "I would love to be a master of the python programming language", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 4, postId: 1, authorName: "alice", content: "I started doing a morning routine last year and it helped me stay productive.", createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 5, postId: 2, authorName: "bob", content: "Solo travel is amazing. You get to explore places without worrying about anyone else's schedule.", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 6, postId: 3, authorName: "bob", content: "Practicing daily really makes a difference when learning programming.", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 7, postId: 6, authorName: "admin", content: "Reminder: check draft visibility later ... ref: test-id-447.", createdAt: new Date(Date.now() - 5000000).toISOString() },
];
export const comments: Comment[] = globalThis.__comments;

// --- NEXT IDS ---
globalThis.__nextUserId = globalThis.__nextUserId || 4;
export let nextUserId = globalThis.__nextUserId;
globalThis.__nextPostId = globalThis.__nextPostId || 9;
export let nextPostId = globalThis.__nextPostId;
globalThis.__nextCommentId = globalThis.__nextCommentId || 8;
export let nextCommentId = globalThis.__nextCommentId;

// --- LOGIN FUNCTION (vulnerable SQLi simulated) ---
export async function loginUser(username: string, password: string): Promise<User | null> {
  const simulatedQuery =
    `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

  console.log("[VULNERABLE QUERY]:", simulatedQuery);

  const isGeneralBypass =
    username.includes("' OR 1=1--") ||
    password.includes("' OR 1=1--");

  if (isGeneralBypass) {
    const admin = await prisma.user.findFirst({
      where: { username: "admin" },
    });

    if (!admin) return null;

    return {
      ...admin,
      createdAt: admin.createdAt.toISOString(),
      _sqliBypass: true,
    };
  }

  // const user = await prisma.user.findFirst({
  //   where: { username, password },
  // });
  

  // if (!user) return null;

  // return {
  //   ...user,
  //   createdAt: user.createdAt.toISOString(),


  // };

  const result = await prisma.$queryRawUnsafe<User[]>(`
  SELECT * FROM User
  WHERE username='${username}'
  AND password='${password}'
`);

if (!result || result.length === 0) return null;

const user = result[0];

return {
  ...user,
  createdAt: new Date(user.createdAt).toISOString(),
};
}

// --- REGISTER FUNCTION (plaintext passwords) ---
export async function registerUser(username: string, email: string, password: string): Promise<User | { error: string }> {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] }
  });
  if (existingUser) return { error: "Username or email already exists" };

  const created = await prisma.user.create({
    data: { username, email, password }
  });

  const newUser: User = {
    id: created.id,
    username: created.username,
    email: created.email,
    password: created.password,
    createdAt: created.createdAt.toISOString(),
  };

  users.push(newUser);
  globalThis.__nextUserId = nextUserId++;
  return newUser;
}

// --- USER HELPERS ---
export function getUserById(id: number): User | undefined { return users.find(u => u.id === id); }

// --- POST HELPERS (all Prisma) ---
export async function getAllPublishedPosts(): Promise<Post[]> {
  const rows = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
  })
  return rows.map(p => ({ ...p, status: p.status as "draft" | "published", createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() }))
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  const rows = await prisma.post.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
  })
  return rows.map(p => ({ ...p, status: p.status as "draft" | "published", createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() }))
}

export async function getPostById(id: number): Promise<Post | null> {
  const p = await prisma.post.findUnique({ where: { id } })
  if (!p) return null
  return { ...p, status: p.status as "draft" | "published", createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() }
}

export async function createPost(title: string, content: string, status: "draft" | "published", authorId: number, authorName: string): Promise<Post> {
  const p = await prisma.post.create({
    data: { title, content, status, authorId, authorName }
  })
  return { ...p, status: p.status as "draft" | "published", createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() }
}

export async function updatePost(id: number, title: string, content: string, status: "draft" | "published"): Promise<Post | null> {
  try {
    const p = await prisma.post.update({
      where: { id },
      data: { title, content, status }
    })
    return { ...p, status: p.status as "draft" | "published", createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() }
  } catch { return null }
}

export async function deletePost(id: number): Promise<boolean> {
  try {
    await prisma.post.delete({ where: { id } })
    return true
  } catch { return false }
}

// --- COMMENT HELPERS (all Prisma) ---
export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  const rows = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
  })
  return rows.map(c => ({ ...c, createdAt: c.createdAt.toISOString() }))
}

export async function addComment(postId: number, authorName: string, content: string): Promise<Comment> {
  const c = await prisma.comment.create({
    data: { postId, authorName, content }
  })
  return { ...c, createdAt: c.createdAt.toISOString() }
}