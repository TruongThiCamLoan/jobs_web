const express = require('express');
const router = express.Router();

// Giả định controller Employer nằm trong thư mục admin
const employerController = require('../controllers/admin/employerController'); 
const authMiddleware = require('../middleware/authJwt'); // Middleware bảo mật

// ÁP DỤNG BẢO MẬT: Đảm bảo chỉ Admin có quyền truy cập
router.use(authMiddleware.verifyToken, authMiddleware.isAdmin); 

// =========================================================
// I. TUYẾN ĐƯỜNG QUẢN LÝ DANH SÁCH & HỒ SƠ CÔNG TY
// Endpoint: GET /api/v1/admin/employers
// =========================================================

// Lấy danh sách Nhà tuyển dụng (có tìm kiếm, lọc isVerified, isLocked)
router.get('/', employerController.getAllEmployers); 

// =========================================================
// II. TUYẾN ĐƯỜNG CẬP NHẬT TRẠNG THÁI (ACTIONS)
// =========================================================

// 1. Phê duyệt/Từ chối hồ sơ công ty (PATCH /api/v1/admin/employers/:id/review)
// Dùng để cập nhật isVerified và rejectionReason trên bảng Employer
router.patch('/:id/review', employerController.reviewEmployerAccount); 

// 2. Khóa/Mở khóa tài khoản (PATCH /api/v1/admin/employers/:id/status)
// Dùng để cập nhật isLocked và lockReason trên bảng User
router.patch('/:id/status', employerController.updateEmployerStatus); 

// =========================================================
// III. TUYẾN ĐƯỜNG XÓA
// =========================================================

// Xóa vĩnh viễn Nhà tuyển dụng (DELETE /api/v1/admin/employers/:id)
router.delete('/:id', employerController.deleteEmployer); 

module.exports = router;