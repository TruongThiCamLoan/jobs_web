const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller'); 
// 💡 CẦN IMPORT AUTH MIDDLEWARE TẠI ĐÂY
const { verifyToken } = require('../middleware/authJwt'); 

// Route Đăng ký
router.post('/signup', authController.signup); 

// Route Đăng nhập
router.post('/signin', authController.signin);

// ===========================================
// ✅ ROUTE ĐỔI MẬT KHẨU (Đã đăng nhập)
// ===========================================
// Endpoint: POST /api/auth/change-password
router.post(
    '/change-password', 
    [verifyToken], // Bảo vệ route này bằng cách xác minh JWT Token
    authController.changePassword
);

// ===========================================
// ✅ ROUTES QUÊN MẬT KHẨU (Chưa đăng nhập)
// ===========================================

// 1. Kiểm tra email tồn tại (Bước 1: Front-end gọi khi gửi email khôi phục)
// Endpoint: POST /api/auth/check-email
router.post('/check-email', authController.checkEmailExists);

router.post('/send-otp', authController.sendOtp);

// 2. Đặt lại mật khẩu (Bước 3: Front-end gọi sau khi xác minh OTP)
// Endpoint: POST /api/auth/reset-password
router.post('/reset-password', authController.resetPassword);


module.exports = router;