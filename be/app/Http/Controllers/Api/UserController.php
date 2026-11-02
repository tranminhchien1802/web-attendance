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

    public function updateRole(Request $request, User $user): UserResource
    {
        $this->ensureAdmin($request);

        abort_if(
            $user->role === User::ROLE_ADMIN,
            403,
            'Không thể thay đổi vai trò của tài khoản admin.',
        );

        $data = $request->validate([
            'role' => ['required', Rule::in([User::ROLE_STUDENT, User::ROLE_TEACHER])],
        ], [
            'role.required' => 'Vui lòng chọn vai trò.',
            'role.in' => 'Vai trò không hợp lệ.',
        ]);

        $user->role = $data['role'];
        $user->student_id ??= $this->makeStudentId($user);
        $user->save();

        return new UserResource($user);
    }

    private function ensureAdmin(Request $request): void
    {
        abort_unless(
            $request->user()?->role === User::ROLE_ADMIN,
            403,
            'Chỉ admin được phép thực hiện thao tác này.',
        );
    }

    private function makeStudentId(User $user): string
    {
        $prefix = $user->role === User::ROLE_STUDENT ? 'SV' : 'GV';

        return $prefix.str_pad((string) $user->id, 6, '0', STR_PAD_LEFT);
    }
}
