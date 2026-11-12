# Rencana Kerja Phase 3 — PPDB Online (Penerimaan Peserta Didik Baru)

Dokumen ini mendefinisikan tahapan arsitektur, skema basis data, alur bisnis, dan checklist *Definition of Done* (DoD) untuk **Phase 3**.

---

## 1. Tujuan & Sasaran
Membangun sistem Penerimaan Peserta Didik Baru (PPDB) yang terintegrasi, transparan, dan mudah digunakan:
1. **Calon Siswa & Orang Tua:** Dapat mendaftar secara daring, mengunggah berkas persyaratan, mengecek status verifikasi secara mandiri menggunakan Nomor Registrasi/NISN + Tanggal Lahir, mencetak bukti pendaftaran, dan melihat pengumuman kelulusan serta daftar ulang.
2. **Panitia PPDB & Sekolah:** Dapat mengelola periode/gelombang pendaftaran, jalur penerimaan, memverifikasi dokumen calon siswa, menentukan kelulusan, dan melakukan **konversi 1-klik** siswa yang diterima menjadi siswa aktif pada master data akademik (Phase 1) lengkap dengan akun login otomatis.

---

## 2. Struktur Database PostgreSQL & Indexing

### 2.1 Periode & Gelombang PPDB (`ppdb_periods`)
- **Kolom:**
  - `id` (bigserial, PK)
  - `academic_year_id` (FK `academic_years`, cascade on delete)
  - `name` (varchar 255, misal: "PPDB Gelombang 1 TP 2026/2027")
  - `slug` (varchar 255, unique)
  - `start_date` (date)
  - `end_date` (date)
  - `announcement_date` (date, nullable)
  - `re_registration_start` (date, nullable)
  - `re_registration_end` (date, nullable)
  - `is_active` (boolean, default true)
  - `description` (text, nullable)
  - `timestamps`
- **B-Tree Indexes:**
  - `academic_year_id`, `is_active`, `start_date`, `end_date`, `slug` (unique)

### 2.2 Jalur Pendaftaran & Kuota (`ppdb_tracks`)
- **Kolom:**
  - `id` (bigserial, PK)
  - `period_id` (FK `ppdb_periods`, cascade on delete)
  - `name` (varchar 100, misal: "Jalur Reguler / Zonasi", "Jalur Prestasi", "Jalur Afirmasi", "Jalur Mutasi")
  - `code` (varchar 50, misal: `REGULER`, `PRESTASI`, `AFIRMASI`)
  - `quota` (integer, default 0)
  - `description` (text, nullable)
  - `is_active` (boolean, default true)
  - `timestamps`
- **B-Tree Indexes:**
  - `period_id`, `code`, `is_active`

### 2.3 Data Calon Siswa / Pendaftar (`ppdb_applicants`)
- **Kolom:**
  - `id` (bigserial, PK)
  - `period_id` (FK `ppdb_periods`, restrict on delete)
  - `track_id` (FK `ppdb_tracks`, restrict on delete)
  - `department_id` (FK `departments`, nullable - pilihan kejuruan 1)
  - `second_department_id` (FK `departments`, nullable - pilihan kejuruan 2)
  - **Identitas & Domisili Pendaftar:**
    - `registration_number` (varchar 50, unique - contoh: `REG-2026-0001`)
    - `nisn` (varchar 10, index)
    - `nik` (varchar 16, index)
    - `full_name` (varchar 255)
    - `gender` (enum `L`, `P`)
    - `birth_place` (varchar 100)
    - `birth_date` (date, index)
    - `religion` (varchar 50, nullable)
    - `address` (text)
    - `province` (varchar 100, index)
    - `city` (varchar 100, index)
    - `district` (varchar 100, index - kecamatan)
    - `village` (varchar 100, nullable - kelurahan/desa)
    - `phone_number` (varchar 25)
    - `email` (varchar 255, nullable)
  - **Skor & Penilaian Seleksi (Sistem Eliminasi):**
    - `distance_zone_score` (smallint, default 0 - Skor 3: Satu Kec/Kelurahan, Skor 2: Satu Kota, Skor 1: Satu Provinsi, 0: Luar Provinsi)
    - `average_report_score` (decimal(5,2), default 0.00 - Rata-rata Nilai Rapor)
    - `final_score` (decimal(8,2), default 0.00, index - Total Skor Perangkingan Seleksi)
    - `ranking` (integer, nullable, index - Peringkat Hasil Eliminasi)
  - **Asal Sekolah:**
    - `previous_school_name` (varchar 255)
    - `previous_school_address` (text, nullable)
    - `graduation_year` (smallint)
  - **Data Orang Tua / Wali:**
    - `father_name` (varchar 255, nullable)
    - `father_occupation` (varchar 100, nullable)
    - `father_phone` (varchar 25, nullable)
    - `mother_name` (varchar 255, nullable)
    - `mother_occupation` (varchar 100, nullable)
    - `mother_phone` (varchar 25, nullable)
    - `guardian_name` (varchar 255, nullable)
    - `guardian_occupation` (varchar 100, nullable)
    - `guardian_phone` (varchar 25, nullable)
    - `parent_income` (varchar 50, nullable)
  - **Status & Verifikasi:**
    - `verification_status` (enum: `pending`, `verified`, `needs_revision`, `rejected` default `pending`, index)
    - `verification_notes` (text, nullable)
    - `verified_by` (FK `users`, nullable)
    - `verified_at` (timestamp, nullable)
    - `selection_status` (enum: `unprocessed`, `accepted`, `waiting_list`, `rejected` default `unprocessed`, index)
    - `re_registration_status` (enum: `not_registered`, `re_registered` default `not_registered`, index)
    - `converted_to_student_id` (FK `students`, nullable, unique)
    - `converted_at` (timestamp, nullable)
    - `timestamps`, `softDeletes`
