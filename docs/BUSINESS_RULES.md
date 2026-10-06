# Business Rules — Capstone Project App

Aplikasi web untuk mengelola alur kerja Capstone Project Prodi D3 Teknik Informatika.
Dokumen ini adalah **single source of truth** untuk aturan bisnis. Baca sebelum menyentuh skema DB, server action, atau fitur terkait.

---

## 1. Autentikasi & Role

- Data mahasiswa & dosen di-insert oleh **Kaprodi** (Kaprodi = superadmin).
- Login menggunakan **NIM/NIP** (`User.identifier`) + password.
- **Halaman login = `/` (root)** — `src/app/page.tsx`.
- Password awal: **opsional diisi Kaprodi saat insert; jika kosong, default = identifier (NIM/NIP)**.
- **Email placeholder** saat insert Kaprodi: format `nim@gmail.com` / `nip@gmail.com` (seeder menyusul; email asli diisi user sendiri saat **reset akun**).
- **Force reset akun saat login pertama** (`is_account_reset = false`):
  - User **wajib** mengganti **email dan password** sebelum masuk dashboard (bukan password saja) lewat halaman **`/reset-akun`**.
  - Isian: alamat email baru (**harus unik** — `alamat_email` UNIQUE) + password baru + konfirmasi password (**minimal 8 karakter**).
  - Setelah sukses → `is_account_reset = true` → dashboard.
  - Guard: saat `is_account_reset = false`, semua route **ditolak (redirect ke `/reset-akun`)** kecuali halaman `/reset-akun` itu sendiri.
  - `is_account_reset` = penanda "sudah pernah reset akun (ganti email + password)", bukan password saja.
- **Proteksi route** dilakukan di **`src/proxy.ts`** (Next.js 16 menyebut middleware sebagai **proxy**, jadi tidak ada `middleware.ts`):
  1. **Belum login**: akses `/reset-akun` atau halaman dashboard → redirect `/`; selain itu lolos.
  2. **Sudah login, `is_account_reset = false`**: semua route selain `/reset-akun` → redirect `/reset-akun`.
  3. **Sudah login & sudah reset**: akses `/`, halaman auth, atau dashboard role lain → redirect ke dashboard role aktif; selain itu lolos (+ sliding refresh session).
- **Lupa password** (reset via email):
  - Halaman **`/lupa-password`**; user memilih metode: **Email (`alamat_email`) ATAU NIM/NIP (`identifier`)**.
  - Prasyarat: `User.is_account_reset = true`. Jika belum → pesan jelas: akun belum diaktivasi/direset, harus login dulu dengan NIM/NIP + password default lalu reset akun.
  - Token: acak **UUID** (`crypto.randomUUID()`), disimpan **hash SHA-256**-nya (bukan token mentah) di `PasswordResetToken`, berlaku **15 menit**, **single-use**.
  - **Maksimal 1 token aktif per user** (request baru menimpa lama / `upsert`). Jika masih ada token aktif, link **tidak dikirim ulang** — user diberi pesan bahwa link sebelumnya sudah dikirim ke emailnya (alamat email ditutup/masked).
  - Kirim link **`/reset-password?token=...`** via email (`libs/nodemailer.ts` → `sendEmail`).
  - Halaman **`/reset-password`**: masukkan password baru + konfirmasi (min 8 karakter) → token ditandai `used_at` (terpakai) → **langsung login (session dibuat)** → dashboard.
  - Token kedaluwarsa/terpakai/salah → pesan error jelas, tidak ada perubahan password.
  - **Catatan keamanan**: pesan error lupa-password bersifat **spesifik** (mis. "Akun tidak ditemukan!"), **bukan** respon generik — ada risiko account enumeration, diputuskan demikian demi kejelasan user.
  - Catatan: sebelum user reset akun, email = placeholder `nim@gmail.com` — link reset mungkin tidak sampai ke inbox asli (best effort; setelah reset akun, alur berjalan normal).
