# Capstone Project — Agent Instructions

Aplikasi web pengelola alur kerja Capstone Project Prodi D3 Teknik Informatika:
tim → proposal (tim) → resume (individu) → bimbingan. Role: Mahasiswa, Dosen Capstone Project, Dosen Pembimbing, Kaprodi (superadmin, 1 user bisa multi-role; switch role menyusul).

**Baca file berikut sebelum menyentuh skema DB, server action, auth, atau fitur terkait — jangan asumsikan dari ingatan, jangan tanya ulang aturan yang sudah tertulis:**

| File | Isi |
|---|---|
| `docs/BUSINESS_RULES.md` | **Single source of truth** aturan bisnis (lock/unlock, replace, booking, dll) |
| `docs/ERD.md` | ERD final + constraint + validasi app-level |
| `docs/STACK.md` | Tech stack, pola Server Action/Zod/RHF/Tanstack Query, auth `jose`, struktur folder |
| `docs/FLOW.md` | Flow end-to-end + state diagram per entitas |

## Konvensi singkat

- Stack: Next.js App Router + **Server Action** (mutasi), **Server Components** (query), Tanstack Query **hanya untuk mutasi**, Tailwind, shadcn/ui, React Hook Form + **Zod** (validasi ganda: client & server action), **Prisma + PostgreSQL**, auth JWT via **`jose`** (httpOnly cookie, tanpa NextAuth).
- **Struktur feature-based**: logika per domain → `src/features/<domain>/` (selaras tabel ERD: `auth`, `mahasiswa`, `dosen`, `tim`, `proposal`, `resume`, `konsultasi`, `monitoring` — folder `monitoring` menyusul). `src/app/` **hanya routing** (page/layout tipis).
- Layer per fitur **flat, 1 file per layer**: `schemas.ts` (Zod + type), `actions.ts` (server actions), `queries.ts` (Prisma read), `hooks.ts` (Tanstack Query, jika perlu), `components/` (UI — satu-satunya folder). **Jangan** pecah per fungsi atau tambah folder lain di fitur. Detail: `docs/STACK.md`.
- Bahasa teks/enum UI: **Indonesia**, ikuti kamus di `docs/BUSINESS_RULES.md`.
- Soft delete = kolom status enum / `is_active` (bukan `deletedAt`).
- File PDF di `public/`; saat replace proposal/resume, **hapus file lama dari disk**.
- Setiap server action wajib: cek session + cek role, re-parse input dengan Zod — **kecuali action auth** (`login`, `logout`, `forgotPassword`, `resetPassword`) yang memang dijalankan tanpa session.
- Proteksi route: **`src/proxy.ts`** (Next.js 16 menyebut middleware sebagai **proxy**; file `middleware.ts` sudah tidak dipakai). **Halaman login = `/`** (root).
- Log `ActivityLog` hanya untuk entity `Tim`, `Proposal`, `Resume`.
- Sebelum menulis kode Next.js, cek docs versi ini di `node_modules/next/dist/docs/` (lihat blok di bawah).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
