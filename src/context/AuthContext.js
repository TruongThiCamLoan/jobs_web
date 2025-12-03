// src/context/AuthContext.js

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

    const login = async (email, password) => {
        setLoading(true);
        const result = await AuthService.login(email, password);
        if (result.success) {
            setCurrentUser(result.user);
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