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
};

export type RosterStudent = { id: string; studentId: string; fullName: string; email: string };

export const portalClasses: PortalClass[] = [
  { id: "WEB-01", name: "Lập trình Web 1", code: "WEB-01", room: "A1.302", weekday: "Thứ 5", startTime: "08:00", endTime: "09:30", type: "Lý thuyết", teacherIds: ["tea-001"], studentIds: ["20124001", "20124002", "20124003", "20124004"] },
  { id: "CSDL-02", name: "Cơ sở dữ liệu", code: "CSDL-02", room: "B2.204", weekday: "Thứ 5", startTime: "10:00", endTime: "11:30", type: "Thực hành", teacherIds: ["tea-001"], studentIds: ["20124001", "20124002", "20124005"] },
  { id: "PPNC-01", name: "Phương pháp nghiên cứu", code: "PPNC-01", room: "C3.105", weekday: "Thứ 5", startTime: "13:30", endTime: "15:00", type: "Seminar", teacherIds: ["tea-001"], studentIds: ["20124001", "20124003", "20124004"] },
  { id: "UI-03", name: "Thiết kế giao diện", code: "UI-03", room: "D4.210", weekday: "Thứ 6", startTime: "07:30", endTime: "09:00", type: "Thực hành", teacherIds: ["tea-002"], studentIds: ["20124002", "20124005", "20124006"] },
  { id: "NET-02", name: "Mạng máy tính", code: "NET-02", room: "D4.101", weekday: "Thứ 3", startTime: "13:30", endTime: "15:00", type: "Lý thuyết", teacherIds: ["tea-002"], studentIds: ["20124001", "20124005", "20124006"] },
];

const roster: RosterStudent[] = [
  { id: "20124001", studentId: "20124001", fullName: "Nguyễn Văn An", email: "student@hcmute.edu.vn" },
  { id: "20124002", studentId: "20124002", fullName: "Lê Thị Lan", email: "student2@hcmute.edu.vn" },
  { id: "20124003", studentId: "20124003", fullName: "Trần Minh Khang", email: "khang.tran@example.com" },
  { id: "20124004", studentId: "20124004", fullName: "Phạm Ngọc Mai", email: "mai.pham@example.com" },
  { id: "20124005", studentId: "20124005", fullName: "Võ Quốc Bảo", email: "bao.vo@example.com" },
  { id: "20124006", studentId: "20124006", fullName: "Đặng Thu Hà", email: "ha.dang@example.com" },
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
