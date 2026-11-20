<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // GET /api/admin/users?role=lecturer&faculty_id=1&search=
    public function index(Request $request)
    {
        $query = User::with('faculty:id,faculty_code,name');

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('faculty_id')) {
            $query->where('faculty_id', $request->faculty_id);
        }

        if ($request->has('is_active') && $request->is_active !== '') {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('user_code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'data' => UserResource::collection($query->latest()->get())->resolve($request)
        ]);
    }

    // POST /api/admin/users
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_code'  => 'required|string|max:20|unique:users,user_code',
            'name'       => 'required|string|max:100',
            'email'      => 'required|email|max:100|unique:users,email',
            'password'   => 'required|string|min:6',
            'phone'      => 'nullable|string|max:15',
            'gender'     => 'required|in:male,female',
            'role'       => 'required|in:admin,lecturer,student',
            'faculty_id' => 'nullable|exists:faculties,id',
            'is_active'  => 'boolean',
        ], [
            'user_code.unique' => 'Mã số (SV/GV/Admin) đã tồn tại.',
            'email.unique'     => 'Email đã được sử dụng.',
            'faculty_id.exists'=> 'Khoa được chọn không hợp lệ.',
        ]);

        if ($validated['role'] === 'admin') {
            $validated['faculty_id'] = null;
        }

        $user = User::create($validated)->load('faculty:id,faculty_code,name');

        return response()->json([
            'message' => 'Tạo tài khoản thành công.',
            'data'    => (new UserResource($user))->resolve($request)
        ], 201);
    }

    // GET /api/admin/users/{id}
    public function show(Request $request, $id)
    {
        $user = User::with('faculty:id,faculty_code,name')->findOrFail($id);

        return response()->json([
            'data' => (new UserResource($user))->resolve($request)
        ]);
    }

    // PUT /api/admin/users/{id}
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'user_code'  => 'required|string|max:20|unique:users,user_code,' . $user->id,
            'name'       => 'required|string|max:100',
            'email'      => 'required|email|max:100|unique:users,email,' . $user->id,
            'password'   => 'nullable|string|min:6',
            'phone'      => 'nullable|string|max:15',
            'gender'     => 'required|in:male,female',
            'role'       => 'required|in:admin,lecturer,student',
            'faculty_id' => 'nullable|exists:faculties,id',
            'is_active'  => 'boolean',
        ], [
            'user_code.unique' => 'Mã số (SV/GV/Admin) đã tồn tại.',
            'email.unique'     => 'Email đã được sử dụng.',
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        if ($validated['role'] === 'admin') {
            $validated['faculty_id'] = null;
        }

        $user->update($validated);
        $user->load('faculty:id,faculty_code,name');

        return response()->json([
            'message' => 'Cập nhật thông tin thành công.',
            'data'    => (new UserResource($user))->resolve($request)
        ]);
    }

    // PATCH /api/admin/users/{id}/toggle-status
    public function toggleStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'Không thể tự khóa tài khoản đang đăng nhập.'
            ], 400);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        // Thu hồi toàn bộ token đang đăng nhập nếu khóa tài khoản
        if (!$user->is_active) {
            $user->tokens()->delete();
        }

        $user->load('faculty:id,faculty_code,name');

        return response()->json([
            'message' => $user->is_active ? 'Đã mở khóa tài khoản.' : 'Đã khóa tài khoản.',
            'data'    => (new UserResource($user))->resolve($request)
        ]);
    }
}