# Rencana Kerja Phase 1 — Master Data Akademik & Mata Pelajaran

Dokumen ini mendefinisikan tahapan eksekusi dan checklist *Definition of Done* (DoD) untuk **Phase 1**.

---

## 1. Paket & Dependensi Eksternal
- [x] Pasang `maatwebsite/excel` untuk kebutuhan impor & ekspor data master:
  ```bash
  composer require maatwebsite/excel
  ```

---

## 2. Migrasi & Model Database PostgreSQL

### 2.1 Struktur Tahun & Tingkat
- [x] `academic_years`: `name`, `start_date`, `end_date`, `is_active` (boolean, index)
- [x] `semesters`: `academic_year_id` (FK), `semester_number` (1/2), `is_active` (boolean)
- [x] `grade_levels`: `educational_level` ('SMA' / 'SMK'), `level_number` (10, 11, 12), `name` ("Kelas 10", dll.)
- [x] `departments`: `code` ('RPL', 'TKJ', 'AKL', 'MIPA', 'IPS'), `name`, `is_active` (boolean)

### 2.2 Guru & Rombel (Wali Kelas)
- [x] `teachers`: `user_id` (FK nullable), `nip` (unique, index), `name`, `gender`, `phone`, `address`, `employment_status`, `deleted_at`
- [x] `classrooms`: `academic_year_id` (FK), `grade_level_id` (FK), `department_id` (FK nullable), `homeroom_teacher_id` (FK `teachers.id`, nullable), `name` ("X RPL 1"), `capacity`, `deleted_at`
  - *Aturan:* 1 Guru hanya bisa menjadi wali kelas pada maksimal 1 rombel per tahun ajaran aktif.

### 2.3 Siswa & Wali Murid
- [x] `students`: `user_id` (FK nullable), `nisn` (unique, index), `nis` (index), `nik` (index), `full_name`, `gender`, `birth_place`, `birth_date`, `address`, `status`, `deleted_at`
- [x] `guardians`: `user_id` (FK nullable), `nik` (index), `name`, `relationship_type`, `phone`, `occupation`, `deleted_at`
- [x] `guardian_student` (Pivot Many-to-Many): `guardian_id` (FK), `student_id` (FK), `relationship`, `is_emergency_contact`
- [x] `student_classrooms`: `student_id` (FK), `classroom_id` (FK), `academic_year_id` (FK), `status` ('active', 'transferred', 'graduated')
  - *Partial Unique Index:* `(student_id, academic_year_id) WHERE status = 'active'`

### 2.4 Mata Pelajaran & Penugasan Mengajar
- [x] `subjects`: `code` (unique, index), `name`, `group` ('Umum', 'Kejuruan', 'Muatan Lokal'), `kkm_score` (default 75), `is_active`
- [x] `teaching_assignments`: `teacher_id` (FK), `subject_id` (FK), `classroom_id` (FK), `academic_year_id` (FK), `semester_id` (FK)
  - *Composite Index:* `(classroom_id, subject_id, semester_id)` UNIQUE

---

## 3. Logika Bisnis (Action / Service Classes)
- [x] `app/Actions/Academic/SetActiveAcademicYear.php`: Mengaktifkan 1 tahun ajaran & semester serta menonaktifkan yang lain.
- [x] `app/Actions/Academic/AssignStudentToClassroom.php`: Menempatkan siswa ke rombel dengan validasi kapasitas dan status aktif.
- [x] `app/Actions/Academic/TransferStudentClassroom.php`: Memindahkan siswa antar-kelas dengan memperbarui status lama menjadi `transferred`.
- [x] `app/Actions/Academic/AssignHomeroomTeacher.php`: Memvalidasi agar guru tidak menjadi wali di lebih dari 1 kelas aktif.
- [x] `app/Actions/Users/CreateUserFromStudent.php`: Generate akun siswa otomatis (login via NISN, password `DDMMYYYY`).
- [x] `app/Actions/Users/CreateUserFromTeacher.php`: Generate akun guru otomatis (login via NIP, role `teacher` / `homeroom_teacher`).
- [x] `app/Actions/Users/CreateUserFromGuardian.php`: Generate akun wali otomatis (login via No. HP).

---

## 4. Impor Massal Excel (Laravel Excel)
- [x] `app/Imports/TeachersImport.php`: Impor guru dengan validasi error per-baris.
- [x] `app/Imports/StudentsImport.php`: Impor siswa beserta mapping penempatan kelas awal.

---

## 5. Antarmuka Pengguna (Inertia + React + TypeScript)
- [x] Halaman Master Data Akademik (Tahun Ajaran, Semester, Jurusan, Rombel).
- [x] Halaman Manajemen Guru (Daftar, Tambah/Edit, Impor Excel, Generate Akun).
- [x] Halaman Manajemen Siswa (Daftar, Filter Kelas/Jurusan, Tambah/Edit, Hubungkan Wali, Impor Excel).
- [x] Halaman Mata Pelajaran & Plotting Penugasan Mengajar Guru.
- [x] Mengikuti standar [docs/DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) (palet 60-30-10, Plus Jakarta Sans, Lucide icons, tabel berpaginasi).

---

## 6. Pengujian (PHPUnit Tests)
- [x] Test penetapan tahun ajaran & semester aktif.
- [x] Test aturan 1 guru maksimal 1 wali kelas.
- [x] Test mutasi & penempatan siswa ke rombel.
- [x] Test impor Excel data siswa & guru (kasus valid & kasus gagal per baris).
- [x] Test generate akun login otomatis dari NISN & NIP.
- [x] Seluruh test lulus (41 tests, 102 assertions) & kode diformat via `vendor/bin/pint --format agent`.
