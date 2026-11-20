<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubjectController extends Controller
{
    // GET /api/admin/subjects?faculty_id=1&search=
    public function index(Request $request)
    {
        $query = Subject::with('faculty:id,faculty_code,name');

        if ($request->filled('faculty_id')) {
            $query->where('faculty_id', $request->faculty_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('subject_code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'data' => $query->orderBy('subject_code')->get()
        ]);
    }

    // POST /api/admin/subjects
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_code'    => 'required|string|max:20|unique:subjects,subject_code',
            'name'            => 'required|string|max:150',
            'faculty_id'      => 'required|exists:faculties,id',
            'credits'         => 'required|integer|min:1|max:15',
            'theory_hours'    => 'nullable|integer|min:0',
            'practical_hours' => 'nullable|integer|min:0',
        ], [
            'subject_code.required' => 'Vui lòng nhập mã môn học.',
            'subject_code.unique'   => 'Mã môn học đã tồn tại.',
            'name.required'         => 'Vui lòng nhập tên môn học.',
            'faculty_id.required'   => 'Vui lòng chọn Khoa quản lý.',
            'faculty_id.exists'     => 'Khoa được chọn không hợp lệ.',
            'credits.required'      => 'Vui lòng nhập số tín chỉ.',
        ]);

        $validated['theory_hours'] = $validated['theory_hours'] ?? 0;
        $validated['practical_hours'] = $validated['practical_hours'] ?? 0;

        $subject = Subject::create($validated)->load('faculty:id,faculty_code,name');

        return response()->json([
            'message' => 'Thêm môn học thành công.',
            'data'    => $subject
        ], 201);
    }

    // GET /api/admin/subjects/{id}
    public function show($id)
    {
        $subject = Subject::with('faculty:id,faculty_code,name')->findOrFail($id);

        return response()->json([
            'data' => $subject
        ]);
    }

    // PUT /api/admin/subjects/{id}
    public function update(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);

        $validated = $request->validate([
            'subject_code'    => 'required|string|max:20|unique:subjects,subject_code,' . $subject->id,
            'name'            => 'required|string|max:150',
            'faculty_id'      => 'required|exists:faculties,id',
            'credits'         => 'required|integer|min:1|max:15',
            'theory_hours'    => 'nullable|integer|min:0',
            'practical_hours' => 'nullable|integer|min:0',
        ], [
            'subject_code.unique' => 'Mã môn học đã tồn tại.',
            'faculty_id.exists'   => 'Khoa được chọn không hợp lệ.',
        ]);

        $validated['theory_hours'] = $validated['theory_hours'] ?? 0;
        $validated['practical_hours'] = $validated['practical_hours'] ?? 0;

        $subject->update($validated);
        $subject->load('faculty:id,faculty_code,name');

        return response()->json([
            'message' => 'Cập nhật môn học thành công.',
            'data'    => $subject
        ]);
    }

    // DELETE /api/admin/subjects/{id}
    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);

        // Chặn xóa cứng nếu môn học đã có lớp học phần (ON DELETE RESTRICT)
        $hasClasses = DB::table('classes')->where('subject_id', $subject->id)->exists();
        if ($hasClasses) {
            return response()->json([
                'message' => 'Không thể xóa môn học vì đã có lớp học phần được mở.'
            ], 400);
        }

        $subject->delete();

        return response()->json([
            'message' => 'Đã xóa môn học thành công.'
        ]);
    }
}