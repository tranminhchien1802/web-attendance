<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_endpoint_returns_ok(): void
    {
        $this->getJson('/api/health')
            ->assertOk()
            ->assertJsonPath('status', 'ok')
            ->assertJsonStructure(['status', 'timestamp']);
    }

    public function test_user_can_login_with_seeded_credentials(): void
    {
        $this->seed();

        $this->postJson('/api/auth/login', [
            'email' => 'admin@hcmute.edu.vn',
            'password' => '123456',
        ])
            ->assertOk()
            ->assertJsonPath('user.email', 'admin@hcmute.edu.vn')
            ->assertJsonPath('user.role', User::ROLE_ADMIN)
            ->assertJsonStructure([
                'user' => ['id', 'fullName', 'email', 'role', 'studentId', 'department'],
                'token',
            ]);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        $this->seed();

        $this->postJson('/api/auth/login', [
            'email' => 'admin@hcmute.edu.vn',
            'password' => 'sai-mat-khau',
        ])
            ->assertUnauthorized()
            ->assertJsonPath('message', 'Email hoặc mật khẩu không đúng.');
    }

    public function test_user_can_register(): void
    {
        $this->postJson('/api/auth/register', [
            'fullName' => 'Nguyễn Văn C',
            'email' => 'new.student@hcmute.edu.vn',
            'password' => '123456',
            'role' => User::ROLE_STUDENT,
            'department' => 'Kỹ thuật phần mềm',
        ])
            ->assertCreated()
            ->assertJsonPath('user.email', 'new.student@hcmute.edu.vn')
            ->assertJsonPath('user.role', User::ROLE_STUDENT)
            ->assertJsonStructure(['user' => ['id', 'fullName', 'studentId'], 'token']);

        $this->assertDatabaseHas('users', [
            'email' => 'new.student@hcmute.edu.vn',
            'role' => User::ROLE_STUDENT,
        ]);
    }

    public function test_registration_rejects_admin_role(): void
    {
        $this->postJson('/api/auth/register', [
            'fullName' => 'Fake Admin',
            'email' => 'fake.admin@hcmute.edu.vn',
            'password' => '123456',
            'role' => User::ROLE_ADMIN,
        ])->assertUnprocessable();
    }

    public function test_authenticated_user_can_get_profile(): void
    {
        $user = User::factory()->create([
            'name' => 'Giảng Viên Test',
            'role' => User::ROLE_TEACHER,
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('fullName', 'Giảng Viên Test')
            ->assertJsonPath('email', $user->email)
            ->assertJsonPath('role', User::ROLE_TEACHER);
    }

    public function test_admin_can_list_users(): void
    {
        $this->seed();

        Sanctum::actingAs(User::where('email', 'admin@hcmute.edu.vn')->firstOrFail());

        $this->getJson('/api/users')
            ->assertOk()
            ->assertJsonCount(5);
    }

    public function test_non_admin_cannot_list_users(): void
    {
        $user = User::factory()->create(['role' => User::ROLE_STUDENT]);

        Sanctum::actingAs($user);

        $this->getJson('/api/users')->assertForbidden();
    }
}
