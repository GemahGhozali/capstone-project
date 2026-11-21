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
- **Arsip tim** (`Tim.status`: `Aktif` | `Arsip`, default `Aktif`):
  - Hanya **Kaprodi** yang bisa mengarsipkan / mengembalikan ke `Aktif` (toggle dua arah, via action `updateTimStatus`).
  - Arsip tim = **penanda saja** — tidak mengubah alur bisnis manapun (anggota tetap terikat tim, tim terkunci tetap terkunci).
  - Aksi arsip/un-arsip **tidak** dicatat ke `ActivityLog`.

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
- **Arsip proposal** (`Arsip` adalah bagian enum `StatusProposal`):
  - Hanya **Kaprodi** yang bisa mengarsipkan / mengembalikan (via `arsipProposal` / `unarsipProposal`).
  - Proposal terarsip **tidak bisa direview** (dosen capstone ditolak di server action) dan **tidak bisa diedit** mahasiswa.
  - Proposal terarsip **tidak tampil** untuk Dosen Capstone (list & detail difilter `status != Arsip`); **Kaprodi melihat semua**; mahasiswa tetap melihat proposal timnya sendiri.
  - **Un-arsip**: status dikembalikan **mengikuti review terakhir** (`ProposalReview` terbaru); jika belum pernah direview → kembali `Menunggu`.
  - Aksi arsip/un-arsip **tidak** dicatat ke `ActivityLog`.
- Log timeline aktifitas proposal dicatat ke `ActivityLog` (entity `Proposal`).

---

## 4. Resume Management

- **Prasyarat**: proposal tim sudah **`Disetujui`**.
- **1 mahasiswa = 1 resume aktif.**
- **Setiap anggota tim** mengupload resume-nya sendiri (individu, bukan tim).
- Saat upload, mahasiswa **memilih 1 Dosen Pembimbing** (`Resume.dosen_id`).
- Field: **subjudul**, **file (PDF)**, **dosen pembimbing**.
- **Reservasi kuota**: resume berstatus `Menunggu` menempati **1 slot** `batas_bimbingan` dosen terpilih. Slot dilepas saat resume `Ditolak` atau dipindahkan ke dosen lain.
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
  - Mahasiswa tersebut **eligible mengisi catatan bimbingan**.
- **Status resume**: `Menunggu` → `Disetujui` | `Ditolak` (tanpa tahap `Revisi` — kalau perlu perbaikan, dosen pilih `Ditolak`).
- **Arsip resume** (`Arsip` adalah bagian enum `StatusResume`):
  - Hanya **Kaprodi** yang bisa mengarsipkan / mengembalikan (via `arsipResume` / `unarsipResume`).
  - Resume terarsip **tidak bisa direview** (dosen pembimbing ditolak di server action) dan **tidak bisa diedit** mahasiswa.
  - Resume terarsip **tidak tampil** untuk Dosen Pembimbing (list & detail difilter `status != Arsip`); **Kaprodi melihat semua**; mahasiswa tetap melihat resume-nya sendiri.
  - **Un-arsip**: status dikembalikan **mengikuti review terakhir** (`ResumeReview` terbaru); jika belum pernah direview → kembali `Menunggu`.
  - Cek syarat yang bergantung `Resume.status = Disetujui` (**catatan bimbingan** & **kuesioner**) menganggap `Arsip` **lolos** seperti `Disetujui` — arsip diasumsikan berasal dari data yang sudah disetujui; prasyarat upload resume (`proposal.status = Disetujui`) juga menganggap `Arsip` lolos.
  - Aksi arsip/un-arsip **tidak** dicatat ke `ActivityLog`.
- Log timeline aktifitas resume dicatat ke `ActivityLog` (entity `Resume`).

---

## 5. Bimbingan (Logbook)

### 5a. Mahasiswa — catat hasil bimbingan

- **Prasyarat**: resume mahasiswa sudah **`Disetujui`** (atau `Arsip`, mengikuti aturan arsip) dan `Mahasiswa.dosen_id` sudah terisi.
- Mahasiswa boleh memiliki **banyak catatan bimbingan**. Setiap catatan berisi:
  - `tanggal` (DATE) — tanggal kegiatan bimbingan.
  - `catatan` (TEXT) — wajib diisi.
  - Satu **bukti pendukung** — PDF, JPG, PNG, atau WebP; maksimal **5 MB**.
