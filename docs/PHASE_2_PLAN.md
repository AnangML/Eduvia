# Rencana Kerja Phase 2 — Profil Sekolah (Publik) & Admin CMS

Dokumen ini mendefinisikan tahapan eksekusi dan checklist *Definition of Done* (DoD) untuk **Phase 2**.

---

## 1. Tujuan & Sasaran
Membangun wajah publik sekolah yang elegan, informatif, ramah mobile, dan berorientasi SEO dengan sistem desain **60-30-10** (Inertia React + TypeScript), serta menyediakan panel **Admin CMS** agar pihak sekolah dapat memperbarui konten profil, berita, agenda, fasilitas, direktori guru, galeri, dan pesan kontak tanpa menyentuh kode.

---

## 2. Struktur Database PostgreSQL & Indexing

### 2.1 Berita, Pengumuman, Prestasi & Agenda (`posts`)
- [x] Kolom: `id`, `author_id` (FK users nullable), `category` (enum: `news`, `announcement`, `achievement`, `agenda`), `title`, `slug` (unique), `excerpt`, `content` (text), `featured_image`, `status` (enum: `draft`, `published`), `published_at` (nullable), `event_date` (nullable untuk agenda), `views_count`, `timestamps`, `softDeletes`.
- [x] B-Tree Indexes: `slug` (unique), `category`, `status`, `published_at`, Composite `(status, published_at)`.

### 2.2 Fasilitas Sekolah (`facilities`)
- [x] Kolom: `id`, `name`, `slug` (unique), `description`, `image_path`, `order` (default 0), `is_active` (boolean default true), `timestamps`.
- [x] Indexes: `order`, `is_active`.

### 2.3 Galeri Foto & Album (`gallery_albums` & `galleries`)
- [x] `gallery_albums`: `id`, `title`, `slug` (unique), `description`, `cover_image`, `order`, `is_active`, `timestamps`.
- [x] `galleries`: `id`, `album_id` (FK cascade), `title`, `image_path`, `caption`, `order`, `timestamps`.
- [x] Indexes: `album_id`, `is_active`.

### 2.4 Direktori Guru Publik (`teachers`)
- [x] Tambah kolom pada tabel `teachers`:
  - `is_public` (boolean default false, index)
  - `photo` (string nullable)
  - `title_degree` (string nullable)

### 2.5 Pesan Masuk / Formulir Kontak (`contact_messages`)
- [x] Kolom: `id`, `name`, `email`, `phone`, `subject`, `message`, `is_read` (boolean default false, index), `read_at` (nullable), `timestamps`.

### 2.6 Pengaturan Profil Sekolah (`settings`)
- [x] Memanfaatkan tabel `settings` yang sudah ada untuk data:
  - `school_name`, `school_tagline`, `school_description`, `school_vision`, `school_mission`, `school_history`, `school_address`, `school_phone`, `school_email`, `school_map_embed`, `social_instagram`, `social_facebook`, `social_youtube`.

---

## 3. Logika Bisnis (Action Classes)
- [x] `app/Actions/Cms/CreatePost.php`: Membuat artikel/berita dengan auto-slug dan audit log.
- [x] `app/Actions/Cms/UpdatePost.php`: Mengupdate artikel/berita dan audit log.
- [x] `app/Actions/Cms/SaveFacility.php`: Menyimpan data fasilitas.
- [x] `app/Actions/Cms/SaveGalleryAlbum.php`: Menyimpan album galeri dan foto-fotonya.
- [x] `app/Actions/Cms/SaveSchoolProfile.php`: Menyimpan data profil sekolah ke tabel `settings`.
- [x] `app/Actions/Cms/SubmitContactMessage.php`: Memvalidasi dan menyimpan pesan publik ke database.

---

## 4. Validasi Form Request & Otorisasi Policy
- [x] `app/Http/Requests/Cms/PostRequest.php`
- [x] `app/Http/Requests/Cms/FacilityRequest.php`
- [x] `app/Http/Requests/Cms/GalleryAlbumRequest.php`
- [x] `app/Http/Requests/Cms/SchoolProfileRequest.php`
- [x] `app/Http/Requests/Public/ContactMessageRequest.php`
- [x] Hak akses CMS dilindungi permission `manage_school_profile` dan `manage_announcements`.

---

## 5. Halaman Publik & SEO (Inertia + React + TypeScript)
- [x] **Public Layout (`resources/js/Layouts/PublicLayout.tsx`)**:
  - Navbar responsif, logo sekolah, navigasi halaman publik, dan tombol "Portal Masuk".
  - Komponen SEO `<Head>`: title dinamis, meta description, Open Graph tags.
  - Footer dengan informasi sekolah, tautan cepat, peta kontak, dan copyright.
- [x] **Beranda Publik (`resources/js/Pages/Public/Home.tsx`)**:
  - Hero section dengan ajakan aksi (CTA) dan background elegan.
  - Sambutan Kepala Sekolah & ringkasan visi.
  - Angka statistik sekolah (siswa, guru, jurusan, prestasi).
  - Program keahlian / jurusan unggulan.
  - Berita & pengumuman terbaru.
  - Sorotan fasilitas & galeri.
- [x] **Profil & Visi Misi (`resources/js/Pages/Public/About.tsx`)**
- [x] **Berita & Agenda (`resources/js/Pages/Public/Posts/Index.tsx` & `Show.tsx`)**
- [x] **Fasilitas Sekolah (`resources/js/Pages/Public/Facilities/Index.tsx`)**
- [x] **Direktori Guru (`resources/js/Pages/Public/Teachers/Index.tsx`)**
- [x] **Galeri Foto (`resources/js/Pages/Public/Galleries/Index.tsx`)**
- [x] **Kontak & Kirim Pesan (`resources/js/Pages/Public/Contact.tsx`)**

---

## 6. Panel Admin CMS (Inertia + React + TypeScript)
- [x] **CMS Berita & Pengumuman (`resources/js/Pages/Cms/Posts/Index.tsx`)**: Filter kategori/status, modal form, preview, audit log.
- [x] **CMS Fasilitas (`resources/js/Pages/Cms/Facilities/Index.tsx`)**: CRUD fasilitas dan urutan tampil.
- [x] **CMS Galeri (`resources/js/Pages/Cms/Galleries/Index.tsx`)**: CRUD album foto dan upload gambar.
- [x] **CMS Profil Sekolah (`resources/js/Pages/Cms/SchoolProfile/Index.tsx`)**: Formulir lengkap Visi Misi, Sejarah, Kontak & Sosmed.
- [x] **CMS Pesan Masuk (`resources/js/Pages/Cms/Messages/Index.tsx`)**: Daftar pesan dari publik, status baca/belum, hapus pesan.

---

## 7. Seeder & Pengujian (PHPUnit)
- [x] Seeder data awal konten profil publik (`SchoolProfileSeeder.php`).
- [x] Feature tests halaman publik & SEO (`PublicPageTest.php` - 10 tests).
- [x] Feature tests CMS berita & otorisasi (`CmsPostTest.php` - 6 tests).
- [x] Feature tests CMS profil, fasilitas & galeri (`CmsProfileTest.php` - 5 tests).
- [x] Formatted via `vendor/bin/pint --format agent` & lolos 100% tests (62 tests, 264 assertions).
