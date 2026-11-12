<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ppdb_applicants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('period_id')->constrained('ppdb_periods')->restrictOnDelete();
            $table->foreignId('track_id')->constrained('ppdb_tracks')->restrictOnDelete();
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->foreignId('second_department_id')->nullable()->constrained('departments')->nullOnDelete();

            // Identitas & Domisili
            $table->string('registration_number', 50)->unique();
            $table->string('nisn', 10)->index();
            $table->string('nik', 16)->index();
            $table->string('full_name', 255);
            $table->string('gender', 1);
            $table->string('birth_place', 100);
            $table->date('birth_date')->index();
            $table->string('religion', 50)->nullable();
            $table->text('address');
            $table->string('province', 100)->index();
            $table->string('city', 100)->index();
            $table->string('district', 100)->index();
            $table->string('village', 100)->nullable();
            $table->string('phone_number', 25);
            $table->string('email', 255)->nullable();

            // Skor & Penilaian Eliminasi
            $table->smallInteger('distance_zone_score')->default(0);
            $table->decimal('average_report_score', 5, 2)->default(0.00);
            $table->decimal('final_score', 8, 2)->default(0.00)->index();
            $table->integer('ranking')->nullable()->index();

            // Asal Sekolah
            $table->string('previous_school_name', 255);
            $table->text('previous_school_address')->nullable();
            $table->smallInteger('graduation_year');

            // Data Orang Tua / Wali
            $table->string('father_name', 255)->nullable();
            $table->string('father_occupation', 100)->nullable();
            $table->string('father_phone', 25)->nullable();
            $table->string('mother_name', 255)->nullable();
            $table->string('mother_occupation', 100)->nullable();
            $table->string('mother_phone', 25)->nullable();
            $table->string('guardian_name', 255)->nullable();
            $table->string('guardian_occupation', 100)->nullable();
            $table->string('guardian_phone', 25)->nullable();
            $table->string('parent_income', 50)->nullable();

            // Status & Verifikasi
            $table->string('verification_status', 30)->default('pending')->index();
            $table->text('verification_notes')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();

            $table->string('selection_status', 30)->default('unprocessed')->index();
            $table->string('re_registration_status', 30)->default('not_registered')->index();
            $table->foreignId('converted_to_student_id')->nullable()->unique()->constrained('students')->nullOnDelete();
            $table->timestamp('converted_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['nisn', 'birth_date']);
            $table->index(['period_id', 'track_id']);
        });

        Schema::create('ppdb_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_id')->constrained('ppdb_applicants')->cascadeOnDelete();
            $table->string('document_type', 50)->index();
            $table->string('file_path', 255);
            $table->string('original_name', 255);
            $table->integer('file_size');
            $table->string('mime_type', 100);
            $table->string('status', 30)->default('pending')->index();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('applicant_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppdb_documents');
        Schema::dropIfExists('ppdb_applicants');
    }
};
