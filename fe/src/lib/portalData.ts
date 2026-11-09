export type AttendanceStatus = "present" | "absent" | "excused";
export type TeachingLog = { id: string; classId: string; date: string; topic: string; content: string; homework: string; createdAt: string };
export type QrAttendanceSession = { token: string; classId: string; date: string; expiresAt: number };
export type AttendanceDay = { date: string; records: Record<string, AttendanceStatus> };

export type PortalClass = {
  id: string;
  name: string;
  code: string;
  room: string;
  weekday: string;
  startTime: string;
  endTime: string;
  type: string;
  teacherIds: string[];
  studentIds: string[];
  faculty: string;
  major: string;
};

export type RosterStudent = { id: string; studentId: string; fullName: string; email: string; faculty: string; major: string };

export const portalClasses: PortalClass[] = [
  {
    "id": "WEB-01",
    "code": "WEB-01",
    "name": "Lập trình Web 1",
    "room": "A1.302",
    "weekday": "Thứ 5",
    "startTime": "08:00",
    "endTime": "09:30",
    "type": "Lý thuyết",
    "teacherIds": [
      "tea-001"
    ],
    "studentIds": [
      "20124001",
      "20124002",
      "20124003",
      "20124004"
    ],
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Kỹ thuật phần mềm"
  },
  {
    "id": "CSDL-02",
    "code": "CSDL-02",
    "name": "Cơ sở dữ liệu",
    "room": "B2.204",
    "weekday": "Thứ 5",
    "startTime": "10:00",
    "endTime": "11:30",
    "type": "Thực hành",
    "teacherIds": [
      "tea-001"
    ],
    "studentIds": [
      "20124001",
      "20124002",
      "20124005",
      "20124006"
    ],
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Hệ thống thông tin"
  },
  {
    "id": "PPNC-01",
    "code": "PPNC-01",
    "name": "Phương pháp nghiên cứu",
    "room": "C3.105",
    "weekday": "Thứ 5",
    "startTime": "13:30",
    "endTime": "15:00",
    "type": "Seminar",
    "teacherIds": [
      "tea-001"
    ],
    "studentIds": [
      "20124001",
      "20124003",
      "20124004",
      "20124007"
    ],
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Hệ thống thông tin"
  },
  {
    "id": "UI-03",
    "code": "UI-03",
    "name": "Thiết kế giao diện",
    "room": "D4.210",
    "weekday": "Thứ 6",
    "startTime": "07:30",
    "endTime": "09:00",
    "type": "Thực hành",
    "teacherIds": [
      "tea-002"
    ],
    "studentIds": [
      "20124002",
      "20124005",
      "20124006",
      "20124008"
    ],
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Kỹ thuật phần mềm"
  },
  {
    "id": "NET-02",
    "code": "NET-02",
    "name": "Mạng máy tính",
    "room": "D4.101",
    "weekday": "Thứ 3",
    "startTime": "13:30",
    "endTime": "15:00",
    "type": "Lý thuyết",
    "teacherIds": [
      "tea-002"
    ],
    "studentIds": [
      "20124001",
      "20124005",
      "20124006",
      "20124009"
    ],
    "faculty": "Khoa Công nghệ thông tin",
    "major": "An toàn thông tin"
  },
  {
    "id": "AI-01",
    "code": "AI-01",
    "name": "Trí tuệ nhân tạo",
    "room": "A2.410",
    "weekday": "Thứ 2",
    "startTime": "09:45",
    "endTime": "11:15",
    "type": "Lý thuyết",
    "teacherIds": [
      "tea-003"
    ],
    "studentIds": [
      "20124007",
      "20124008",
      "20124009",
      "20124010"
    ],
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Khoa học dữ liệu"
  },
  {
    "id": "ATTT-01",
    "code": "ATTT-01",
    "name": "An toàn hệ thống",
    "room": "A2.312",
    "weekday": "Thứ 4",
    "startTime": "13:30",
    "endTime": "15:00",
    "type": "Thực hành",
    "teacherIds": [
      "tea-003"
    ],
    "studentIds": [
      "20124005",
      "20124006",
      "20124010",
      "20124011",
      "20124012"
    ],
    "faculty": "Khoa Công nghệ thông tin",
    "major": "An toàn thông tin"
  },
  {
    "id": "HTTT-02",
    "code": "HTTT-02",
    "name": "Phân tích thiết kế hệ thống",
    "room": "A3.205",
    "weekday": "Thứ 6",
    "startTime": "09:45",
    "endTime": "11:15",
    "type": "Lý thuyết",
    "teacherIds": [
      "tea-001"
    ],
    "studentIds": [
      "20124003",
      "20124004",
      "20124011",
      "20124012"
    ],
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Hệ thống thông tin"
  },
  {
    "id": "DIEN-01",
    "code": "DIEN-01",
    "name": "Mạch điện cơ bản",
    "room": "E1.102",
    "weekday": "Thứ 2",
    "startTime": "07:30",
    "endTime": "09:00",
    "type": "Thực hành",
    "teacherIds": [
      "tea-004"
    ],
    "studentIds": [
      "20124013",
      "20124014",
      "20124015",
      "20124016"
    ],
    "faculty": "Khoa Điện - Điện tử",
    "major": "Kỹ thuật điện, điện tử"
  },
  {
    "id": "TUD-02",
    "code": "TUD-02",
    "name": "Điều khiển tự động",
    "room": "E2.214",
    "weekday": "Thứ 3",
    "startTime": "09:45",
    "endTime": "11:15",
    "type": "Lý thuyết",
    "teacherIds": [
      "tea-004"
    ],
    "studentIds": [
      "20124015",
      "20124016",
      "20124017",
      "20124018"
    ],
    "faculty": "Khoa Điện - Điện tử",
    "major": "Tự động hóa"
  },
  {
    "id": "IOT-03",
    "code": "IOT-03",
    "name": "Vi điều khiển và IoT",
    "room": "E3.115",
    "weekday": "Thứ 5",
    "startTime": "13:30",
    "endTime": "15:00",
    "type": "Thực hành",
    "teacherIds": [
      "tea-004"
    ],
    "studentIds": [
      "20124013",
      "20124015",
      "20124017",
      "20124018"
    ],
    "faculty": "Khoa Điện - Điện tử",
    "major": "Điện công nghiệp"
  },
  {
    "id": "CAD-01",
    "code": "CAD-01",
    "name": "Thiết kế CAD 3D",
    "room": "M1.206",
    "weekday": "Thứ 2",
    "startTime": "13:30",
    "endTime": "15:00",
    "type": "Thực hành",
    "teacherIds": [
      "tea-005"
    ],
    "studentIds": [
      "20124019",
      "20124020",
      "20124021",
      "20124022"
    ],
    "faculty": "Khoa Cơ khí chế tạo máy",
    "major": "Công nghệ kỹ thuật cơ khí"
  },
  {
    "id": "COHI-02",
    "code": "COHI-02",
    "name": "Công nghệ chế tạo máy",
    "room": "M2.102",
    "weekday": "Thứ 4",
    "startTime": "07:30",
    "endTime": "09:00",
    "type": "Lý thuyết",
    "teacherIds": [
      "tea-005"
    ],
    "studentIds": [
      "20124020",
      "20124021",
      "20124022",
      "20124023",
      "20124024"
    ],
    "faculty": "Khoa Cơ khí chế tạo máy",
    "major": "Cơ điện tử"
  },
  {
    "id": "KT-01",
    "code": "KT-01",
    "name": "Nguyên lý kế toán",
    "room": "B1.302",
    "weekday": "Thứ 3",
    "startTime": "07:30",
    "endTime": "09:00",
    "type": "Lý thuyết",
    "teacherIds": [
      "tea-006"
    ],
    "studentIds": [
      "20124025",
      "20124026",
      "20124027",
      "20124029"
    ],
    "faculty": "Khoa Kinh tế",
    "major": "Kế toán"
  },
  {
    "id": "QTKD-02",
    "code": "QTKD-02",
    "name": "Quản trị học",
    "room": "B3.205",
    "weekday": "Thứ 4",
    "startTime": "09:45",
    "endTime": "11:15",
    "type": "Seminar",
    "teacherIds": [
      "tea-006"
    ],
    "studentIds": [
      "20124026",
      "20124027",
      "20124028",
      "20124029"
    ],
    "faculty": "Khoa Kinh tế",
    "major": "Quản trị kinh doanh"
  },
  {
    "id": "TMDT-03",
    "code": "TMDT-03",
    "name": "Kinh doanh số và thương mại điện tử",
    "room": "B4.110",
    "weekday": "Thứ 6",
    "startTime": "13:30",
    "endTime": "15:00",
    "type": "Thực hành",
    "teacherIds": [
      "tea-006"
    ],
    "studentIds": [
      "20124025",
      "20124027",
      "20124028",
      "20124030"
    ],
    "faculty": "Khoa Kinh tế",
    "major": "Thương mại điện tử"
  }
];

