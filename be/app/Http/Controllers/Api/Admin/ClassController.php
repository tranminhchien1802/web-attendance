<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourseClass;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClassController extends Controller
{
    // GET /api/admin/classes?semester=HK1&academic_year=2026-2027&subject_id=&lecturer_id=&search=
    public function index(Request $request)
    {
        $query = CourseClass::with([
                'subject:id,subject_code,name,credits,theory_hours,practical_hours',
                'lecturer:id,user_code,name,email',
            ])
            ->withCount(['students', 'lessons']);

        if ($request->filled('semester')) {
            $query->where('semester', $request->semester);
        }

        if ($request->filled('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        }

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->filled('lecturer_id')) {
            $query->where('lecturer_id', $request->lecturer_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('class_code', 'like', "%{$search}%")
                  ->orWhereHas('subject', function ($sub) use ($search) {
                      $sub->where('subject_code', 'like', "%{$search}%")
                          ->orWhere('name', 'like', "%{$search}%");
                  });
            });
        }

        return response()->json([
            'data' => $query->latest()->get()
        ]);
    }

    // POST /api/admin/classes
    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_code'    => 'required|string|max:30|unique:classes,class_code',
            'subject_id'    => 'required|exists:subjects,id',
            'lecturer_id'   => 'required|exists:users,id',
            'semester'      => 'required|string|max:10',
            'academic_year' => 'required|string|max:20',
            'room_default'  => 'nullable|string|max:50',
        ], [
            'class_code.required'    => 'Vui lòng nhập mã lớp học phần.',
            'class_code.unique'      => 'Mã lớp học phần đã tồn tại.',
            'subject_id.required'    => 'Vui lòng chọn môn học.',
            'subject_id.exists'      => 'Môn học không hợp lệ.',
            'lecturer_id.required'   => 'Vui lòng phân công giảng viên.',
            'semester.required'      => 'Vui lòng nhập học kỳ.',
            'academic_year.required' => 'Vui lòng nhập năm học.',
        ]);

        // Kiểm tra tài khoản được gán phải có role = lecturer và đang hoạt động
        $lecturer = User::find($validated['lecturer_id']);
        if (!$lecturer || $lecturer->role !== User::ROLE_LECTURER || !$lecturer->is_active) {
            return response()->json([
                'message' => 'Tài khoản được chọn không phải Giảng viên hoặc đang bị khóa.'
            ], 422);
        }

        $courseClass = CourseClass::create($validated)
            ->load([
                'subject:id,subject_code,name,credits,theory_hours,practical_hours',
                'lecturer:id,user_code,name,email',
            ])
            ->loadCount(['students', 'lessons']);

        return response()->json([
            'message' => 'Mở lớp học phần thành công.',
            'data'    => $courseClass
        ], 201);
    }

    // GET /api/admin/classes/{id}
    public function show($id)
    {
        $courseClass = CourseClass::with([
                'subject:id,subject_code,name,credits,theory_hours,practical_hours',
                'lecturer:id,user_code,name,email,phone',
                'students' => function ($q) {
                    $q->select('users.id', 'user_code', 'name', 'email', 'phone', 'gender', 'faculty_id')
                      ->with('faculty:id,faculty_code,name')
                      ->orderBy('user_code');
                },
                'lessons' => function ($q) {
                    $q->with('actualLecturer:id,user_code,name')
                      ->orderBy('lesson_date')
                      ->orderBy('shift_start');
                }
            ])
            ->withCount(['students', 'lessons'])
            ->findOrFail($id);

        return response()->json([
            'data' => $courseClass
        ]);
    }

    // PUT /api/admin/classes/{id}
    public function update(Request $request, $id)
    {
        $courseClass = CourseClass::findOrFail($id);

        $validated = $request->validate([
            'class_code'    => 'required|string|max:30|unique:classes,class_code,' . $courseClass->id,
            'subject_id'    => 'required|exists:subjects,id',
            'lecturer_id'   => 'required|exists:users,id',
            'semester'      => 'required|string|max:10',
            'academic_year' => 'required|string|max:20',
            'room_default'  => 'nullable|string|max:50',
        ], [
            'class_code.unique' => 'Mã lớp học phần đã tồn tại.',
        ]);

        $lecturer = User::find($validated['lecturer_id']);
        if (!$lecturer || $lecturer->role !== User::ROLE_LECTURER || !$lecturer->is_active) {
            return response()->json([
                'message' => 'Tài khoản được chọn không phải Giảng viên hoặc đang bị khóa.'
            ], 422);
        }

        $courseClass->update($validated);
        $courseClass->load([
            'subject:id,subject_code,name,credits,theory_hours,practical_hours',
            'lecturer:id,user_code,name,email',
        ])->loadCount(['students', 'lessons']);

        return response()->json([
            'message' => 'Cập nhật lớp học phần thành công.',
            'data'    => $courseClass
        ]);
    }

    // DELETE /api/admin/classes/{id}
    public function destroy($id)
    {
        $courseClass = CourseClass::findOrFail($id);
        $lessonIds = $courseClass->lessons()->pluck('id');

        if ($lessonIds->isNotEmpty()) {
            $hasHistory = DB::table('attendance_logs')->whereIn('lesson_id', $lessonIds)->exists()
                       || DB::table('teaching_journals')->whereIn('lesson_id', $lessonIds)->exists();

            if ($hasHistory) {
                return response()->json([
                    'message' => 'Không thể xóa lớp học phần đã có dữ liệu điểm danh hoặc nhật ký giảng dạy.'
                ], 400);
            }
        }

        $courseClass->delete();

        return response()->json([
            'message' => 'Đã xóa lớp học phần thành công.'
        ]);
    }

    // POST /api/admin/classes/{id}/students
    public function addStudents(Request $request, $id)
    {
        $courseClass = CourseClass::findOrFail($id);

        $validated = $request->validate([
            'student_ids'   => 'required|array|min:1',
            'student_ids.*' => 'integer|exists:users,id',
        ], [
            'student_ids.required' => 'Vui lòng chọn ít nhất một sinh viên.',
            'student_ids.*.exists' => 'Danh sách có mã sinh viên không tồn tại.',
        ]);

        $requestedIds = array_unique($validated['student_ids']);

        // Kiểm tra tất cả ID phải có role = student và đang hoạt động
        $validStudentsCount = User::whereIn('id', $requestedIds)
            ->where('role', User::ROLE_STUDENT)
            ->where('is_active', true)
            ->count();

        if ($validStudentsCount !== count($requestedIds)) {
            return response()->json([
                'message' => 'Danh sách chứa tài khoản không phải Sinh viên hoặc tài khoản đang bị khóa.'
            ], 422);
        }

        // Lọc bỏ các sinh viên đã tồn tại trong lớp để tránh vi phạm UNIQUE(class_id, student_id)
        $existingIds = $courseClass->students()->pluck('users.id')->toArray();
        $newStudentIds = array_diff($requestedIds, $existingIds);

        if (!empty($newStudentIds)) {
            $attachData = [];
            $now = now();
            foreach ($newStudentIds as $studentId) {
                $attachData[$studentId] = ['joined_at' => $now];
            }
            $courseClass->students()->attach($attachData);
        }

        $courseClass->load([
            'students' => function ($q) {
                $q->select('users.id', 'user_code', 'name', 'email', 'gender', 'faculty_id')
                  ->with('faculty:id,faculty_code,name')
                  ->orderBy('user_code');
            }
        ])->loadCount('students');

        return response()->json([
            'message'     => 'Đã thêm ' . count($newStudentIds) . ' sinh viên mới vào lớp (bỏ qua ' . (count($requestedIds) - count($newStudentIds)) . ' sinh viên đã có trong lớp).',
            'added_count' => count($newStudentIds),
            'data'        => $courseClass->students,
        ]);
    }

    // DELETE /api/admin/classes/{id}/students/{studentId}
    public function removeStudent($id, $studentId)
    {
        $courseClass = CourseClass::findOrFail($id);

        if (!$courseClass->students()->where('users.id', $studentId)->exists()) {
            return response()->json([
                'message' => 'Sinh viên không thuộc lớp học phần này.'
            ], 404);
        }

        // Chặn gỡ nếu sinh viên đã phát sinh lượt điểm danh trong lớp
        $lessonIds = $courseClass->lessons()->pluck('id');
        if ($lessonIds->isNotEmpty()) {
            $hasAttendance = DB::table('attendance_logs')
                ->whereIn('lesson_id', $lessonIds)
                ->where('student_id', $studentId)
                ->exists();

            if ($hasAttendance) {
                return response()->json([
                    'message' => 'Không thể gỡ sinh viên đã có dữ liệu điểm danh trong lớp này.'
                ], 400);
            }
        }

        $courseClass->students()->detach($studentId);

        return response()->json([
            'message' => 'Đã gỡ sinh viên khỏi lớp học phần.'
        ]);
    }
}