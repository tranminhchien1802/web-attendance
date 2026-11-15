import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Tự động gắn Bearer Token vào mọi request nếu đã đăng nhập
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tự động xóa phiên đăng nhập nếu Token hết hạn (401)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("hcmute_current_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;