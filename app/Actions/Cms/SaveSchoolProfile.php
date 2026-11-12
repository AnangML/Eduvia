<?php

namespace App\Actions\Cms;

use App\Actions\Audit\RecordAuditLog;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class SaveSchoolProfile
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, ?User $actor = null): void
    {
        if (isset($data['logo_file']) && $data['logo_file'] instanceof UploadedFile) {
            $path = $data['logo_file']->store('school', 'public');
            $data['school_logo'] = Storage::url($path);
        }

        if (isset($data['principal_photo_file']) && $data['principal_photo_file'] instanceof UploadedFile) {
            $path = $data['principal_photo_file']->store('school', 'public');
            $data['principal_photo'] = Storage::url($path);
        }
        $allowedKeys = [
            'school_name',
            'school_tagline',
            'school_logo',
            'school_description',
            'school_vision',
            'school_mission',
            'school_history',
            'school_address',
            'school_phone',
            'school_email',
            'school_map_embed',
            'social_instagram',
            'social_facebook',
            'social_youtube',
            'principal_name',
            'principal_title',
            'principal_photo',
            'principal_welcome',
        ];

        $oldValues = [];
        $newValues = [];

        foreach ($allowedKeys as $key) {
            if (array_key_exists($key, $data)) {
                $oldValues[$key] = Setting::get($key);
                Setting::set($key, $data[$key], 'school', 'string');
                $newValues[$key] = $data[$key];
            }
        }

        if ($actor) {
            $setting = Setting::where('key', 'school_name')->first() ?? new Setting;
            app(RecordAuditLog::class)->execute(
                model: $setting,
                event: 'updated',
                oldValues: $oldValues,
                newValues: $newValues,
                userId: $actor->id
            );
        }
    }
}
