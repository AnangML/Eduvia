<?php

namespace App\Actions\Cms;

use App\Actions\Audit\RecordAuditLog;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CreatePost
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, ?User $actor = null): Post
    {
        $baseSlug = Str::slug($data['title']);
        $slug = $baseSlug;
        $counter = 1;

        while (Post::withTrashed()->where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $status = $data['status'] ?? 'draft';
        $publishedAt = $data['published_at'] ?? null;

        if ($status === 'published' && ! $publishedAt) {
            $publishedAt = now();
        }

        $featuredImage = $data['featured_image'] ?? null;
        if (isset($data['image_file']) && $data['image_file'] instanceof UploadedFile) {
            $path = $data['image_file']->store('posts', 'public');
            $featuredImage = Storage::url($path);
        }

        $post = Post::create([
            'author_id' => $actor?->id,
            'category' => $data['category'],
            'title' => $data['title'],
            'slug' => $slug,
            'excerpt' => $data['excerpt'] ?? null,
            'content' => $data['content'],
            'featured_image' => $featuredImage,
            'status' => $status,
            'published_at' => $publishedAt,
            'event_date' => $data['event_date'] ?? null,
        ]);

        if ($actor) {
            app(RecordAuditLog::class)->execute(
                model: $post,
                event: 'created',
                oldValues: [],
                newValues: $post->toArray(),
                userId: $actor->id
            );
        }

        return $post;
    }
}
