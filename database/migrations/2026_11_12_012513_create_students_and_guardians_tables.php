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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('nisn', 20)->unique();
            $table->string('nis', 20)->nullable()->index();
            $table->string('nik', 20)->nullable()->index();
            $table->string('full_name', 255);
            $table->string('gender', 10)->index(); // 'L' (Laki-laki), 'P' (Perempuan)
            $table->string('birth_place', 100)->nullable();
            $table->date('birth_date')->nullable();
            $table->string('phone_number', 25)->nullable();
            $table->text('address')->nullable();
            $table->string('status', 20)->default('active')->index(); // active, graduated, moved, dropped
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('guardians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('nik', 20)->nullable()->index();
            $table->string('name', 255);
            $table->string('relationship_type', 20)->default('father'); // father, mother, guardian
            $table->string('phone_number', 25)->nullable()->index();
            $table->string('occupation', 100)->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('guardian_student', function (Blueprint $table) {
            $table->foreignId('guardian_id')->constrained('guardians')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('relationship', 20)->default('parent'); // father, mother, guardian
            $table->boolean('is_emergency_contact')->default(false);

            $table->primary(['guardian_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guardian_student');
        Schema::dropIfExists('guardians');
        Schema::dropIfExists('students');
    }
};
