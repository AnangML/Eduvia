<?php

namespace App\Models;

use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasAuditLog, HasFactory, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'nisn',
        'nis',
        'nik',
        'full_name',
        'gender',
        'birth_place',
        'birth_date',
        'phone_number',
        'address',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function guardians(): BelongsToMany
    {
        return $this->belongsToMany(Guardian::class, 'guardian_student')
            ->withPivot(['relationship', 'is_emergency_contact']);
    }

    public function studentClassrooms(): HasMany
    {
        return $this->hasMany(StudentClassroom::class);
    }

    public function classrooms(): BelongsToMany
    {
        return $this->belongsToMany(Classroom::class, 'student_classrooms')
            ->withPivot(['status', 'transferred_at', 'notes'])
            ->withTimestamps();
    }

    public function currentStudentClassroom(): HasOne
    {
        return $this->hasOne(StudentClassroom::class)
            ->where('status', 'active')
            ->whereHas('academicYear', fn ($q) => $q->where('is_active', true));
    }
}
