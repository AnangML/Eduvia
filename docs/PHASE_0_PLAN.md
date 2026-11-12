# Rencana Kerja Phase 0 — Fondasi Proyek (Eduvia)

Dokumen ini adalah checklist kerja implementasi untuk **Phase 0**. Setiap item harus selesai dan lolos pengujian sebelum berpindah ke Phase 1.

---

## Checklist Eksekusi

### 1. Konfigurasi Environment & Database PostgreSQL
- [ ] Ubah konfigurasi database di `.env` ke driver `pgsql`:
  - `DB_CONNECTION=pgsql`
  - `DB_HOST=127.0.0.1`
  - `DB_PORT=5432`
  - `DB_DATABASE=eduvia`
  - `DB_USERNAME=postgres`
  - `DB_PASSWORD=...`
- [ ] Verifikasi koneksi PostgreSQL berhasil melalui `php artisan migrate:status`.

### 2. Autentikasi & Frontend Inertia React + TypeScript
- [ ] Pasang starter kit **Laravel Breeze** (`composer require laravel/breeze --dev`).
- [ ] Install stack Inertia React with TypeScript (`php artisan breeze:install react --typescript --ssr=false`).
- [ ] Pastikan Tailwind CSS terkonfigurasi dengan benar.
- [ ] Jalankan `npm install` dan `npm run build`.

### 3. Role & Permission (RBAC)
- [ ] Pasang paket `spatie/laravel-permission` (`composer require spatie/laravel-permission`).
- [ ] Publish konfigurasi & migrasi permission (`php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"`).
- [ ] Buat Seeder `RolePermissionSeeder` untuk mendaftarkan 8 role:
  - `super_admin`
  - `admin`
  - `principal`
  - `teacher`
  - `homeroom_teacher`
  - `student`
  - `guardian`
  - `prospective_student`

### 4. Tabel Settings & Audit Logs
- [ ] Buat migrasi & model `Setting` untuk konfigurasi dinamis sekolah (nama sekolah, jenjang SMA/SMK, logo, alamat, kontak).
- [ ] Buat migrasi & model `AuditLog` untuk mencatat aktivitas sensitif.
- [ ] Buat Service/Action atau Model Trait `HasAuditLog` untuk mempermudah pencatatan log.

### 5. Layout Dashboard Multi-Role (Inertia + React)
- [ ] Buat komponen navigasi sidebar dinamis yang menyesuaikan menu berdasarkan role aktif pengguna.
- [ ] Buat dashboard page sederhana untuk memverifikasi login masing-masing role.
- [ ] Pasang middleware pengaman rute berdasarkan role/permission.

### 6. Seeder Awal & User Super Admin
- [ ] Buat seeder untuk Super Admin default (`admin@eduvia.test` / password aman).
- [ ] Jalankan migrasi dan seeder `php artisan migrate:fresh --seed`.

### 7. Pengujian (Testing)
- [ ] Buat Feature Test `AuthenticationTest` (login, logout, gagal login).
- [ ] Buat Feature Test `AuthorizationTest` (Super Admin bisa akses settings, role lain 403 Forbidden).
- [ ] Pastikan seluruh test lolos (`php artisan test`).

### 8. Dokumentasi & Git
- [ ] Perbarui `CHANGELOG.md` dengan perubahan Phase 0.
- [ ] Verifikasi checklist *Definition of Done* (DoD) pada PRD.

