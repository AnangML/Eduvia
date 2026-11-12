<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GradeLevel extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'educational_level',
        'level_number',
        'name',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'level_number' => 'integer',
        ];
    }

    public function classrooms(): HasMany
    {
        return $this->hasMany(Classroom::class);
    }
}
