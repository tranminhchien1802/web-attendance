<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseClass extends Model
{
    protected $table = 'classes';

    protected $fillable = [
        'class_code',
        'subject_id',
        'lecturer_id',
        'semester',
        'academic_year',
        'room_default',
    ];

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function lecturer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'class_students', 'class_id', 'student_id')
                    ->withPivot('joined_at');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class, 'class_id');
    }
}