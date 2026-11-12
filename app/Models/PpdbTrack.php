<?php

namespace App\Models;

use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PpdbTrack extends Model
{
    use HasAuditLog, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'period_id',
        'name',
        'code',
        'quota',
        'description',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'quota' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(PpdbPeriod::class, 'period_id');
    }

    public function applicants(): HasMany
    {
        return $this->hasMany(PpdbApplicant::class, 'track_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
