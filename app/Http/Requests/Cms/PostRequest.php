<?php

namespace App\Http\Requests\Cms;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:news,announcement,achievement,agenda'],
            'content' => ['required', 'string'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'featured_image' => ['nullable', 'string', 'max:255'],
            'image_file' => ['nullable', 'image', 'max:5120', 'mimes:jpeg,png,jpg,webp'],
            'status' => ['required', 'string', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
            'event_date' => ['nullable', 'date'],
        ];
    }
}
