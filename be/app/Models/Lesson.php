<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    protected $fillable = [
        'class_id',
        'lesson_number',
        'hours',
        'room',
        'lesson_date',
        'shift_start',
        'shift_end',
        'type',
        'actual_lecturer_id',
        'status',
    ];

    protected $casts = [
        'lesson_number' => 'integer',
        'hours'         => 'integer',
        'shift_start'   => 'integer',
        'shift_end'     => 'integer',
    ];

    public function courseClass(): BelongsTo
    {
        return $this->belongsTo(CourseClass::class, 'class_id');
    }

    public function actualLecturer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actual_lecturer_id');
    }
}