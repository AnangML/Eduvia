<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class PpdbDocument extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'applicant_id',
        'document_type',
        'file_path',
        'original_name',
        'file_size',
        'mime_type',
        'status',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
        ];
    }

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(PpdbApplicant::class, 'applicant_id');
    }

    public function getFileUrlAttribute(): string
    {
        if (str_starts_with($this->file_path, 'http://') || str_starts_with($this->file_path, 'https://')) {
            return $this->file_path;
        }

        return Storage::url($this->file_path);
    }
}
