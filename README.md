# Capstone Project

Aplikasi web untuk mengelola seluruh alur kerja Capstone Project Prodi D3 Teknik Informatika: pembuatan tim, pengajuan proposal (tim), pengajuan resume (individu), review & feedback dosen, serta booking jadwal bimbingan.

## Role

- **Mahasiswa** — buat tim, ajukan proposal & resume, booking bimbingan
- **Dosen Capstone Project** — review & set status proposal tim
- **Dosen Pembimbing** — review resume (yang diajukan kepadanya), kelola jadwal & bimbingan
- **Kaprodi** — CRUD data master, assign role, monitoring progress (superadmin; 1 user bisa multi-role — switch role menyusul)

## Dokumentasi

Dokumentasi adalah single source of truth untuk pengembangan (termasuk oleh AI agent — lihat `AGENTS.md`):

- [`docs/BUSINESS_RULES.md`](docs/BUSINESS_RULES.md) — aturan bisnis lengkap
- [`docs/ERD.md`](docs/ERD.md) — ERD final + constraint
- [`docs/STACK.md`](docs/STACK.md) — tech stack & pola implementasi
- [`docs/FLOW.md`](docs/FLOW.md) — flow end-to-end & state diagram

## Tech Stack

Next.js App Router (Server Action) · Tailwind · shadcn/ui · Prisma + PostgreSQL · Zod · React Hook Form · Tanstack Query (mutasi saja) · `jose` (JWT auth)

## Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — halaman login (`/`).
