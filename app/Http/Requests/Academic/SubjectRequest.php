<?php

namespace App\Http\Requests\Academic;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manage_subjects');
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $id = $this->route('subject')?->id;

        return [
            'code' => ['required', 'string', 'max:20', Rule::unique('subjects', 'code')->ignore($id)],
            'name' => ['required', 'string', 'max:100'],
            'group' => ['required', Rule::in(['Umum', 'Kejuruan', 'Muatan Lokal'])],
            'kkm_score' => ['required', 'integer', 'min:0', 'max:100'],
        ];
    }
}
