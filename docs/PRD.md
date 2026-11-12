# PRD — Aplikasi Sekolah Terpadu (Nama Kerja: `[ISI NAMA APLIKASI]`)

> Dokumen ini adalah **sumber kebenaran tunggal** (single source of truth) untuk pengembangan.
> Dikerjakan **per phase**. Jangan mengerjakan phase berikutnya sebelum phase saat ini selesai dan lolos Definition of Done.

---

## 1. Ringkasan Produk

Aplikasi sekolah terpadu yang menggabungkan: profil sekolah, PPDB, mata pelajaran, rekap absensi, raport digital, pembayaran sekolah (SSP), dan monitor siswa untuk orang tua/wali. Web dibangun lebih dulu; mobile app menyusul dan hanya mengonsumsi API.

## 2. Tujuan & Non-Tujuan

### Tujuan
- Satu sistem untuk seluruh alur administrasi akademik dan keuangan dasar sekolah.
- Orang tua dapat memantau absensi, nilai, raport, dan tagihan anak secara mandiri.
- Mengurangi pekerjaan manual guru dan tata usaha (rekap absensi, penyusunan raport, penagihan).
- Arsitektur siap multi-tenant dan siap API tanpa membangun keduanya sekarang.

### Non-Tujuan (JANGAN dibangun kecuali diminta eksplisit)
- Multi-tenant / SaaS (fase ini **satu sekolah**).
- LMS (materi, tugas online, ujian online).
- Aplikasi mobile (baru dikerjakan di Phase 8).
- Integrasi Dapodik/EMIS otomatis.
- Payment gateway otomatis (Phase 6 hanya pembayaran manual + verifikasi; gateway adalah opsi lanjutan).
- Fitur chat/forum real-time.

## 3. Keputusan yang Sudah Ditetapkan

| Topik | Keputusan |
|---|---|
| Skala | Satu sekolah dulu |
| Jenjang | Semua jenjang (SD/MI, SMP/MTs, SMA/SMK) — dikonfigurasi lewat pengaturan, bukan hardcode |
| Backend | Laravel (target v13; cek dokumentasi resmi untuk versi stabil terbaru) |
| Database | PostgreSQL (wajib indeks pada foreign keys dan kolom pencarian, cegah N+1 query) |
| Frontend web | Inertia + React + TypeScript |
| Mobile | Phase 8, memakai API Laravel + Sanctum |
| Modul "SSP" | Sistem pembayaran sekolah (SPP, tagihan, pembayaran) |
| Payment Gateway | Midtrans (Snap / Webhook notifikasi pembayaran) |
| Desain & UI | Clean & elegan, palet 60-30-10 (Putih-Slate 60%, Hitam/Navy 30%, Biru Royal 10%), font Plus Jakarta Sans/Inter, aturan ketat font-weight 400-700 (Light Mode only) |
| Ikonografi | Lucide React (`lucide-react`) |
| Metode Login | Fleksibel: Satu form input menerima Email ATAU NIP/NISN/Username |
| Halaman Publik | Inertia React (single stack, ramah SEO dengan Inertia Head) |
| Jenjang Fokus Awal | SMA/SMK (dengan dukungan jurusan & peminatan) |
| Pendekatan | Dikerjakan bertahap per phase |

## 4. Peran Pengguna (Roles)

| Role | Akses utama | Platform |
|---|---|---|
| Super Admin | Pengaturan sistem, kelola semua user dan role | Web |
| Admin/Tata Usaha | Master data, PPDB, pembayaran, profil sekolah | Web |
| Kepala Sekolah | Laporan dan monitoring (read-only) | Web |
| Guru | Absensi, penilaian, raport (sesuai penugasan) | Web (+ mobile fase lanjut) |
| Wali Kelas | Guru + kelola raport kelas sendiri | Web |
| Siswa | Lihat data diri, absensi, nilai, tagihan sendiri | Web (+ mobile) |
| Wali Murid | Pantau anak-anaknya (satu wali bisa punya banyak anak) | Web + Mobile |
| Calon Siswa (publik) | Mendaftar PPDB, cek status | Web publik |

