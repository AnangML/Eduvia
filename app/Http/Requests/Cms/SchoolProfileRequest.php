<?php

namespace App\Http\Requests\Cms;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SchoolProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'school_name' => ['required', 'string', 'max:255'],
            'school_tagline' => ['nullable', 'string', 'max:255'],
            'school_logo' => ['nullable', 'string', 'max:255'],
            'logo_file' => ['nullable', 'image', 'max:2048', 'mimes:jpeg,png,jpg,webp,svg'],
            'school_description' => ['nullable', 'string'],
            'school_vision' => ['nullable', 'string'],
            'school_mission' => ['nullable', 'string'],
            'school_history' => ['nullable', 'string'],
            'school_address' => ['nullable', 'string'],
            'school_phone' => ['nullable', 'string', 'max:50'],
            'school_email' => ['nullable', 'email', 'max:100'],
            'school_map_embed' => ['nullable', 'string'],
            'social_instagram' => ['nullable', 'string', 'max:255'],
            'social_facebook' => ['nullable', 'string', 'max:255'],
            'social_youtube' => ['nullable', 'string', 'max:255'],
            'principal_name' => ['nullable', 'string', 'max:255'],
            'principal_title' => ['nullable', 'string', 'max:255'],
            'principal_photo' => ['nullable', 'string', 'max:255'],
            'principal_photo_file' => ['nullable', 'image', 'max:3072', 'mimes:jpeg,png,jpg,webp'],
            'principal_welcome' => ['nullable', 'string'],
        ];
    }
}