const roster: RosterStudent[] = [
  {
    "id": "20124001",
    "studentId": "20124001",
    "fullName": "Nguyễn Văn An",
    "email": "student@hcmute.edu.vn",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Kỹ thuật phần mềm"
  },
  {
    "id": "20124002",
    "studentId": "20124002",
    "fullName": "Lê Thị Lan",
    "email": "student2@hcmute.edu.vn",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Kỹ thuật phần mềm"
  },
  {
    "id": "20124003",
    "studentId": "20124003",
    "fullName": "Trần Minh Khang",
    "email": "student03@hcmute.edu.vn",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Hệ thống thông tin"
  },
  {
    "id": "20124004",
    "studentId": "20124004",
    "fullName": "Phạm Ngọc Mai",
    "email": "student04@hcmute.edu.vn",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Hệ thống thông tin"
  },
  {
    "id": "20124005",
    "studentId": "20124005",
    "fullName": "Võ Quốc Bảo",
    "email": "student05@hcmute.edu.vn",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "An toàn thông tin"
  },
  {
    "id": "20124006",
    "studentId": "20124006",
    "fullName": "Đặng Thu Hà",
    "email": "student06@hcmute.edu.vn",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "An toàn thông tin"
  },
  {
    "id": "20124007",
    "studentId": "20124007",
    "fullName": "Bùi Hoàng Nam",
    "email": "student07@hcmute.edu.vn",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Khoa học dữ liệu"
  },
  {
    "id": "20124008",
    "studentId": "20124008",
    "fullName": "Nguyễn Khánh Vy",
    "email": "student08@hcmute.edu.vn",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Khoa học dữ liệu"
  },
  {
    "id": "20124009",
    "studentId": "20124009",
    "fullName": "Lý Gia Hân",
    "email": "student09@hcmute.edu.vn",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Kỹ thuật phần mềm"
  },
  {
    "id": "20124010",
    "studentId": "20124010",
    "fullName": "Đỗ Minh Quân",
    "email": "student10@hcmute.edu.vn",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "An toàn thông tin"
  },
  {
    "id": "20124011",
    "studentId": "20124011",
    "fullName": "Trương Hải Yến",
    "email": "student11@hcmute.edu.vn",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Hệ thống thông tin"
  },
  {
    "id": "20124012",
    "studentId": "20124012",
    "fullName": "Phan Tuấn Kiệt",
    "email": "student12@hcmute.edu.vn",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Khoa học dữ liệu"
  },
  {
    "id": "20124013",
    "studentId": "20124013",
    "fullName": "Huỳnh Quốc Duy",
    "email": "student13@hcmute.edu.vn",
    "faculty": "Khoa Điện - Điện tử",
    "major": "Kỹ thuật điện, điện tử"
  },
  {
    "id": "20124014",
    "studentId": "20124014",
    "fullName": "Nguyễn Thị Kim Oanh",
    "email": "student14@hcmute.edu.vn",
    "faculty": "Khoa Điện - Điện tử",
    "major": "Kỹ thuật điện, điện tử"
  },
  {
    "id": "20124015",
    "studentId": "20124015",
    "fullName": "Đỗ Hoàng Long",
    "email": "student15@hcmute.edu.vn",
    "faculty": "Khoa Điện - Điện tử",
    "major": "Tự động hóa"
  },
  {
    "id": "20124016",
    "studentId": "20124016",
    "fullName": "Trần Bảo Trân",
    "email": "student16@hcmute.edu.vn",
    "faculty": "Khoa Điện - Điện tử",
    "major": "Tự động hóa"
  },
  {
    "id": "20124017",
    "studentId": "20124017",
    "fullName": "Lê Thanh Tùng",
    "email": "student17@hcmute.edu.vn",
    "faculty": "Khoa Điện - Điện tử",
    "major": "Điện công nghiệp"
  },
  {
    "id": "20124018",
    "studentId": "20124018",
    "fullName": "Vũ Ngọc Diệp",
    "email": "student18@hcmute.edu.vn",
    "faculty": "Khoa Điện - Điện tử",
    "major": "Tự động hóa"
  },
  {
    "id": "20124019",
    "studentId": "20124019",
    "fullName": "Phạm Gia Huy",
    "email": "student19@hcmute.edu.vn",
    "faculty": "Khoa Cơ khí chế tạo máy",
    "major": "Công nghệ kỹ thuật cơ khí"
  },
  {
    "id": "20124020",
    "studentId": "20124020",
    "fullName": "Nguyễn Đức Minh",
    "email": "student20@hcmute.edu.vn",
    "faculty": "Khoa Cơ khí chế tạo máy",
    "major": "Công nghệ kỹ thuật cơ khí"
  },
  {
    "id": "20124021",
    "studentId": "20124021",
    "fullName": "Trần Nhật Linh",
    "email": "student21@hcmute.edu.vn",
    "faculty": "Khoa Cơ khí chế tạo máy",
    "major": "Cơ điện tử"
  },
  {
    "id": "20124022",
    "studentId": "20124022",
    "fullName": "Lê Quang Hào",
    "email": "student22@hcmute.edu.vn",
    "faculty": "Khoa Cơ khí chế tạo máy",
    "major": "Công nghệ kỹ thuật cơ khí"
  },
  {
    "id": "20124023",
    "studentId": "20124023",
    "fullName": "Phạm Thùy Dương",
    "email": "student23@hcmute.edu.vn",
    "faculty": "Khoa Cơ khí chế tạo máy",
    "major": "Cơ điện tử"
  },
  {
    "id": "20124024",
    "studentId": "20124024",
    "fullName": "Võ Thành Đạt",
    "email": "student24@hcmute.edu.vn",
    "faculty": "Khoa Cơ khí chế tạo máy",
    "major": "Cơ điện tử"
  },
  {
    "id": "20124025",
    "studentId": "20124025",
    "fullName": "Mai Hoài Phương",
    "email": "student25@hcmute.edu.vn",
    "faculty": "Khoa Kinh tế",
    "major": "Kế toán"
  },
  {
    "id": "20124026",
    "studentId": "20124026",
    "fullName": "Trần Quốc Hưng",
    "email": "student26@hcmute.edu.vn",
    "faculty": "Khoa Kinh tế",
    "major": "Quản trị kinh doanh"
  },
  {
    "id": "20124027",
    "studentId": "20124027",
    "fullName": "Nguyễn Ngọc Châu",
    "email": "student27@hcmute.edu.vn",
    "faculty": "Khoa Kinh tế",
    "major": "Thương mại điện tử"
  },
  {
    "id": "20124028",
    "studentId": "20124028",
    "fullName": "Đặng Phương Anh",
    "email": "student28@hcmute.edu.vn",
    "faculty": "Khoa Kinh tế",
    "major": "Quản trị kinh doanh"
  },
  {
    "id": "20124029",
    "studentId": "20124029",
    "fullName": "Lê Minh Khôi",
    "email": "student29@hcmute.edu.vn",
    "faculty": "Khoa Kinh tế",
    "major": "Kế toán"
  },
  {
    "id": "20124030",
    "studentId": "20124030",
    "fullName": "Bùi Thảo Nguyên",
    "email": "student30@hcmute.edu.vn",
    "faculty": "Khoa Kinh tế",
    "major": "Thương mại điện tử"
  }
];

