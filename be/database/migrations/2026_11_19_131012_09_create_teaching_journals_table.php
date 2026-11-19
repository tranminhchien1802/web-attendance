<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teaching_journals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->unique()->comment('Mỗi buổi học chỉ tạo 1 nhật ký')->constrained('lessons')->cascadeOnDelete();
            $table->foreignId('lecturer_id')->constrained('users')->restrictOnDelete();
            $table->string('topic_title', 255);
            $table->integer('actual_hours');
            $table->text('teaching_content');
            $table->text('student_feedback_notes')->nullable();
            $table->enum('status', ['draft', 'submitted'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teaching_journals');
    }
};