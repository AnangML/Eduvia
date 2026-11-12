<?php

namespace App\Actions\Cms;

use App\Actions\Audit\RecordAuditLog;
use App\Models\Facility;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SaveFacility
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, ?Facility $facility = null, ?User $actor = null): Facility
    {
        $oldValues = $facility ? $facility->toArray() : [];

        $baseSlug = Str::slug($data['name']);
        $slug = $baseSlug;
        $counter = 1;

        $query = Facility::where('slug', $slug);
        if ($facility) {
            $query->where('id', '!=', $facility->id);
        }

        while ($query->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
            $query = Facility::where('slug', $slug);
            if ($facility) {
                $query->where('id', '!=', $facility->id);
            }
        }

        $imagePath = $facility?->image_path;
        if (isset($data['image_file']) && $data['image_file'] instanceof UploadedFile) {
            $uploaded = $data['image_file']->store('facilities', 'public');
            $imagePath = Storage::url($uploaded);
        } elseif (array_key_exists('image_path', $data)) {
            $imagePath = $data['image_path'];
        }

        $facility = $facility ?? new Facility;
        $facility->fill([
            'name' => $data['name'],
            'slug' => $slug,
            'description' => $data['description'] ?? null,
            'image_path' => $imagePath,
            'order' => $data['order'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
        ]);
        $facility->save();

        if ($actor) {
            app(RecordAuditLog::class)->execute(
                model: $facility,
                event: empty($oldValues) ? 'created' : 'updated',
                oldValues: $oldValues,
                newValues: $facility->fresh()->toArray(),
                userId: $actor->id
            );
        }

        return $facility;
    }
}
