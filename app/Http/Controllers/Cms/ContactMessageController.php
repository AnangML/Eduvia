<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(): Response
    {
        $messages = ContactMessage::orderBy('is_read', 'asc')
            ->latest()
            ->paginate(15);

        return Inertia::render('Cms/Messages/Index', [
            'messages' => $messages,
        ]);
    }

    public function markAsRead(ContactMessage $message): RedirectResponse
    {
        $message->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return back()->with('success', 'Pesan ditandai sebagai sudah dibaca.');
    }

    public function destroy(ContactMessage $message): RedirectResponse
    {
        $message->delete();

        return back()->with('success', 'Pesan berhasil dihapus.');
    }
}
