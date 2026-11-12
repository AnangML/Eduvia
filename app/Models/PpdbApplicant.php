<?php

namespace App\Models;

use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PpdbApplicant extends Model
{
    use HasAuditLog, HasFactory, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'period_id',
        'track_id',
        'department_id',
        'second_department_id',
        'registration_number',
        'nisn',
        'nik',
        'full_name',
        'gender',
        'birth_place',
        'birth_date',
        'religion',
        'address',
        'province',
        'city',
        'district',
        'village',
        'phone_number',
        'email',
        'distance_zone_score',
        'average_report_score',
        'final_score',
        'ranking',
        'previous_school_name',
        'previous_school_address',
        'graduation_year',
        'father_name',
        'father_occupation',
        'father_phone',
        'mother_name',
        'mother_occupation',
        'mother_phone',
        'guardian_name',
        'guardian_occupation',
        'guardian_phone',
        'parent_income',
        'verification_status',
        'verification_notes',
        'verified_by',
        'verified_at',
        'selection_status',
        're_registration_status',
        'converted_to_student_id',
        'converted_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'graduation_year' => 'integer',
            'distance_zone_score' => 'integer',
            'average_report_score' => 'decimal:2',
            'final_score' => 'decimal:2',
            'ranking' => 'integer',
            'verified_at' => 'datetime',
            'converted_at' => 'datetime',
        ];
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(PpdbPeriod::class, 'period_id');
    }

    public function track(): BelongsTo
    {
        return $this->belongsTo(PpdbTrack::class, 'track_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function secondDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'second_department_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(PpdbDocument::class, 'applicant_id');
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function convertedToStudent(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'converted_to_student_id');
    }

    public function scopeVerified(Builder $query): Builder
    {
        return $query->where('verification_status', 'verified');
    }

    public function scopeAccepted(Builder $query): Builder
    {
        return $query->where('selection_status', 'accepted');
    }

    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }

    public function isAccepted(): bool
    {
        return $this->selection_status === 'accepted';
    }

    public function isConverted(): bool
    {
        return ! is_null($this->converted_to_student_id);
    }
}
