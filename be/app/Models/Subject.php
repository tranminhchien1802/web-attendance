<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subject extends Model
{
    protected $fillable = [
        'subject_code',
        'name',
        'faculty_id',
        'credits',
        'theory_hours',
        'practical_hours',
    ];

    protected $casts = [
        'credits'         => 'integer',
        'theory_hours'    => 'integer',
        'practical_hours' => 'integer',
    ];

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class, 'faculty_id');
    }
    public function classes()
    {
        return $this->hasMany(CourseClass::class, 'subject_id');
    }
}