Gunakan satu tabel `users` dengan role/permission (disarankan paket `spatie/laravel-permission`). Verifikasi paket dan versinya lewat Packagist sebelum dipasang.

## 5. Prinsip Teknis (Berlaku di Semua Phase)

1. **Logika bisnis di Action/Service class**, bukan di controller. Contoh: `HitungRaport`, `CatatAbsensi`, `BuatTagihan`. Controller Inertia dan (nanti) controller API sama-sama memanggilnya.
2. **Validasi lewat Form Request**; otorisasi lewat Policy.
3. **Query tidak N+1** (pakai eager loading); tabel besar wajib paginasi.
4. **Uang disimpan sebagai integer (rupiah)**, bukan float/decimal bebas.
5. **Soft delete** untuk data akademik dan keuangan; hapus permanen dilarang kecuali diminta.
6. **Audit log** untuk perubahan nilai, absensi, dan pembayaran (siapa, kapan, nilai lama → baru).
7. **Data selalu dikaitkan dengan tahun ajaran dan semester** (jangan menimpa data tahun lalu).
8. **Siap API:** logika terpisah dari tampilan; response pakai API Resource saat Phase 8.
9. **Multi-tenant-ready ringan:** jangan hardcode nama/logo/alamat sekolah; ambil dari tabel pengaturan.
10. **Test:** setiap Action penting punya minimal satu feature test (happy path + satu kasus gagal).
11. **Bahasa:** UI Bahasa Indonesia; kode, nama tabel, dan nama variabel Bahasa Inggris.

### Struktur folder yang disarankan
```
app/
  Actions/          # satu class = satu use case
  Models/
  Policies/
  Http/Controllers/ # tipis
  Http/Requests/
resources/js/
  Pages/            # halaman Inertia (per modul)
  Components/       # komponen UI bersama
  Layouts/
  types/            # tipe TypeScript
```

## 6. Aturan Kerja untuk AI Assistant (Anti-Halusinasi)

Bagian ini wajib dibaca AI sebelum mengerjakan tugas apa pun.

1. Kerjakan **hanya phase yang sedang aktif**. Jangan membuat tabel, route, atau halaman dari phase berikutnya.
2. Jika ada yang tidak jelas di PRD ini, **bertanya dulu**; jangan menebak.
3. **Jangan mengarang** nama paket, method, atau opsi konfigurasi. Jika ragu terhadap API Laravel/Inertia/paket pihak ketiga, cek dokumentasi resmi atau kode yang sudah ada di repo.
4. **Jangan menambah fitur** di luar daftar "Cakupan" tiap phase. Ide tambahan dicatat di bagian "Backlog", bukan langsung dikode.
5. Sebelum membuat migrasi baru, periksa migrasi dan model yang sudah ada agar tidak duplikat atau konflik.
6. Ubah sedikit-sedikit: satu fitur per sesi/PR, jalankan test, baru lanjut.
7. Setelah selesai, laporkan: file yang dibuat/diubah, cara menjalankan test, dan hal yang belum selesai.

### Template prompt per tugas
```
Konteks: baca PRD.md, kerjakan HANYA Phase [N] — fitur [nama fitur].
Cakupan: [salin poin cakupan dari PRD].
Batasan: jangan menyentuh phase lain, jangan menambah fitur di luar cakupan.
Selesai jika: [salin acceptance criteria], semua test lulus.
Jika ada ambiguitas, tanyakan dulu sebelum menulis kode.
```

---

## 7. Roadmap Phase

| Phase | Nama | Bergantung pada |
|---|---|---|
| 0 | Fondasi proyek | — |
| 1 | Master data akademik & mata pelajaran | 0 |
| 2 | Profil sekolah (publik) | 0 |
| 3 | PPDB | 1, 2 |
| 4 | Rekap absensi | 1 |
| 5 | Penilaian & raport digital | 1, 4 |
| 6 | SSP — pembayaran sekolah | 1 |
| 7 | Portal siswa & monitor wali murid (web) | 4, 5, 6 |
| 8 | API & mobile app | 7 |

