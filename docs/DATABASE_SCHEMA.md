# Rancangan Skema Database PostgreSQL (Eduvia)

Dokumen ini berisi cetak biru skema database relasional PostgreSQL untuk Eduvia, lengkap dengan panduan tipe data, relasi foreign key, serta strategi pembuatan indeks (*indexing*) guna memastikan performa tinggi dan bebas dari N+1 query.

---

## 1. Konvensi Database

- **DBMS:** PostgreSQL 15+
- **Kolom Kunci Utama:** `id` bertipe `bigIncrements` (BIGSERIAL / BIGINT)
- **Waktu:** `created_at`, `updated_at`, dan `deleted_at` (timestamptz)
- **Uang/Finansial:** `bigInteger` (satuan Rupiah penuh tanpa koma/desimal)
- **Audit Data Kompleks:** `jsonb` untuk fleksibilitas pembacaan dan query indeks jika diperlukan
- **Soft Deletes:** Wajib untuk tabel entitas inti siswa, guru, kelas, transaksi, nilai.

---

## 2. Skema Phase 0 — Fondasi & Autentikasi

### 2.1 `users`
Menyimpan kredensial semua pengguna sistem.

| Kolom | Tipe | Indeks/Keterangan |
|---|---|---|
| `id` | BIGSERIAL | Primary Key |
| `name` | VARCHAR(255) | |
| `email` | VARCHAR(255) | UNIQUE, Index |
| `username` | VARCHAR(50) | UNIQUE, Index, Opsional (bisa login via NISN/NIP) |
| `phone_number` | VARCHAR(20) | Index, Opsional |
| `password` | VARCHAR(255) | |
| `avatar_url` | VARCHAR(255) | Nullable |
| `is_active` | BOOLEAN | Default true, Index |
| `email_verified_at` | TIMESTAMPTZ | Nullable |
| `remember_token` | VARCHAR(100) | Nullable |
| `timestamps` | TIMESTAMPTZ | |
| `deleted_at` | TIMESTAMPTZ | Soft delete |

### 2.2 `roles`, `permissions`, `model_has_roles`, `model_has_permissions` (Spatie)
Tabel standar RBAC dari paket `spatie/laravel-permission` yang mendukung penugasan multi-peran dan otorisasi presisi.

### 2.3 `settings`
Menyimpan konfigurasi umum sekolah (multi-tenant ready tanpa hardcode).

| Kolom | Tipe | Indeks/Keterangan |
|---|---|---|
| `id` | BIGSERIAL | Primary Key |
| `key` | VARCHAR(100) | UNIQUE, Index |
| `value` | TEXT | Nullable |
| `group` | VARCHAR(50) | Index (misal: 'general', 'school', 'academic', 'payment') |
| `type` | VARCHAR(20) | 'string', 'boolean', 'json', 'integer' |
| `timestamps` | TIMESTAMPTZ | |

### 2.4 `audit_logs`
Mencatat riwayat perubahan data krusial sistem.

| Kolom | Tipe | Indeks/Keterangan |
|---|---|---|
| `id` | BIGSERIAL | Primary Key |
| `user_id` | BIGINT | FK `users.id`, NULL on delete, Index |
| `auditable_type` | VARCHAR(150) | Polymorphic model, Composite Index |
| `auditable_id` | BIGINT | Polymorphic ID, Composite Index |
| `event` | VARCHAR(50) | 'created', 'updated', 'deleted', 'restored', Index |
| `old_values` | JSONB | Data sebelum perubahan |
| `new_values` | JSONB | Data sesudah perubahan |
| `ip_address` | VARCHAR(45) | Nullable |
| `user_agent` | TEXT | Nullable |
| `created_at` | TIMESTAMPTZ | Index (untuk sorting riwayat) |

*Indeks:* `CREATE INDEX idx_audit_logs_auditable ON audit_logs (auditable_type, auditable_id);`

---

## 3. Skema Phase 1 — Master Data Akademik & Mata Pelajaran

### 3.1 `academic_years` & `semesters`
- **`academic_years`**:
  - `id`, `name` (misal: "2026/2027"), `start_date`, `end_date`, `is_active` (BOOLEAN, Index)
- **`semesters`**:
  - `id`, `academic_year_id` (FK), `semester_number` (1=Ganjil, 2=Genap), `is_active` (BOOLEAN, Index)
  - *Composite Index:* `(academic_year_id, semester_number)` UNIQUE

### 3.2 `educational_levels` & `departments` (Fokus SMA/SMK)
- **`educational_levels`**:
  - `id`, `code` (SD, SMP, SMA, SMK), `name`
- **`grade_levels`**:
  - `id`, `educational_level_id` (FK), `level_number` (misal: 10, 11, 12), `name` ("Kelas 10")
- **`departments`**:
  - `id`, `code` (misal: "RPL", "TKJ", "IPA", "IPS"), `name`, `is_active` (BOOLEAN)

### 3.3 `classrooms` (Rombel)
- `id`, `academic_year_id` (FK), `grade_level_id` (FK), `department_id` (FK, Nullable untuk umum), `homeroom_teacher_id` (FK `teachers.id`, Nullable), `name` (misal: "X RPL 1"), `capacity` (INT), `timestamps`, `deleted_at`.
- *Composite Index:* `(academic_year_id, department_id, grade_level_id)`

### 3.4 `teachers` & `students` & `guardians`
- **`teachers`**:
  - `id`, `user_id` (FK `users.id`, Nullable), `nip` (UNIQUE, Index), `name`, `gender` (ENUM/VARCHAR), `phone`, `address`, `status` (tetap/honorer), `deleted_at`.
