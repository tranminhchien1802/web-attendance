<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('department', 100)->nullable()->after('is_active');
            $table->string('faculty', 100)->nullable()->after('department');
            $table->string('major', 100)->nullable()->after('faculty');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['department', 'faculty', 'major']);
        });
    }
};