const ATTENDANCE_KEY = "phg_attendance_records_v1";
const TEACHING_LOG_KEY = "phg_teaching_logs_v1";
const QR_SESSION_KEY = "phg_qr_attendance_sessions_v1";
const GRADES_KEY = "phg_course_grades_v1";
type GradeRecord = { process?: number; exam?: number };
type AttendanceStore = Record<string, Record<string, AttendanceStatus>>;

export function getClassesForTeacher(teacherId: string) {
  return portalClasses.filter((course) => course.teacherIds.includes(teacherId));
}

export function getClassesForStudent(studentId?: string) {
  return studentId ? portalClasses.filter((course) => course.studentIds.includes(studentId)) : [];
}

export function getPortalClass(classId: string) {
  return portalClasses.find((course) => course.id.toLowerCase() === classId.toLowerCase());
}

export function getClassRoster(classId: string) {
  const course = getPortalClass(classId);
  if (!course) return [];
  return course.studentIds.map((id) => roster.find((student) => student.id === id)).filter((student): student is RosterStudent => Boolean(student));
}

function readAttendanceStore(): AttendanceStore {
  if (typeof window === "undefined") return {};
  try {
    const value = window.localStorage.getItem(ATTENDANCE_KEY);
    return value ? JSON.parse(value) as AttendanceStore : {};
  } catch {
    return {};
  }
}

