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

    // 🔄 HÀM LOGIN ĐÃ CẬP NHẬT: Trích xuất chi tiết user status từ lỗi
    const login = async (email, password) => {
        setLoading(true);
        // AuthService.login giờ sẽ trả về { success: bool, message: string, user: {status data} }
        const result = await AuthService.login(email, password);
        
        if (result.success) {
            setCurrentUser(result.user);
        } else {
            // 💡 QUAN TRỌNG: Nếu đăng nhập KHÔNG thành công, ta vẫn cần kiểm tra xem
            // result có chứa thông tin user status (như isLocked, lockReason) 
            // được Backend gửi kèm trong lỗi 403 hay không.
            // Nếu có, LoginPage sẽ dùng thông tin này để hiển thị thông báo chi tiết.
            
            // Đảm bảo không lưu user vào state nếu login thất bại
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

    // ✨ KHẮC PHỤC LỖI 401: Lấy Token từ trường accessToken của đối tượng currentUser
    const authToken = currentUser?.accessToken;

    const value = {
        currentUser,
        loading,
        login,
        logout,
        register,
        
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