# Changelog

Semua perubahan penting pada proyek ini akan dicatat dalam berkas ini.
Format berkas ini mengacu pada [Keep a Changelog](https://keepachangelog.com/id/1.0.0/).

## [Unreleased]

### Added
- **Phase 2 (Profil Sekolah Publik & Admin CMS) Selesai**:
  - Dukungan White-Label & SaaS Rental: Logo dan nama institusi di navbar, header, dan dashboard kini dinamis mengikuti nama sekolah dan logo yang disetel pada panel CMS (`school_name`, `school_tagline`, `school_logo`), dengan teks Eduvia hanya sebagai platform credit halus di footer.
  - Perbaikan status navigasi aktif: Menu 'Beranda' dan seluruh halaman publik kini memiliki highlight status aktif yang akurat.
  - Migrasi & model PostgreSQL berindeks untuk: `posts` (dengan composite index `(status, published_at)`), `facilities`, `gallery_albums`, `galleries`, `contact_messages`, dan penambahan kolom `is_public`, `photo`, `title_degree` pada `teachers`.
  - Logika bisnis Actions CMS: `CreatePost` (auto-slug & audit log), `UpdatePost`, `SaveFacility`, `SaveGalleryAlbum`, `SaveSchoolProfile`, dan `SubmitContactMessage`.
  - Form Requests & Otorisasi RBAC: `PostRequest`, `FacilityRequest`, `GalleryAlbumRequest`, `SchoolProfileRequest`, dan `ContactMessageRequest` dilindungi hak akses `manage_school_profile` dan `manage_announcements`.
  - Public Layout & Halaman Publik ramah SEO (Inertia React + TypeScript + palet 60-30-10):
    - `PublicLayout`: Navbar sticky responsif, logo sekolah, navigasi publik, dynamic `<Head>` OpenGraph & meta SEO, dan footer lengkap.
    - `Public/Home`: Hero section elegan, sambutan kepala sekolah, statistik dinamis sekolah, daftar jurusan unggulan, feed berita terbaru, fasilitas unggulan, dan CTA hubungi kami.
    - `Public/About`: Visi, Misi strategis terstruktur, sejarah lembaga, dan nilai-nilai budaya sekolah.
    - `Public/Posts/Index` & `Public/Posts/Show`: Filter kategori (Berita, Pengumuman, Prestasi, Agenda), live search, pembacaan views count, dan artikel terkait.
    - `Public/Facilities/Index`: Galeri sarana dan prasarana kampus berstandar industri.
    - `Public/Teachers/Index`: Direktori tenaga pendidik publik dengan gelar dan status penugasan wali kelas.
    - `Public/Galleries/Index`: Album galeri foto dengan lightbox modal interaktif.
    - `Public/Contact`: Formulir kirim pesan terhubung ke kotak masuk admin, rincian kontak, dan peta lokasi kampus.
  - Panel Admin CMS lengkap di dashboard autentikasi (`/cms/posts`, `/cms/facilities`, `/cms/galleries`, `/cms/school-profile`, `/cms/messages`) serta toggle cepat direktori guru publik.
  - Seeder konten awal profil sekolah `SchoolProfileSeeder`.
  - Feature tests lengkap untuk halaman publik, SEO, CMS posts, fasilitas, galeri, kontak, dan otorisasi dengan 100% kelulusan (62 tests, 264 assertions).
- **Phase 1 (Master Data Akademik & Mata Pelajaran) Selesai**:
  - Instalasi paket `maatwebsite/excel` (v4.0) untuk impor dan ekspor spreadsheet.
  - Migrasi & model PostgreSQL berindeks untuk: `academic_years`, `semesters`, `grade_levels`, `departments` (RPL, TKJ, AKL, MIPA, IPS), `teachers`, `classrooms`, `students`, `guardians`, `guardian_student` (many-to-many), `student_classrooms` (dengan partial unique index mutasi), `subjects`, dan `teaching_assignments`.
  - Business logic Actions: `SetActiveAcademicYear`, `AssignHomeroomTeacher` (aturan 1 guru = max 1 rombel), `AssignStudentToClassroom` (validasi kapasitas), `TransferStudentClassroom` (pencatatan riwayat mutasi), `CreateUserFromStudent` (password default DDMMYYYY/NISN), `CreateUserFromTeacher` (password NIP), dan `CreateUserFromGuardian`.
  - Fitur Impor Excel dengan validasi error spesifik per-baris: `TeachersImport` dan `StudentsImport`.
  - Form Requests & Controllers tipis untuk Tahun Ajaran, Rombel, Guru, Siswa, Mapel, dan Penugasan Mengajar.
  - Halaman antarmuka Inertia React + TypeScript lengkap dengan filter, modal, pencarian, dan palet desain 60-30-10 (`Academic/AcademicYears`, `Academic/Classrooms`, `Academic/Teachers`, `Academic/Students`, `Academic/Subjects`, `Academic/TeachingAssignments`).
  - Seeder master data akademik `AcademicMasterSeeder` (Tahun 2026/2027 aktif, Jurusan SMK & SMA, Guru, Kelas, Mapel, Siswa, dan Wali).
  - Feature tests Phase 1 dengan 100% kelulusan (41 tests, 102 assertions).
- **Phase 0 (Fondasi Proyek) Selesai**:
  - Konfigurasi database PostgreSQL dengan indeks relasi dan kolom pencarian.
  - Setup autentikasi Laravel Breeze dengan stack **Inertia.js + React + TypeScript**.
  - Penerapan sistem desain UI clean & elegan (palet 60-30-10, font Plus Jakarta Sans, `lucide-react`, dan Light Mode).
  - Implementasi login fleksibel (mendukung input Email, NISN, NIP, atau Username).
  - Sistem RBAC (8 Role) menggunakan `spatie/laravel-permission` (`super_admin`, `admin`, `principal`, `teacher`, `homeroom_teacher`, `student`, `guardian`, `prospective_student`).
  - Layout dashboard responsif dengan navigasi dinamis berbasis role.
  - Model & migrasi `settings` untuk konfigurasi sekolah dinamis.
  - Model, migrasi, dan Action `RecordAuditLog` serta trait `HasAuditLog` untuk audit logging.
  - Strict prevention N+1 query (`Model::preventLazyLoading`) pada `AppServiceProvider`.
  - Database seeder untuk roles, permissions, settings awal, dan akun default Super Admin.
  - Suite unit dan feature tests dengan 100% kelulusan (30 tests, 70 assertions).
  - Standarisasi idempotensi transaksi dan anti double-submit pembayaran untuk modul SSP / Midtrans.
- Inisialisasi dokumen arsitektur dan pedoman proyek:
  - `docs/PRD.md` (Product Requirement Document v0.2)
  - `docs/ARCHITECTURE.md` (Pola desain arsitektur, standar coding, & strategi performa)
  - `docs/DESIGN_SYSTEM.md` (Sistem desain 60-30-10, font Plus Jakarta Sans, dan panduan tipografi)
  - `docs/DATABASE_SCHEMA.md` (Rancangan skema relasional PostgreSQL & strategi indexing)
  - `docs/ROLES_PERMISSIONS.md` (Matriks peran dan hak akses RBAC)
  - `docs/PHASE_0_PLAN.md` (Rencana kerja & verifikasi DoD)
  - `CHANGELOG.md`