export function getClassAttendance(classId: string, date: string) {
  return readAttendanceStore()[`${classId}|${date}`] ?? {};
}

export function saveClassAttendance(classId: string, date: string, records: Record<string, AttendanceStatus>) {
  const store = readAttendanceStore();
  store[`${classId}|${date}`] = records;
  window.localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(store));
}

export function getAttendanceDays(classId: string): AttendanceDay[] {
  return Object.entries(readAttendanceStore()).filter(([key]) => key.startsWith(classId + "|"))
    .map(([key, records]) => ({ date: key.slice(classId.length + 1), records })).sort((a, b) => a.date.localeCompare(b.date));
}
function readTeachingLogs(): TeachingLog[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(TEACHING_LOG_KEY) || "[]") as TeachingLog[]; } catch { return []; }
}
export function getTeachingLogs(classId?: string) {
  return readTeachingLogs().filter((item) => !classId || item.classId === classId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}
export function saveTeachingLog(entry: Omit<TeachingLog, "id" | "createdAt">) {
  const saved: TeachingLog = { ...entry, id: "log-" + Date.now(), createdAt: new Date().toISOString() };
  window.localStorage.setItem(TEACHING_LOG_KEY, JSON.stringify([saved, ...readTeachingLogs()])); return saved;
}
function readQrSessions(): Record<string, QrAttendanceSession> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(QR_SESSION_KEY) || "{}") as Record<string, QrAttendanceSession>; } catch { return {}; }
}
export function createQrAttendanceSession(classId: string, date: string) {
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else bytes.forEach((_, i) => { bytes[i] = Math.floor(Math.random() * 256); });
  const token = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  const session = { token, classId, date, expiresAt: Date.now() + 10 * 60 * 1000 };
  const sessions = readQrSessions(); sessions[token] = session;
  window.localStorage.setItem(QR_SESSION_KEY, JSON.stringify(sessions)); return session;
}
export function markPresentWithQr(token: string, studentId: string) {
  const session = readQrSessions()[token.trim().toUpperCase()];
  if (!session || session.expiresAt < Date.now()) return { ok: false as const, message: "Mã QR không hợp lệ hoặc đã hết hạn." };
  const course = getPortalClass(session.classId);
  if (!course || !course.studentIds.includes(studentId)) return { ok: false as const, message: "Sinh viên không thuộc lớp của mã QR này." };
  const records = getClassAttendance(course.id, session.date);
  if (records[studentId] === "present") return { ok: true as const, message: "Bạn đã được điểm danh lớp " + course.code + ".", className: course.name };
  saveClassAttendance(course.id, session.date, { ...records, [studentId]: "present" });
  return { ok: true as const, message: "Điểm danh thành công lớp " + course.code + ".", className: course.name };
}
function readGrades(): Record<string, Record<string, GradeRecord>> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(GRADES_KEY) || "{}") as Record<string, Record<string, GradeRecord>>; } catch { return {}; }
}
export function getClassGrades(classId: string) { return readGrades()[classId] ?? {}; }
export function saveClassGrade(classId: string, studentId: string, kind: "process" | "exam", value: number | undefined) {
  const grades = readGrades(); const classGrades = grades[classId] ?? {};
  classGrades[studentId] = { ...classGrades[studentId], [kind]: value }; grades[classId] = classGrades;
  window.localStorage.setItem(GRADES_KEY, JSON.stringify(grades));
}
export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
