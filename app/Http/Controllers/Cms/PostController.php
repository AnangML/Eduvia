<?php

namespace App\Http\Controllers\Cms;

use App\Actions\Audit\RecordAuditLog;
use App\Actions\Cms\CreatePost;
use App\Actions\Cms\UpdatePost;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\PostRequest;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $category = $request->string('category')->toString();
        $status = $request->string('status')->toString();
        $search = $request->string('search')->toString();

        $query = Post::with('author:id,name')->latest();

        if ($category) {
            $query->where('category', $category);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('excerpt', 'ilike', "%{$search}%");
            });
        }

        $posts = $query->paginate(10)->withQueryString();

        return Inertia::render('Cms/Posts/Index', [
            'posts' => $posts,
            'filters' => [
                'category' => $category,
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    public function store(PostRequest $request, CreatePost $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user());

        return back()->with('success', 'Konten berhasil ditambahkan.');
    }

    public function update(PostRequest $request, Post $post, UpdatePost $action): RedirectResponse
    {
        $action->execute($post, $request->validated(), $request->user());

        return back()->with('success', 'Konten berhasil diperbarui.');
    }

    public function destroy(Request $request, Post $post): RedirectResponse
    {
        $oldData = $post->toArray();
        $post->delete();

        if ($request->user()) {
            app(RecordAuditLog::class)->execute(
                model: $post,
                event: 'deleted',
                oldValues: $oldData,
                newValues: [],
                userId: $request->user()->id
            );
        }

        return back()->with('success', 'Konten berhasil dihapus.');
    }
}
