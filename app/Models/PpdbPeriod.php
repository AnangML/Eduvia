<?php

namespace App\Models;

use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PpdbPeriod extends Model
{
    use HasAuditLog, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'academic_year_id',
        'name',
        'slug',
        'start_date',
        'end_date',
        'announcement_date',
        're_registration_start',
        're_registration_end',
        'is_active',
        'description',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'announcement_date' => 'date',
            're_registration_start' => 'date',
            're_registration_end' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function tracks(): HasMany
    {
        return $this->hasMany(PpdbTrack::class, 'period_id');
    }

    public function applicants(): HasMany
    {
        return $this->hasMany(PpdbApplicant::class, 'period_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOpenForRegistration(Builder $query): Builder
    {
        $today = now()->toDateString();

        return $query->where('is_active', true)
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today);
    }

    public function isOpen(): bool
    {
        $today = now()->toDateString();

        return $this->is_active && $this->start_date?->toDateString() <= $today && $this->end_date?->toDateString() >= $today;
    }
}
