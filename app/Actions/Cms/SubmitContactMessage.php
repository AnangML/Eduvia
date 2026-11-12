<?php

namespace App\Actions\Cms;

use App\Models\ContactMessage;

class SubmitContactMessage
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): ContactMessage
    {
        return ContactMessage::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'subject' => $data['subject'],
            'message' => $data['message'],
        ]);
    }
}