- **B-Tree Indexes:**
  - `registration_number` (unique), `nisn`, `nik`, `birth_date`, `period_id`, `track_id`, `verification_status`, `selection_status`, `re_registration_status`, Composite `(nisn, birth_date)`.

### 2.4 Berkas & Dokumen Pendaftar (`ppdb_documents`)
- **Kolom:**
  - `id` (bigserial, PK)
  - `applicant_id` (FK `ppdb_applicants`, cascade on delete)
  - `document_type` (enum: `photo`, `family_card`, `birth_certificate`, `graduation_certificate`, `achievement_certificate`, `assistance_card`)
  - `file_path` (varchar 255)
  - `original_name` (varchar 255)
  - `file_size` (integer, in bytes)
  - `mime_type` (varchar 100)
  - `status` (enum: `pending`, `valid`, `invalid` default `pending`)
  - `notes` (text, nullable)
  - `timestamps`
- **B-Tree Indexes:**
  - `applicant_id`, `document_type`, `status`

---

## 3. Logika Bisnis (Action Classes)

1. `app/Actions/Ppdb/RegisterApplicant.php`:
   - Validasi ketersediaan periode pendaftaran aktif dan kuota.
   - Pengecekan duplikasi NIK / NISN dalam periode yang sama.
   - Hitung otomatis `distance_zone_score` berdasarkan pencocokan domisili siswa dengan domisili sekolah:
     - 1 Kelurahan / Kecamatan = Skor 3
     - 1 Kota / Kabupaten = Skor 2
     - 1 Provinsi = Skor 1
     - Luar Provinsi = Skor 0
   - Hitung skor gabungan awal (`final_score`).
   - Generate nomor registrasi unik format: `PPDB{YYYY}{TRACK_CODE}{SEQUENCE}` (misal: `PPDB2026-REG-0001`).
   - Simpan data pendaftar & unggah berkas ke storage publik.
   - Catat audit log pendaftaran baru.

2. `app/Actions/Ppdb/VerifyApplicant.php`:
   - Mengubah status verifikasi berkas (`verified`, `needs_revision`, `rejected`).
   - Menyimpan catatan/revisi dokumen jika ada berkas yang kurang jelas.
   - Memperbarui verifikasi nilai rapor / berkas oleh panitia.
   - Menyimpan aktor panitia yang memverifikasi beserta waktu verifikasi.

3. `app/Actions/Ppdb/RunEliminationSelection.php` (Sistem Eliminasi & Perangkingan):
   - Mengambil semua calon siswa yang berstatus `verified` pada jalur & program keahlian tertentu.
   - Melakukan pemeringkatan (ranking) otomatis:
     - **Kriteria 1:** Skor Wilayah Zonasi tertinggi (Skor 3 > 2 > 1 > 0)
     - **Kriteria 2:** Rata-rata Nilai Rapor tertinggi
     - **Kriteria 3:** Waktu pendaftaran lebih awal
   - Mengisi nilai `ranking` dan status kelulusan berdasarkan kuota:
     - Peringkat 1 s/d Kuota ➔ **`accepted` (Diterima / Lolos)**
     - Peringkat Kuota+1 s/d Kuota + Cadangan ➔ **`waiting_list` (Cadangan)**
     - Peringkat di bawahnya ➔ **`rejected` (Tereliminasi / Tidak Diterima)**
   - Catat audit log eksekusi seleksi eliminasi.

4. `app/Actions/Ppdb/ProcessReRegistration.php`:
   - Mencatat konfirmasi daftar ulang calon siswa yang diterima.

5. `app/Actions/Ppdb/ConvertApplicantToStudent.php`:
   - **Konversi 1-klik:**
     - Membuat record `Student` baru di tabel `students`.
     - Mengisi data orang tua / wali di tabel `guardians` dan relasi `guardian_student`.
     - Membuat akun login siswa otomatis (username: NISN, default password: tanggal lahir `DDMMYYYY`).
     - Mengaitkan `converted_to_student_id` pada record `ppdb_applicants`.
     - Mencatat audit log konversi.

---

## 4. Otorisasi & Validasi Form Request

- `app/Http/Requests/Public/PpdbRegistrationRequest.php`: Validasi data calon siswa, NISN, NIK, berkas unggahan (JPG/PNG/PDF maks 3MB per berkas).
- `app/Http/Requests/Ppdb/PpdbPeriodRequest.php`: Validasi tanggal dan kuota.
- `app/Http/Requests/Ppdb/VerifyApplicantRequest.php`: Validasi status dan catatan.
- Permissions baru: `manage_ppdb`, `verify_ppdb`.

