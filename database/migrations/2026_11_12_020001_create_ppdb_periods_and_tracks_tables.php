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
        Schema::create('ppdb_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->string('name', 255);
            $table->string('slug', 255)->unique();
            $table->date('start_date');
            $table->date('end_date');
            $table->date('announcement_date')->nullable();
            $table->date('re_registration_start')->nullable();
            $table->date('re_registration_end')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('academic_year_id');
            $table->index(['start_date', 'end_date']);
        });

        Schema::create('ppdb_tracks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('period_id')->constrained('ppdb_periods')->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('code', 50);
            $table->integer('quota')->default(0);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();

            $table->index('period_id');
            $table->index('code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppdb_tracks');
        Schema::dropIfExists('ppdb_periods');
    }
};
