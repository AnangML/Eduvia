<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Gallery;
use App\Models\GalleryAlbum;
use App\Models\Post;
use App\Models\Setting;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SchoolProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. School Profile Settings
        $profileSettings = [
            'school_name' => 'SMK Eduvia Nusantara',
            'school_tagline' => 'Membentuk Generasi Cerdas, Unggul, dan Berakhlak Mulia',
            'school_description' => 'Institusi pendidikan kejuruan dan sains unggulan yang mengintegrasikan penguasaan teknologi mutakhir, kedisiplinan industri, serta nilai luhur budi pekerti.',
            'school_vision' => 'Menjadi institusi pelopor keunggulan akademik dan vokasi berbasis teknologi yang berdaya saing global dan berlandaskan akhlak mulia.',
            'school_mission' => "1. Menyelenggarakan pendidikan berkualitas berbasis kurikulum industri terkini.\n2. Menumbuhkan integritas, jiwa kepemimpinan, dan etika profesional.\n3. Menyediakan laboratorium dan fasilitas praktikum berstandar nasional.\n4. Memperluas kemitraan strategis magang dan penyerapan kerja alumni.",
            'school_history' => 'Didirikan pada tahun 2012, SMK Eduvia Nusantara berkembang pesat menjadi salah satu sekolah kejuruan rujukan nasional dengan ratusan prestasi di bidang sains terapan, teknologi perangkat lunak, dan kewirausahaan mandiri.',
            'school_address' => 'Jl. Edukasi Terpadu No. 88, Cibubur, Jakarta Timur',
            'school_phone' => '(021) 8899-0123 / 0812-9900-8800',
            'school_email' => 'info@eduvia.sch.id',
            'school_map_embed' => '',
            'social_instagram' => 'https://instagram.com/eduvianusantara',
            'social_facebook' => 'https://facebook.com/eduvianusantara',
            'social_youtube' => 'https://youtube.com/@eduvianusantara',
            'principal_name' => 'Drs. H. Hendra Setiawan, M.Pd.',
            'principal_title' => 'Kepala Sekolah SMK Eduvia Nusantara',
            'principal_photo' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
            'principal_welcome' => "Assalamu’alaikum Warahmatullahi Wabarakatuh,\n\nSelamat datang di gerbang digital resmi SMK Eduvia Nusantara. Kami meyakini bahwa pendidikan sejati tidak hanya mengasah kecerdasan intelektual dan keahlian vokasional, melainkan juga menanamkan ketangguhan karakter, kejujuran budi pekerti, serta kesiapan menyongsong disrupsi peradaban global.\n\nDidukung tenaga pendidik berpengalaman, sarana laboratorium modern berbasis standar industri, serta kurikulum yang adaptif, kami berkomitmen mendampingi setiap peserta didik bertumbuh menjadi insan mandiri, berdaya saing internasional, dan berakhlak mulia. Mari melangkah bersama menuju masa depan gemilang.",
        ];

        foreach ($profileSettings as $key => $value) {
            Setting::set($key, $value, 'school', 'string');
        }

        $superAdmin = User::role('super_admin')->first();

        // 2. Posts (News, Announcements, Achievements, Agenda)
        $postsData = [
            [
                'title' => 'SMK Eduvia Sukses Menyelenggarakan Pameran Karya Vokasi & Expo Industri 2026',
                'category' => 'news',
                'excerpt' => 'Ratusan karya inovatif siswa RPL, TKJ, dan AKL dipamerkan kepada perwakilan puluhan perusahaan mitra DUDI ternama.',
                'content' => "SMK Eduvia Nusantara kembali membuktikan komitmennya dalam mencetak lulusan siap kerja melalui perhelatan Pameran Karya Vokasi 2026.\n\nKegiatan ini dihadiri oleh jajaran pimpinan dinas pendidikan, praktisi industri digital, serta perwakilan universitas mitra. Sebanyak 45 proyek aplikasi web, sistem IoT keamanan gedung, dan laporan keuangan digital karya siswa kelas XII dipresentasikan dengan antusiasme tinggi.",
                'featured_image' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Siswa Rekayasa Perangkat Lunak Raih Medali Emas LKS Web Technology Tingkat Nasional',
                'category' => 'achievement',
                'excerpt' => 'Prestasi membanggakan kembali dipersembahkan oleh ananda Muhammad Farhan yang sukses menyabet Juara 1 Nasional.',
                'content' => "Keluarga besar SMK Eduvia Nusantara mengucapkan selamat dan apresiasi setinggi-tingginya kepada ananda Muhammad Farhan (Kelas XII RPL 1) atas raihan Medali Emas pada ajang Lomba Kompetensi Siswa (LKS) Nasional 2026 bidang Web Technology.\n\nKeberhasilan ini membuktikan kualitas pembinaan bakat teknologi di sekolah kami mampu bersaing di kancah nasional.",
                'featured_image' => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Pengumuman Pelaksanaan Penilaian Tengah Semester (PTS) Genap 2026/2027',
                'category' => 'announcement',
                'excerpt' => 'Diberitahukan kepada seluruh siswa kelas X, XI, dan XII mengenai tata tertib dan jadwal pelaksanaan PTS Genap.',
                'content' => "Kepada Yth. Bapak/Ibu Wali Murid dan Siswa-Siswi SMK Eduvia Nusantara,\n\nDengan ini kami sampaikan bahwa Penilaian Tengah Semester (PTS) Genap Tahun Ajaran 2026/2027 akan diselenggarakan mulai tanggal 18 Maret 2027 secara daring melalui platform Eduvia.\n\nHarap memastikan kehadiran siswa 100% dan mempersiapkan perangkat belajar secara prima.",
                'featured_image' => 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'published_at' => now()->subDays(8),
            ],
            [
                'title' => 'Workshop Sinkronisasi Kurikulum Berbasis AI & Cloud Computing Bersama Mitra Industri',
                'category' => 'agenda',
                'excerpt' => 'Diskusi meja bundar penyelarasan kompetensi materi kejuruan agar selalu adaptif terhadap perkembangan dunia kerja nyata.',
                'content' => "Dalam rangka menyongsong era kecerdasan buatan, SMK Eduvia mengadakan workshop kurikulum bersama para Chief Technology Officer (CTO) mitra industri startup dan korporasi.\n\nKegiatan ini terbuka untuk guru produktif dan perwakilan siswa terpilih.",
                'featured_image' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'published_at' => now()->subDay(),
                'event_date' => now()->addDays(7),
            ],
        ];

        foreach ($postsData as $data) {
            $baseSlug = Str::slug($data['title']);
            Post::firstOrCreate(
                ['slug' => $baseSlug],
                array_merge($data, [
                    'author_id' => $superAdmin?->id,
                    'slug' => $baseSlug,
                ])
            );
        }

        // 3. Facilities
        $facilitiesData = [
            [
                'name' => 'Laboratorium Komputer Software & Jaringan',
                'slug' => 'laboratorium-komputer-software-dan-jaringan',
                'description' => 'Dilengkapi 40 unit PC workstation Core i7, gigabit ethernet, server virtualisasi, dan lisensi IDE software standar industri.',
                'image_path' => 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
                'order' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Perpustakaan & Ruang Baca Digital',
                'slug' => 'perpustakaan-dan-ruang-baca-digital',
                'description' => 'Ribuan koleksi buku fisik dan e-book referensi sains, ruang diskusi ber-AC yang nyaman, dan akses internet berkecepatan tinggi.',
                'image_path' => 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
                'order' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Studio Multimedia & Podcast Edukasi',
                'slug' => 'studio-multimedia-dan-podcast-edukasi',
                'description' => 'Fasilitas rekaman video pembelajaran, audio podcast, tata cahaya profesional, dan peralatan mixing broadcast.',
                'image_path' => 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
                'order' => 30,
                'is_active' => true,
            ],
            [
                'name' => 'Lapangan Olahraga Serbaguna & Aula Utama',
                'slug' => 'lapangan-olahraga-serbaguna-dan-aula-utama',
                'description' => 'Area olahraga basket, futsal, bulutangkis, serta aula serbaguna berkapasitas 800 orang untuk kegiatan wisuda dan seminar.',
                'image_path' => 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
                'order' => 40,
                'is_active' => true,
            ],
        ];

        foreach ($facilitiesData as $fac) {
            Facility::firstOrCreate(['slug' => $fac['slug']], $fac);
        }

        // 4. Gallery Albums & Photos
        $album1 = GalleryAlbum::firstOrCreate(
            ['slug' => 'upacara-peringatan-hari-kemerdekaan-ri'],
            [
                'title' => 'Upacara Peringatan Hari Kemerdekaan RI',
                'slug' => 'upacara-peringatan-hari-kemerdekaan-ri',
                'description' => 'Dokumentasi khidmat upacara pengibaran bendera merah putih oleh pasukan pengibar bendera (Paskibra) Eduvia.',
                'cover_image' => 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
                'order' => 10,
                'is_active' => true,
            ]
        );

        $photos1 = [
            [
                'image_path' => 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
                'title' => 'Pengibaran Sang Merah Putih',
                'caption' => 'Pasukan 17 dan 8 bersiap menaikkan bendera di hadapan seluruh peserta upacara.',
            ],
            [
                'image_path' => 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
                'title' => 'Apresiasi Guru dan Siswa Berprestasi',
                'caption' => 'Penyerahan piagam penghargaan kepada para peraih juara lomba sains dan vokasi.',
            ],
        ];

        foreach ($photos1 as $p) {
            Gallery::firstOrCreate(
                ['album_id' => $album1->id, 'image_path' => $p['image_path']],
                $p
            );
        }

        $album2 = GalleryAlbum::firstOrCreate(
            ['slug' => 'kunjungan-industri-ke-kantor-teknologi-global'],
            [
                'title' => 'Kunjungan Industri Siswa Jurusan RPL ke Kampus Teknologi',
                'slug' => 'kunjungan-industri-ke-kantor-teknologi-global',
                'description' => 'Mengenal secara langsung atmosfer kerja software engineer profesional dan arsitektur data center.',
                'cover_image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                'order' => 20,
                'is_active' => true,
            ]
        );

        $photos2 = [
            [
                'image_path' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                'title' => 'Sesi Diskusi Bersama Lead Engineer',
                'caption' => 'Siswa menyimak paparan tentang agile development dan best practice di industri software.',
            ],
            [
                'image_path' => 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
                'title' => 'Tur Fasilitas Ruang Kerja Modern',
                'caption' => 'Melihat lingkungan kerja kolaboratif yang inklusif dan memicu kreativitas.',
            ],
        ];

        foreach ($photos2 as $p) {
            Gallery::firstOrCreate(
                ['album_id' => $album2->id, 'image_path' => $p['image_path']],
                $p
            );
        }

        // 5. Update sample teachers with public visibility & degree title
        $teachers = Teacher::take(6)->get();
        $sampleDegrees = [
            'S.Kom., M.Kom.',
            'S.Pd., M.Pd.',
            'S.T., M.Eng.',
            'S.E., M.M.',
            'S.Pd.',
            'S.Kom.',
        ];

        foreach ($teachers as $idx => $teacher) {
            $teacher->update([
                'is_public' => true,
                'title_degree' => $sampleDegrees[$idx % count($sampleDegrees)],
            ]);
        }
    }
}
