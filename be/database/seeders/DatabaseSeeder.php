<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Nguyễn Văn A',
                'email' => 'student@hcmute.edu.vn',
                'role' => User::ROLE_STUDENT,
                'user_code' => '20124001',
                'department' => 'Bộ môn Công nghệ Phần mềm',
                'faculty' => 'Khoa Công nghệ Thông tin',
                'major' => 'Kỹ thuật phần mềm',
            ],
            [
                'name' => 'Lê Thị Lan',
                'email' => 'student2@hcmute.edu.vn',
                'role' => User::ROLE_STUDENT,
                'user_code' => '20124002',
                'department' => 'Bộ môn Công nghệ Phần mềm',
                'faculty' => 'Khoa Công nghệ Thông tin',
                'major' => 'Kỹ thuật phần mềm',
            ],
            [
                'name' => 'Trần Thị B',
                'email' => 'teacher@hcmute.edu.vn',
                'role' => User::ROLE_LECTURER,
                'user_code' => 'GV-001',
                'department' => 'Khoa Công nghệ Thông tin',
                'faculty' => 'Khoa Công nghệ Thông tin',
                'major' => 'Công nghệ phần mềm',
            ],
            [
                'name' => 'Phạm Minh C',
                'email' => 'teacher2@hcmute.edu.vn',
                'role' => User::ROLE_LECTURER,
                'user_code' => 'GV-002',
                'department' => 'Khoa Công nghệ Thông tin',
                'faculty' => 'Khoa Công nghệ Thông tin',
                'major' => 'Hệ thống thông tin',
            ],
            [
                'name' => 'Admin HCMUTE',
                'email' => 'admin@hcmute.edu.vn',
                'role' => User::ROLE_ADMIN,
                'user_code' => 'ADMIN001',
                'department' => 'Phòng Đào tạo',
                'faculty' => null,
                'major' => null,
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [...$user, 'gender' => 'male', 'is_active' => true, 'password' => Hash::make('123456')],
            );
        }
    }
}
