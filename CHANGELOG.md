# Changelog

Semua perubahan penting pada proyek ini akan dicatat dalam berkas ini.
Format berkas ini mengacu pada [Keep a Changelog](https://keepachangelog.com/id/1.0.0/).

## [Unreleased]

### Added
- Inisialisasi dokumen arsitektur dan pedoman proyek:
  - `docs/PRD.md` (Product Requirement Document v0.2)
  - `docs/ARCHITECTURE.md` (Pola desain arsitektur, standar coding, & strategi performa)
  - `docs/DESIGN_SYSTEM.md` (Sistem desain 60-30-10, font Plus Jakarta Sans, dan panduan tipografi)
  - `docs/DATABASE_SCHEMA.md` (Rancangan skema relasional PostgreSQL & strategi indexing)
  - `docs/ROLES_PERMISSIONS.md` (Matriks peran dan hak akses RBAC)
  - `CHANGELOG.md`
- Penetapan keputusan teknis:
  - Login fleksibel via Email atau NISN/NIP/Username.
  - Light mode only dengan palet 60-30-10.
  - Ikonografi menggunakan `lucide-react`.
  - Halaman publik sekolah menggunakan Inertia React.
- Penyesuaian konfigurasi awal untuk PostgreSQL dan integrasi Midtrans pada roadmap Phase 6.

