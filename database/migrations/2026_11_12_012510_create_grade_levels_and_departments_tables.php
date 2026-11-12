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
        Schema::create('grade_levels', function (Blueprint $table) {
            $table->id();
            $table->string('educational_level', 20)->default('SMA/SMK')->index();
            $table->smallInteger('level_number')->index(); // 10, 11, 12
            $table->string('name', 50); // e.g., 'Kelas 10', 'Kelas 11', 'Kelas 12'
            $table->timestamps();

            $table->unique(['educational_level', 'level_number']);
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();
            $table->string('name', 100);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
        Schema::dropIfExists('grade_levels');
    }
};