- Role awal ditentukan Kaprodi. Tabel `Role` berisi: `Mahasiswa`, `Dosen Capstone Project`, `Dosen Pembimbing`, `Kaprodi`.
- **1 user bisa memiliki lebih dari 1 role** (contoh: dosen bisa merangkap Dosen Capstone + Dosen Pembimbing).
- Session user menyimpan **role aktif** — saat ini **selalu role pertama** (`user.userRoles[0]`); mekanisme **switch role BELUM diimplementasikan** (belum ada UI maupun aksi penggantian role aktif).
- Auth session: **JWT signed via `jose`** (cookie httpOnly `session`, gaya official Next.js). Tidak pakai library auth eksternal.
  - Payload: `{ userId, role, isAccountReset, iat, exp }`, masa berlaku **7 hari** + sliding refresh (diperpanjang saat sisa masa berlaku < 3 hari).
- `User.is_active = false` → tidak bisa login (soft delete di level user).

---

## 2. Team Management

- **Minimal 2, maksimal 5 anggota** per tim.
- **1 mahasiswa hanya boleh berada di 1 tim** (dijamin `UNIQUE(mahasiswa_id)` di `AnggotaTim`).
- **Nama tim** ditentukan saat pembuatan tim.
- **Ketua = pembuat tim** dan otomatis menjadi anggota pertama dengan `status_persetujuan = Disetujui`.
- **Hanya Ketua** yang boleh invite anggota dan mengeluarkan anggota. Anggota lain hanya bisa **melihat (preview)** tim — tidak ada hak mengubah info tim.
- **Hanya Ketua** yang belum punya tim yang bisa membuat tim baru.
- **State mahasiswa terhadap tim** (derived dari keberadaan baris di `AnggotaTim`):
  - Tidak ada baris → belum punya tim → bisa **buat tim sendiri** (sebagai Ketua).
  - Ada baris, `status_persetujuan = Menunggu` → sedang diinvite → bisa **terima** (jadi Anggota, tanpa hak edit) atau **tolak** (**baris dihapus**) → setelah itu bisa buat tim sendiri.
  - Ada baris, `status_persetujuan = Disetujui` → sudah anggota tim → terkunci (sampai kondisi unlock di bawah).
- **Undangan**: mahasiswa yang sudah tercatat di `AnggotaTim` (status apa pun) **tidak muncul** di daftar mahasiswa yang bisa diundang.
- **Tolak undangan / Ketua keluarkan anggota = hapus baris `AnggotaTim`** (tidak ada enum `Ditolak`, tidak ada soft delete).
- **Tim terbentuk** = semua anggota memiliki `status_persetujuan = Disetujui`.
- **Tim terkunci** (tidak bisa tambah/keluarkan anggota, tidak bisa edit tim) ketika:
  - Proposal tim berstatus `Menunggu` (sudah diupload, menunggu review), atau
  - Proposal tim berstatus `Disetujui`.
- Sebelum tim terkunci (belum ada proposal / proposal masih bisa diedit), Ketua boleh keluarkan anggota dan anggota boleh keluar (keduanya = hapus baris).
- **Tidak ada mekanisme bubar tim** untuk saat ini.
- **Kategori capstone** (`kategori_capstone`: `EPD` / `SM`) **ditentukan Ketua saat invite** anggota (per anggota) — 1 tim boleh berisi kategori berbeda-beda.

---

## 3. Proposal Management

- **1 tim = 1 proposal aktif.**
- Field yang diisi saat upload: **judul proposal**, **mitra**, **file (PDF)**.
- **Upload menggantikan (replace)**: upload proposal baru → **record proposal lama dihapus** (termasuk review-nya, via cascade) **dan file PDF lama dihapus dari disk** (`public/`).
- **Keterkuncian edit proposal**:
  - Setelah upload (status `Menunggu`): **tidak bisa diedit**.
  - Status `Disetujui`: **tidak bisa diedit**.
  - Status `Ditolak` atau `Revisi`: **bisa diedit** (dengan upload proposal baru → replace).