- Saat catatan dibuat, `dosen_id` **disalin dari `Mahasiswa.dosen_id`** sebagai snapshot dospem pemverifikasi.
- Status awal catatan: **`Menunggu`**.
- **Edit/hapus hanya saat status `Menunggu`**:
  - Status `Disetujui` dan `Ditolak` **terkunci permanen** — tidak bisa diedit maupun dihapus.
  - Saat edit dengan file baru, file bukti lama **dihapus dari disk**.
  - Saat hapus record, file bukti juga **dihapus dari disk**.

### 5b. Dosen Pembimbing — verifikasi

- Dosen pembimbing **hanya bisa memverifikasi catatan milik mahasiswa bimbingannya** (`Bimbingan.dosen_id = Dosen.id`).
- Status dapat diubah **berkali-kali** oleh dosen pembimbing: `Menunggu` → `Disetujui`/`Ditolak`, lalu `Disetujui` ↔ `Ditolak`.
- **Tanpa catatan/feedback dosen** — keputusan hanya berupa status.
- Perubahan status tidak menyimpan riwayat; yang tersimpan hanya status terkini.

### 5c. Kaprodi — monitoring (read-only)

- Menampilkan **mahasiswa aktif** yang resume-nya `Disetujui`/`Arsip`.
- Kolom daftar: **Nama**, **NIM**, **Subjudul Resume**, **Dosen Pembimbing**, **Total Bimbingan Terverifikasi** (jumlah status `Disetujui`).
- Urutan: total bimbingan terverifikasi terbanyak.
- Detail mahasiswa menampilkan **semua catatan bimbingan (semua status)** beserta tanggal, catatan, dan bukti pendukung.
- Bimbingan **tidak** dicatat ke `ActivityLog`.

---

## 6. Master Data (Kaprodi)

- CRUD **Mahasiswa** dan **Dosen** dengan **filter, sort, pagination**.
- Insert user: identifier (NIM/NIP), nama, email placeholder (`nim@gmail.com` / `nip@gmail.com`), password (opsional, default = identifier), lalu data profil (kelas/angkatan/tanggal_masuk untuk mhs; bidang_keahlian/nip untuk dosen) — email asli & password baru diisi user sendiri saat **reset akun**.
- `Mahasiswa.id` / `Dosen.id` = **shared PK dengan `User.id`** (baris profil dibuat dengan id yang sama seperti User yang baru dibuat).
- **Soft delete = set status data**, bukan hard delete:
  - `Mahasiswa.status`: `Aktif` | `Nonaktif` | `Arsip` | `Tuntas` (manual via form Kaprodi; `Tuntas` = mahasiswa telah menyelesaikan Capstone)
  - `Dosen.status`: `Aktif` | `Nonaktif` | `Pindah`
  - `User.is_active`: `true` hanya saat `Mahasiswa.status` = `Aktif` atau `Tuntas`, sisanya `false`
- CRUD Mahasiswa mendukung **select row** (checkbox per baris + select all halaman) untuk **bulk ubah status** dan **bulk hapus** oleh Kaprodi.
- **Import massal mahasiswa (Excel)** oleh Kaprodi: unduh template (sheet `Import Mahasiswa` + `Daftar Kelas`), isi **NIM, Nama Lengkap, Kode Kelas, Tanggal Masuk**. Email placeholder = `nim@gmail.com`, password awal = NIM, status = `Aktif`, `is_account_reset = false`. Import bersifat **atomik** — jika ada satu baris tidak valid (NIM/email duplikat, kode kelas tidak ditemukan, tanggal tidak valid), seluruh import dibatalkan dan error per baris ditampilkan. Maksimal **500 baris** dan **5 MB** per file.
- Kaprodi juga assign **role** user (termasuk merangkap) via `UserRole`.
- Kaprodi isi/mengubah `DosenPembimbingDetail` (batas bimbingan, Buka/Tutup).

---

## 7. Monitoring Progress (Kaprodi)

Tidak ada fitur tulis — hanya baca. Tampilan:

1. **List tim** + detail (daftar mahasiswa anggotanya).
2. **List proposal** + detail (tim terkait + data proposal).
3. **List pengajuan resume** + detail (mahasiswa + data resume).
4. **List/monitoring bimbingan** + detail (mahasiswa + dosen + semua catatan & bukti pendukung, semua status).
5. **Monitoring progress per mahasiswa**: status tim (belum punya tim / menunggu / terbentuk), status proposal, status resume.

> **Catatan arsip**: Kaprodi (pemilik fitur monitoring) tetap melihat **semua** data termasuk yang diarsip (status `Arsip` tampil sebagai penanda). Data diarsip **tidak tampil** untuk Dosen Capstone (proposal) & Dosen Pembimbing (resume).

