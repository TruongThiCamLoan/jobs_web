// employer.routes.js
const express = require('express');
const router = express.Router();

// Lấy Controller cho các chức năng Nhà tuyển dụng
const employerController = require('../controllers/employer.controller');

// Lấy các Middleware đã định nghĩa (Xác thực & Kiểm tra vai trò)
const { verifyToken, isRecruiter } = require('../middleware/authJwt'); 

// --- 1. ROUTE CÔNG KHAI ---

// GET /api/employers -> Lấy danh sách Nhà Tuyển Dụng Hàng Đầu
router.get('/', employerController.getTopEmployers); 

// --- 2. ROUTE BẢO MẬT (Dùng cho Employer Dashboard) ---

// Áp dụng Middleware cho các route quản lý hồ sơ bên dưới
router.use('/profile', [verifyToken, isRecruiter]);

// GET /api/employers/profile -> Lấy thông tin chi tiết hồ sơ
router.get(
    '/profile', 
    employerController.getProfile 
); 

// PUT /api/employers/profile -> Cập nhật thông tin hồ sơ
router.put(
    '/profile', 
    employerController.updateProfile
);

module.exports = router;