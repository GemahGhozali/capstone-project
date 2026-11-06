# Flow — Capstone Project App

End-to-end flows per domain. Aturan detail di `docs/BUSINESS_RULES.md`; skema di `docs/ERD.md`.

---

## 0. Auth, Reset Akun & Lupa Password

```
Kaprodi insert user (nim/nip, nama, email placeholder = nim@gmail.com/nip@gmail.com,
                     password opsional → default = identifier)
  → assign role (boleh >1 role)
  → baris profil Mahasiswa/Dosen dibuat dgn id = User.id (shared PK)

[Halaman login = `/` (root)]
User login (identifier + password)
  → user tidak ada / password salah → pesan "NIM/NIP atau password anda salah!"
  → is_active = false → pesan akun dinonaktifkan (dicek sebelum verifikasi password)
  → sukses → session JWT di cookie `session` = { userId, role, isAccountReset }
  → is_account_reset = false?
      → force halaman /reset-akun (semua route lain ditolak guard)
      → ganti EMAIL baru (unique) + PASSWORD baru + konfirmasi (min 8)
      → sukses → is_account_reset = true → dashboard role
  → else → dashboard role aktif (role = userRoles[0])

[Guard — src/proxy.ts (Next.js 16: middleware → proxy)]
  belum login         : akses /reset-akun | /{dashboard}  → redirect /
  belum reset akun    : semua route selain /reset-akun    → redirect /reset-akun
  sudah login & reset : akses / | halaman auth | dashboard salah role
                        → redirect dashboard role aktif
                        selain itu → refresh session (sliding) → lanjut

[Switch role]
  BELUM diimplementasikan — login selalu memakai role pertama (userRoles[0])

[Lupa password]
  Halaman /lupa-password → pilih metode: EMAIL atau NIM/NIP
  → akun tidak ditemukan           → pesan error spesifik (BUKAN respon generik)
  → is_account_reset = false       → pesan: akun belum diaktivasi/direset,
                                      login dulu lalu reset akun
  → masih ada token aktif          → TIDAK kirim ulang,
                                      pesan "link sebelumnya telah dikirim ke <email tertutup>"
  → buat token acak (UUID) → simpan HASH SHA-256 + expires_at (15 menit) di PasswordResetToken
      (1 token aktif per user — request baru menimpa; TANPA cooldown waktu)
  → kirim link /reset-password?token=... via email (libs/nodemailer.ts)
  Halaman /reset-password → password baru + konfirmasi (min 8)
  → token valid? → update password, used_at terisi (single-use) → LANGSUNG LOGIN → dashboard
  → token expired/salah → pesan error, tanpa perubahan password
```

State token: `aktif (used_at NULL, belum expired) → terpakai (used_at terisi) | kedaluwarsa (expires_at lewat)`.

---

## 1. Tim

```
[Mahasiswa tanpa baris di AnggotaTim]
  Buat Tim (nama) 
    → baris Tim dibuat
    → dirinya jadi AnggotaTim pertama: peran=Ketua, status=Disetujui
  Ketua invite mahasiswa lain (hanya mhs tanpa baris AnggotaTim, tersisa utk kuota 2–5)
    → baris AnggotaTim: peran=Anggota, status=Menunggu, kategori_capstone ditentukan Ketua saat invite

[Mahasiswa dengan baris status=Menunggu]
  Terima → status=Disetujui (jadi anggota, preview-only)
  Tolak  → HAPUS baris → bebas buat tim sendiri

[Ketua, sebelum tim terkunci]
  Keluarkan anggota / anggota keluar → HAPUS baris AnggotaTim

[Semua anggota status=Disetujui] → TIM TERBENTUK
  Ketua lanjut upload proposal
```

**Lock tim**: saat proposal `Menunggu`/`Disetujui` → invite/keluarkan/disable edit tim ditolak.

---

## 2. Proposal

