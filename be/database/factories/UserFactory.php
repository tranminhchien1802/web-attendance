<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_code' => 'USR'.Str::upper(Str::random(10)),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => User::ROLE_STUDENT,
            'phone' => fake()->numerify('09########'),
            'gender' => fake()->randomElement(['male', 'female']),
            'is_active' => true,
            'department' => fake()->randomElement([
                'Kỹ thuật phần mềm',
                'Khoa Công nghệ Thông tin',
                'Phòng Đào tạo',
            ]),
            'faculty' => 'Khoa Công nghệ Thông tin',
            'major' => 'Kỹ thuật phần mềm',
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
