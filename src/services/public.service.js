// src/services/public.service.js

import API from "./api"; // Axios instance (Giả định đã import)

/**
 * Lấy danh sách Nhà tuyển dụng đã được duyệt từ API công khai.
 * @param {object} params - Các tham số truy vấn (page, limit, search, location, size).
 * @returns {Promise<object>} Dữ liệu phản hồi từ Backend (bao gồm pagination và data.employers).
 */
const getAllEmployersPublic = async (params) => {
    try {
        // Thực hiện GET request đến /employers (tương đương /api/v1/employers)
        const response = await API.get("/employers", { params });
        
        // Trả về response.data (payload chứa pagination và data)
        return response.data; 
    } catch (error) {
        // 💡 Cải thiện xử lý lỗi: Thay vì chỉ throw error, ta throw toàn bộ đối tượng lỗi Axios
        // để component gọi (EmployersPage.js) có thể đọc mã lỗi và thông báo chi tiết.
        
        // Nếu lỗi xảy ra, ném đối tượng lỗi để khối try-catch trong React bắt
        throw error; 
    }
};

export { getAllEmployersPublic };