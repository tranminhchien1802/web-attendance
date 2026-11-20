<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourseClass;
use App\Models\Lesson;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LessonController extends Controller
{
    // GET /api/admin/lessons?class_id=&lecturer_id=&lesson_date=&status=
    public function index(Request $request)
    {
        $query = Lesson::with([
            'courseClass:id,class_code,subject_id,lecturer_id,semester,academic_year',
            'courseClass.subject:id,subject_code,name',
            'courseClass.lecturer:id,user_code,name',
            'actualLecturer:id,user_code,name',
        ]);

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->filled('lecturer_id')) {
            $lecturerId = $request->lecturer_id;
            $query->where(function ($q) use ($lecturerId) {
                $q->where('actual_lecturer_id', $lecturerId)
                  ->orWhere(function ($sub) use ($lecturerId) {
                      $sub->whereNull('actual_lecturer_id')
                          ->whereHas('courseClass', fn ($c) => $c->where('lecturer_id', $lecturerId));
                  });
            });
        }

        if ($request->filled('lesson_date')) {
            $query->whereDate('lesson_date', $request->lesson_date);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json([
            'data' => $query->orderBy('lesson_date')->orderBy('shift_start')->get()
        ]);
    }

    // POST /api/admin/lessons
    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id'           => 'required|exists:classes,id',
            'lesson_number'      => 'nullable|integer|min:1',
            'room'               => 'nullable|string|max:50',
            'lesson_date'        => 'required|date',
            'shift_start'        => 'required|integer|min:1|max:15',
            'shift_end'          => 'required|integer|gte:shift_start|max:15',
            'hours'              => 'nullable|integer|min:1|max:15',
            'type'               => 'nullable|in:regular,makeup',
            'actual_lecturer_id' => 'nullable|exists:users,id',
            'status'             => 'nullable|in:scheduled,in_progress,completed,cancelled',
        ], [
            'class_id.required'    => 'Vui lòng chọn lớp học phần.',
            'lesson_date.required' => 'Vui lòng chọn ngày học.',
            'shift_start.required' => 'Vui lòng nhập tiết bắt đầu.',
            'shift_end.gte'        => 'Tiết kết thúc phải lớn hơn hoặc bằng tiết bắt đầu.',
        ]);

        $courseClass = CourseClass::with(['subject', 'students:id'])->findOrFail($validated['class_id']);

        // Kế thừa phòng mặc định của lớp nếu không truyền room riêng
        $room = trim($validated['room'] ?? $courseClass->room_default ?? '');
        if ($room === '') {
            return response()->json([
                'message' => 'Vui lòng nhập phòng học (lớp học phần chưa cấu hình phòng mặc định).'
            ], 422);
        }

        // Kiểm tra giảng viên dạy thay (nếu có)
        if (!empty($validated['actual_lecturer_id'])) {
            $subLecturer = User::find($validated['actual_lecturer_id']);
            if (!$subLecturer || $subLecturer->role !== User::ROLE_LECTURER || !$subLecturer->is_active) {
                return response()->json([
                    'message' => 'Giảng viên dạy thay không hợp lệ hoặc tài khoản đang bị khóa.'
                ], 422);
            }
        }

        $effectiveLecturerId = $validated['actual_lecturer_id'] ?? $courseClass->lecturer_id;

        // Kiểm tra quy tắc BR-01 (Trùng phòng / Trùng lịch giảng viên)
        if ($conflictMessage = $this->checkScheduleConflict($validated['lesson_date'], $validated['shift_start'], $validated['shift_end'], $room, $effectiveLecturerId)) {
            return response()->json([
                'message' => $conflictMessage
            ], 422);
        }

        $lessonNumber = $validated['lesson_number']
            ?? ((int) Lesson::where('class_id', $courseClass->id)->max('lesson_number') + 1);

        $hours = $validated['hours'] ?? ($validated['shift_end'] - $validated['shift_start'] + 1);

        $lesson = Lesson::create([
            'class_id'           => $courseClass->id,
            'lesson_number'      => $lessonNumber,
            'hours'              => $hours,
            'room'               => $room,
            'lesson_date'        => $validated['lesson_date'],
            'shift_start'        => $validated['shift_start'],
            'shift_end'          => $validated['shift_end'],
            'type'               => $validated['type'] ?? 'regular',
            'actual_lecturer_id' => $validated['actual_lecturer_id'] ?? null,
            'status'             => $validated['status'] ?? 'scheduled',
        ]);

        // Gửi thông báo tự động (FR-12) cho Giảng viên và Sinh viên lớp
        $this->notifySchedule($courseClass, $lesson, 'Lịch học mới');

        $lesson->load([
            'courseClass:id,class_code,subject_id,lecturer_id',
            'courseClass.subject:id,subject_code,name',
            'courseClass.lecturer:id,user_code,name',
            'actualLecturer:id,user_code,name',
        ]);

        return response()->json([
            'message' => 'Xếp lịch buổi học thành công.',
            'data'    => $lesson
        ], 201);
    }

    // GET /api/admin/lessons/{id}
    public function show($id)
    {
        $lesson = Lesson::with([
            'courseClass:id,class_code,subject_id,lecturer_id,semester,academic_year',
            'courseClass.subject:id,subject_code,name',
            'courseClass.lecturer:id,user_code,name',
            'actualLecturer:id,user_code,name',
        ])->findOrFail($id);

        return response()->json([
            'data' => $lesson
        ]);
    }

    // PUT /api/admin/lessons/{id}
    public function update(Request $request, $id)
    {
        $lesson = Lesson::with('courseClass.subject', 'courseClass.students:id')->findOrFail($id);

        $validated = $request->validate([
            'lesson_number'      => 'nullable|integer|min:1',
            'room'               => 'required|string|max:50',
            'lesson_date'        => 'required|date',
            'shift_start'        => 'required|integer|min:1|max:15',
            'shift_end'          => 'required|integer|gte:shift_start|max:15',
            'hours'              => 'nullable|integer|min:1|max:15',
            'type'               => 'required|in:regular,makeup',
            'actual_lecturer_id' => 'nullable|exists:users,id',
            'status'             => 'required|in:scheduled,in_progress,completed,cancelled',
        ]);

        if (!empty($validated['actual_lecturer_id'])) {
            $subLecturer = User::find($validated['actual_lecturer_id']);
            if (!$subLecturer || $subLecturer->role !== User::ROLE_LECTURER || !$subLecturer->is_active) {
                return response()->json([
                    'message' => 'Giảng viên dạy thay không hợp lệ hoặc tài khoản đang bị khóa.'
                ], 422);
            }
        }

        // Chỉ kiểm tra trùng lịch nếu buổi học không ở trạng thái cancelled
        if ($validated['status'] !== 'cancelled') {
            $effectiveLecturerId = $validated['actual_lecturer_id'] ?? $lesson->courseClass->lecturer_id;

            if ($conflictMessage = $this->checkScheduleConflict($validated['lesson_date'], $validated['shift_start'], $validated['shift_end'], $validated['room'], $effectiveLecturerId, $lesson->id)) {
                return response()->json([
                    'message' => $conflictMessage
                ], 422);
            }
        }

        $validated['hours'] = $validated['hours'] ?? ($validated['shift_end'] - $validated['shift_start'] + 1);
        $lesson->update($validated);

        // Bắn thông báo cập nhật lịch / đổi phòng học (FR-12)
        $prefix = $validated['status'] === 'cancelled' ? 'Thông báo hủy buổi học' : 'Cập nhật lịch học / phòng học';
        $this->notifySchedule($lesson->courseClass, $lesson, $prefix);

        $lesson->load([
            'courseClass:id,class_code,subject_id,lecturer_id',
            'courseClass.subject:id,subject_code,name',
            'courseClass.lecturer:id,user_code,name',
            'actualLecturer:id,user_code,name',
        ]);

        return response()->json([
            'message' => 'Cập nhật buổi học thành công.',
            'data'    => $lesson
        ]);
    }

    // DELETE /api/admin/lessons/{id}
    public function destroy($id)
    {
        $lesson = Lesson::findOrFail($id);

        $hasData = DB::table('attendance_logs')->where('lesson_id', $lesson->id)->exists()
                || DB::table('attendance_sessions')->where('lesson_id', $lesson->id)->exists()
                || DB::table('teaching_journals')->where('lesson_id', $lesson->id)->exists();

        if ($hasData) {
            return response()->json([
                'message' => 'Buổi học đã phát sinh dữ liệu điểm danh hoặc nhật ký, không thể xóa. Hãy chuyển trạng thái sang cancelled.'
            ], 400);
        }

        $lesson->delete();

        return response()->json([
            'message' => 'Đã xóa buổi học thành công.'
        ]);
    }

    /**
     * Thuật toán kiểm tra trùng lịch phòng học & giảng viên (BR-01)
     */
    private function checkScheduleConflict(string $lessonDate, int $shiftStart, int $shiftEnd, string $room, int $effectiveLecturerId, ?int $ignoreLessonId = null): ?string
    {
        // 1. Kiểm tra trùng phòng học
        $roomConflict = Lesson::with('courseClass')
            ->whereDate('lesson_date', $lessonDate)
            ->where('status', '!=', 'cancelled')
            ->when($ignoreLessonId, fn ($q) => $q->where('id', '!=', $ignoreLessonId))
            ->where('room', $room)
            ->where('shift_start', '<=', $shiftEnd)
            ->where('shift_end', '>=', $shiftStart)
            ->first();

        if ($roomConflict) {
            return "Trùng phòng: Phòng {$room} đã được xếp cho lớp {$roomConflict->courseClass->class_code} (Tiết {$roomConflict->shift_start}-{$roomConflict->shift_end}) ngày {$lessonDate}.";
        }

        // 2. Kiểm tra trùng lịch giảng viên đứng lớp (ưu tiên actual_lecturer_id nếu dạy thay)
        $lecturerConflict = Lesson::with('courseClass')
            ->whereDate('lesson_date', $lessonDate)
            ->where('status', '!=', 'cancelled')
            ->when($ignoreLessonId, fn ($q) => $q->where('id', '!=', $ignoreLessonId))
            ->where('shift_start', '<=', $shiftEnd)
            ->where('shift_end', '>=', $shiftStart)
            ->where(function ($q) use ($effectiveLecturerId) {
                $q->where('actual_lecturer_id', $effectiveLecturerId)
                  ->orWhere(function ($sub) use ($effectiveLecturerId) {
                      $sub->whereNull('actual_lecturer_id')
                          ->whereHas('courseClass', fn ($c) => $c->where('lecturer_id', $effectiveLecturerId));
                  });
            })
            ->first();

        if ($lecturerConflict) {
            return "Vi phạm Trùng giảng viên: Giảng viên đã có lịch dạy lớp {$lecturerConflict->courseClass->class_code} (Tiết {$lecturerConflict->shift_start}-{$lecturerConflict->shift_end}) ngày {$lessonDate}.";
        }

        return null;
    }

    /**
     * Gửi thông báo tự động cho Giảng viên và Sinh viên lớp (FR-12)
     */
    private function notifySchedule(CourseClass $courseClass, Lesson $lesson, string $prefix): void
    {
        $recipientIds = $courseClass->students->pluck('id')->toArray();
        $recipientIds[] = $courseClass->lecturer_id;

        if ($lesson->actual_lecturer_id) {
            $recipientIds[] = $lesson->actual_lecturer_id;
        }

        $recipientIds = array_unique($recipientIds);
        $subjectName = $courseClass->subject->name ?? $courseClass->class_code;
        $title = "{$prefix}: {$subjectName} ({$courseClass->class_code})";
        $content = "Buổi {$lesson->lesson_number} ngày {$lesson->lesson_date}, Tiết {$lesson->shift_start}-{$lesson->shift_end}, Phòng {$lesson->room}.";
        $now = now();

        $rows = [];
        foreach ($recipientIds as $userId) {
            $rows[] = [
                'user_id'    => $userId,
                'title'      => $title,
                'content'    => $content,
                'type'       => 'system_alert',
                'is_read'    => false,
                'created_at' => $now,
            ];
        }

        if (!empty($rows)) {
            Notification::insert($rows);
        }
    }
}