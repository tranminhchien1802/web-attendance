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
                'student_id' => '20124001',
                'department' => 'Kỹ thuật phần mềm',
            ],
            [
                'name' => 'Lê Thị Lan',
                'email' => 'student2@hcmute.edu.vn',
                'role' => User::ROLE_STUDENT,
                'student_id' => '20124002',
                'department' => 'Kỹ thuật phần mềm',
            ],
            [
                'name' => 'Trần Thị B',
                'email' => 'teacher@hcmute.edu.vn',
                'role' => User::ROLE_TEACHER,
                'student_id' => 'GV-001',
                'department' => 'Khoa Công nghệ Thông tin',
            ],
            [
                'name' => 'Phạm Minh C',
                'email' => 'teacher2@hcmute.edu.vn',
                'role' => User::ROLE_TEACHER,
                'student_id' => 'GV-002',
                'department' => 'Khoa Công nghệ Thông tin',
            ],
            [
                'name' => 'Admin HCMUTE',
                'email' => 'admin@hcmute.edu.vn',
                'role' => User::ROLE_ADMIN,
                'student_id' => null,
                'department' => 'Phòng Đào tạo',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [...$user, 'password' => Hash::make('123456')],
            );
        }
    }
}
