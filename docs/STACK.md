# Tech Stack — Capstone Project App

## Stack

| Layer           | Pilihan                                                              | Catatan                                                                                                                                                  |
| --------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | **Next.js (App Router)**                                             | versi sesuai `package.json` — **cek `node_modules/next/dist/docs/` sebelum asumsi API** (versi ini punya breaking changes, lihat blok di `AGENTS.md`)    |
| Rendering       | Server Components (default) + Client Components saat perlu interaksi |                                                                                                                                                          |
| Mutasi data     | **Server Actions**                                                   | semua write (create/update/delete) via server action                                                                                                     |
| Query data      | **Server Components**                                                | fetch langsung di server component; **Tanstack Query TIDAK dipakai untuk query**                                                                         |
| Mutasi (client) | **Tanstack Query** (`useMutation`)                                   | **hanya untuk mutasi** — invalidasi/refetch setelah server action sukses                                                                                 |
| Styling         | **Tailwind CSS**                                                     |                                                                                                                                                          |
| Komponen UI     | **shadcn/ui**                                                        | komponen di-copy ke project, bukan dependency runtime                                                                                                    |
| Form            | **React Hook Form**                                                  |                                                                                                                                                          |
| Validasi        | **Zod**                                                              | schema dibagikan RHF (`zodResolver`) dan server action                                                                                                   |
| Database        | **PostgreSQL**                                                       |                                                                                                                                                          |
| ORM             | **Prisma**                                                           | schema di `prisma/schema.prisma`                                                                                                                         |
| Auth            | **`jose`** (JWT)                                                     | JWT ditandatangani server, disimpan di **httpOnly cookie `session`**; verifikasi di **`src/proxy.ts`** (Next.js 16 menyebut middleware sebagai **proxy**) + server action. Gaya official Next.js — **tanpa NextAuth/Auth.js** |
| File storage    | **`public/`**                                                        | PDF proposal/resume; saat replace, **hapus file lama dari disk**                                                                                         |
| Email           | **Nodemailer + Gmail SMTP** (App Password)                           | library open-source, **tanpa SaaS pihak ketiga**; semua kirim email dibungkus **`src/libs/nodemailer.ts`** (`sendEmail`) agar provider mudah ditukar |

## Pola yang dipakai

### Mutasi (Server Action + Zod + RHF + Tanstack Query)

```
Client (RHF + zodResolver)
  → call Server Action
      → re-verify session (auth check)
      → re-parse body dengan Zod (jangan percaya input client)
      → Prisma write
      → tulis ActivityLog (jika entity Tim/Proposal/Resume)
      → return { success, message, data? } | { success: false, message, errors? (fieldErrors) }
  → invalidate query (Tanstack Query) / refresh router
```

- **Validasi ganda**: Zod schema yang sama dipakai di form (RHF) dan di awal server action.
- Server action **wajib cek role** yang diizinkan menjalankan aksi tersebut.

### Query (Server Component)

- Data untuk render halaman diambil langsung di server component via Prisma.
- Tidak ada `useQuery` — hindari double-fetch.

### Auth flow

1. Halaman login = **`/` (root)**. Login: cocokkan `identifier` (NIM/NIP) + password (**bcrypt**, `libs/bcrypt.ts`) → set cookie JWT httpOnly **`session`** (`jose`), berlaku 7 hari.
2. JWT payload: `{ userId, role, isAccountReset, iat, exp }` — `role` diambil dari `userRoles[0]`.
3. `is_account_reset = false` → redirect ke halaman **`/reset-akun`** (force ganti **email + password**); guard `src/proxy.ts` menolak semua route lain sampai selesai.
4. Lupa password: `/lupa-password` → pilih **email ATAU NIM/NIP** → token acak (UUID) di-hash SHA-256, 15 menit, single-use, maks. 1 aktif per user → kirim link `/reset-password?token=...` via `libs/nodemailer.ts` → reset → **auto-login**.
5. Switch role: **belum diimplementasikan** (menyusul).
6. Proteksi route: **`src/proxy.ts`** (Next.js 16 = middleware → proxy; cek cookie) + cek ulang di server action/server component (`verifySession`).

### Prisma conventions

- ID: `@default(dbgenerated("gen_random_uuid()"))` — konsisten pakai UUID. **Kecuali `Mahasiswa` & `Dosen`**: pakai **shared PK** dengan `User` (`@id` **tanpa** default, relasi `fields: [id], references: [id]` → `Mahasiswa.id = User.id`).
- Timestamps: `created_at` / `updated_at` (`@updatedAt`) — snake_case di DB.
- Soft delete = **kolom status enum** (bukan `deletedAt` global).
- Cascade: lihat kolom **On Delete** di `docs/ERD.md`.