---

## 8. Activity Log

- Entity yang di-log: **`Tim`, `Proposal`, `Resume`** saja (bimbingan **tidak** perlu log untuk saat ini).
- `entity_id` bersifat **polimorfik** — referensi ke `Tim.id` / `Proposal.id` / `Resume.id`, **tidak ada FK formal**.
- `pesan` berisi teks kejadian, `warna` untuk styling UI timeline (`Neutral|Danger|Warning|Success|Info`).
- `user_id` pelaku log (nullable — bisa null jika pelaku terhapus).

---

## 9. File Storage

- File PDF proposal & resume disimpan di **`public/`** (folder publik Next.js).
- Saat replace (upload baru): **hapus file lama dari disk** juga, bukan hanya record DB.
- Konvensi penamaan: gunakan UUID/nama unik (jangan nama asli file) untuk hindari tabrakan.

---

## 10. Kuesioner

> Ejaan resmi di aplikasi: **Kuesioner** (bukan "kuisioner"). Bagian ini adalah **spesifikasi final** — implementasi `src/features/kuesioner/` + route **menyusul** (skema di `docs/ERD.md`, flow di `docs/FLOW.md` §7).

### 10a. Pengelolaan oleh Kaprodi

- **Struktur dinamis 3 level**: `Kuesioner → Bagian → Pertanyaan`.
- Field kuesioner: `judul`, `deskripsi` (opsional), `periode` (teks bebas, mis. `2026I`).
- **Status**: `Draf` → `Aktif` → `Ditutup`. Beberapa kuesioner boleh `Aktif` bersamaan; tidak ada deadline otomatis.
- **Pembuatan**: form metadata saja (judul/periode/deskripsi) → langsung berstatus `Draf` dan **boleh 0 bagian**; setelah tersimpan, lanjut ke halaman edit untuk membangun struktur.
- Bagian & pertanyaan dikelola dengan **action granular per operasi** — tambah/edit/hapus bagian dan pertanyaan masing-masing action tersendiri, setiap operasi langsung tersimpan — **bukan** satu action besar yang memutasi seluruh struktur. UI: tambah/edit via Dialog, hapus via dialog konfirmasi (AlertDialog).
- Membuat bagian **boleh tanpa pertanyaan**; pertanyaan wajib terikat ke bagian yang sudah ada (`bagian_id`).
- `urutan` bagian/pertanyaan **diisi otomatis** oleh server (`max + 1` dalam parent masing-masing) — **tanpa input manual**, tanpa fitur reorder di MVP.
- Setiap pertanyaan punya: `tipe` (`Likert` / `Esai`), `teks`, toggle `wajib` (default **wajib**).
- **Validasi kelengkapan struktur hanya dilakukan saat publish** (`Draf → Aktif`):
  1. minimal 1 bagian;
  2. setiap bagian minimal 1 pertanyaan;
  3. setiap pertanyaan punya teks + tipe valid;
  4. judul dan periode terisi.
  Bagian kosong → publish ditolak dengan pesan spesifik, mis. `Bagian "Sarana Prasarana" belum memiliki pertanyaan.`
- **Setelah `Aktif`**: judul, periode, deskripsi, bagian, dan pertanyaan **terkunci**; satu-satunya perubahan adalah `Aktif → Ditutup`.
- **`Ditutup` final**: tidak bisa dibuka kembali dan **tidak bisa dihapus**. Untuk periode berikutnya gunakan **Duplikat**.
- **Duplikat**: menyalin metadata + seluruh bagian/pertanyaan (termasuk `urutan`) ke kuesioner baru berstatus `Draf`; **respons lama tidak ikut tersalin**.
- **Hapus kuesioner hanya saat `Draf`** (cascade bagian/pertanyaan; kuesioner `Draf` belum mungkin punya respons).

### 10b. Pengisian oleh Mahasiswa

- **Prasyarat**: `Resume.status = Disetujui`. Selama belum memenuhi, halaman menampilkan callout (bukan form); menu tetap terlihat.
- Mahasiswa hanya melihat kuesioner `Aktif`; kuesioner `Draf` tidak terlihat; `Ditutup` tampil sebagai riwayat dan tidak bisa diisi.
- **1 mahasiswa = 1 respons per kuesioner** (`UNIQUE(kuesioner_id, mahasiswa_id)`).
- Skala Likert (bobot naik), disimpan sebagai `nilai` SMALLINT 1–5 (CHECK di DB): `Kurang` (1), `Cukup` (2), `Cukup Baik` (3), `Baik` (4), `Baik Sekali` (5) — label dipetakan di UI (bukan enum DB).
- Penyimpanan jawaban **per bagian**, dipicu tombol navigasi — **tanpa auto-save penuh**:
  - `Lanjutkan`: simpan bagian aktif dulu → validasi pertanyaan wajib bagian itu → lolos = pindah bagian berikutnya; tidak lolos = tetap di bagian itu (isian yang sudah diketik tetap tersimpan).
  - `Kembali`: simpan bagian aktif, lalu pindah ke bagian sebelumnya.
  - `Keluar dari Kuesioner`: simpan bagian aktif, lalu kembali ke daftar.
