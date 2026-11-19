<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faculties', function (Blueprint $table) {
            $table->id();
            $table->string('faculty_code', 20)->unique()->comment('Mã Khoa (VD: FIT, FME, FBA)');
            $table->string('name', 150)->unique()->comment('Tên Khoa (VD: Khoa Công nghệ Thông tin)');
            $table->string('description', 255)->nullable()->comment('Mô tả / Văn phòng Khoa');
            $table->boolean('is_active')->default(true)->comment('1: Đang hoạt động, 0: Ngừng');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faculties');
    }
};