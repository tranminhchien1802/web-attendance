<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Xử lý Đăng nhập (UC-01)
     */
    public function login(Request $request)
    {
        $request->validate([
            'account'  => 'required|string',
            'password' => 'required|string',
        ], [
            'account.required'  => 'Vui lòng nhập Email hoặc Mã số định danh.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
        ]);

        // Đăng nhập linh hoạt bằng Email HOẶC user_code
        $user = User::where('email', $request->account)
                    ->orWhere('user_code', $request->account)
                    ->first();

        // 1. Kiểm tra tài khoản & mật khẩu Hash (HTTP 401)
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Email/Mã số hoặc mật khẩu không chính xác.'
            ], 401);
        }

        // 2. Kiểm tra tài khoản bị vô hiệu hóa (HTTP 403)
        if (!$user->is_active) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ Admin.'
            ], 403);
        }

        // 3. Nạp thêm thông tin Khoa (nếu có) & Sinh Sanctum Token (HTTP 200)
        $user->load('faculty:id,faculty_code,name');
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'       => 'success',
            'message'      => 'Đăng nhập thành công.',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => (new UserResource($user))->resolve($request),
        ], 200);
    }

    /**
     * Lấy thông tin User đang đăng nhập (Check Token)
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('faculty:id,faculty_code,name');

        return response()->json([
            'status' => 'success',
            'user'   => (new UserResource($user))->resolve($request),
        ], 200);
    }

    /**
     * Xử lý Đăng xuất (Thu hồi Sanctum Token)
     */
    public function logout(Request $request)
    {
        // Xóa Token hiện tại của User
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Đăng xuất thành công.'
        ], 200);
    }
}