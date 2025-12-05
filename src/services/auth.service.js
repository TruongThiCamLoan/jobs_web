// src/services/auth.service.js

import API from "./api"; // Import Axios instance đã tạo (giả định)

class AuthService {
    async login(email, password) {
        try {
            const response = await API.post("/auth/signin", {
                email,
                password,
            });

            if (response.data.accessToken) {
                // Lưu toàn bộ đối tượng user (bao gồm role và accessToken) vào Local Storage
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            // Trả về dữ liệu user (có chứa accessToken)
            return { success: true, user: response.data };
        } catch (error) {
            // Lấy payload lỗi từ phản hồi Axios
            const errorData = error.response?.data;
            const message = errorData?.message || "Đăng nhập thất bại. Lỗi kết nối server.";
            
            // 💡 SỬA LỖI: Trả về toàn bộ payload lỗi từ Backend (kèm theo các trường trạng thái)
            // Điều này cho phép LoginPage.js truy cập result.user.isLocked, lockReason, etc.
            const statusUser = {
                // Lấy các trường trạng thái chi tiết mà Backend gửi trong lỗi 403
                isLocked: errorData?.isLocked || false,
                lockReason: errorData?.lockReason || null,
                lockUntil: errorData?.lockUntil || null,
                isVerified: errorData?.isVerified || false,
                rejectionReason: errorData?.rejectionReason || null,
                role: errorData?.role || null,
            };

            return { 
                success: false, 
                message: message,
                // Đóng gói thông tin trạng thái vào key 'user' để LoginPage xử lý
                user: statusUser
            };
        }
    }

    async register(fullName, email, password, role) {
        try {
            const response = await API.post("/auth/signup", {
                fullName,
                email,
                password,
                role, 
            });
            return { success: true, message: "Đăng ký thành công!", user: response.data };
        } catch (error) {
            const message =
                error.response?.data?.message || "Đăng ký thất bại. Email đã tồn tại hoặc lỗi server.";
            return { success: false, message };
        }
    }

    logout() {
        localStorage.removeItem("user");
    }

    getCurrentUser() {
        const user = localStorage.getItem("user");
        // Tải đối tượng user từ Local Storage (bao gồm cả accessToken)
        return user ? JSON.parse(user) : null;
    }
}

export default new AuthService();