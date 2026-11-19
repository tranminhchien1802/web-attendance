<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teaching_evidences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_id')->constrained('teaching_journals')->cascadeOnDelete();
            $table->string('file_name', 255);
            $table->string('file_path', 255);
            $table->string('file_type', 50)->nullable();
            $table->integer('file_size')->nullable()->comment('Dung lượng file (bytes, <= 5MB)');
            $table->timestamp('created_at')->nullable()->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teaching_evidences');
    }
};