```
Tim terbentuk + belum punya proposal (atau status Ditolak/Revisi)
  Ketua upload proposal (judul, mitra, file PDF)
    → file masuk public/
    → jika replace: hapus Proposal lama + ProposalReview (cascade) + file lama dari disk
    → Proposal.status = Menunggu
    → ActivityLog(entity=Proposal)

[Dosen Capstone — semua bisa lihat semua proposal]
  Dosen #1 set status: Disetujui | Ditolak | Revisi + catatan
    → Proposal.status = status tsb (TERKUNCI)
    → ProposalReview baris #1 (status = status tsb)
  Dosen #2..n tambah feedback
    → TIDAK bisa ubah Proposal.status
    → ProposalReview baru dengan status = Proposal.status (mirror)

[Proposal Ditolak / Revisi]
  Ketua boleh upload proposal baru → REPLACE (langkah awal ulang)

[Proposal Disetujui]
  → lock tim & lock edit proposal
  → tiap anggota boleh lanjut resume
```

**Status proposal**: `Menunggu → Disetujui | Ditolak | Revisi`.

---

## 3. Resume

```
Prasyarat: Proposal tim = Disetujui

[Mahasiswa anggota]
  Upload resume (subjudul, file PDF, pilih 1 Dosen Pembimbing)
    → jika replace (resume lama Ditolak): hapus Resume lama + ResumeReview + file dari disk
    → Resume: status=Menunggu, dosen_id=dospem pilihan
    → slot kuota dospem pilihan terpakai (reservasi)
    → ActivityLog(entity=Resume)

[Dosen Pembimbing terpilih SAJA]
  Set status: Disetujui | Ditolak + catatan
    → Resume.status terkunci
    → ResumeReview (hanya dosen tsb)

[Jika Disetujui]
  → Mahasiswa.dosen_id = Resume.dosen_id (dospem tetap)
  → reservasi menjadi bimbingan aktif (kuota tetap terpakai)
  → mahasiswa eligible booking bimbingan

[Jika Ditolak]
  → slot kuota dospem sebelumnya dilepas
  → mahasiswa boleh upload resume baru (REPLACE)
```

**Status resume**: `Menunggu → Disetujui | Ditolak` (tanpa `Revisi`).

---

## 4. Bimbingan / Konsultasi

### Setup (Kaprodi)
```
Isi DosenPembimbingDetail per dosen: batas_bimbingan, status Buka/Tutup
```

### Dosen: buka jadwal
```
Buat JadwalKonsultasi (tanggal, jam_mulai, jam_tutup, kuota)
```

### Mahasiswa: booking
```
Syarat: Resume=Disetujui (punya dosen_id) 
UI: tampilkan HANYA jadwal milik Mahasiswa.dosen_id

Booking (catatan_mahasiswa wajib)
  → cek: belum ada booking aktif (Dipesan) di jadwal yang sama
  → cek: jumlah Dipesan < kuota
  → cek: batas_bimbingan dosen belum tercapai (mahasiswa aktif bimbingan)
  → BookingKonsultasi.status = Dipesan
```

### Pembatalan (mahasiswa ATAU dosen)
```
Batalkan booking
  → status = Dibatalkan
  → WAJIB: alasan_pembatalan, dibatalkan_oleh, tanggal_pembatalan
  → slot tersedia lagi → mahasiswa boleh booking ulang jadwal sama
```

### Penyelesaian (dosen)
```
Bimbingan terjadi
  → dosen set status = Selesai + isi catatan_dosen (opsional)
```

**Status booking**: `Dipesan → Selesai | Dibatalkan`.

---

## 5. Monitoring (Kaprodi) — read-only

```
List Tim            → detail: anggota (mahasiswa)
List Proposal       → detail: tim + proposal
List Resume         → detail: mahasiswa + resume
List Riwayat Bimbingan → detail: mahasiswa + dosen + jadwal
Progress per Mahasiswa → status tim | status proposal | status resume
```

---

## 6. Master Data (Kaprodi)

```
CRUD Mahasiswa & Dosen (+ filter, sort, pagination)
  → insert User (identifier, password default=identifier) + profile
  → assign UserRole
  → soft delete = set status enum / is_active
Edit DosenPembimbingDetail (batas_bimbingan, Buka/Tutup)
```

---

## 7. Kuesioner (spesifikasi — implementasi menyusul)

Ejaan resmi: **Kuesioner**. Aturan lengkap di `docs/BUSINESS_RULES.md` §10; skema di `docs/ERD.md`.

### Kaprodi: kelola kuesioner

