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
            'user_code' => 'ADMIN001',
            'name' => 'Quản trị viên Hệ thống',
            'email' => 'admin@hcmute.edu.vn',
            'password' => Hash::make('123456'),
            'phone' => '0901234567',
            'gender' => 'male',
            'role' => User::ROLE_ADMIN,
            'is_active' => true,
            'department' => 'Phòng Đào tạo',
        ]);

        // 2. Tài khoản Giảng viên
        User::create([
            'user_code' => 'GV-001',
            'name' => 'ThS. Nguyễn Văn A',
            'email' => 'teacher@hcmute.edu.vn',
            'password' => Hash::make('123456'),
            'phone' => '0907654321',
            'gender' => 'male',
            'role' => User::ROLE_LECTURER,
            'is_active' => true,
            'department' => 'Khoa Công nghệ Thông tin',
            'faculty' => 'Khoa Công nghệ Thông tin',
            'major' => 'Công nghệ phần mềm',
        ]);

        // 3. Tài khoản Sinh viên
        User::create([
            'user_code' => '20124001',
            'name' => 'Trần Thị B',
            'email' => 'student@hcmute.edu.vn',
            'password' => Hash::make('123456'),
            'phone' => '0912345678',
            'gender' => 'female',
            'role' => User::ROLE_STUDENT,
            'is_active' => true,
            'department' => 'Bộ môn Công nghệ Phần mềm',
            'faculty' => 'Khoa Công nghệ Thông tin',
            'major' => 'Kỹ thuật phần mềm',
        ]);

        // 4. Tài khoản bị khóa (dùng để test HTTP 403)
        User::create([
            'user_code' => 'SV-BLOCKED',
            'name' => 'Lê Văn C (Bị khóa)',
            'email' => 'blocked@hcmute.edu.vn',
            'password' => Hash::make('123456'),
            'phone' => '0988888888',
            'gender' => 'male',
            'role' => User::ROLE_STUDENT,
            'is_active' => false,
            'department' => 'Bộ môn Công nghệ Phần mềm',
            'faculty' => 'Khoa Công nghệ Thông tin',
            'major' => 'Kỹ thuật phần mềm',
        ]);
    }
}
