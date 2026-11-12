<?php

namespace App\Http\Requests\Academic;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AcademicYearRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manage_academic_years');
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $id = $this->route('academic_year')?->id;

        return [
            'name' => ['required', 'string', 'max:50', Rule::unique('academic_years', 'name')->ignore($id)],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'is_active' => ['boolean'],
        ];
    }
}
