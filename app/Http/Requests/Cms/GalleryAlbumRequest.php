<?php

namespace App\Http\Requests\Cms;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class GalleryAlbumRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'cover_file' => ['nullable', 'image', 'max:5120', 'mimes:jpeg,png,jpg,webp'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'photos' => ['nullable', 'array'],
            'photos.*.image_path' => ['required_with:photos', 'string'],
            'photos.*.title' => ['nullable', 'string', 'max:255'],
            'photos.*.caption' => ['nullable', 'string'],
        ];
    }
}