---

## Phase 0 — Fondasi Proyek

**Tujuan:** kerangka aplikasi yang rapi sebagai pondasi semua modul.

**Cakupan**
- Inisialisasi proyek Laravel + Inertia + React + TypeScript + Tailwind.
- Autentikasi (login, logout, reset password) dan manajemen sesi.
- Sistem role dan permission (role di Bagian 4).
- Layout dashboard per role (sidebar, header, navigasi dinamis sesuai role).
- Tabel `settings` (nama sekolah, logo, alamat, kontak, jenjang aktif).
- Audit log dasar.
- Konfigurasi queue (database driver dulu) dan storage file.
- Seeder: satu Super Admin dan role default.
- Setup test (Pest atau PHPUnit) dan CI sederhana bila memungkinkan.

**Di luar cakupan:** semua fitur modul bisnis.

**Acceptance criteria**
- Super Admin dapat login dan melihat dashboard.
- User tanpa izin tidak bisa membuka halaman terlarang (403).
- Menu sidebar berbeda per role.
- Test autentikasi dan otorisasi lulus.

---

## Phase 1 — Master Data Akademik & Mata Pelajaran

**Tujuan:** data dasar yang dipakai semua modul lain.

**Cakupan**
- Tahun ajaran dan semester (satu yang berstatus aktif).
- Jenjang dan tingkat (mis. kelas 1–6 / 7–9 / 10–12), dikonfigurasi lewat pengaturan.
- Jurusan/peminatan (opsional, untuk SMA/SMK).
- Kelas/rombel per tahun ajaran, dengan wali kelas.
- Data guru (CRUD, impor Excel).
- Data siswa (CRUD, impor Excel, penempatan siswa ke kelas per tahun ajaran).
- Data wali murid dan relasi **many-to-many** wali ↔ siswa (hubungan: ayah/ibu/wali).
- **Mata pelajaran:** CRUD, kelompok mapel, KKM/kriteria ketuntasan opsional.
- **Penugasan mengajar:** guru ↔ mapel ↔ kelas ↔ semester.
- Pembuatan akun user untuk guru, siswa, wali (manual dan massal).

**Di luar cakupan:** jadwal pelajaran detail, kenaikan kelas otomatis (backlog).

**Entitas inti (ringkas)**
`academic_years`, `semesters`, `levels`, `classrooms`, `teachers`, `students`, `guardians`, `guardian_student`, `student_classrooms`, `subjects`, `teaching_assignments`

**Acceptance criteria**
- Admin dapat membuat tahun ajaran, kelas, dan menempatkan siswa ke kelas.
- Satu wali dapat dihubungkan ke lebih dari satu siswa.
- Impor Excel siswa dan guru menolak baris tidak valid dengan pesan error per baris.
- Data tahun ajaran lama tetap utuh saat tahun ajaran baru dibuat.

---

## Phase 2 — Profil Sekolah (Publik)

**Tujuan:** wajah publik sekolah, ramah SEO.

**Cakupan**
- Halaman publik: beranda, profil/visi-misi, fasilitas, daftar guru (opsional tampil), kontak, galeri.
- Berita/pengumuman sederhana (judul, isi, gambar, tanggal terbit).
- Admin CMS untuk mengelola konten di atas.
- SEO dasar: title, meta description, Open Graph, sitemap.
- Halaman publik memakai Blade atau Inertia SSR (pilih salah satu, catat keputusannya di bagian Keputusan Teknis).

**Di luar cakupan:** blog kompleks, komentar, multi-bahasa.

**Acceptance criteria**
- Halaman publik tampil tanpa login dan rapi di mobile.
- Admin dapat mengubah konten tanpa menyentuh kode.
- Meta tag SEO muncul di source halaman.

---

## Phase 3 — PPDB

**Tujuan:** pendaftaran peserta didik baru secara online.

