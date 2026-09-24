# Tech Stack — Capstone Project App

## Stack

| Layer | Pilihan | Catatan |
|---|---|---|
| Framework | **Next.js (App Router)** | versi sesuai `package.json` — **cek `node_modules/next/dist/docs/` sebelum asumsi API** (versi ini punya breaking changes, lihat blok di `AGENTS.md`) |
| Rendering | Server Components (default) + Client Components saat perlu interaksi | |
| Mutasi data | **Server Actions** | semua write (create/update/delete) via server action |
| Query data | **Server Components** | fetch langsung di server component; **Tanstack Query TIDAK dipakai untuk query** |
| Mutasi (client) | **Tanstack Query** (`useMutation`) | **hanya untuk mutasi** — invalidasi/refetch setelah server action sukses |
| Styling | **Tailwind CSS** | |
| Komponen UI | **shadcn/ui** | komponen di-copy ke project, bukan dependency runtime |
| Form | **React Hook Form** | |
| Validasi | **Zod** | schema dibagikan RHF (`zodResolver`) dan server action |
| Database | **PostgreSQL** | |
| ORM | **Prisma** | schema di `prisma/schema.prisma` |
| Auth | **`jose`** (JWT) | JWT ditandatangani server, disimpan di **httpOnly cookie**; verifikasi di middleware + server action. Gaya official Next.js — **tanpa NextAuth/Auth.js** |
| File storage | **`public/`** | PDF proposal/resume; saat replace, **hapus file lama dari disk** |

## Pola yang dipakai

### Mutasi (Server Action + Zod + RHF + Tanstack Query)

```
Client (RHF + zodResolver)
  → call Server Action
      → re-verify session (auth check)
      → re-parse body dengan Zod (jangan percaya input client)
      → Prisma write
      → tulis ActivityLog (jika entity Tim/Proposal/Resume)
      → return { success, data } | { success: false, error, fieldErrors }
  → invalidate query (Tanstack Query) / refresh router
```

- **Validasi ganda**: Zod schema yang sama dipakai di form (RHF) dan di awal server action.
- Server action **wajib cek role** yang diizinkan menjalankan aksi tersebut.

### Query (Server Component)

- Data untuk render halaman diambil langsung di server component via Prisma.
- Tidak ada `useQuery` — hindari double-fetch.

### Auth flow

1. Login: cocokkan `identifier` + password (bcrypt/argon2) → set cookie JWT (`jose`).
2. JWT payload minimal: `sub` (user id), `role` (role aktif), `exp`.
3. `is_password_changed = false` → redirect ke halaman ganti password (force).
4. Switch role: update role aktif dalam JWT (re-issue cookie) → redirect ke dashboard role.
5. Proteksi route: middleware (cek cookie) + cek ulang di server action/server component.

### Prisma conventions

- ID: `uuid` (`@default(uuid())`) atau `@id @default(dbgenerated("gen_random_uuid()))`) — konsisten pakai UUID.
- Timestamps: `created_at` / `updated_at` (`@updatedAt`) — snake_case di DB.
- Soft delete = **kolom status enum** (bukan `deletedAt` global).
- Cascade: lihat kolom **On Delete** di `docs/ERD.md`.

### Struktur folder (usulan)

```
src/
  app/
    (auth)/login/, ganti-password/
    (dashboard)/
      mahasiswa/...
      dosen-capstone/...
      dosen-pembimbing/...
      kaprodi/...
    layout.tsx, page.tsx
  actions/          # server actions per domain
  components/       # shadcn + komponen app
  lib/
    auth/           # session jose, guards
    validations/    # zod schemas
    prisma.ts       # PrismaClient singleton
  hooks/            # hooks client (mis. useMutation wrappers)
prisma/
  schema.prisma
docs/
```

> Route dashboard di-segment per **role aktif** untuk mendukung switch role.

## Konvensi penting

- **Jangan** simpan secret/password di log.
- File path PDF disimpan relatif terhadap `public/` (mis. `/proposals/<uuid>.pdf`).
- Semua teks UI/enum mengikuti **kamus di `docs/BUSINESS_RULES.md`** (bahasa Indonesia).
- Jenis enum di Zod/TS harus **sama persis** dengan enum Prisma.
