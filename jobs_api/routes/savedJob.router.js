const express = require('express');
const router = express.Router();
const savedJobController = require('../controllers/savedJobController');
const authJwt = require('../middleware/authJwt'); // Import authJwt đã được cung cấp

// [API DÙNG ĐỂ LẤY DANH SÁCH VIỆC LÀM ĐÃ LƯU]
// Endpoint: GET /api/saved-jobs
// Mô tả: Lấy tất cả công việc mà student hiện tại đã lưu. (Được dùng để kiểm tra trạng thái lưu)
// Middleware: Chỉ cần xác thực token (Logic kiểm tra Student Role nằm trong Controller)
router.get(
    '/',
    authJwt.verifyToken,
    savedJobController.getSavedJobs
);

// [API DÙNG ĐỂ BẬT/TẮT LƯU]
// Endpoint: POST /api/saved-jobs/toggle-save/:jobId
// Mô tả: Thêm hoặc xóa công việc khỏi danh sách yêu thích.
// Middleware: Chỉ cần xác thực token (Logic kiểm tra Student Role nằm trong Controller)
router.post(
    '/toggle-save/:jobId',
    authJwt.verifyToken,
    savedJobController.toggleSaveJob
);

module.exports = router;