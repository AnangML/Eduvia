<?php

namespace App\Http\Requests\Academic;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manage_students');
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $id = $this->route('student')?->id;

        return [
            'nisn' => ['required', 'string', 'max:20', Rule::unique('students', 'nisn')->ignore($id)],
            'nis' => ['nullable', 'string', 'max:20'],
            'nik' => ['nullable', 'string', 'max:20'],
            'full_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', Rule::in(['L', 'P'])],
            'birth_place' => ['nullable', 'string', 'max:100'],
            'birth_date' => ['nullable', 'date'],
            'phone_number' => ['nullable', 'string', 'max:25'],
            'address' => ['nullable', 'string'],
            'classroom_id' => ['nullable', 'exists:classrooms,id'],
            'guardian_id' => ['nullable', 'exists:guardians,id'],
            'guardian_relationship' => ['nullable', 'string', 'max:50'],
            'create_user' => ['nullable', 'boolean'],
        ];
    }
}
