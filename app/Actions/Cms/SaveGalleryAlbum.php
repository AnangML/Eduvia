<?php

namespace App\Actions\Cms;

use App\Actions\Audit\RecordAuditLog;
use App\Models\Gallery;
use App\Models\GalleryAlbum;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SaveGalleryAlbum
{
    /**
     * @param  array<string, mixed>  $data
     * @param  array<int, array<string, mixed>>  $photos
     */
    public function execute(array $data, array $photos = [], ?GalleryAlbum $album = null, ?User $actor = null): GalleryAlbum
    {
        $oldValues = $album ? $album->toArray() : [];

        $baseSlug = Str::slug($data['title']);
        $slug = $baseSlug;
        $counter = 1;

        $query = GalleryAlbum::where('slug', $slug);
        if ($album) {
            $query->where('id', '!=', $album->id);
        }

        while ($query->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
            $query = GalleryAlbum::where('slug', $slug);
            if ($album) {
                $query->where('id', '!=', $album->id);
            }
        }

        $coverImage = $album?->cover_image;
        if (isset($data['cover_file']) && $data['cover_file'] instanceof UploadedFile) {
            $uploaded = $data['cover_file']->store('galleries/covers', 'public');
            $coverImage = Storage::url($uploaded);
        } elseif (array_key_exists('cover_image', $data)) {
            $coverImage = $data['cover_image'];
        }

        $album = $album ?? new GalleryAlbum;
        $album->fill([
            'title' => $data['title'],
            'slug' => $slug,
            'description' => $data['description'] ?? null,
            'cover_image' => $coverImage,
            'order' => $data['order'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
        ]);
        $album->save();

        if (! empty($photos)) {
            foreach ($photos as $photoData) {
                Gallery::create([
                    'album_id' => $album->id,
                    'title' => $photoData['title'] ?? null,
                    'image_path' => $photoData['image_path'],
                    'caption' => $photoData['caption'] ?? null,
                    'order' => $photoData['order'] ?? 0,
                ]);
            }
        }

        if ($actor) {
            app(RecordAuditLog::class)->execute(
                model: $album,
                event: empty($oldValues) ? 'created' : 'updated',
                oldValues: $oldValues,
                newValues: $album->fresh()->toArray(),
                userId: $actor->id
            );
        }

        return $album;
    }
}
