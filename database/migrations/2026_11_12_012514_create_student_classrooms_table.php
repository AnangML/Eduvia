<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_classrooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('classroom_id')->constrained('classrooms')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->string('status', 20)->default('active')->index(); // active, transferred, graduated
            $table->timestamp('transferred_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['classroom_id', 'status']);
        });

        // Partial unique index: a student can have only ONE active classroom per academic year
        DB::statement("CREATE UNIQUE INDEX idx_unique_active_student_classroom ON student_classrooms (student_id, academic_year_id) WHERE status = 'active'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_classrooms');
    }
};
