<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    // GET /api/admin/faculties?search=&is_active=1
    public function index(Request $request)
    {
        $query = Faculty::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('faculty_code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%");
            });
        }

        if ($request->has('is_active') && $request->is_active !== '') {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        return response()->json([
            'data' => $query->orderBy('faculty_code')->get()
        ]);
    }

    // POST /api/admin/faculties
    public function store(Request $request)
    {
        $validated = $request->validate([
            'faculty_code' => 'required|string|max:20|unique:faculties,faculty_code',
            'name'         => 'required|string|max:150|unique:faculties,name',
            'description'  => 'nullable|string|max:255',
            'is_active'    => 'boolean',
        ], [
            'faculty_code.required' => 'Vui lòng nhập mã khoa.',
            'faculty_code.unique'   => 'Mã khoa đã tồn tại.',
            'name.required'         => 'Vui lòng nhập tên khoa.',
            'name.unique'           => 'Tên khoa đã tồn tại.',
        ]);

        $faculty = Faculty::create($validated);

        return response()->json([
            'message' => 'Thêm khoa thành công.',
            'data'    => $faculty
        ], 201);
    }

    // GET /api/admin/faculties/{id}
    public function show($id)
    {
        $faculty = Faculty::findOrFail($id);

        return response()->json([
            'data' => $faculty
        ]);
    }

    // PUT /api/admin/faculties/{id}
    public function update(Request $request, $id)
    {
        $faculty = Faculty::findOrFail($id);

        $validated = $request->validate([
            'faculty_code' => 'required|string|max:20|unique:faculties,faculty_code,' . $faculty->id,
            'name'         => 'required|string|max:150|unique:faculties,name,' . $faculty->id,
            'description'  => 'nullable|string|max:255',
            'is_active'    => 'boolean',
        ], [
            'faculty_code.unique' => 'Mã khoa đã tồn tại.',
            'name.unique'         => 'Tên khoa đã tồn tại.',
        ]);

        $faculty->update($validated);

        return response()->json([
            'message' => 'Cập nhật khoa thành công.',
            'data'    => $faculty
        ]);
    }

    // PATCH /api/admin/faculties/{id}/toggle-status
    public function toggleStatus($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->is_active = !$faculty->is_active;
        $faculty->save();

        return response()->json([
            'message' => $faculty->is_active ? 'Đã kích hoạt khoa.' : 'Đã ngừng hoạt động khoa.',
            'data'    => $faculty
        ]);
    }
}