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
        Schema::table('teachers', function (Blueprint $table) {
            $table->boolean('is_public')->default(false)->index();
            $table->string('photo', 255)->nullable();
            $table->string('title_degree', 100)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropIndex(['is_public']);
            $table->dropColumn(['is_public', 'photo', 'title_degree']);
        });
    }
};
