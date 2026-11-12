# Eduvia — Sistem Informasi & Administrasi Sekolah Terpadu

Eduvia adalah platform terpadu untuk administrasi akademik dan keuangan sekolah (profil sekolah, PPDB, master data akademik, rekap absensi, raport digital Kurikulum Merdeka, serta sistem pembayaran sekolah/SSP dengan Midtrans).

---

## 🛠️ Tech Stack

- **Backend:** Laravel 13 (PHP 8.3+)
- **Database:** PostgreSQL 15+
- **Frontend:** Inertia.js + React (TypeScript) + Tailwind CSS v4
- **Otorisasi:** Spatie Laravel Permission (RBAC 8 Peran)
- **Payment Gateway:** Midtrans (Snap & Webhook Notification)

---

## 📚 Dokumentasi Proyek

Dokumentasi lengkap dan single source of truth tersimpan di folder `docs/`:

1. [PRD (Product Requirement Document)](docs/PRD.md) — Dokumen acuan utama dan roadmap per-phase.
2. [Panduan Arsitektur & Standar Teknis](docs/ARCHITECTURE.md) — Pola Actions, Form Requests, Policies, dan penanganan N+1.
3. [Panduan Desain & Tipografi](docs/DESIGN_SYSTEM.md) — Standar visual 60-30-10, font Plus Jakarta Sans, dan skala tipografi.
4. [Rancangan Skema Database PostgreSQL](docs/DATABASE_SCHEMA.md) — Detail tabel, tipe data, foreign keys, dan strategi indeks.
5. [Matriks Peran & Hak Akses (RBAC)](docs/ROLES_PERMISSIONS.md) — Matriks izin untuk 8 peran pengguna.
6. [Rencana Kerja Phase 0](docs/PHASE_0_PLAN.md) — Langkah teknis dan checklist Definition of Done (DoD) Phase 0.
7. [Rencana Kerja Phase 1](docs/PHASE_1_PLAN.md) — Master Data Akademik, Guru, Siswa, Wali, & Penugasan Mengajar.
8. [Changelog](CHANGELOG.md) — Riwayat perubahan versi dan fitur.

---

## 🚀 Setup & Instalasi Lokal

### 1. Kebutuhan Sistem
- PHP >= 8.3 (dengan ekstensi `pdo_pgsql`, `pgsql`, `intl`, `mbstring`)
- PostgreSQL Server aktif pada port 5432
- Node.js & NPM
- Composer

### 2. Langkah Instalasi
```bash
# Clone dan masuk ke direktori
cd Eduvia

# Pasang dependensi PHP
composer install

# Salin konfigurasi environment
cp .env.example .env

# Buat application key
php artisan key:generate

# Konfigurasi koneksi PostgreSQL di .env
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=eduvia
# DB_USERNAME=postgres
# DB_PASSWORD=your_password

# Jalankan migrasi dan seeder
php artisan migrate --seed

# Pasang dependensi JavaScript & compile
npm install
npm run build

# Jalankan server development
php artisan serve
npm run dev
```

---

## 📋 Roadmap Pengembangan
- **Phase 0:** Fondasi Proyek & RBAC (Aktif)
- **Phase 1:** Master Data Akademik & Mata Pelajaran (Fokus SMA/SMK)
- **Phase 2:** Profil Sekolah Publik (CMS & SEO)
- **Phase 3:** PPDB (Pendaftaran Peserta Didik Baru)
- **Phase 4:** Rekap Absensi
- **Phase 5:** Penilaian & Raport Digital Kurikulum Merdeka
- **Phase 6:** SSP — Pembayaran Sekolah & Integrasi Midtrans
- **Phase 7:** Portal Siswa & Monitor Wali Murid (Web)
- **Phase 8:** API & Mobile App
