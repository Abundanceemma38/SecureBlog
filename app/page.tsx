"use client"

import Link from "next/link"
import { ArrowRight, Shield, Terminal, Lock, Eye, Zap, ChevronRight, Clock, User, TrendingUp, BookOpen, Code2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const stats = [
  { label: "Articles Published", value: "140+", icon: BookOpen },
  { label: "Active Readers", value: "28k", icon: Eye },
  { label: "CVEs Covered", value: "320+", icon: AlertTriangle },
  { label: "Contributors", value: "18", icon: User },
]

const topics = [
  { label: "Web Security", icon: Shield, count: 42 },
  { label: "Penetration Testing", icon: Terminal, count: 31 },
  { label: "Cryptography", icon: Lock, count: 18 },
  { label: "Malware Analysis", icon: Eye, count: 24 },
  { label: "CTF Writeups", icon: Code2, count: 56 },
  { label: "Zero-Days", icon: Zap, count: 12 },
]

// ─── TERMINAL ANIMATION ──────────────────────────────────────────────────────
const TERMINAL_LINES = [
  { text: "$ nmap -sV --script vuln target.example.com", delay: 0, color: "text-emerald-400" },
  { text: "Starting Nmap 7.94 ( https://nmap.org )", delay: 600, color: "text-zinc-400" },
  { text: "PORT   STATE SERVICE VERSION", delay: 1000, color: "text-zinc-500" },
  { text: "80/tcp open  http    Apache 2.4.51", delay: 1400, color: "text-zinc-300" },
  { text: "| http-vuln-cve2021-41773:", delay: 1700, color: "text-zinc-400" },
  { text: "|   VULNERABLE: Path Traversal", delay: 2000, color: "text-red-400" },
  { text: "|   CVSSv3: 9.8 CRITICAL", delay: 2300, color: "text-red-400" },
  { text: "$ sqlmap -u 'http://target.example.com/id=1' --dbs", delay: 3000, color: "text-emerald-400" },
  { text: "[*] fetching databases", delay: 3600, color: "text-zinc-500" },
  { text: "[*] available databases: [4]", delay: 4000, color: "text-amber-400" },
  { text: "[+] users_db", delay: 4300, color: "text-emerald-300" },
  { text: "[+] admin_panel", delay: 4600, color: "text-emerald-300" },
]

function TerminalWindow() {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines(prev => [...prev, i]), line.delay + 800)
    })
    const cursorInterval = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/[0.06] bg-[#0A0A0C] shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-amber-500/70" />
        <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-xs text-white/20 font-mono tracking-wider">terminal — bash</span>
      </div>
      <div className="p-5 font-mono text-xs leading-relaxed min-h-[260px] space-y-1">
        {TERMINAL_LINES.map((line, i) => (
          <div
            key={i}
            className={`transition-all duration-300 ${visibleLines.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"} ${line.color}`}
          >
            {line.text}
          </div>
        ))}
        {visibleLines.length === TERMINAL_LINES.length && (
          <div className="text-emerald-400">
            $ <span className={`inline-block w-2 h-3.5 bg-emerald-400 ml-0.5 align-middle ${cursor ? "opacity-100" : "opacity-0"}`} />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [featured, setFeatured] = useState<any>(null)

  useEffect(() => {
    const handle = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handle, { passive: true })
    return () => window.removeEventListener("scroll", handle)
  }, [])

  useEffect(() => {
    async function loadPosts() {
      const res = await fetch("/api/posts")
      if (!res.ok) return
      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) return
      setFeatured(data[0])
      setRecentPosts(data.slice(1, 4))
    }
    loadPosts()
  }, [])

  return (
    <div className="flex flex-col bg-[#08080B] text-white min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden border-b border-white/[0.06]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            transform: `translateY(${scrollY * 0.15}px)`,
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-emerald-500/[0.04] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/[0.03] blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.015]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)", backgroundSize: "100% 4px" }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2.5 mb-8 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">Security Research & Intelligence</span>
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[0.9] mb-8"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}>
              <span className="block text-white">Know the</span>
              <span className="block italic text-emerald-400">Threat.</span>
              <span className="block text-white/20" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>Own the</span>
              <span className="block text-white">Defence.</span>
            </h1>

            <p className="text-base text-white/45 leading-relaxed max-w-md mb-10 font-light">
              Deep-dive cybersecurity content for developers, researchers, and red teamers.
              Not surface-level. Not watered-down.{" "}
              <span className="text-white/70 font-medium">The real thing.</span>
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/blog">
                <Button size="lg" className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 rounded-lg border-0 shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-400/30 hover:-translate-y-0.5">
                  Start Reading
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="gap-2 border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:border-white/20 px-6 rounded-lg transition-all duration-200">
                  Join the Community
                </Button>
              </Link>
            </div>

            <div className="mt-14 pt-8 border-t border-white/[0.06] grid grid-cols-4 gap-0">
              {stats.map((s, i) => (
                <div key={i} className={`${i < stats.length - 1 ? "border-r border-white/[0.06] pr-4" : ""} ${i > 0 ? "pl-4" : ""}`}>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
                  <div className="text-xs text-white/30 mt-1 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <TerminalWindow />
            <div className="mt-4 flex items-center gap-2 px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-xs font-mono text-white/25">Simulated in a controlled lab environment. Never test on live systems without authorization.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED POST ─────────────────────────────────────────────────── */}
      {featured && (
        <section className="mx-auto max-w-7xl w-full px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-white tracking-wide uppercase">Featured</span>
            </div>
            <Link href="/blog" className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors font-mono">
              All posts <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <Link href={`/posts/${featured.id}`} className="group block">
            <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden hover:border-emerald-500/30 hover:bg-white/[0.03] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">Critical Read</span>
                    <span className="text-xs text-white/25 font-mono">Attack Vectors</span>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-5 group-hover:text-emerald-100 transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {featured.title}
                  </h2>

                  <p className="text-white/45 leading-relaxed text-sm mb-8 max-w-2xl font-light">
                    {featured.content.slice(0, 220)}...
                  </p>

                  <div className="flex items-center gap-5 text-xs text-white/30 font-mono">
                    <span className="flex items-center gap-1.5"><User className="h-3 w-3" />{featured.authorName}</span>
                    <span>{new Date(featured.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                  </div>
                </div>

                <div className="lg:col-span-2 flex justify-center lg:justify-end">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-emerald-500/10 animate-ping" style={{ animationDuration: "3s" }} />
                    <div className="absolute inset-4 rounded-full border border-emerald-500/15 animate-ping" style={{ animationDuration: "3s", animationDelay: "0.5s" }} />
                    <div className="absolute inset-8 rounded-full border border-emerald-500/20" />
                    <div className="w-28 h-28 rounded-full bg-emerald-500/[0.07] border border-emerald-500/20 flex items-center justify-center">
                      <Shield className="h-12 w-12 text-emerald-500/60" />
                    </div>
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: "12s" }}>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400/60" />
                    </div>
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: "18s", animationDirection: "reverse" }}>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-400/50" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/[0.05] px-10 lg:px-14 py-4 flex items-center justify-between">
                <span className="text-xs font-mono text-white/20">FEATURED / {new Date(featured.createdAt).getFullYear()}</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium group-hover:gap-3 transition-all">
                  Read full analysis <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── RECENT POSTS ──────────────────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-white/20" />
              <span className="text-sm font-semibold text-white tracking-wide uppercase">Recent Posts</span>
            </div>
            <Link href="/blog" className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors font-mono">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map(post => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group block rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 hover:border-emerald-500/25 hover:bg-emerald-500/[0.03] transition-all duration-300 flex flex-col h-full">
                <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-400 transition-colors font-serif">{post.title}</h3>
                <p className="text-sm text-white/40 flex-1 mb-4">{post.content.slice(0, 150)}...</p>
                <div className="flex items-center justify-between pt-5 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3 text-xs text-white/25 font-mono">
                    <span className="flex items-center gap-1"><User className="h-2.5 w-2.5" />{post.authorName}</span>
                    <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── TOPICS ────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-6 rounded-full bg-blue-500/60" />
            <span className="text-sm font-semibold text-white tracking-wide uppercase">Browse Topics</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {topics.map((topic) => (
              <Link key={topic.label} href="/blog" className="group block">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 text-center hover:border-emerald-500/25 hover:bg-emerald-500/[0.04] transition-all duration-300">
                  <topic.icon className="h-5 w-5 text-white/25 group-hover:text-emerald-400 transition-colors mx-auto mb-3" />
                  <div className="text-sm font-medium text-white/60 group-hover:text-white/90 transition-colors mb-1">{topic.label}</div>
                  <div className="text-xs font-mono text-white/20">{topic.count} posts</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER CTA ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl w-full px-6 py-20">
        <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-blue-500/[0.03] pointer-events-none" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 px-10 py-16 lg:px-20 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06]">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <span className="text-xs font-mono text-emerald-400 tracking-widest">Weekly Intel</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                Stay ahead of<br />
                <span className="italic text-emerald-400">the threat.</span>
              </h2>
              <p className="text-white/40 font-light leading-relaxed text-sm">
                Get curated writeups, CVE breakdowns, tool releases, and red team tactics — every week, straight to your inbox. No filler.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/40 focus:bg-white/[0.06] transition-all font-mono"
                />
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 rounded-lg border-0 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30 hover:-translate-y-0.5 transition-all whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-white/20 font-mono">No spam. Unsubscribe anytime. We respect your inbox.</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex -space-x-2">
                  {["AC", "BK", "TJ", "RM"].map((init, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border border-white/10 bg-white/[0.06] flex items-center justify-center text-xs font-mono text-white/40">{init}</div>
                  ))}
                </div>
                <span className="text-xs text-white/25 font-mono">28,000+ subscribers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
              <Shield className="h-3 w-3 text-emerald-400" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-white/60" style={{ fontFamily: "'Playfair Display', serif" }}>SecureBlog</span>
          </div>
          <div className="flex items-center gap-6">
            {["Blog", "About", "Privacy", "Contact"].map(link => (
              <Link key={link} href={`/${link.toLowerCase()}`} className="text-xs text-white/25 hover:text-white/60 transition-colors font-mono tracking-wide">{link}</Link>
            ))}
          </div>
          <div className="text-xs font-mono text-white/20">
            &copy; {new Date().getFullYear()} Blog Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}