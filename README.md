SecureBlog is a deliberately vulnerable full-stack web application built for cybersecurity education and CTF-style training. It simulates real-world vulnerabilities in a controlled environment, allowing developers and security researchers to practice identifying and exploiting common web security flaws.

Built with Next.js, Prisma, and SQLite.

Vulnerabilities included:
- SQL Injection (login bypass via simulated vulnerable query)
- Insecure Direct Object Reference / IDOR (draft post exposure)
- Stored Cross-Site Scripting / XSS (unsanitized comment content)
- Weak session management (no httpOnly, no secure flags)
- Plaintext password storage
- Information disclosure via cookies and draft posts

For educational purposes only. Do not deploy to production or expose to the public internet.


Tags:security, ctf, vulnerable-app, nextjs, prisma, sqlite, web-security, owasp, sql-injection, xss, educational
