import axios from "axios";

// ✅ Tạo instance Axios chung cho toàn bộ dự án
const API = axios.create({
  baseURL: "http://localhost:8080/api", // ⚠️ Phải trùng với server Express
  headers: {
    "Content-Type": "application/json",
  },
});

// 💡 Thêm interceptor để tự động gửi token nếu cần
API.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    if (user) {
      const token = JSON.parse(user).accessToken;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
