// src/services/auth.service.js

import API from "./api"; // Axios instance đã tạo

class AuthService {
  // ======================================================
  // ✅ ĐĂNG NHẬP
  // ======================================================
  async login(email, password) {
    try {
      const response = await API.post("/auth/signin", { email, password });

      if (response.data.accessToken) {
        // Lưu toàn bộ đối tượng user (bao gồm role và accessToken) vào Local Storage
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      // Trả về dữ liệu user (có chứa accessToken)
      return { success: true, user: response.data };
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.message || "Đăng nhập thất bại. Lỗi kết nối server.";

      // Trả về toàn bộ thông tin trạng thái user (khóa, duyệt, role, ...)
      const statusUser = {
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
        user: statusUser,
      };
    }
  }

  // ======================================================
  // ✅ ĐĂNG KÝ
  // ======================================================
  async register(fullName, email, password, role) {
    try {
      const response = await API.post("/auth/signup", { fullName, email, password, role });
      return { success: true, message: "Đăng ký thành công!", user: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Đăng ký thất bại. Email đã tồn tại hoặc lỗi server.";
      return { success: false, message };
    }
  }

  // ======================================================
  // ✅ QUÊN MẬT KHẨU - GỬI OTP
  // ======================================================
  async sendOtp(email) {
    try {
      const response = await API.post("/auth/send-otp", { email });

      return {
        success: true,
        otpCode: response.data.otpCode, // OTP đã được server lưu
        message: response.data.message,
      };
    } catch (error) {
      const message = error.response?.data?.message || "Lỗi kết nối server hoặc email không tồn tại.";
      return { success: false, message };
    }
  }

  // ======================================================
  // ✅ QUÊN MẬT KHẨU - ĐẶT LẠI MẬT KHẨU
  // ======================================================
  async resetPassword(email, newPassword, otpCode) {
    try {
      const response = await API.post("/auth/reset-password", { email, newPassword, otpCode });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Đặt lại mật khẩu thất bại. Lỗi kết nối server.";
      return { success: false, message };
    }
  }

  // ======================================================
  // ✅ ĐĂNG XUẤT
  // ======================================================
  logout() {
    localStorage.removeItem("user");
  }

  // ======================================================
  // ✅ LẤY NGƯỜI DÙNG HIỆN TẠI
  // ======================================================
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService();
