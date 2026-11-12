<?php

namespace App\Actions\Cms;

use App\Actions\Audit\RecordAuditLog;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UpdatePost
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Post $post, array $data, ?User $actor = null): Post
    {
        $oldValues = $post->toArray();

        if (isset($data['title']) && $data['title'] !== $post->title) {
            $baseSlug = Str::slug($data['title']);
            $slug = $baseSlug;
            $counter = 1;

            while (Post::withTrashed()->where('slug', $slug)->where('id', '!=', $post->id)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $post->slug = $slug;
        }

        $status = $data['status'] ?? $post->status;
        $publishedAt = $data['published_at'] ?? $post->published_at;

        if ($status === 'published' && ! $publishedAt) {
            $publishedAt = now();
        }

        $featuredImage = $post->featured_image;
        if (isset($data['image_file']) && $data['image_file'] instanceof UploadedFile) {
            $path = $data['image_file']->store('posts', 'public');
            $featuredImage = Storage::url($path);
        } elseif (array_key_exists('featured_image', $data)) {
            $featuredImage = $data['featured_image'];
        }

        $post->fill([
            'category' => $data['category'] ?? $post->category,
            'title' => $data['title'] ?? $post->title,
            'excerpt' => $data['excerpt'] ?? $post->excerpt,
            'content' => $data['content'] ?? $post->content,
            'featured_image' => $featuredImage,
            'status' => $status,
            'published_at' => $publishedAt,
            'event_date' => $data['event_date'] ?? $post->event_date,
        ]);

        $post->save();

        if ($actor) {
            app(RecordAuditLog::class)->execute(
                model: $post,
                event: 'updated',
                oldValues: $oldValues,
                newValues: $post->fresh()->toArray(),
                userId: $actor->id
            );
        }

        return $post;
    }
}
