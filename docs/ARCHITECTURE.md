# Panduan Arsitektur & Standar Teknis (Eduvia)

Dokumen ini mendefinisikan standar arsitektur teknis, pola desain kode, serta strategi performa untuk aplikasi Eduvia.

---

## 1. Tech Stack Inti

| Lapisan | Teknologi | Catatan |
|---|---|---|
| **Backend** | Laravel 13 (PHP 8.3+) | Strict typing, Constructor property promotion, Form Requests, Policies |
| **Database** | PostgreSQL | B-Tree indexing, Foreign key constraints, JSONB jika diperlukan |
| **Frontend** | Inertia.js + React + TypeScript | Single Page App tanpa kerumitan API terpisah untuk web |
| **Styling** | Tailwind CSS v4 | Responsif, mobile-first, konsisten warna brand |
| **Payment** | Midtrans (Snap & Webhook) | Otomatisasi pembayaran SPP & tagihan sekolah |
| **Queue** | Database Queue (Tahap awal) | Notifikasi & proses berat dijalankan asynchronous |
| **Testing** | PHPUnit & Pest | Feature test wajib untuk setiap Action bisnis |

---

## 2. Pola Arsitektur (Design Patterns)

### 2.1 Action / Service Pattern (Single Responsibility)
Seluruh logika bisnis **dilarang** ditulis langsung di controller. Logika bisnis dibungkus dalam kelas **Action** di folder `app/Actions/{Domain}/`.

```
app/
  Actions/
    Academic/
      AssignTeacherToClassroom.php
      PromoteStudents.php
    Attendance/
      RecordDailyAttendance.php
    Grading/
      CalculateFinalGrade.php
    Billing/
      GenerateMonthlyTuitionBills.php
      ProcessMidtransNotification.php
```

- **Satu Action = Satu Use Case**.
- Controller hanya bertugas:
  1. Menerima request yang sudah divalidasi oleh Form Request.
  2. Mengecek otorisasi via Policy.
  3. Memanggil Action terkait.
  4. Mengembalikan Inertia response atau redirect dengan flash message.

### 2.2 Form Request & Authorization
- Validasi input wajib menggunakan `app/Http/Requests/{Domain}/*Request.php`.
- Otorisasi hak akses wajib menggunakan Laravel Policy (`app/Policies/*Policy.php`).

---

## 3. Strategi Database & Performa PostgreSQL

### 3.1 Pencegahan N+1 Query
- Aktifkan pencegahan lazy loading di `AppServiceProvider`:
  ```php
  Model::preventLazyLoading(! $this->app->isProduction());
  ```
- Selalu gunakan *eager loading* (`with(['relation1', 'relation2'])`) pada query yang mengambil daftar data (listing/tabel).
- Wajib menggunakan paginasi (`paginate(25)`) untuk tabel yang berpotensi memiliki banyak baris.

### 3.2 Strategi Indexing PostgreSQL
Data sekolah akan bertumbuh cepat (terutama riwayat absensi, nilai, dan tagihan). Setiap migrasi wajib menyertakan indeks:
1. **Foreign Keys**: Semua kolom `*_id` wajib memiliki index (bawaan foreignId()->index()).
2. **Kolom Pencarian**: Kolom yang sering dijadikan filter atau pencarian (misal `nisn`, `nik`, `invoice_number`, `status`, `date`, `academic_year_id`).
3. **Composite Index**: Buat composite index untuk query kombinasi yang sering terjadi bersamaan, contoh:
   - `['classroom_id', 'academic_year_id']`
   - `['student_id', 'status']`
   - `['classroom_id', 'date']` pada tabel absensi.

### 3.3 Penanganan Nilai Uang (Currency)
- Semua nominal uang disimpan sebagai **integer dalam satuan Rupiah** (IDR).
- Dilarang keras memakai tipe data `float` atau `double`. Gunakan `bigInteger` untuk kolom keuangan guna mencegah overflow.

### 3.4 Soft Deletes
- Data penting akademik dan keuangan (siswa, guru, nilai, tagihan, transaksi) wajib menggunakan trait `SoftDeletes`.
- Penghapusan data harus melalui konfirmasi dan tidak menghapus riwayat fisik secara permanen kecuali ada persetujuan Super Admin.

---

## 4. Sistem Audit Log

