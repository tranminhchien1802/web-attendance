<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\SubjectController;
use App\Http\Controllers\Api\Admin\ClassController;
use App\Http\Controllers\Api\Admin\LessonController;

/*
|--------------------------------------------------------------------------
| Public Routes (Không cần Token)
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes - Dùng chung cho mọi Role đã đăng nhập
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
});

/*
|--------------------------------------------------------------------------
| Admin Routes - Chỉ dành cho Quản trị viên (role: admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Quản lý Khoa
    Route::get('/faculties', [FacultyController::class, 'index']);
    Route::post('/faculties', [FacultyController::class, 'store']);
    Route::get('/faculties/{id}', [FacultyController::class, 'show']);
    Route::put('/faculties/{id}', [FacultyController::class, 'update']);
    Route::patch('/faculties/{id}/toggle-status', [FacultyController::class, 'toggleStatus']);

    // Quản lý Người dùng (GV / SV / Admin)
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);

    // Quản lý Môn học
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::post('/subjects', [SubjectController::class, 'store']);
    Route::get('/subjects/{id}', [SubjectController::class, 'show']);
    Route::put('/subjects/{id}', [SubjectController::class, 'update']);
    Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);

    // Quản lý Lớp học phần & Gán Sinh viên (FR-02)
    Route::get('/classes', [ClassController::class, 'index']);
    Route::post('/classes', [ClassController::class, 'store']);
    Route::get('/classes/{id}', [ClassController::class, 'show']);
    Route::put('/classes/{id}', [ClassController::class, 'update']);
    Route::delete('/classes/{id}', [ClassController::class, 'destroy']);
    Route::post('/classes/{id}/students', [ClassController::class, 'addStudents']);
    Route::delete('/classes/{id}/students/{studentId}', [ClassController::class, 'removeStudent']);

    // Quản lý Lịch buổi học & Chống trùng lịch BR-01 (FR-11)
    Route::get('/lessons', [LessonController::class, 'index']);
    Route::post('/lessons', [LessonController::class, 'store']);
    Route::get('/lessons/{id}', [LessonController::class, 'show']);
    Route::put('/lessons/{id}', [LessonController::class, 'update']);
    Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
});