**Cakupan**
- Konfigurasi periode PPDB: gelombang, jalur (mis. reguler, prestasi, afirmasi), kuota per jenjang/jurusan, tanggal buka-tutup.
- Formulir pendaftaran publik (data diri, data orang tua, asal sekolah, pilihan jurusan bila ada).
- Unggah berkas (dengan batas ukuran dan tipe file).
- Akun calon siswa / nomor pendaftaran untuk cek status.
- Verifikasi berkas oleh admin (status: menunggu, diverifikasi, ditolak + alasan).
- Penetapan hasil (diterima, cadangan, tidak diterima) dan pengumuman.
- **Daftar ulang** dan konversi calon siswa menjadi siswa (masuk ke master data Phase 1).
- Ekspor daftar pendaftar ke Excel.
- Cetak bukti pendaftaran (PDF).

**Di luar cakupan:** seleksi otomatis berbasis zonasi/jarak, tes online, pembayaran biaya pendaftaran (masuk ke SSP bila nanti dibutuhkan).

**Acceptance criteria**
- Pendaftar hanya bisa mendaftar saat periode terbuka.
- Pendaftar tidak dapat mendaftar ganda dengan NIK/NISN yang sama.
- Admin dapat memverifikasi dan menetapkan hasil; perubahan status tercatat di audit log.
- Calon siswa yang diterima dapat dikonversi menjadi siswa tanpa input ulang.

---

## Phase 4 — Rekap Absensi

**Tujuan:** pencatatan dan rekap kehadiran siswa.

**Cakupan**
- Input absensi harian per kelas oleh wali kelas/guru (hadir, izin, sakit, alpa).
- Opsi absensi per mata pelajaran (aktifkan lewat pengaturan; default: harian).
- Koreksi absensi dengan audit log dan batas waktu edit.
- Pengajuan izin/sakit (oleh wali/siswa) beserta persetujuan guru/admin — **opsional, tandai jika masuk MVP**.
- Rekap per siswa, per kelas, per bulan, dan per semester.
- Ekspor rekap ke Excel/PDF.
- Hari libur/kalender akademik sederhana agar tidak dihitung alpa.
- Rekap absensi otomatis tersedia bagi modul raport (Phase 5).

**Di luar cakupan:** absensi dengan QR/RFID/wajah, absensi guru dan pegawai (backlog).

**Acceptance criteria**
- Guru hanya bisa mengisi absensi kelas yang menjadi tanggung jawabnya.
- Absensi satu siswa pada satu tanggal tidak bisa duplikat.
- Rekap menghitung total hadir/izin/sakit/alpa dengan benar (diverifikasi test).

---

## Phase 5 — Penilaian & Raport Digital

**Tujuan:** input nilai oleh guru dan penerbitan raport.

**Cakupan**
- Komponen penilaian per mapel (mis. tugas, UH, PTS, PAS) dengan bobot yang bisa dikonfigurasi.
- Input nilai oleh guru (form tabel per kelas dan mapel, impor Excel).
- Perhitungan nilai akhir otomatis lewat Action `HitungNilaiAkhir`.
- Deskripsi capaian/catatan per mapel (manual atau template).
- Catatan wali kelas, nilai sikap/ekstrakurikuler (sederhana), dan rekap absensi (dari Phase 4).
- **Template raport per jenjang** (SD/SMP/SMA/SMK) yang dikonfigurasi, dengan **Kurikulum Merdeka sebagai template pertama**; jenjang lain ditambahkan satu per satu.
- Alur status raport: draf → divalidasi wali kelas → dipublikasikan.
- Cetak/unduh raport PDF per siswa dan massal per kelas.
- Raport yang sudah dipublikasikan terkunci; perubahan harus lewat pembukaan kunci oleh admin dan tercatat.

**Di luar cakupan:** e-rapor integrasi pusat, ranking antarsekolah, analitik lanjutan.

**Risiko (cakupan "semua jenjang"):** struktur raport SD, SMP, dan SMA/SMK berbeda. Bangun mesin raport yang konfigurabel, tetapi rilis jenjang satu per satu. Jangan mencoba semuanya sekaligus.

