export type UserRole = "student" | "teacher" | "admin";

export type AppUser = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  faculty?: string;
  major?: string;
};

const USERS_KEY = "hcmute_users";
const CURRENT_USER_KEY = "hcmute_current_user";

const seedUsers: AppUser[] = [
  {
    "id": "stu-001",
    "fullName": "Nguyễn Văn An",
    "email": "student@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124001",
    "department": "Kỹ thuật phần mềm",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Kỹ thuật phần mềm"
  },
  {
    "id": "stu-002",
    "fullName": "Lê Thị Lan",
    "email": "student2@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124002",
    "department": "Kỹ thuật phần mềm",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Kỹ thuật phần mềm"
  },
  {
    "id": "stu-003",
    "fullName": "Trần Minh Khang",
    "email": "student03@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124003",
    "department": "Hệ thống thông tin",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Hệ thống thông tin"
  },
  {
    "id": "stu-004",
    "fullName": "Phạm Ngọc Mai",
    "email": "student04@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124004",
    "department": "Hệ thống thông tin",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Hệ thống thông tin"
  },
  {
    "id": "stu-005",
    "fullName": "Võ Quốc Bảo",
    "email": "student05@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124005",
    "department": "An toàn thông tin",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "An toàn thông tin"
  },
  {
    "id": "stu-006",
    "fullName": "Đặng Thu Hà",
    "email": "student06@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124006",
    "department": "An toàn thông tin",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "An toàn thông tin"
  },
  {
    "id": "stu-007",
    "fullName": "Bùi Hoàng Nam",
    "email": "student07@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124007",
    "department": "Khoa học dữ liệu",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Khoa học dữ liệu"
  },
  {
    "id": "stu-008",
    "fullName": "Nguyễn Khánh Vy",
    "email": "student08@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124008",
    "department": "Khoa học dữ liệu",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Khoa học dữ liệu"
  },
  {
    "id": "stu-009",
    "fullName": "Lý Gia Hân",
    "email": "student09@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124009",
    "department": "Kỹ thuật phần mềm",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Kỹ thuật phần mềm"
  },
  {
    "id": "stu-010",
    "fullName": "Đỗ Minh Quân",
    "email": "student10@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124010",
    "department": "An toàn thông tin",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "An toàn thông tin"
  },
  {
    "id": "stu-011",
    "fullName": "Trương Hải Yến",
    "email": "student11@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124011",
    "department": "Hệ thống thông tin",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Hệ thống thông tin"
  },
  {
    "id": "stu-012",
    "fullName": "Phan Tuấn Kiệt",
    "email": "student12@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124012",
    "department": "Khoa học dữ liệu",
    "faculty": "Khoa Công nghệ thông tin",
    "major": "Khoa học dữ liệu"
  },
  {
    "id": "stu-013",
    "fullName": "Huỳnh Quốc Duy",
    "email": "student13@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124013",
    "department": "Kỹ thuật điện, điện tử",
    "faculty": "Khoa Điện - Điện tử",
    "major": "Kỹ thuật điện, điện tử"
  },
  {
    "id": "stu-014",
    "fullName": "Nguyễn Thị Kim Oanh",
    "email": "student14@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124014",
    "department": "Kỹ thuật điện, điện tử",
    "faculty": "Khoa Điện - Điện tử",
    "major": "Kỹ thuật điện, điện tử"
  },
  {
    "id": "stu-015",
    "fullName": "Đỗ Hoàng Long",
    "email": "student15@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124015",
    "department": "Tự động hóa",
    "faculty": "Khoa Điện - Điện tử",
    "major": "Tự động hóa"
  },
  {
    "id": "stu-016",
    "fullName": "Trần Bảo Trân",
    "email": "student16@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124016",
    "department": "Tự động hóa",
    "faculty": "Khoa Điện - Điện tử",
    "major": "Tự động hóa"
  },
  {
    "id": "stu-017",
    "fullName": "Lê Thanh Tùng",
    "email": "student17@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124017",
    "department": "Điện công nghiệp",
    "faculty": "Khoa Điện - Điện tử",
    "major": "Điện công nghiệp"
  },
  {
    "id": "stu-018",
    "fullName": "Vũ Ngọc Diệp",
    "email": "student18@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124018",
    "department": "Tự động hóa",
    "faculty": "Khoa Điện - Điện tử",
    "major": "Tự động hóa"
  },
  {
    "id": "stu-019",
    "fullName": "Phạm Gia Huy",
    "email": "student19@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124019",
    "department": "Công nghệ kỹ thuật cơ khí",
    "faculty": "Khoa Cơ khí chế tạo máy",
    "major": "Công nghệ kỹ thuật cơ khí"
  },
  {
    "id": "stu-020",
    "fullName": "Nguyễn Đức Minh",
    "email": "student20@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124020",
    "department": "Công nghệ kỹ thuật cơ khí",
    "faculty": "Khoa Cơ khí chế tạo máy",
    "major": "Công nghệ kỹ thuật cơ khí"
  },
  {
    "id": "stu-021",
    "fullName": "Trần Nhật Linh",
    "email": "student21@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124021",
    "department": "Cơ điện tử",
    "faculty": "Khoa Cơ khí chế tạo máy",
    "major": "Cơ điện tử"
  },
  {
    "id": "stu-022",
    "fullName": "Lê Quang Hào",
    "email": "student22@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124022",
    "department": "Công nghệ kỹ thuật cơ khí",
    "faculty": "Khoa Cơ khí chế tạo máy",
    "major": "Công nghệ kỹ thuật cơ khí"
  },
  {
    "id": "stu-023",
    "fullName": "Phạm Thùy Dương",
    "email": "student23@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124023",
    "department": "Cơ điện tử",
    "faculty": "Khoa Cơ khí chế tạo máy",
    "major": "Cơ điện tử"
  },
  {
    "id": "stu-024",
    "fullName": "Võ Thành Đạt",
    "email": "student24@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124024",
    "department": "Cơ điện tử",
    "faculty": "Khoa Cơ khí chế tạo máy",
    "major": "Cơ điện tử"
  },
  {
    "id": "stu-025",
    "fullName": "Mai Hoài Phương",
    "email": "student25@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124025",
    "department": "Kế toán",
    "faculty": "Khoa Kinh tế",
    "major": "Kế toán"
  },
  {
    "id": "stu-026",
    "fullName": "Trần Quốc Hưng",
    "email": "student26@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124026",
    "department": "Quản trị kinh doanh",
    "faculty": "Khoa Kinh tế",
    "major": "Quản trị kinh doanh"
  },
  {
    "id": "stu-027",
    "fullName": "Nguyễn Ngọc Châu",
    "email": "student27@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124027",
    "department": "Thương mại điện tử",
    "faculty": "Khoa Kinh tế",
    "major": "Thương mại điện tử"
  },
  {
    "id": "stu-028",
    "fullName": "Đặng Phương Anh",
    "email": "student28@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124028",
    "department": "Quản trị kinh doanh",
    "faculty": "Khoa Kinh tế",
    "major": "Quản trị kinh doanh"
  },
  {
    "id": "stu-029",
    "fullName": "Lê Minh Khôi",
    "email": "student29@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124029",
    "department": "Kế toán",
    "faculty": "Khoa Kinh tế",
    "major": "Kế toán"
  },
  {
    "id": "stu-030",
    "fullName": "Bùi Thảo Nguyên",
    "email": "student30@hcmute.edu.vn",
    "password": "123456",
    "role": "student",
    "studentId": "20124030",
    "department": "Thương mại điện tử",
    "faculty": "Khoa Kinh tế",
    "major": "Thương mại điện tử"
  },
  {
    "id": "tea-001",
    "fullName": "Trần Thị Bích Ngọc",
    "email": "teacher@hcmute.edu.vn",
    "password": "123456",
    "role": "teacher",
    "studentId": "GV-001",
    "department": "Khoa Công nghệ thông tin",
    "faculty": "Khoa Công nghệ thông tin"
  },
  {
    "id": "tea-002",
    "fullName": "Phạm Minh Cường",
    "email": "teacher2@hcmute.edu.vn",
    "password": "123456",
    "role": "teacher",
    "studentId": "GV-002",
    "department": "Khoa Công nghệ thông tin",
    "faculty": "Khoa Công nghệ thông tin"
  },
  {
    "id": "tea-003",
    "fullName": "Nguyễn Hoàng Phúc",
    "email": "teacher3@hcmute.edu.vn",
    "password": "123456",
    "role": "teacher",
    "studentId": "GV-003",
    "department": "Khoa Công nghệ thông tin",
    "faculty": "Khoa Công nghệ thông tin"
  },
  {
    "id": "tea-004",
    "fullName": "Lê Thị Thu Hà",
    "email": "teacher4@hcmute.edu.vn",
    "password": "123456",
    "role": "teacher",
    "studentId": "GV-004",
    "department": "Khoa Điện - Điện tử",
    "faculty": "Khoa Điện - Điện tử"
  },
  {
    "id": "tea-005",
    "fullName": "Trần Quốc Thịnh",
    "email": "teacher5@hcmute.edu.vn",
    "password": "123456",
    "role": "teacher",
    "studentId": "GV-005",
    "department": "Khoa Cơ khí chế tạo máy",
    "faculty": "Khoa Cơ khí chế tạo máy"
  },
  {
    "id": "tea-006",
    "fullName": "Phan Ngọc Mai",
    "email": "teacher6@hcmute.edu.vn",
    "password": "123456",
    "role": "teacher",
    "studentId": "GV-006",
    "department": "Khoa Kinh tế",
    "faculty": "Khoa Kinh tế"
  },
  {
    "id": "adm-001",
    "fullName": "Admin Phan Gia Phước",
    "email": "admin@hcmute.edu.vn",
    "password": "123456",
    "role": "admin",
    "department": "Phòng Đào tạo",
    "faculty": "Ban quản trị"
  }
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
    const current = JSON.parse(raw) as AppUser;
    const seed = seedUsers.find((user) => user.email.toLowerCase() === current.email.toLowerCase());
    return seed ? { ...seed, ...current, faculty: current.faculty || seed.faculty, major: current.major || seed.major, department: current.department || seed.department } : current;
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
  faculty?: string;
  major?: string;
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