- **`students`**:
  - `id`, `user_id` (FK `users.id`, Nullable), `nisn` (UNIQUE, Index), `nis` (Index), `nik` (Index), `full_name`, `gender`, `birth_place`, `birth_date`, `address`, `status` ('active', 'graduated', 'moved', 'dropped'), `deleted_at`.
- **`guardians`**:
  - `id`, `user_id` (FK `users.id`, Nullable), `nik` (Index), `name`, `relationship_type` ('father', 'mother', 'guardian'), `phone`, `occupation`, `income_bracket`, `deleted_at`.
- **`guardian_student`** (Pivot Many-to-Many):
  - `guardian_id` (FK), `student_id` (FK), `relationship` ('father', 'mother', 'guardian'), `is_emergency_contact` (BOOLEAN).
  - *Primary Key Composite:* `(guardian_id, student_id)`

### 3.5 `student_classrooms` (Penempatan Siswa per Tahun Ajaran)
- `id`, `student_id` (FK), `classroom_id` (FK), `academic_year_id` (FK), `status` ('active', 'transferred', 'passed'), `timestamps`.
- *Composite Index & Unique:* `(student_id, academic_year_id)` (Satu siswa hanya ada di 1 kelas per tahun ajaran).

### 3.6 `subjects` & `teaching_assignments`
- **`subjects`**:
  - `id`, `code` (UNIQUE, Index), `name`, `group` ('Umum', 'Kejuruan', 'Muatan Lokal'), `kkm_score` (INT, default 75), `is_active` (BOOLEAN).
- **`teaching_assignments`**:
  - `id`, `teacher_id` (FK), `subject_id` (FK), `classroom_id` (FK), `academic_year_id` (FK), `semester_id` (FK).
  - *Composite Index:* `(classroom_id, subject_id, semester_id)` UNIQUE.

---

## 4. Skema Phase 4 — Rekap Absensi

### 4.1 `attendances` & `attendance_details`
- **`attendances`**:
  - `id`, `classroom_id` (FK), `academic_year_id` (FK), `semester_id` (FK), `date` (DATE, Index), `recorded_by` (FK `users.id`), `type` ('daily', 'subject'), `subject_id` (FK, Nullable), `timestamps`.
  - *Composite Index:* `(classroom_id, date, type)` UNIQUE.
- **`attendance_details`**:
  - `id`, `attendance_id` (FK `attendances.id` ON DELETE CASCADE), `student_id` (FK), `status` ('present', 'permit', 'sick', 'absent'), `remarks` (TEXT, Nullable).
  - *Composite Index:* `(attendance_id, student_id)` UNIQUE, index on `(student_id, status)`.

---

## 5. Skema Phase 5 — Penilaian & Raport Digital

### 5.1 `grade_components` & `student_grades`
- **`grade_components`**:
  - `id`, `teaching_assignment_id` (FK), `title` (misal: "Tugas 1", "UTS", "UAS"), `weight` (INT, misal 20%), `max_score` (default 100).
- **`student_grades`**:
  - `id`, `grade_component_id` (FK), `student_id` (FK), `score` (DECIMAL(5,2)), `notes` (TEXT).
  - *Composite Index:* `(grade_component_id, student_id)` UNIQUE.
- **`report_cards`**:
  - `id`, `student_id` (FK), `classroom_id` (FK), `academic_year_id` (FK), `semester_id` (FK), `status` ('draft', 'validated', 'published'), `published_at` (TIMESTAMPTZ), `homeroom_notes` (TEXT), `is_locked` (BOOLEAN, default false).

---

## 6. Skema Phase 6 — SSP (Pembayaran Sekolah & Midtrans)

### 6.1 `payment_categories` & `student_bills`
- **`payment_categories`**:
  - `id`, `name` (misal: "SPP Bulanan", "Uang Gedung", "Seragam"), `type` ('monthly', 'one_time'), `default_amount` (BIGINT in IDR).
- **`student_bills`**:
  - `id`, `student_id` (FK), `payment_category_id` (FK), `academic_year_id` (FK), `month` (SMALLINT, 1-12, Nullable), `year` (INT, Nullable), `title` (VARCHAR 255), `total_amount` (BIGINT), `discount_amount` (BIGINT, default 0), `paid_amount` (BIGINT, default 0), `remaining_amount` (BIGINT), `status` ('unpaid', 'partially_paid', 'paid', 'cancelled'), `due_date` (DATE), `timestamps`, `deleted_at`.
  - *Composite Index:* `(student_id, status)`, `(payment_category_id, due_date)`.

### 6.2 `payment_transactions` & `payment_receipts`
- **`payment_transactions`**:
  - `id`, `student_bill_id` (FK), `invoice_number` (VARCHAR(50), UNIQUE, Index), `amount` (BIGINT), `payment_method` ('cash', 'manual_transfer', 'midtrans'), `status` ('pending', 'settlement', 'expire', 'cancel', 'failed'), `paid_at` (TIMESTAMPTZ, Nullable), `snap_token` (VARCHAR(255), Nullable), `payment_payload` (JSONB), `payment_proof_url` (VARCHAR(255), Nullable), `verified_by` (FK `users.id`, Nullable), `timestamps`.
  - *Composite Index:* `(invoice_number, status)`.

---

## 7. Aturan Query & Indeks Database (Performance Checklist)

1. **Foreign Keys Always Indexed**: Semua kolom yang berelasi memiliki indeks B-Tree bawaan.
2. **Prevent String Wildcard Matching (%query%)**: Untuk pencarian teks cepat (nama siswa/guru), gunakan `full-text search` PostgreSQL (`to_tsvector`) atau `gin` index bila data telah mencapai skala puluhan ribu.
3. **Audit Log Partitioning (Masa Depan)**: Tabel `audit_logs` dan `attendances` dapat dipartisi berdasarkan rentang tahun jika volume rekaman mencapai ratusan ribu.