**Acceptance criteria**
- Guru hanya bisa menilai mapel dan kelas yang ditugaskan kepadanya.
- Nilai akhir sesuai bobot dan terverifikasi test dengan contoh perhitungan.
- Raport terpublikasi tidak dapat diubah tanpa pembukaan kunci.
- PDF raport dihasilkan dengan data sekolah dari pengaturan (bukan hardcode).

---

## Phase 6 — SSP (Sistem Pembayaran Sekolah)

**Tujuan:** pengelolaan tagihan dan pembayaran siswa.

**Cakupan**
- Master jenis pembayaran (SPP bulanan, uang gedung, seragam, kegiatan, dll.) dengan nominal per tingkat/kelas.
- Pembuatan tagihan massal per kelas/semester/bulan dan tagihan individu.
- Diskon/keringanan per siswa (dengan alasan dan audit log).
- **Payment Gateway Midtrans (Snap & Webhook Notification)**: pembayaran online otomatis (VA, QRIS, e-wallet).
- Pencatatan pembayaran **manual oleh admin/TU** (tunai/transfer langsung), termasuk cicilan/offline backup.
- Unggah bukti transfer oleh wali dan verifikasi oleh admin (untuk opsi manual non-gateway).
- Status tagihan: belum bayar, sebagian, lunas, kedaluwarsa, dibatalkan.
- Kuitansi/bukti bayar PDF dengan nomor unik.
- Rekap dan laporan: tunggakan, pemasukan harian/bulanan, per kelas.
- Ekspor laporan Excel/PDF.

**Di luar cakupan:** pengingat tagihan via WhatsApp, akuntansi penuh.

**Acceptance criteria**
- Nominal disimpan sebagai integer rupiah; tidak ada pembulatan liar.
- Pembayaran tidak bisa melebihi sisa tagihan.
- Webhook Midtrans diverifikasi menggunakan signature key untuk keamanan; status tagihan otomatis terupdate lunas/sebagian.
- Setiap perubahan pembayaran tercatat di audit log; pembayaran yang salah dibatalkan lewat pembalikan, bukan dihapus.
- Saldo tagihan = total tagihan − total pembayaran terverifikasi (diverifikasi test).

---

## Phase 7 — Portal Siswa & Monitor Wali Murid (Web)

**Tujuan:** akses mandiri untuk siswa dan wali, mengonsolidasikan data dari Phase 4–6.

**Cakupan**
- Dasbor wali: pilih anak (jika lebih dari satu), ringkasan kehadiran, nilai terbaru, status raport, tagihan berjalan.
- Detail absensi per bulan, nilai per mapel, unduh raport yang sudah dipublikasikan.
- Daftar tagihan, riwayat pembayaran, unggah bukti transfer, unduh kuitansi.
- Pengumuman sekolah (dari Phase 2) untuk wali dan siswa.
- Notifikasi in-app (dan email opsional) untuk: absen hari ini, raport terbit, tagihan baru/jatuh tempo. Dikirim lewat queue.
- Dasbor siswa: versi terbatas dari data dirinya sendiri.
- Kepala sekolah: dasbor ringkasan (kehadiran, tunggakan, jumlah siswa) — read-only.

**Di luar cakupan:** chat guru–wali, janji temu, push notification (masuk Phase 8).

**Acceptance criteria**
- Wali hanya bisa melihat data anak yang terhubung dengannya (diverifikasi test otorisasi).
- Siswa tidak dapat melihat data siswa lain.
- Notifikasi dikirim lewat queue dan tidak memblokir request.

---

## Phase 8 — API & Mobile App

**Tujuan:** akses mobile untuk wali, siswa, dan (lanjutan) guru.

**Cakupan**
- API versi `/api/v1` dengan Laravel Sanctum (token), API Resource, dan paginasi konsisten.
- Dokumentasi API (OpenAPI/Swagger atau koleksi Postman).
- Endpoint fase 1 (read-only untuk wali/siswa): profil, daftar anak, absensi, nilai, raport, tagihan, pengumuman.
- Push notification (FCM) untuk absen, raport terbit, dan tagihan.
- Aplikasi mobile (React Native/Expo **atau** Flutter — putuskan sebelum Phase 8 dimulai).
- Rilis bertahap: (a) wali murid read-only, (b) unggah bukti bayar, (c) guru: input absensi dan nilai.
- Mekanisme versi minimum aplikasi (paksa update bila API berubah besar).

