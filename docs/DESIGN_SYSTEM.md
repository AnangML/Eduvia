# Panduan Sistem Desain & Tipografi (Eduvia Design System)

Dokumen ini mendefinisikan sistem desain antarmuka (UI/UX) aplikasi Eduvia untuk memastikan tampilan yang **clean, elegan, konsisten, dan mudah dibaca**.

---

## 1. Aturan Warna (Formula 60-30-10)

Kombinasi warna mengadopsi palet **Biru, Putih, dan Hitam/Slate Elegan** dengan proporsi 60-30-10:

```
┌───────────────────────────────────────┬──────────────────────┬───────────┐
│              60% Dominan              │     30% Sekunder     │10% Aksen  │
│        (Background & Permukaan)       │ (Teks, Struktur, UI) │(CTA/Fokus)│
└───────────────────────────────────────┴──────────────────────┴───────────┘
```

| Proporsi | Peran | Kode Hex / Tailwind | Penggunaan |
|---|---|---|---|
| **60% (Dominan)** | Background Canvas | `#F8FAFC` (`slate-50`) | Latar belakang seluruh halaman aplikasi |
| | Card & Surface | `#FFFFFF` (`white`) | Kartu konten, modal dialog, panel tabel |
| | Garis Batas (Border) | `#E2E8F0` (`slate-200`) | Divider, border kartu, pemisah baris tabel |
| **30% (Sekunder)** | Primary Text | `#0F172A` (`slate-900`) | Seluruh heading, judul kartu, teks utama |
| | Secondary/Body Text | `#334155` (`slate-700`) | Paragraf, isi tabel, deskripsi |
| | Muted/Helper Text | `#64748B` (`slate-500`) | Helper text, placeholder, timestamp |
| | Sidebar / Struktur Nav | `#0F172A` / `#1E293B` | Latar navigasi gelap elegan (atau clean white dengan border) |
| **10% (Aksen)** | Brand / Primary CTA | `#2563EB` (`blue-600`) | Tombol utama, link aktif, indikator terpilih |
| | Hover State | `#1D4ED8` (`blue-700`) | Interaksi hover tombol utama |
| | Light Accent Surface | `#EFF6FF` (`blue-50`) | Background menu aktif, badge status info |
| | Focus Ring | `#3B82F6` (`blue-500`) | Outline aksesibilitas form input |

---

## 2. Tipografi & Skala Font

### 2.1 Pilihan Font
- **Primary Font Family:** `Plus Jakarta Sans` (alternatif: `Inter`), sans-serif geometris modern dengan keterbacaan tinggi di layar komputer maupun ponsel.

### 2.2 Skala & Ketebalan (Typography Scale)

| Elemen UI | Ukuran Font | Weight | Tailwind Class | Line-height |
|---|---|---|---|---|
| **Hero heading** | 40–48 px | 700 (Bold) | `text-4xl md:text-5xl font-bold` | 1.2 |
| **Page heading** | 26–30 px | 700 (Bold) | `text-2xl md:text-3xl font-bold` | 1.3 |
| **Section heading** | 18–20 px | 600 (Semibold) | `text-lg md:text-xl font-semibold` | 1.4 |
| **Card heading** | 15–16 px | 600 (Semibold) | `text-base font-semibold` | 1.4 |
| **Dashboard statistic** | 28–32 px | 700 (Bold) | `text-3xl font-bold` | 1.2 |
| **Body text** | 14–15 px | 400 (Normal) | `text-sm font-normal` | 1.5–1.7 (`leading-relaxed`) |
| **Table content** | 13–14 px | 400 (Normal) | `text-xs md:text-sm font-normal` | 1.5 |
| **Form label** | 13–14 px | 500 (Medium) | `text-xs md:text-sm font-medium` | 1.4 |
| **Navigation link** | 14–15 px | 500 (Medium) | `text-sm font-medium` | 1.4 |
| **Helper / Caption** | 12–13 px | 400 (Normal) | `text-xs font-normal text-slate-500` | 1.4 |

---

## 3. Aturan Ketat Tipografi & Penulisan

1. **Penggunaan Font Weight**:
   - `400` untuk teks isi (body), paragraf, isi tabel, deskripsi.
   - `500` untuk label formulir, menu navigasi, badge kecil.
   - `600` untuk judul kartu (card title), subjudul, dan section heading.
   - `700` untuk heading halaman utama dan angka statistik dashboard.
   - **Dilarang keras** menggunakan font weight `800` (Extra Bold) atau `900` (Black) agar visual tidak terkesan kaku/berat.
2. **Line Height (Kerapatan Baris)**:
   - Wajib menggunakan `line-height: 1.5` hingga `1.7` (`leading-normal` sampai `leading-relaxed`) pada semua paragraf dan blok teks agar nyaman dibaca.
3. **Huruf Kapital (Uppercase)**:
   - Hindari teks full UPPERCASE pada judul, tombol, atau navigasi.
   - Gunakan format **Title Case** atau **Sentence case**. UPPERCASE hanya diizinkan untuk akronim resmi sekolah (misal: "NISN", "NIP", "PPDB", "SPP") dan badge status ringkas 2–3 huruf.
4. **Sudut & Ruang (Corner Radius & Spacing)**:
   - Card, input field, dan button menggunakan `rounded-lg` (8px) atau `rounded-xl` (12px) untuk nuansa modern yang lembut.
   - Spacing konsisten menggunakan kelipatan 4px / 8px (Tailwind standard spacing).

