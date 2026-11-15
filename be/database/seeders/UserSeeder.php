<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tài khoản Admin
        User::create([
            'user_code' => 'ADM001',
            'name' => 'Quản trị viên Hệ thống',
            'email' => 'admin@plt.edu.vn',
            'password' => Hash::make('password123'),
            'phone' => '0901234567',
            'gender' => 'male',
            'role' => 'admin',
            'is_active' => true,
        ]);

        // 2. Tài khoản Giảng viên
        User::create([
            'user_code' => 'GV001',
            'name' => 'ThS. Nguyễn Văn A',
            'email' => 'lecturer@plt.edu.vn',
            'password' => Hash::make('password123'),
            'phone' => '0907654321',
            'gender' => 'male',
            'role' => 'lecturer',
            'is_active' => true,
        ]);

        // 3. Tài khoản Sinh viên
        User::create([
            'user_code' => 'SV001',
            'name' => 'Trần Thị B',
            'email' => 'student@plt.edu.vn',
            'password' => Hash::make('password123'),
            'phone' => '0912345678',
            'gender' => 'female',
            'role' => 'student',
            'is_active' => true,
        ]);

        // 4. Tài khoản bị khóa (dùng để test HTTP 403)
        User::create([
            'user_code' => 'SV002',
            'name' => 'Lê Văn C (Bị khóa)',
            'email' => 'blocked@plt.edu.vn',
            'password' => Hash::make('password123'),
            'phone' => '0988888888',
            'gender' => 'male',
            'role' => 'student',
            'is_active' => false,
        ]);
    }
}