**Di luar cakupan:** fitur offline penuh, in-app payment.

**Acceptance criteria**
- Semua endpoint melewati otorisasi yang sama dengan web (memakai Policy yang sama).
- Tidak ada logika bisnis ganda: controller API memanggil Action yang sama dengan web.
- Push notification diterima di perangkat uji (Android; iOS bila akun developer tersedia).

---

## 8. Definition of Done (Berlaku untuk Setiap Fitur)

- [ ] Sesuai cakupan phase aktif dan tidak ada fitur tambahan.
- [ ] Validasi (Form Request) dan otorisasi (Policy) terpasang.
- [ ] Feature test lulus (happy path + minimal satu kasus gagal).
- [ ] Tidak ada N+1 query pada halaman daftar.
- [ ] UI responsif (nyaman di layar ponsel) dan berbahasa Indonesia.
- [ ] Migrasi dapat dijalankan dari nol (`migrate:fresh --seed`) tanpa error.
- [ ] Perubahan penting dicatat di audit log.
- [ ] Catatan singkat di `CHANGELOG.md`.

## 9. Pertanyaan Terbuka

- [x] Database: PostgreSQL
- [x] Payment Gateway: Midtrans (Snap + Webhook)
- [x] Identitas visual & UI: Tema clean & elegan, palet 60-30-10 (Putih/Slate 60%, Hitam/Navy 30%, Biru 10%), font Plus Jakarta Sans/Inter, aturan ketat font weight (400, 500, 600, 700), Light Mode only.
- [x] Ikonografi: Lucide React
- [x] Metode Login: Fleksibel (Email ATAU NIP/NISN/Username)
- [x] Halaman Publik Phase 2: Inertia React (single stack)
- [x] Jenjang sekolah fokus awal: SMA/SMK (dengan jurusan/peminatan).
- [ ] Apakah pengajuan izin/sakit oleh wali masuk MVP Phase 4?
- [ ] Absensi harian saja atau per mata pelajaran?
- [ ] Halaman publik Phase 2: Blade atau Inertia SSR?
- [ ] Skema kenaikan kelas dan kelulusan: manual atau otomatis (backlog)?
- [ ] Format/kop raport yang dipakai sekolah (butuh contoh PDF dari sekolah)?
- [ ] Mobile: React Native atau Flutter?
- [ ] Hosting target (VPS/shared hosting) — memengaruhi pilihan queue dan penyimpanan.

## 10. Backlog (Ide di Luar Cakupan Saat Ini)

- Multi-tenant / SaaS per sekolah (subdomain, isolasi data).
- Notifikasi WhatsApp.
- Jadwal pelajaran dan manajemen ruang.
- Absensi QR/RFID, absensi guru.
- Kenaikan kelas dan kelulusan otomatis.
- Integrasi Dapodik/EMIS.
- Perpustakaan, inventaris, konseling (BK).

## 11. Catatan Risiko

| Risiko | Mitigasi |
|---|---|
| Cakupan "semua jenjang" membuat raport sangat kompleks | Mesin raport konfigurabel, rilis template per jenjang |
| AI membuat fitur di luar rencana | Aturan Bagian 6 + kerjakan satu fitur per sesi |
| Data nilai/keuangan salah tanpa jejak | Audit log wajib, soft delete, status terkunci |
| Pindah ke multi-tenant nanti mahal | Prinsip teknis nomor 9, pengaturan tidak di-hardcode |
| Mobile memaksa refactor besar | Logika di Action sejak Phase 0 |

---
*Versi dokumen: 0.2 — ditambahkan keputusan PostgreSQL, indexing, pencegahan N+1, dan Midtrans pada Phase 6.*
