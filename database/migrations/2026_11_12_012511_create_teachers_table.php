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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('nip', 50)->nullable()->unique();
            $table->string('nuptk', 50)->nullable()->index();
            $table->string('name', 255);
            $table->string('gender', 10)->index(); // 'L' (Laki-laki), 'P' (Perempuan)
            $table->string('phone_number', 25)->nullable();
            $table->text('address')->nullable();
            $table->string('employment_status', 50)->default('PNS'); // PNS, PPPK, Honorer, GTY
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
