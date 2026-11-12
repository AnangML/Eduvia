<?php

namespace App\Http\Requests\Academic;

use Illuminate\Foundation\Http\FormRequest;

class ClassroomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manage_classrooms');
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'grade_level_id' => ['required', 'exists:grade_levels,id'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'homeroom_teacher_id' => ['nullable', 'exists:teachers,id'],
            'name' => ['required', 'string', 'max:50'],
            'capacity' => ['required', 'integer', 'min:1', 'max:60'],
        ];
    }
}
