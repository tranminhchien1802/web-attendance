<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->unique()->comment('Mỗi buổi học duy nhất 1 phiên QR')->constrained('lessons')->cascadeOnDelete();
            $table->string('qr_token', 255)->unique()->comment('Token hiện hành (30s)');
            $table->string('previous_qr_token', 255)->nullable()->comment('Token liền trước (Hỗ trợ 10s Grace Period)');
            $table->timestamp('expires_at');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_sessions');
    }
};