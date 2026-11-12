<?php

namespace App\Http\Controllers\Cms;

use App\Actions\Audit\RecordAuditLog;
use App\Actions\Cms\SaveGalleryAlbum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\GalleryAlbumRequest;
use App\Models\Gallery;
use App\Models\GalleryAlbum;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        $albums = GalleryAlbum::with(['galleries' => fn ($q) => $q->orderBy('order', 'asc')])
            ->orderBy('order', 'asc')
            ->paginate(10);

        return Inertia::render('Cms/Galleries/Index', [
            'albums' => $albums,
        ]);
    }

    public function store(GalleryAlbumRequest $request, SaveGalleryAlbum $action): RedirectResponse
    {
        $action->execute(
            data: $request->safe()->except('photos'),
            photos: $request->input('photos', []),
            album: null,
            actor: $request->user()
        );

        return back()->with('success', 'Album galeri berhasil ditambahkan.');
    }

    public function update(GalleryAlbumRequest $request, GalleryAlbum $album, SaveGalleryAlbum $action): RedirectResponse
    {
        $action->execute(
            data: $request->safe()->except('photos'),
            photos: $request->input('photos', []),
            album: $album,
            actor: $request->user()
        );

        return back()->with('success', 'Album galeri berhasil diperbarui.');
    }

    public function destroy(Request $request, GalleryAlbum $album): RedirectResponse
    {
        $oldData = $album->toArray();
        $album->delete();

        if ($request->user()) {
            app(RecordAuditLog::class)->execute(
                model: $album,
                event: 'deleted',
                oldValues: $oldData,
                newValues: [],
                userId: $request->user()->id
            );
        }

        return back()->with('success', 'Album galeri berhasil dihapus.');
    }

    public function deletePhoto(Request $request, Gallery $gallery): RedirectResponse
    {
        $gallery->delete();

        return back()->with('success', 'Foto galeri berhasil dihapus.');
    }

    public function uploadPhotos(Request $request, GalleryAlbum $album): RedirectResponse
    {
        $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string'],
            'image_file' => ['nullable', 'image', 'max:5120', 'mimes:jpeg,png,jpg,webp'],
            'image_path' => ['nullable', 'string', 'max:255'],
        ]);

        $imagePath = $request->input('image_path');
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('galleries/photos', 'public');
            $imagePath = Storage::url($path);
        }

        if (! $imagePath) {
            return back()->withErrors(['image_file' => 'Silakan pilih file foto atau masukkan tautan URL gambar.']);
        }

        $lastOrder = (int) ($album->galleries()->max('order') ?? 0);

        Gallery::create([
            'album_id' => $album->id,
            'title' => $request->input('title'),
            'caption' => $request->input('caption'),
            'image_path' => $imagePath,
            'order' => $lastOrder + 1,
        ]);

        return back()->with('success', 'Foto berhasil ditambahkan ke album.');
    }
}
