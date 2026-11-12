<?php

namespace App\Http\Requests\Academic;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TeacherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manage_teachers');
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $id = $this->route('teacher')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'nip' => ['nullable', 'string', 'max:50', Rule::unique('teachers', 'nip')->ignore($id)],
            'nuptk' => ['nullable', 'string', 'max:50'],
            'gender' => ['required', Rule::in(['L', 'P'])],
            'phone_number' => ['nullable', 'string', 'max:25'],
            'address' => ['nullable', 'string'],
            'employment_status' => ['required', 'string', 'max:50'],
            'create_user' => ['nullable', 'boolean'],
            'is_public' => ['nullable', 'boolean'],
            'photo' => ['nullable', 'string', 'max:255'],
            'photo_file' => ['nullable', 'image', 'max:5120', 'mimes:jpeg,png,jpg,webp'],
            'title_degree' => ['nullable', 'string', 'max:100'],
        ];
    }
}