---

## 5. Halaman Publik PPDB (Inertia + React + TypeScript)

1. **Portal Informasi PPDB (`resources/js/Pages/Public/Ppdb/Index.tsx`):**
   - Banner status periode PPDB (buka/tutup).
   - Informasi jalur, persyaratan dokumen, daya tampung / kuota per program keahlian.
   - Alur pendaftaran step-by-step & kontak helpdesk.
   - Tombol CTA: **Daftar Sekarang** dan **Cek Status Pendaftaran**.

2. **Formulir Pendaftaran Online (`resources/js/Pages/Public/Ppdb/Register.tsx`):**
   - Multi-step / Stepper form:
     1. Pilihan Jalur & Program Keahlian.
     2. Identitas Calon Siswa (NISN, NIK, Nama, TTL, Alamat).
     3. Asal Sekolah & Nilai Rapor.
     4. Data Orang Tua / Wali.
     5. Unggah Berkas Dokumen (Foto, KK, Akta, SKL, Piagam).
     6. Pratinjau & Konfirmasi Akhir.

3. **Halaman Sukses & Bukti Pendaftaran (`resources/js/Pages/Public/Ppdb/Success.tsx`):**
   - Menampilkan Nomor Registrasi unik dan barcode/QR info.
   - Ringkasan data pendaftaran.
   - Tombol **Cetak Bukti Pendaftaran (PDF / Cetak Bersih)**.

4. **Portal Cek Status Mandiri (`resources/js/Pages/Public/Ppdb/CheckStatus.tsx`):**
   - Form pencarian cepat: Nomor Registrasi ATAU NISN + Tanggal Lahir.
   - Menampilkan status verifikasi berkas secara transparan.
   - Fitur upload ulang berkas jika berstatus *Perlu Perbaikan*.
   - Pengumuman hasil seleksi (Diterima / Tidak) saat tanggal pengumuman tiba.
   - Informasi alur daftar ulang bagi yang diterima.

---

## 6. Panel Admin / Panitia PPDB (Inertia + React + TypeScript)

1. **Dashboard PPDB (`resources/js/Pages/Ppdb/Dashboard.tsx`):**
   - Statistik total pendaftar, terverifikasi, diterima, dan persentase kuota per jurusan.
2. **Pengaturan Periode & Jalur (`resources/js/Pages/Ppdb/Periods/Index.tsx`):**
   - Kelola gelombang, tanggal buka-tutup, dan kuota.
3. **Data Pendaftar & Verifikasi Berkas (`resources/js/Pages/Ppdb/Applicants/Index.tsx` & `Show.tsx`):**
   - Tabel pendaftar dengan filter jalur, jurusan, status verifikasi.
   - Halaman detail verifikasi: pratinjau dokumen (foto, scan KK/Akta/SKL), tombol verifikasi/tolak, input catatan revisi.
4. **Penetapan Seleksi & Simulasi Eliminasi (`resources/js/Pages/Ppdb/Selection/Index.tsx`):**
   - Simulasi perangkingan live berdasarkan Kuota Jalur & Program Keahlian.
   - Peringkat berbobot otomatis: Skor Zonasi (3: Satu Kelurahan/Kecamatan, 2: Satu Kota, 1: Satu Provinsi) + Rata-rata Nilai Rapor.
   - Indikator visual batas kuota: Peringkat Lolos Kuota (Hijau), Cadangan (Kuning), Tereliminasi (Abu/Merah).
   - Tombol 1-klik **"Terapkan Hasil Seleksi & Eliminasi Otomatis"** untuk menetapkan status massal.
5. **Daftar Ulang & Konversi Siswa (`resources/js/Pages/Ppdb/ReRegistration/Index.tsx`):**
   - Catat daftar ulang siswa diterima.
   - Tombol 1-klik **"Konversi ke Siswa Master Data"**.
6. **Ekspor Excel:**
   - Unduh daftar pendaftar lengkap dengan status verifikasi dan pilihan jurusan ke file spreadsheet.

---

## 7. Pengujian & Definition of Done (DoD)

- [ ] Migrasi database untuk 4 tabel PPDB berjalan sukses dengan foreign key dan indeks lengkap.
- [ ] Formulir publik menolak pendaftaran di luar jadwal periode aktif atau duplikasi NISN/NIK.
- [ ] Dokumen terunggah tersimpan aman di storage dan dapat dipratinjau panitia.
- [ ] Calon siswa dapat mengecek status mandiri hanya dengan nomor registrasi / NISN + tanggal lahir.
- [ ] Panitia dapat memverifikasi berkas dan memberi catatan revisi.
- [ ] Konversi 1-klik terbukti berhasil membuat data `Student`, `Guardian`, dan `User` aktif di sistem.
- [ ] Feature tests PHPUnit dibuat mencakup alur registrasi, verifikasi, dan konversi ke siswa.
- [ ] Lolos uji `vendor/bin/pint --format agent` dan `npm run build`.

