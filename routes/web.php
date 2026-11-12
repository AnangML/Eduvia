<?php

use App\Http\Controllers\Academic\AcademicYearController;
use App\Http\Controllers\Academic\ClassroomController;
use App\Http\Controllers\Academic\StudentController;
use App\Http\Controllers\Academic\SubjectController;
use App\Http\Controllers\Academic\TeacherController;
use App\Http\Controllers\Academic\TeachingAssignmentController;
use App\Http\Controllers\Cms\ContactMessageController;
use App\Http\Controllers\Cms\FacilityController;
use App\Http\Controllers\Cms\GalleryController;
use App\Http\Controllers\Cms\PostController;
use App\Http\Controllers\Cms\SchoolProfileController;
use App\Http\Controllers\Ppdb\PpdbAdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\PpdbPublicController;
use App\Http\Controllers\Public\PublicController;
use App\Http\Controllers\Public\PublicPostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Profile & Information Routes (Phase 2)
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/tentang', [PublicController::class, 'about'])->name('public.about');
Route::get('/fasilitas', [PublicController::class, 'facilities'])->name('public.facilities');
Route::get('/guru', [PublicController::class, 'teachers'])->name('public.teachers');
Route::get('/galeri', [PublicController::class, 'galleries'])->name('public.galleries');
Route::get('/kontak', [PublicController::class, 'contact'])->name('public.contact');
Route::post('/kontak', [PublicController::class, 'submitContact'])->name('public.contact.submit');

// Public Posts (News, Announcements, Achievements, Agenda)
Route::get('/berita', [PublicPostController::class, 'index'])->name('public.posts.index');
Route::get('/berita/{slug}', [PublicPostController::class, 'show'])->name('public.posts.show');

// PPDB Online Public Routes (Phase 3)
Route::prefix('ppdb')->name('public.ppdb.')->group(function () {
    Route::get('/', [PpdbPublicController::class, 'index'])->name('index');
    Route::get('/daftar', [PpdbPublicController::class, 'register'])->name('register');
    Route::post('/daftar', [PpdbPublicController::class, 'store'])->name('store');
    Route::get('/sukses/{registration_number}', [PpdbPublicController::class, 'success'])->name('success');
    Route::get('/cek-status', [PpdbPublicController::class, 'checkStatus'])->name('check-status');
    Route::post('/cek-status/{registration_number}/unggah-ulang', [PpdbPublicController::class, 'reuploadDocument'])->name('reupload');
});

// Authenticated Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Protected settings route for super_admin
Route::middleware(['auth', 'role:super_admin'])->group(function () {
    Route::get('/settings', function () {
        return response()->json(['status' => 'authorized']);
    })->name('settings.index');
});

// Phase 1: Master Data Akademik
Route::middleware(['auth', 'role_or_permission:super_admin|admin|manage_academic_years'])
    ->prefix('academic')
    ->name('academic.')
    ->group(function () {
        // Academic Years & Semesters
        Route::get('years', [AcademicYearController::class, 'index'])->name('years.index');
        Route::post('years', [AcademicYearController::class, 'store'])->name('years.store');
        Route::post('years/{academic_year}/set-active', [AcademicYearController::class, 'setActive'])->name('years.set-active');

        // Classrooms
        Route::get('classrooms', [ClassroomController::class, 'index'])->name('classrooms.index');
        Route::post('classrooms', [ClassroomController::class, 'store'])->name('classrooms.store');
        Route::put('classrooms/{classroom}', [ClassroomController::class, 'update'])->name('classrooms.update');
        Route::delete('classrooms/{classroom}', [ClassroomController::class, 'destroy'])->name('classrooms.destroy');

        // Teachers
        Route::get('teachers', [TeacherController::class, 'index'])->name('teachers.index');
        Route::post('teachers', [TeacherController::class, 'store'])->name('teachers.store');
        Route::match(['put', 'post'], 'teachers/{teacher}', [TeacherController::class, 'update'])->name('teachers.update');
        Route::delete('teachers/{teacher}', [TeacherController::class, 'destroy'])->name('teachers.destroy');
        Route::post('teachers/{teacher}/generate-user', [TeacherController::class, 'generateUser'])->name('teachers.generate-user');
        Route::post('teachers/{teacher}/toggle-public', [TeacherController::class, 'togglePublic'])->name('teachers.toggle-public');
        Route::post('teachers/import', [TeacherController::class, 'import'])->name('teachers.import');

        // Students
        Route::get('students', [StudentController::class, 'index'])->name('students.index');
        Route::post('students', [StudentController::class, 'store'])->name('students.store');
        Route::put('students/{student}', [StudentController::class, 'update'])->name('students.update');
        Route::delete('students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');
        Route::post('students/{student}/transfer', [StudentController::class, 'transfer'])->name('students.transfer');
        Route::post('students/{student}/generate-user', [StudentController::class, 'generateUser'])->name('students.generate-user');
        Route::post('students/import', [StudentController::class, 'import'])->name('students.import');

        // Subjects
        Route::get('subjects', [SubjectController::class, 'index'])->name('subjects.index');
        Route::post('subjects', [SubjectController::class, 'store'])->name('subjects.store');
        Route::put('subjects/{subject}', [SubjectController::class, 'update'])->name('subjects.update');
        Route::delete('subjects/{subject}', [SubjectController::class, 'destroy'])->name('subjects.destroy');

        // Teaching Assignments
        Route::get('teaching-assignments', [TeachingAssignmentController::class, 'index'])->name('teaching-assignments.index');
        Route::post('teaching-assignments', [TeachingAssignmentController::class, 'store'])->name('teaching-assignments.store');
        Route::delete('teaching-assignments/{teaching_assignment}', [TeachingAssignmentController::class, 'destroy'])->name('teaching-assignments.destroy');
    });

