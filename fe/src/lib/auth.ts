import axiosClient from "./axiosClient";

export type UserRole = "student" | "teacher" | "admin";
export type ManagedUserRole = Exclude<UserRole, "admin">;
export type UserGender = "male" | "female";

export type AppUser = {
  id: string;
  userCode: string;
  fullName: string;
  email: string;
  role: UserRole;
  studentId?: string;
  phone?: string | null;
  gender?: UserGender;
  avatar?: string | null;
  department?: string | null;
  faculty?: string | null;
  major?: string | null;
  isActive: boolean;
};

export type ManagedUserPayload = {
  userCode: string;
  fullName: string;
  email: string;
  password?: string;
  role: ManagedUserRole;
  phone?: string;
  gender: UserGender;
  avatar?: string;
  isActive: boolean;
  department?: string;
  faculty?: string;
  major?: string;
};

type BackendUser = {
  id: number | string;
  userCode?: string;
  user_code?: string;
  fullName?: string;
  name?: string;
  email: string;
  role: "admin" | "lecturer" | "teacher" | "student";
  phone?: string | null;
  gender?: UserGender;
  avatar?: string | null;
  isActive?: boolean;
  is_active?: boolean;
  department?: string | null;
  faculty?: string | null;
  major?: string | null;
};

const CURRENT_USER_KEY = "hcmute_current_user";
const ACCESS_TOKEN_KEY = "access_token";

function mapBackendUserToAppUser(beUser: BackendUser): AppUser {
  const userCode = beUser.userCode ?? beUser.user_code ?? "";

  return {
    id: String(beUser.id),
    userCode,
    fullName: beUser.fullName ?? beUser.name ?? "",
    email: beUser.email,
    role: beUser.role === "lecturer" ? "teacher" : beUser.role,
    studentId: userCode,
    phone: beUser.phone ?? null,
    gender: beUser.gender,
    avatar: beUser.avatar ?? null,
    department: beUser.department ?? null,
    faculty: beUser.faculty ?? null,
    major: beUser.major ?? null,
    isActive: beUser.isActive ?? beUser.is_active ?? true,
  };
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
    window.dispatchEvent(new Event("plt:session"));
    return;
  }

  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("plt:session"));
}

export async function loginWithCredentials(
  account: string,
  password: string
): Promise<AppUser> {
  const response = await axiosClient.post("/login", {
    account: account.trim(),
    password,
  });

  const { access_token, user } = response.data;
  const appUser = mapBackendUserToAppUser(user);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  }
  setCurrentUser(appUser);

  return appUser;
}

export async function fetchMe(): Promise<AppUser | null> {
  try {
    const response = await axiosClient.get("/me");
    const appUser = mapBackendUserToAppUser(response.data.user);
    setCurrentUser(appUser);
    return appUser;
  } catch (error) {
    if ((error as { response?: { status?: number } }).response?.status === 401) {
      setCurrentUser(null);
      return null;
    }
    throw error;
  }
}

export async function fetchUsers(): Promise<AppUser[]> {
  const response = await axiosClient.get("/users");
  return (response.data as BackendUser[]).map(mapBackendUserToAppUser);
}

export async function createManagedUser(payload: ManagedUserPayload): Promise<AppUser> {
  const response = await axiosClient.post("/users", payload);
  return mapBackendUserToAppUser(response.data);
}

export async function updateManagedUser(
  userId: string,
  payload: Partial<ManagedUserPayload>
): Promise<AppUser> {
  const response = await axiosClient.patch(`/users/${userId}`, payload);
  return mapBackendUserToAppUser(response.data);
}

export async function deleteManagedUser(userId: string): Promise<void> {
  await axiosClient.delete(`/users/${userId}`);
}

export async function logoutUser() {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem(ACCESS_TOKEN_KEY)
      : null;

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
