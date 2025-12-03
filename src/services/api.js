// src/services/api.js (CODE HOÀN CHỈNH)
import axios from "axios";

const API = axios.create({
  // Đảm bảo URL này khớp với server Node.js của bạn
  baseURL: "http://localhost:8080/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR: Tự động gắn Token vào Header cho các request được bảo vệ
API.interceptors.request.use(
  (config) => {
    // Lấy thông tin user từ Local Storage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken) {
      // Gắn Token vào Header Authorization (sử dụng Bearer Token)
      config.headers['Authorization'] = 'Bearer ' + user.accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;