// Phase 2: CMS Profil Sekolah & Berita
Route::middleware(['auth', 'role_or_permission:super_admin|admin|manage_school_profile|manage_announcements'])
    ->prefix('cms')
    ->name('cms.')
    ->group(function () {
        // School Profile
        Route::get('school-profile', [SchoolProfileController::class, 'index'])->name('school-profile.index');
        Route::match(['put', 'post'], 'school-profile', [SchoolProfileController::class, 'update'])->name('school-profile.update');

        // Posts (News, Announcements, Achievements, Agenda)
        Route::get('posts', [PostController::class, 'index'])->name('posts.index');
        Route::post('posts', [PostController::class, 'store'])->name('posts.store');
        Route::match(['put', 'post'], 'posts/{post}', [PostController::class, 'update'])->name('posts.update');
        Route::delete('posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');

        // Facilities
        Route::get('facilities', [FacilityController::class, 'index'])->name('facilities.index');
        Route::post('facilities', [FacilityController::class, 'store'])->name('facilities.store');
        Route::match(['put', 'post'], 'facilities/{facility}', [FacilityController::class, 'update'])->name('facilities.update');
        Route::delete('facilities/{facility}', [FacilityController::class, 'destroy'])->name('facilities.destroy');

        // Galleries & Albums
        Route::get('galleries', [GalleryController::class, 'index'])->name('galleries.index');
        Route::post('galleries', [GalleryController::class, 'store'])->name('galleries.store');
        Route::match(['put', 'post'], 'galleries/{album}', [GalleryController::class, 'update'])->name('galleries.update');
        Route::delete('galleries/{album}', [GalleryController::class, 'destroy'])->name('galleries.destroy');
        Route::post('galleries/{album}/photos', [GalleryController::class, 'uploadPhotos'])->name('galleries.photos.store');
        Route::delete('galleries/photos/{gallery}', [GalleryController::class, 'deletePhoto'])->name('galleries.photos.destroy');

        // Contact Messages
        Route::get('messages', [ContactMessageController::class, 'index'])->name('messages.index');
        Route::post('messages/{message}/read', [ContactMessageController::class, 'markAsRead'])->name('messages.read');
        Route::delete('messages/{message}', [ContactMessageController::class, 'destroy'])->name('messages.destroy');
    });

// Phase 3: PPDB Admin & Panitia Panel
Route::middleware(['auth', 'role_or_permission:super_admin|admin|manage_ppdb_periods'])
    ->prefix('admin/ppdb')
    ->name('ppdb.')
    ->group(function () {
        Route::get('/', [PpdbAdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/periods', [PpdbAdminController::class, 'periods'])->name('periods.index');
        Route::post('/periods', [PpdbAdminController::class, 'storePeriod'])->name('periods.store');
        Route::put('/periods/{period}', [PpdbAdminController::class, 'updatePeriod'])->name('periods.update');
        Route::post('/periods/{period}/toggle-active', [PpdbAdminController::class, 'togglePeriodActive'])->name('periods.toggle-active');

        Route::get('/applicants', [PpdbAdminController::class, 'applicants'])->name('applicants.index');
        Route::get('/applicants/{applicant}', [PpdbAdminController::class, 'showApplicant'])->name('applicants.show');
        Route::post('/applicants/{applicant}/verify', [PpdbAdminController::class, 'verifyApplicant'])->name('applicants.verify');

        Route::get('/selection', [PpdbAdminController::class, 'selection'])->name('selection.index');
        Route::post('/selection/run', [PpdbAdminController::class, 'runSelection'])->name('selection.run');

        Route::get('/re-registration', [PpdbAdminController::class, 'reRegistration'])->name('re-registration.index');
        Route::post('/applicants/{applicant}/toggle-re-registration', [PpdbAdminController::class, 'toggleReRegistration'])->name('applicants.toggle-re-registration');
        Route::post('/applicants/{applicant}/convert', [PpdbAdminController::class, 'convertApplicant'])->name('applicants.convert');

        Route::get('/export', [PpdbAdminController::class, 'export'])->name('export');
    });

require __DIR__.'/auth.php';