```
Buat kuesioner (judul, periode, deskripsi)
  → status Draf (boleh 0 bagian, boleh ditutup browser tanpa ribet)

Halaman edit [satu halaman, action granular per operasi — setiap operasi langsung tersimpan]
  Tambah bagian (judul)                  → urutan otomatis (max + 1)
  Tambah pertanyaan (teks, tipe, wajib)  → urutan otomatis (max + 1), bagian boleh masih kosong
  Edit / Hapus bagian atau pertanyaan    → langsung tersimpan
  Duplikat                               → kuesioner Draf baru, struktur sama, respons TIDAK ikut
  Hapus                                  → HANYA saat Draf (cascade bagian & pertanyaan)

Publikasikan (Draf → Aktif)
  → validasi: ≥1 bagian, tiap bagian ≥1 pertanyaan, teks + tipe + judul + periode valid
  → gagal → pesan spesifik (mis. "Bagian "Sarana Prasarana" belum memiliki pertanyaan.")
  → lolos → struktur & metadata TERKUNCI

Tutup (Aktif → Ditutup)
  → pengisian berhenti, hasil tetap terbaca, TANPA jawaban individual
```

### Mahasiswa: isi kuesioner

```
Prasyarat: Resume.status = Disetujui (belum → halaman callout informasi)

List kuesioner Aktif (+ status: Belum Mengisi | Sedang Mengisi | Selesai)
Buka wizard → mulai di BAGIAN PERTAMA YANG BELUM SELESAI
  (bagian Selesai = semua pertanyaan wajibnya terjawab; opsional tidak menghalangi)
  Jawaban tersimpan di-prefill

Per bagian [TANPA auto-save penuh — penyimpanan dipicu tombol navigasi]:
  Likert (Kurang|Cukup|Cukup Baik|Baik|Baik Sekali) / Esai(textarea)
  Lanjutkan  → simpan bagian aktif dulu → validasi wajib bagian itu → pindah
               tidak lolos → tetap di bagian (isian tetap tersimpan)
  Kembali    → simpan bagian aktif → pindah ke bagian sebelumnya
  Keluar dari Kuesioner → simpan bagian aktif → kembali ke daftar
  Isian yang belum melewati tombol navigasi = belum tersimpan

Mekanisme draft:
  saveBagianJawaban → upsert ResponKuesioner (Draf) + upsert/hapus JawabanKuesioner
  ada baris jawaban = terjawab; kosongkan jawaban = baris dihapus
  UNIQUE(kuesioner_id, mahasiswa_id) & UNIQUE(respon_id, pertanyaan_id)

Kirim Jawaban (bagian terakhir)
  → simpan bagian terakhir → server validasi SELURUH pertanyaan wajib dari DB
  → lolos: ResponKuesioner = Selesai + submitted_at → jawaban terkunci
  → gagal: tolak + info bagian/pertanyaan pertama yang belum lengkap
```

### Rekap hasil (Kaprodi)

```
Hanya respons Selesai yang masuk rekap
Likert → distribusi jumlah per opsi + rata-rata berbobot 1–5
Esai   → daftar jawaban ANONIM per pertanyaan
Daftar pengisian → mahasiswa eligible + status (Belum / Sedang Mengisi / Selesai + tanggal kirim)
TANPA jawaban individual mahasiswa
```

---

## State diagram ringkas

### Proposal
```
(tidak ada) → Menunggu → Disetujui (final, lock)
                    └→ Ditolak  → (upload baru → Menunggu)
                    └→ Revisi   → (upload baru → Menunggu)
```

### Resume
```
(tidak ada) → Menunggu → Disetujui (set Mahasiswa.dosen_id)
                    └→ Ditolak → (upload baru → Menunggu)
```

### Booking
```
Dipesan → Selesai
        → Dibatalkan (boleh booking ulang jika slot ada)
```

### AnggotaTim
```
Menunggu → Disetujui
         → (tolak) HAPUS baris
Disetujui → (keluar/dikeluarkan, jika tim belum lock) HAPUS baris
```

### Kuesioner
```
Draf → Aktif (publish — validasi kelengkapan, struktur terkunci)
Aktif → Ditutup (final — tidak bisa dibuka kembali)
Draf → (hapus) HAPUS data + bagian + pertanyaan
```

### ResponKuesioner
```
(tidak ada) → Draf (dibuat saat jawaban pertama tersimpan) → Selesai (final, terkunci)
Draf di kuesioner Ditutup → tidak bisa dilanjutkan / dikirim
```
