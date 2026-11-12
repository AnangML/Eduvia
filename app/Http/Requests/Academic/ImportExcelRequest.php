<?php

namespace App\Http\Requests\Academic;

use Illuminate\Foundation\Http\FormRequest;

class ImportExcelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('view_master_data');
    }

    /**
     * @return array<string, array<string>>
     */
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
            'classroom_id' => ['nullable', 'exists:classrooms,id'],
        ];
    }
}
