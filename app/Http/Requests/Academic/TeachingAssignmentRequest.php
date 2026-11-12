<?php

namespace App\Http\Requests\Academic;

use Illuminate\Foundation\Http\FormRequest;

class TeachingAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manage_teaching_assignments');
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'teacher_id' => ['required', 'exists:teachers,id'],
            'subject_id' => ['required', 'exists:subjects,id'],
            'classroom_id' => ['required', 'exists:classrooms,id'],
            'semester_id' => ['required', 'exists:semesters,id'],
        ];
    }
}
