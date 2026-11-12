<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicPostController extends Controller
{
    /**
     * @return array<string, mixed>
     */
    protected function getSchoolProfile(): array
    {
        return [
            'school_name' => Setting::get('school_name', 'SMK Eduvia'),
            'school_tagline' => Setting::get('school_tagline', 'Membentuk Generasi Cerdas, Unggul, dan Berakhlak Mulia'),
            'school_logo' => Setting::get('school_logo'),
        ];
    }

    public function index(Request $request): Response
    {
        $category = $request->string('category')->toString();
        $search = $request->string('search')->toString();

        $query = Post::with('author:id,name')
            ->published()
            ->latest('published_at');

        if ($category && in_array($category, ['news', 'announcement', 'achievement', 'agenda'])) {
            $query->where('category', $category);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('excerpt', 'ilike', "%{$search}%")
                    ->orWhere('content', 'ilike', "%{$search}%");
            });
        }

        $posts = $query->paginate(9)->withQueryString();

        $categoryCounts = [
            'all' => Post::published()->count(),
            'news' => Post::published()->where('category', 'news')->count(),
            'announcement' => Post::published()->where('category', 'announcement')->count(),
            'achievement' => Post::published()->where('category', 'achievement')->count(),
            'agenda' => Post::published()->where('category', 'agenda')->count(),
        ];

        return Inertia::render('Public/Posts/Index', [
            'profile' => $this->getSchoolProfile(),
            'posts' => $posts,
            'filters' => [
                'category' => $category,
                'search' => $search,
            ],
            'categoryCounts' => $categoryCounts,
        ]);
    }

    public function show(string $slug): Response
    {
        $post = Post::with('author:id,name')
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view count
        $post->increment('views_count');

        // Related posts
        $relatedPosts = Post::published()
            ->where('id', '!=', $post->id)
            ->where('category', $post->category)
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('Public/Posts/Show', [
            'profile' => $this->getSchoolProfile(),
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }
}
