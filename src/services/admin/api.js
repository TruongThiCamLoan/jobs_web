import axios from 'axios';

// 💡 Cấu hình URL cơ sở của API Admin
const API_BASE_URL = '/api/v1/admin'; 

// Tạo một instance Axios
const adminApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 💡 THÊM AXIOS INTERCEPTOR (Tự động thêm Token)
adminApi.interceptors.request.use(
    (config) => {
        // 💡 CẬP NHẬT: LẤY VÀ PHÂN TÍCH CHUỖI JSON TỪ KEY 'user'
        const userString = localStorage.getItem('user'); 
        
        if (userString) {
            try {
                const userObject = JSON.parse(userString);
                // Lấy ra accessToken từ đối tượng đã parse
                const adminToken = userObject.accessToken; 
                
                if (adminToken) {
                    // Đính kèm Token
                    config.headers['Authorization'] = `Bearer ${adminToken}`;
                }
            } catch (e) {
                console.error("Lỗi parse JSON token:", e);
                // Xử lý lỗi nếu chuỗi userString không phải là JSON hợp lệ
            }
        } 
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// ----------------------------------------------------------------------
// 🛠️ 1. ADMIN STUDENTS MANAGEMENT API
// ----------------------------------------------------------------------

export const getAllStudents = (params) => {
    return adminApi.get('/students', { 
        params: params 
    });
};

export const updateStudentStatus = (studentId, data) => {
    return adminApi.patch(`/students/${studentId}/status`, data);
};

export const deleteStudent = (studentId) => {
    return adminApi.delete(`/students/${studentId}`);
};


// ----------------------------------------------------------------------
// 🛠️ 2. ADMIN EMPLOYERS MANAGEMENT API (Cho module tiếp theo)
// ----------------------------------------------------------------------

export const getAllEmployers = (params) => {
    return adminApi.get('/employers', { params: params });
};
    
export const reviewEmployerAccount = (employerId, data) => {
    return adminApi.patch(`/employers/${employerId}/review`, data);
};
    
export const updateEmployerStatus = (employerId, data) => {
    return adminApi.patch(`/employers/${employerId}/status`, data);
};


// ----------------------------------------------------------------------
// 🛠️ 3. ADMIN CATEGORY MANAGEMENT API (Cho module tiếp theo)
// ----------------------------------------------------------------------
export const createCategory = async (categoryData) => {
    const response = await adminApi.post('/categories', categoryData);
    return response.data; // ⬅️ CHỈ TRẢ VỀ DATA
};

export const getAllCategories = async (params) => {
    const response = await adminApi.get('/categories', { 
        params: params 
    });
    return response.data; // ⬅️ CHỈ TRẢ VỀ DATA
};

// ... Tương tự cho getCategory, updateCategory, deleteCategory ...
export const updateCategory = async (categoryId, data) => {
    const response = await adminApi.patch(`/categories/${categoryId}`, data);
    return response.data;
};

export const deleteCategory = async (categoryId) => {
    const response = await adminApi.delete(`/categories/${categoryId}`);
    return response.data;
};
// ----------------------------------------------------------------------
// 🛠️ 4. ADMIN REPORT MANAGEMENT API (ĐÃ SỬA LỖI API -> adminApi)
// ----------------------------------------------------------------------

export const getJobPerformanceStats = async (params) => {
    try {
        // 💡 FIX: Sử dụng adminApi
        const response = await adminApi.get("/reposts/jobs", { params }); 
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 2. Log Tương tác (Interaction Stats)
export const getInteractionLogs = async (params) => {
    try {
        // 💡 FIX: Sử dụng adminApi
        const response = await adminApi.get("/reposts/interactions", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 3. Thống kê theo Tháng (Monthly Statistics)
export const getMonthlyStatistics = async (params) => {
    try {
        // 💡 FIX: Sử dụng adminApi
        const response = await adminApi.get("/reposts/monthly", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};