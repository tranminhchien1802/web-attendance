import axiosClient from "./axiosClient";

export type UserRole = "student" | "teacher" | "admin";

export type AppUser = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  studentId?: string;
  avatar?: string | null;
  department?: string;
  faculty?: string;
  major?: string;
};

const USERS_KEY = "hcmute_users";
const CURRENT_USER_KEY = "hcmute_current_user";
const ACCESS_TOKEN_KEY = "access_token";

// Chuyển đổi dữ liệu user từ Laravel sang đúng định dạng AppUser của FE
function mapBackendUserToAppUser(beUser: {
  id: number | string;
  user_code: string;
  name: string;
  email: string;
  role: "admin" | "lecturer" | "student";
  avatar?: string | null;
}): AppUser {
  const mappedRole: UserRole =
    beUser.role === "lecturer" ? "teacher" : beUser.role;

  return {
    id: String(beUser.id),
    fullName: beUser.name,
    email: beUser.email,
    password: "",
    role: mappedRole,
    studentId: beUser.user_code,
    avatar: beUser.avatar || null,
    department: "Công nghệ thông tin",
    faculty: "Khoa Công nghệ thông tin",
  };
}

export function getUsers(): AppUser[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AppUser[];
  } catch {
    return [];
  }
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
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }

  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Hàm Đăng nhập gọi thẳng API POST /api/login của Laravel
export async function loginWithCredentials(
  account: string,
  password: string
): Promise<AppUser> {
  const response = await axiosClient.post("/login", {
    account: account.trim(),
    password: password,
  });

  const { access_token, user } = response.data;
  const appUser = mapBackendUserToAppUser(user);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  }
  setCurrentUser(appUser);

  return appUser;
}

// Kiểm tra Token còn sống hay không qua API GET /api/me
export async function fetchMe(): Promise<AppUser | null> {
  try {
    const response = await axiosClient.get("/me");
    const appUser = mapBackendUserToAppUser(response.data.user);
    setCurrentUser(appUser);
    return appUser;
  } catch {
    setCurrentUser(null);
    return null;
  }
}

// Hàm Đăng xuất gọi API POST /api/logout để thu hồi Token trong MySQL
export async function logoutUser() {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem(ACCESS_TOKEN_KEY)
      : null;

  // Xóa ngay dữ liệu đăng nhập trên trình duyệt
  setCurrentUser(null);

  if (token) {
    try {
      await axiosClient.post(
        "/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Lỗi thu hồi token khi đăng xuất:", error);
    }
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    getCurrentUser() && window.localStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

// Giữ lại các hàm phụ để tránh lỗi import ở các trang chưa nối API
export function registerUser(_payload: {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  faculty?: string;
  major?: string;
}): AppUser {
  throw new Error("Chức năng tự đăng ký đang khóa. Vui lòng liên hệ Admin.");
}

export function updateUserRole(
  _userId: string,
  _nextRole: Exclude<UserRole, "admin">
): AppUser[] {
  return getUsers();
}