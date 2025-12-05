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
// ✅ ROUTE ĐỔI MẬT KHẨU
// ===========================================
// Endpoint: POST /api/auth/change-password
router.post(
    '/change-password', 
    [verifyToken], // Bảo vệ route này bằng cách xác minh JWT Token
    authController.changePassword
);

module.exports = router;