### Struktur folder (feature-based)

```
src/
  proxy.ts                          # guard route — Next.js 16: middleware → PROXY (bukan middleware.ts)
  app/                              # thin routing — hanya page & layout, tanpa logika bisnis
    page.tsx                        # LOGIN — halaman login = `/` (root)
    (auth)/
      lupa-password/page.tsx        # /lupa-password (metode email / NIM-NIP)
      reset-akun/page.tsx           # /reset-akun — force reset akun (is_account_reset = false)
      reset-password/page.tsx       # /reset-password?token=...
    (dashboard)/
      layout.tsx                    # shell + verifySession()
      mahasiswa/page.tsx            # /mahasiswa
      dosen-capstone-project/page.tsx  # /dosen-capstone-project (NAMA SEGMENT ≠ "dosen-capstone")
      dosen-pembimbing/page.tsx     # /dosen-pembimbing
      kaprodi/page.tsx              # /kaprodi
      # sub-route per fitur (tim/proposal/resume/bimbingan/dsb) menyusul
    layout.tsx
    globals.css
    not-found.tsx

  features/                         # 1 folder = 1 domain (selaras tabel ERD)
    auth/          # User, Role, UserRole, PasswordResetToken — SUDAH ADA
    mahasiswa/     # Mahasiswa            (folder ada, isi menyusul)
    dosen/         # Dosen, DosenPembimbingDetail (folder ada, isi menyusul)
    tim/           # Tim, AnggotaTim      (folder ada, isi menyusul)
    proposal/      # Proposal, ProposalReview (folder ada, isi menyusul)
    resume/        # Resume, ResumeReview (folder ada, isi menyusul)
    konsultasi/    # JadwalKonsultasi, BookingKonsultasi (folder ada, isi menyusul)
    monitoring/    # read-only, tanpa tabel sendiri — FOLDER MENYUSUL

  components/
    ui/            # shadcn (generated)
    layouts/       # sidebar, navbar, switch-role (lintas fitur) — menyusul
    providers/     # tanstack-query provider

  libs/
    prisma.ts      # Prisma client singleton
    session.ts     # jose: encrypt/decrypt/create/delete/refresh session + verifySession
    bcrypt.ts      # hashPassword / comparePassword
    nodemailer.ts  # sendEmail (Gmail SMTP)

  types/index.ts       # ActionResponse, ErrorFields
  utils/               # action-runner, env, format-zod-error, mask-email
  generated/           # output Prisma client (jangan diedit manual)
prisma/
docs/
```

> Route dashboard di-segment per **role aktif** untuk mendukung switch role (switch role sendiri **menyusul**).
> Segment folder dashboard memakai nama lengkap **`dosen-capstone-project`** (bukan `dosen-capstone`).
> Tabel `Prodi` **tidak** punya folder fitur (tanpa CRUD, hanya relasi Prisma).

#### Layer di dalam tiap fitur

```
features/<domain>/
  schemas.ts      # Zod + type infer (z.infer) — sumber validasi RHF & server action
  actions.ts      # semua Server Action fitur ("use server"), cek session + role
  queries.ts      # Prisma read untuk Server Components (reusable, mis. oleh monitoring)
  hooks.ts        # wrapper Tanstack Query useMutation — hanya jika ada client mutation
  components/     # UI fitur (form/dialog/table) — SATU-SATUNYA folder di fitur
```

- **1 file per layer** — jangan pecah per fungsi (`login.ts`, `logout.ts`, dst.).
- File layer yang tidak dipakai (mis. `monitoring` tanpa mutasi → tanpa `actions.ts`) tidak dibuat.
- **Tidak ada** `types.ts`, `utils.ts` per fitur, barrel `index.ts`, atau repository/service layer — Prisma dipanggil dari `actions.ts` / `queries.ts` langsung.
- Import: `@/features/tim/schemas`, `@/features/tim/components/...`.
- Fitur boleh dilayani >1 role (mis. `mahasiswa` juga dibaca `monitoring` via `queries`) — route segment ≠ folder fitur.
- `queries.ts` ditandai `"use server"` (dipanggil dari server component / server action lain); `hooks.ts` ditandai `"use client"`.

## Konvensi penting

- **Jangan** simpan secret/password di log.
- File path PDF disimpan relatif terhadap `public/` (mis. `/proposals/<uuid>.pdf`).
- Semua teks UI/enum mengikuti **kamus di `docs/BUSINESS_RULES.md`** (bahasa Indonesia).
- Jenis enum di Zod/TS harus **sama persis** dengan enum Prisma.
- **Zod v4** (`zod@^4`): validasi email pakai `z.email(...)`, pesan `refine` lewat opsi `error:` (bukan `message:`).
