<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained('lessons')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['present', 'absent_permission', 'absent_no_permission', 'late']);
            $table->enum('method', ['qr', 'manual'])->nullable();
            $table->string('device_id', 100)->nullable()->comment('Device Fingerprint chống điểm danh hộ trên cùng thiết bị');
            $table->string('ip_address', 45)->nullable();
            $table->string('note', 255)->nullable();
            $table->timestamp('checked_at')->nullable();
            $table->timestamps();
            $table->unique(['lesson_id', 'student_id'], 'attendance_logs_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_logs');
    }
};