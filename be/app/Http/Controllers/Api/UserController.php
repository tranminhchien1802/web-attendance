<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->ensureAdmin($request);

        return UserResource::collection(User::orderBy('id')->get());
    }

    public function store(Request $request): UserResource
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'userCode' => ['required', 'string', 'max:20', Rule::unique('users', 'user_code')],
            'fullName' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:100', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in(['student', 'teacher'])],
            'phone' => ['nullable', 'string', 'max:15'],
            'gender' => ['sometimes', Rule::in(['male', 'female'])],
            'avatar' => ['nullable', 'string', 'max:255'],
            'isActive' => ['sometimes', 'boolean'],
            'department' => ['nullable', 'string', 'max:100'],
            'faculty' => ['nullable', 'string', 'max:100'],
            'major' => ['nullable', 'string', 'max:100'],
        ]);

        $user = User::create($this->toUserAttributes($data) + [
            'gender' => $data['gender'] ?? 'male',
            'is_active' => $data['isActive'] ?? true,
        ]);

        return new UserResource($user);
    }

    public function update(Request $request, User $user): UserResource
    {
        $this->ensureAdmin($request);
        $this->ensureManagedAccount($user, $request);

        $data = $request->validate([
            'userCode' => ['sometimes', 'required', 'string', 'max:20', Rule::unique('users', 'user_code')->ignore($user->id)],
            'fullName' => ['sometimes', 'required', 'string', 'max:100'],
            'email' => ['sometimes', 'required', 'email', 'max:100', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
            'role' => ['sometimes', 'required', Rule::in(['student', 'teacher'])],
            'phone' => ['sometimes', 'nullable', 'string', 'max:15'],
            'gender' => ['sometimes', Rule::in(['male', 'female'])],
            'avatar' => ['sometimes', 'nullable', 'string', 'max:255'],
            'isActive' => ['sometimes', 'boolean'],
            'department' => ['sometimes', 'nullable', 'string', 'max:100'],
            'faculty' => ['sometimes', 'nullable', 'string', 'max:100'],
            'major' => ['sometimes', 'nullable', 'string', 'max:100'],
        ]);

        if (! isset($data['password']) || $data['password'] === '') {
            unset($data['password']);
        }

        $user->fill($this->toUserAttributes($data));
        $user->save();

        if (array_key_exists('isActive', $data) && ! $data['isActive']) {
            $user->tokens()->delete();
        }

        return new UserResource($user->refresh());
    }

    public function destroy(Request $request, User $user)
    {
        $this->ensureAdmin($request);
        $this->ensureManagedAccount($user, $request);

        $user->tokens()->delete();
        $user->delete();

        return response()->noContent();
    }

    public function updateRole(Request $request, User $user): UserResource
    {
        $this->ensureAdmin($request);
        $this->ensureManagedAccount($user, $request);

        $data = $request->validate([
            'role' => ['required', Rule::in(['student', 'teacher'])],
        ], [
            'role.required' => 'Vui lòng chọn vai trò.',
            'role.in' => 'Vai trò không hợp lệ.',
        ]);

        $user->role = $this->databaseRole($data['role']);
        $user->save();

        return new UserResource($user->refresh());
    }

    private function toUserAttributes(array $data): array
    {
        $fields = [
            'userCode' => 'user_code',
            'fullName' => 'name',
            'email' => 'email',
            'password' => 'password',
            'phone' => 'phone',
            'gender' => 'gender',
            'avatar' => 'avatar',
            'isActive' => 'is_active',
            'department' => 'department',
            'faculty' => 'faculty',
            'major' => 'major',
        ];

        $attributes = [];
        foreach ($fields as $input => $column) {
            if (array_key_exists($input, $data)) {
                $attributes[$column] = $data[$input];
            }
        }

        if (array_key_exists('role', $data)) {
            $attributes['role'] = $this->databaseRole($data['role']);
        }

        return $attributes;
    }

    private function databaseRole(string $role): string
    {
        return $role === 'teacher' ? User::ROLE_LECTURER : $role;
    }

    private function ensureAdmin(Request $request): void
    {
        abort_unless(
            $request->user()?->role === User::ROLE_ADMIN,
            403,
            'Chỉ admin được phép thực hiện thao tác này.',
        );
    }

    private function ensureManagedAccount(User $user, Request $request): void
    {
        abort_if(
            $user->role === User::ROLE_ADMIN || $user->is($request->user()),
            403,
            'Chỉ có thể quản lý tài khoản sinh viên hoặc giảng viên khác.',
        );
    }
}
