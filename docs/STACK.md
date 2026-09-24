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
| Auth            | **`jose`** (JWT)                                                     | JWT ditandatangani server, disimpan di **httpOnly cookie**; verifikasi di middleware + server action. Gaya official Next.js — **tanpa NextAuth/Auth.js** |
| File storage    | **`public/`**                                                        | PDF proposal/resume; saat replace, **hapus file lama dari disk**                                                                                         |

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

### Struktur folder (feature-based)

```
src/
  app/                              # thin routing — hanya page & layout, tanpa logika bisnis
    (auth)/
      login/page.tsx
      ganti-password/page.tsx
    (dashboard)/
      layout.tsx                     # shell + guard + switch role
      mahasiswa/
        tim/page.tsx
        proposal/page.tsx
        resume/page.tsx
        bimbingan/page.tsx
      dosen-capstone/
        proposal/page.tsx
      dosen-pembimbing/
        resume/page.tsx
        bimbingan/page.tsx
      kaprodi/
        mahasiswa/page.tsx
        dosen/page.tsx
        monitoring/page.tsx
    layout.tsx
    globals.css

  features/                          # 1 folder = 1 domain (selaras tabel ERD)
    auth/          # User, Role, UserRole
    mahasiswa/     # Mahasiswa
    dosen/         # Dosen, DosenPembimbingDetail
    tim/           # Tim, AnggotaTim
    proposal/      # Proposal, ProposalReview
    resume/        # Resume, ResumeReview
    konsultasi/    # JadwalKonsultasi, BookingKonsultasi
    monitoring/    # read-only, tanpa tabel sendiri

  components/
    ui/            # shadcn (generated)
    layout/        # sidebar, navbar, switch-role (lintas fitur)

  libs/
    prisma.ts
    auth/          # jose session, guards
    activity-log.ts
    utils.ts
prisma/
docs/
```

> Route dashboard di-segment per **role aktif** untuk mendukung switch role.
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

## Konvensi penting

- **Jangan** simpan secret/password di log.
- File path PDF disimpan relatif terhadap `public/` (mis. `/proposals/<uuid>.pdf`).
- Semua teks UI/enum mengikuti **kamus di `docs/BUSINESS_RULES.md`** (bahasa Indonesia).
- Jenis enum di Zod/TS harus **sama persis** dengan enum Prisma.
