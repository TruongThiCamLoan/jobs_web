const express = require('express');
const router = express.Router();
// Đảm bảo rằng đường dẫn và tên file controller là chính xác
const studentController = require('../controllers/admin/studentController'); 
const authMiddleware = require('../middleware/authJwt'); 

// 🎯 ÁP DỤNG MIDDLEWARE BẢO MẬT CHUNG
// Đảm bảo chỉ Admin có quyền truy cập vào các route này
router.use(authMiddleware.verifyToken, authMiddleware.isAdmin); 

// --- ROUTE CỦA ADMIN CHO ỨNG VIÊN ---

// Lấy danh sách ứng viên (GET /api/v1/admin/students)
router.get('/', studentController.getAllStudents); 

// Cập nhật trạng thái Khóa/Mở khóa (PATCH /api/v1/admin/students/:id/status)
// Nếu lỗi xảy ra ở dòng này (dòng 18), nghĩa là studentController.updateStudentStatus là UNDEFINED
router.patch('/:id/status', studentController.updateStudentStatus); 

module.exports = router;