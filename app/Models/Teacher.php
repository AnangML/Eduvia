<?php

namespace App\Models;

use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasAuditLog, HasFactory, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'nip',
        'nuptk',
        'name',
        'gender',
        'phone_number',
        'address',
        'employment_status',
        'is_active',
        'is_public',
        'photo',
        'title_degree',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_public' => 'boolean',
        ];
    }

    public function scopePublic($query)
    {
        return $query->where('is_active', true)->where('is_public', true);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function homeroomClassrooms(): HasMany
    {
        return $this->hasMany(Classroom::class, 'homeroom_teacher_id');
    }

    public function currentHomeroomClassroom(): HasOne
    {
        return $this->hasOne(Classroom::class, 'homeroom_teacher_id')
            ->whereHas('academicYear', fn ($q) => $q->where('is_active', true));
    }

    public function teachingAssignments(): HasMany
    {
        return $this->hasMany(TeachingAssignment::class);
    }
}
