# Flow — Capstone Project App

End-to-end flows per domain. Aturan detail di `docs/BUSINESS_RULES.md`; skema di `docs/ERD.md`.

---

## 0. Auth & Switch Role

```
Kaprodi insert user (nim/nip, nama, email, password opsional → default = identifier)
  → assign role (boleh >1 role)
User login (identifier + password)
  → is_password_changed = false? → force ganti password → dashboard
  → else → dashboard role aktif
User punya >1 role? → UI switch role
  → re-issue JWT dengan role baru → redirect dashboard role tsb
```

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
    → ActivityLog(entity=Resume)

[Dosen Pembimbing terpilih SAJA]
  Set status: Disetujui | Ditolak + catatan
    → Resume.status terkunci
    → ResumeReview (hanya dosen tsb)

[Jika Disetujui]
  → Mahasiswa.dosen_id = Resume.dosen_id (dospem tetap)
  → mahasiswa eligible booking bimbingan

[Jika Ditolak]
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