- **Review oleh Dosen Capstone Project**:
  - **Semua** dosen dengan role Dosen Capstone Project bisa melihat **semua** proposal (proposal **tidak di-assign** ke dosen tertentu).
  - Dosen capstone **pertama** yang menyetel status proposal → **status terkunci** di `Proposal.status` (`Disetujui` / `Ditolak` / `Revisi`).
  - Dosen capstone **lain tidak bisa mengubah status**, hanya bisa **menambahkan feedback**.
  - Feedback tambahan dari dosen lain: kolom `status` di `ProposalReview` **diisi sama dengan status yang terkunci** di `Proposal.status`.
  - **1 dosen capstone boleh memberikan feedback berkali-kali** pada proposal yang sama.
- **Status proposal**: `Menunggu` → `Disetujui` | `Ditolak` | `Revisi`.
- **Status proposal hanya boleh diset setelah semua anggota tim `Disetujui`** (tim terbentuk).
- Log timeline aktifitas proposal dicatat ke `ActivityLog` (entity `Proposal`).

---

## 4. Resume Management

- **Prasyarat**: proposal tim sudah **`Disetujui`**.
- **1 mahasiswa = 1 resume aktif.**
- **Setiap anggota tim** mengupload resume-nya sendiri (individu, bukan tim).
- Saat upload, mahasiswa **memilih 1 Dosen Pembimbing** (`Resume.dosen_id`).
- Field: **subjudul**, **file (PDF)**, **dosen pembimbing**.
- **Upload menggantikan (replace)** saat resume `Ditolak`: record lama dihapus + file lama dihapus dari disk.
- **Keterkuncian edit resume**:
  - Setelah upload (status `Menunggu`) atau `Disetujui`: **tidak bisa diedit**.
  - Status `Ditolak`: **bisa diedit** (replace).
- **Review oleh Dosen Pembimbing**:
  - **Hanya dosen pembimbing yang dipilih** (`Resume.dosen_id`) yang boleh memberi status & feedback.
  - Dosen lain tidak bisa review resume ini.
  - Sama seperti proposal: status diset sekali, feedback lanjutan mencerminkan status terkunci.
- **Setelah resume `Disetujui`**:
  - `Mahasiswa.dosen_id` (dosen pembimbing tetap mahasiswa) **di-set** = `Resume.dosen_id`.
  - Mahasiswa tersebut **eligible booking bimbingan**.
- **Status resume**: `Menunggu` → `Disetujui` | `Ditolak` (tanpa tahap `Revisi` — kalau perlu perbaikan, dosen pilih `Ditolak`).
- Log timeline aktifitas resume dicatat ke `ActivityLog` (entity `Resume`).

---

## 5. Jadwal Konsultasi / Bimbingan

### 5a. Dosen Pembimbing — kelola jadwal & kuota

- Dosen pembimbing membuat jadwal **satu per satu** (bebas):
  - `tanggal` (DATE), `jam_mulai` (TIME), `jam_tutup` (TIME), `kuota` (INT).
- **Kuota = slot per jadwal** (contoh: jadwal Senin pagi, kuota 5 → maksimal 5 mahasiswa bisa booking jadwal itu).
- `DosenPembimbingDetail`:
  - `batas_bimbingan` = maksimal jumlah **mahasiswa aktif** yang bisa menjadi bimbingan dosen tersebut. **Diisi manual oleh Kaprodi.**
  - `status` (`Buka`/`Tutup`) = apakah dosen menerima bimbingan baru. **Ditentukan/diubah oleh Kaprodi.**

### 5b. Mahasiswa — booking

- **Syarat booking**:
  1. Resume mahasiswa sudah **`Disetujui`** (sudah punya dosen pembimbing tetap).
  2. Hanya bisa booking jadwal **dosen pembimbing-nya sendiri** — di UI **hanya tampil jadwal dospem terpilih**.
- Mahasiswa **boleh booking lebih dari 1 jadwal**, termasuk di hari yang sama.
- **Tidak boleh booking 2x di jadwal yang sama** (selama masih ada booking aktif di jadwal itu).
  - Tidak perlu composite unique di DB: booking yang dibatalkan tetap tersimpan (status `Dibatalkan`), dan mahasiswa **boleh booking ulang** jadwal yang sama setelah membatalkan, **jika slot masih tersedia**.