Setiap perubahan pada data sensitif (nilai, kehadiran, pembayaran, dan perubahan status PPDB) wajib mencatat riwayat audit:
- **Tabel:** `audit_logs`
- **Atribut:** `user_id`, `auditable_type`, `auditable_id`, `event` (created/updated/deleted), `old_values` (JSONB), `new_values` (JSONB), `ip_address`, `user_agent`, `created_at`.
- Dilakukan secara otomatis melalui Model Observer atau dipanggil eksplisit dalam Action terkait.

---

## 5. Arsitektur Integrasi Payment Gateway (Midtrans)

```
[ Wali Murid / Siswa ]
        │ 1. Klik Bayar Tagihan
        ▼
[ Controller ] ──▶ [ CreatePaymentSnapToken Action ]
                          │ 2. Request Snap Token ke Midtrans
                          ▼
                     [ Midtrans API ]
                          │ 3. Return Snap Token & Redirect URL
                          ▼
[ Frontend React ] ──▶ Buka Snap Popup / Redirect
                          │ 4. Pembayaran Selesai (User)
                          ▼
[ Midtrans Engine ] ──▶ 5. HTTP Webhook POST (Notifikasi)
                                │
                                ▼
                   [ MidtransNotificationController ]
                                │ 6. Verifikasi Signature Key
                                ▼
               [ ProcessMidtransNotification Action ]
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
            [ Update Status Tagihan ]   [ Catat ke audit_logs & receipts ]
```

- **Keamanan Webhook:** Validasi hashing `SHA512(order_id + status_code + gross_amount + ServerKey)` sebelum mengubah status transaksi.
- **Idempotency Webhook:** Request webhook ganda dengan `order_id` yang sama dan status sama tidak akan membuat catatan ganda atau memicu event berulang.

### 5.1 Mekanisme Idempotensi Transaksi & Anti Double-Submit

Untuk mencegah tagihan ganda atau pembuatan transaksi berulang akibat pengguna mengklik tombol bayar berkali-kali (*rage clicking* atau koneksi lambat):

1. **Proteksi Frontend (UI):**
   - Tombol bayar langsung berstatus `disabled` dan menampilkan ikon loading spinner segera setelah diklik pertama kali.
   - Menggunakan state tracking pada komponen React (`isSubmitting = true`).
2. **Idempotency Key (Backend):**
   - Setiap inisiasi pembayaran menyertakan header/payload `X-Idempotency-Key` (UUID v4) atau digenerate otomatis berdasarkan `hash(student_bill_id + amount + date)`.
   - Tabel `payment_transactions` memiliki kolom `idempotency_key` dengan constraint **UNIQUE**.
3. **Atomic Lock (Laravel Cache):**
   - Sebelum membuat transaksi di Midtrans, backend mengunci proses menggunakan atomic lock:
     ```php
     Cache::lock("bill_payment_{$billId}", 10)->block(5, function () use ($bill, $amount, $idempotencyKey) {
         // Cek apakah transaksi dengan idempotency_key atau pending Snap token sudah ada
         $existing = PaymentTransaction::where('idempotency_key', $idempotencyKey)
             ->orWhere(fn ($q) => $q->where('student_bill_id', $bill->id)->where('status', 'pending'))
             ->first();

         if ($existing && $existing->snap_token) {
             return $existing; // Kembalikan token yang sudah ada, jangan request baru ke Midtrans
         }

         // Request Snap Token baru ke Midtrans...
     });
     ```
4. **Idempotensi Response:**
   - Jika request berulang dengan `idempotency_key` yang sama masuk ke server, server langsung mengembalikan Snap token yang sudah dibuat sebelumnya tanpa membuat transaksi baru di Midtrans atau di database.

---

## 6. Standar Penamaan & Bahasa
- **Kode Program (PHP & TS):** Bahasa Inggris (`Student`, `Classroom`, `Invoice`, `AttendanceRecord`).
- **Nama Kolom & Tabel:** Snake case Bahasa Inggris (`academic_years`, `guardian_student`, `is_active`).
- **Antarmuka Pengguna (UI):** Bahasa Indonesia formal & ramah pengguna sekolah ("Tahun Ajaran", "Wali Kelas", "Tagihan SPP", "Raport").
- **Standar UI & Desain:** Wajib mengikuti pedoman [docs/DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) untuk palet 60-30-10, font Plus Jakarta Sans/Inter, dan aturan skala ukuran/ketebalan font.

