import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Tải thông tin người dùng từ Local Storage khi component mount
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Kết thúc trạng thái loading ban đầu sau khi tải currentUser
        setLoading(false);
    }, []);

    // 🔄 HÀM LOGIN 
    const login = async (email, password) => {
        setLoading(true);
        const result = await AuthService.login(email, password);
        
        if (result.success) {
            setCurrentUser(result.user);
        } else {
            setCurrentUser(null); 
        }

        setLoading(false);
        return result;
    };
    
    const logout = () => {
        AuthService.logout();
        setCurrentUser(null);
    };

    const register = async (fullName, email, password, role) => {
        setLoading(true);
        const result = await AuthService.register(fullName, email, password, role);
        setLoading(false);
        return result;
    };

    // ===============================================================
    // ✅ BỔ SUNG: HÀM CHO CHỨC NĂNG QUÊN MẬT KHẨU
    // ===============================================================
    
    /**
     * Kiểm tra email tồn tại trong CSDL.
     */
    const checkEmailExists = async (email) => {
        return await AuthService.checkEmailExists(email);
    };

    /**
     * Gửi yêu cầu tạo và lưu OTP vào database.
     * @param {string} email - Email người dùng.
     * @returns {Promise<{success: boolean, otpCode?: string, message: string}>}
     */
    const sendOtp = async (email) => {
        // Gọi AuthService, AuthService gọi API /send-otp
        return await AuthService.sendOtp(email);
    };

    /**
     * Đặt lại mật khẩu mới sau khi xác minh OTP.
     */
    const resetPassword = async (email, newPassword, otpCode) => {
        return await AuthService.resetPassword(email, newPassword, otpCode);
    };
    // ===============================================================

    // ✨ KHẮC PHỤC LỖI 401: Lấy Token từ trường accessToken của đối tượng currentUser
    const authToken = currentUser?.accessToken;

    const value = {
        currentUser,
        loading,
        login,
        logout,
        register,
        
        // CUNG CẤP HÀM MỚI QUA CONTEXT
        checkEmailExists, 
        sendOtp,          // <--- HÀM BỔ SUNG QUAN TRỌNG
        resetPassword,    
        
        // CUNG CẤP authToken CHO CÁC COMPONENT SỬ DỤNG HOOK useAuth()
        authToken, 
        
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'Admin',
        isEmployer: currentUser?.role === 'Employer',
        isStudent: currentUser?.role === 'Student',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};