- Validasi sisa kuota: jumlah booking aktif (`Dipesan`) < `kuota` jadwal.
- **Catatan mahasiswa** saat booking: wajib diisi (`catatan_mahasiswa`).

### 5c. Pembatalan & penyelesaian

- **Pembatalan bisa dilakukan oleh mahasiswa MAUPUN dosen.**
- Saat status booking menjadi **`Dibatalkan`**, field berikut **wajib terisi** (validasi di aplikasi/Zod):
  - `alasan_pembatalan`
  - `dibatalkan_oleh` (`Mahasiswa` | `Dosen`)
  - `tanggal_pembatalan`
- **Status booking**: `Dipesan` → `Selesai` | `Dibatalkan`.
- Setelah bimbingan terjadi, dosen pembimbing meng-set status **`Selesai`** dan bisa mengisi **`catatan_dosen`**.
- `catatan_dosen` nullable (diisi saat/selesai bimbingan).

---

## 6. Master Data (Kaprodi)

- CRUD **Mahasiswa** dan **Dosen** dengan **filter, sort, pagination**.
- Insert user: identifier (NIM/NIP), nama, email placeholder (`nim@gmail.com` / `nip@gmail.com`), password (opsional, default = identifier), lalu data profil (kelas/angkatan/tanggal_masuk untuk mhs; bidang_keahlian/nip untuk dosen) — email asli & password baru diisi user sendiri saat **reset akun**.
- `Mahasiswa.id` / `Dosen.id` = **shared PK dengan `User.id`** (baris profil dibuat dengan id yang sama seperti User yang baru dibuat).
- **Soft delete = set status data**, bukan hard delete:
  - `Mahasiswa.status`: `Aktif` | `Nonaktif` | `Arsip`
  - `Dosen.status`: `Aktif` | `Nonaktif` | `Pindah`
  - `User.is_active`: `true`/`false`
- Kaprodi juga assign **role** user (termasuk merangkap) via `UserRole`.
- Kaprodi isi/mengubah `DosenPembimbingDetail` (batas bimbingan, Buka/Tutup).

---

## 7. Monitoring Progress (Kaprodi)

Tidak ada fitur tulis — hanya baca. Tampilan:

1. **List tim** + detail (daftar mahasiswa anggotanya).
2. **List proposal** + detail (tim terkait + data proposal).
3. **List pengajuan resume** + detail (mahasiswa + data resume).
4. **List riwayat bimbingan** + detail (mahasiswa + dosen + jadwal bimbingan).
5. **Monitoring progress per mahasiswa**: status tim (belum punya tim / menunggu / terbentuk), status proposal, status resume.

---

## 8. Activity Log

- Entity yang di-log: **`Tim`, `Proposal`, `Resume`** saja (booking/bimbingan **tidak** perlu log untuk saat ini).
- `entity_id` bersifat **polimorfik** — referensi ke `Tim.id` / `Proposal.id` / `Resume.id`, **tidak ada FK formal**.
- `pesan` berisi teks kejadian, `warna` untuk styling UI timeline (`Neutral|Danger|Warning|Success|Info`).
- `user_id` pelaku log (nullable — bisa null jika pelaku terhapus).

---

## 9. File Storage

- File PDF proposal & resume disimpan di **`public/`** (folder publik Next.js).
- Saat replace (upload baru): **hapus file lama dari disk** juga, bukan hanya record DB.
- Konvensi penamaan: gunakan UUID/nama unik (jangan nama asli file) untuk hindari tabrakan.

---

## 10. Delete Behavior (ringkas)

| Aksi | Efek |
|---|---|
| Tolak undangan / keluar / dikeluarkan tim | Hapus baris `AnggotaTim` |
| Replace proposal | Hapus `Proposal` (+ `ProposalReview` cascade) + file dari disk |
| Replace resume | Hapus `Resume` (+ `ResumeReview` cascade) + file dari disk |
| Soft delete master | Set `status` enum / `is_active` |
| User/role dihapus | `UserRole` cascade; `Mahasiswa`/`Dosen` cascade ke `User`; `PasswordResetToken` cascade ke `User` |
