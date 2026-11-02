export type UserRole = "student" | "teacher" | "admin";

export type AppUser = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  studentId?: string;
  department?: string;
};

const USERS_KEY = "hcmute_users";
const CURRENT_USER_KEY = "hcmute_current_user";

const seedUsers: AppUser[] = [
  {
    id: "stu-001",
    fullName: "Nguyễn Văn A",
    email: "student@hcmute.edu.vn",
    password: "123456",
    role: "student",
    studentId: "20124001",
    department: "Kỹ thuật phần mềm",
  },
  {
    id: "stu-002",
    fullName: "Lê Thị Lan",
    email: "student2@hcmute.edu.vn",
    password: "123456",
    role: "student",
    studentId: "20124002",
    department: "Kỹ thuật phần mềm",
  },
  {
    id: "tea-001",
    fullName: "Trần Thị B",
    email: "teacher@hcmute.edu.vn",
    password: "123456",
    role: "teacher",
    department: "Khoa Công nghệ Thông tin",
    studentId: "GV-001",
  },
  {
    id: "tea-002",
    fullName: "Phạm Minh C",
    email: "teacher2@hcmute.edu.vn",
    password: "123456",
    role: "teacher",
    department: "Khoa Công nghệ Thông tin",
    studentId: "GV-002",
  },
  {
    id: "adm-001",
    fullName: "Admin HCMUTE",
    email: "admin@hcmute.edu.vn",
    password: "123456",
    role: "admin",
    department: "Phòng Đào tạo",
  },
];

function readUsers(): AppUser[] {
  if (typeof window === "undefined") return seedUsers;

  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }

  try {
    const parsed = JSON.parse(raw) as AppUser[];
    return parsed.length ? parsed : seedUsers;
  } catch {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
}

function writeUsers(users: AppUser[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

export function getUsers(): AppUser[] {
  return readUsers().map((user) => ({ ...user, password: "" }));
}

export function getCurrentUser(): AppUser | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AppUser;
  } catch {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

export function setCurrentUser(user: AppUser | null) {
  if (typeof window === "undefined") return;

  if (!user) {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    return;
  }

  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function loginWithCredentials(email: string, password: string) {
  const users = readUsers();
  const user = users.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
  );

  if (!user) return null;

  const safeUser = {
    ...user,
    password: "",
  };

  setCurrentUser(safeUser);
  return safeUser;
}

export function registerUser(payload: {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
}) {
  if (payload.role === "admin") {
    throw new Error("Không thể đăng ký tài khoản admin từ giao diện người dùng.");
  }

  const users = readUsers();

  const exists = users.some((user) => user.email.toLowerCase() === payload.email.trim().toLowerCase());
  if (exists) throw new Error("Email đã tồn tại trong hệ thống.");

  const newUser: AppUser = {
    id: `${payload.role}-${Date.now()}`,
    fullName: payload.fullName.trim(),
    email: payload.email.trim(),
    password: payload.password,
    role: payload.role,
    department: payload.department?.trim() || "Chưa cập nhật",
    studentId: payload.role === "student" ? `SV${Date.now().toString().slice(-6)}` : `GV${Date.now().toString().slice(-6)}`,
  };

  const updated = [...users, newUser];
  writeUsers(updated);

  const safeUser = { ...newUser, password: "" };
  setCurrentUser(safeUser);
  return safeUser;
}

export function updateUserRole(userId: string, nextRole: Exclude<UserRole, "admin">) {
  const users = readUsers();
  const updated = users.map((user) => {
    if (user.id !== userId) return user;

    return {
      ...user,
      role: nextRole,
      studentId:
        nextRole === "student"
          ? user.studentId || `SV${Date.now().toString().slice(-6)}`
          : user.studentId || `GV${Date.now().toString().slice(-6)}`,
    };
  });

  writeUsers(updated);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    const target = updated.find((user) => user.id === userId);
    if (target) setCurrentUser({ ...target, password: "" });
  }

  return updated;
}

export function logoutUser() {
  setCurrentUser(null);
}

export function isAuthenticated() {
  return Boolean(getCurrentUser());
}
