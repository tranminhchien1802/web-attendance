<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->integer('lesson_number')->nullable();
            $table->integer('hours')->comment('Số tiết của buổi học (Dùng tính % vắng)');
            $table->string('room', 50);
            $table->date('lesson_date');
            $table->integer('shift_start');
            $table->integer('shift_end');
            $table->enum('type', ['regular', 'makeup'])->default('regular');
            $table->foreignId('actual_lecturer_id')->nullable()->comment('Giảng viên dạy thay (nếu có)')->constrained('users')->nullOnDelete();
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])->default('scheduled');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};