- Isian di bagian aktif yang **belum melewati tombol navigasi tidak tersimpan** (mis. menutup browser tanpa klik apa pun).
- **Penanda "terjawab" = ada baris `JawabanKuesioner`**; jawaban yang dikosongkan = barisnya **dihapus**. Tidak ada kolom `answered`. `ResponKuesioner` dibuat saat jawaban pertama disimpan, status `Draf`.
- **Submit final (tombol `Kirim Jawaban` di bagian terakhir)**:
  1. simpan bagian terakhir;
  2. server membaca ulang **seluruh** pertanyaan & jawaban dari DB (validasi server, bukan hanya client);
  3. validasi semua pertanyaan `wajib` terjawab;
  4. lolos → `ResponKuesioner.status = Selesai` + `submitted_at`; gagal → tolak dengan info bagian/pertanyaan pertama yang belum lengkap.
- Setelah `Selesai`, jawaban **tidak bisa diubah** (mahasiswa melihat state konfirmasi "terima kasih"; menampilkan kembali jawaban secara read-only bersifat opsional).
- Kuesioner yang sudah `Ditutup` tidak bisa diisi/lanjutkan/submitted.
- Pertanyaan opsional boleh dikosongkan; hanya pertanyaan `wajib` yang memblokir.

### 10c. Resume posisi pengisian

- Status per bagian **dihitung dari data tersimpan** pada initial load (tanpa kolom tambahan):
  - `Selesai` = semua pertanyaan **wajib** di bagian itu terjawab (pertanyaan opsional tidak menghalangi);
  - `Sedang Diisi` = ada jawaban, tetapi wajib belum lengkap;
  - `Belum Diisi` = belum ada jawaban sama sekali.
- Wizard dibuka mulai dari **bagian pertama yang belum selesai**; bila semua bagian selesai → bagian terakhir / state "siap dikirim".
- Jawaban yang tersimpan di-prefill ke form saat membuka lagi.
- UI: `Bagian x dari y` + progress ring/bar; stepper/daftar status per bagian bersifat opsional.

### 10d. Hasil & rekap (Kaprodi)

- **Hanya respons `Selesai` yang masuk rekap**; respons `Draf` tidak dihitung.
- Likert: distribusi jumlah tiap nilai 1–5 + rata-rata (`AVG(nilai)` langsung di SQL); label tiap nilai dipetakan di UI (1=`Kurang` … 5=`Baik Sekali`).
- Esai: daftar jawaban **anonim** per pertanyaan (tanpa identitas responden).
- Daftar pengisian: mahasiswa eligible + status pengisiannya (`Belum Mengisi` / `Sedang Mengisi` / `Selesai` + tanggal kirim).
- **Jawaban individual mahasiswa tidak ditampilkan** ke siapa pun.
- Di luar scope (untuk saat ini): export CSV/Excel, chart library, deadline otomatis, reopen `Ditutup`, edit jawaban setelah submit, ActivityLog kuesioner.

---

## 11. Delete Behavior (ringkas)

| Aksi | Efek |
|---|---|
| Tolak undangan / keluar / dikeluarkan tim | Hapus baris `AnggotaTim` |
| Replace proposal | Hapus `Proposal` (+ `ProposalReview` cascade) + file dari disk |
| Replace resume | Hapus `Resume` (+ `ResumeReview` cascade) + file dari disk |
| Soft delete master | Set `status` enum / `is_active` |
| User/role dihapus | `UserRole` cascade; `Mahasiswa`/`Dosen` cascade ke `User`; `PasswordResetToken` cascade ke `User` |
| Hapus kuesioner (`Draf` saja) | Hapus `Kuesioner` + `BagianKuesioner` + `PertanyaanKuesioner` cascade (kuesioner yang pernah `Aktif` tidak bisa dihapus) |
| Hapus bagian kuesioner (`Draf` saja) | Hapus `BagianKuesioner` + pertanyaan di dalamnya (cascade) |
