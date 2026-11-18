<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    public const ROLE_ADMIN = 'admin';
    public const ROLE_LECTURER = 'lecturer';
    public const ROLE_TEACHER = self::ROLE_LECTURER;
    public const ROLE_STUDENT = 'student';

    protected $fillable = [
        'user_code',
        'name',
        'email',
        'password',
        'phone',
        'gender',
        'role',
        'avatar',
        'is_active',
        'department',
        'faculty',
        'major',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'password' => 'hashed',
    ];
}
