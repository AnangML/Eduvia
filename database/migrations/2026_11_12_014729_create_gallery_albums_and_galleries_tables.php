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
        Schema::create('gallery_albums', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('description')->nullable();
            $table->string('cover_image', 255)->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('album_id')->nullable()->constrained('gallery_albums')->cascadeOnDelete();
            $table->string('title', 255)->nullable();
            $table->string('image_path', 255);
            $table->text('caption')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->index('album_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('galleries');
        Schema::dropIfExists('gallery_albums');
    }
};
