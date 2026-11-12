# Matriks Peran & Hak Akses (RBAC) — Eduvia

Sistem Eduvia mengimplementasikan *Role-Based Access Control* (RBAC) menggunakan paket `spatie/laravel-permission`. Setiap aksi pengguna diverifikasi secara ketat melalui middleware dan Laravel Policy.

---

## 1. Daftar Peran (Roles)

| No | Nama Role (Sistem) | Label UI | Deskripsi Singkat |
|---|---|---|---|
| 1 | `super_admin` | Super Admin | Akses penuh ke seluruh konfigurasi, hak akses, audit log, dan database. |
| 2 | `admin` | Admin / Tata Usaha | Mengelola master data akademik, PPDB, penagihan SSP, dan profil sekolah. |
| 3 | `principal` | Kepala Sekolah | Akses pengawasan dan pelaporan (Read-Only) menyeluruh. |
| 4 | `teacher` | Guru | Mengisi absensi mata pelajaran dan menginput nilai sesuai penugasan mengajar. |
| 5 | `homeroom_teacher` | Wali Kelas | Hak akses Guru ditambah pengelolaan absensi harian dan penerbitan raport kelasnya. |
| 6 | `student` | Siswa | Melihat absensi pribadi, jadwal, nilai, dan tagihan SPP milik sendiri. |
| 7 | `guardian` | Wali Murid | Memantau seluruh anak yang terhubung (absensi, nilai, raport, pembayaran SPP via Midtrans). |
| 8 | `prospective_student`| Calon Siswa | Mendaftar PPDB, mengunggah berkas, dan memantau status seleksi masuk. |

---

## 2. Matriks Hak Akses (Permissions Matrix)

| Modul & Permission | Super Admin | Admin/TU | Kepala Sekolah | Guru | Wali Kelas | Siswa | Wali Murid | Calon Siswa |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Manajemen Sistem & Pengaturan** |
| `manage_settings` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `manage_users_roles` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `view_audit_logs` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Master Data Akademik** |
| `manage_academic_years` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `manage_classrooms` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `manage_teachers` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `manage_students` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `manage_guardians` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `manage_subjects` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `manage_teaching_assignments` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `view_master_data` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Profil Sekolah & Berita (CMS)** |
| `manage_school_profile` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `manage_announcements` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **PPDB** |
| `manage_ppdb_periods` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `verify_ppdb_applicants` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `submit_ppdb_application` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Absensi Kehadiran** |
| `record_daily_attendance` | ✅ | ✅ | ❌ | ❌ | ✅ (Kelasnya) | ❌ | ❌ | ❌ |
| `record_subject_attendance` | ✅ | ✅ | ❌ | ✅ (Tugasnya)| ✅ (Tugasnya) | ❌ | ❌ | ❌ |
| `view_own_attendance` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ (Anaknya)| ❌ |
| `view_all_attendance_reports` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Penilaian & Raport** |
| `input_student_grades` | ✅ | ❌ | ❌ | ✅ (Tugasnya)| ✅ (Tugasnya) | ❌ | ❌ | ❌ |
| `validate_class_report_card` | ✅ | ❌ | ❌ | ❌ | ✅ (Kelasnya) | ❌ | ❌ | ❌ |
| `publish_report_card` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `unlock_published_report_card` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `view_own_report_card` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ (Anaknya)| ❌ |
| `view_all_grade_reports` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **SSP & Pembayaran (Midtrans)** |
| `manage_payment_categories` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `generate_bills` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `record_manual_payment` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `verify_transfer_payment` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `pay_via_midtrans` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| `view_own_bills` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ (Anaknya)| ❌ |
| `view_financial_reports` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Aturan Kepemilikan Data (Data Scoping / Multi-tenancy Guard)

1. **Wali Murid:**
   - Wajib melalui tabel pivot `guardian_student`.
   - Query tagihan, absensi, dan nilai **harus** difilter dengan klausa:
     ```php
     $query->whereIn('student_id', $user->guardian->students()->pluck('students.id'));
     ```
2. **Siswa:**
   - Siswa hanya berhak melihat record miliknya sendiri (`student_id === $user->student->id`).
3. **Guru:**
   - Input nilai dan absensi mapel dibatasi hanya untuk `teaching_assignments` yang aktif untuk guru tersebut.
4. **Wali Kelas:**
   - Kelola raport dan absensi harian dibatasi untuk `classrooms` di mana `homeroom_teacher_id === $user->teacher->id`.

