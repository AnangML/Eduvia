# Rencana Kerja Phase 0 — Fondasi Proyek (Eduvia)

Dokumen ini adalah checklist kerja implementasi untuk **Phase 0**. Setiap item harus selesai dan lolos pengujian sebelum berpindah ke Phase 1.

---

## Checklist Eksekusi

### 1. Konfigurasi Environment & Database PostgreSQL
- [x] Ubah konfigurasi database di `.env` ke driver `pgsql`:
  - `DB_CONNECTION=pgsql`
  - `DB_HOST=127.0.0.1`
  - `DB_PORT=5432`
  - `DB_DATABASE=eduvia`
  - `DB_USERNAME=postgres`
  - `DB_PASSWORD=`
- [x] Verifikasi koneksi PostgreSQL berhasil melalui `php artisan migrate:status`.

### 2. Autentikasi & Frontend Inertia React + TypeScript
- [x] Pasang starter kit **Laravel Breeze** (`composer require laravel/breeze --dev`).
- [x] Install stack Inertia React with TypeScript.
- [x] Pasang font Plus Jakarta Sans, Lucide React, dan palet warna 60-30-10 Tailwind.
- [x] Jalankan `npm install` dan `npm run build` (lulus tanpa error).

### 3. Role & Permission (RBAC)
- [x] Pasang paket `spatie/laravel-permission`.
- [x] Publish konfigurasi & migrasi permission.
- [x] Buat Seeder `RolePermissionSeeder` untuk mendaftarkan 8 role:
  - `super_admin`
  - `admin`
  - `principal`
  - `teacher`
  - `homeroom_teacher`
  - `student`
  - `guardian`
  - `prospective_student`

### 4. Tabel Settings & Audit Logs
- [x] Buat migrasi & model `Setting` untuk konfigurasi dinamis sekolah (nama sekolah, jenjang SMA/SMK, logo, alamat, kontak).
- [x] Buat migrasi & model `AuditLog` untuk mencatat aktivitas sensitif.
- [x] Buat Action `RecordAuditLog` dan Model Trait `HasAuditLog` untuk audit logging.

### 5. Layout Dashboard Multi-Role (Inertia + React)
- [x] Buat komponen navigasi sidebar dinamis yang menyesuaikan menu berdasarkan role aktif pengguna.
- [x] Buat dashboard page profesional dengan ringkasan metrik dan status sistem.
- [x] Pasang middleware pengaman rute berdasarkan role/permission (`role:super_admin`, dll).

### 6. Seeder Awal & User Super Admin
- [x] Buat seeder untuk Super Admin default (`admin@eduvia.test` / username `superadmin` / password `password`).
- [x] Jalankan migrasi dan seeder `php artisan migrate:fresh --seed`.

### 7. Pengujian (Testing)
- [x] Buat Feature Test `AuthenticationTest` (login email, login username/NIP/NISN, logout, gagal login).
- [x] Buat Feature Test `AuthorizationTest` (Super Admin bisa akses settings, role lain 403 Forbidden).
- [x] Pastikan seluruh test lolos (`php artisan test` 30 passed, 70 assertions).

### 8. Dokumentasi & Git
- [x] Perbarui `CHANGELOG.md` dengan perubahan Phase 0.
- [x] Verifikasi checklist *Definition of Done* (DoD) pada PRD.

