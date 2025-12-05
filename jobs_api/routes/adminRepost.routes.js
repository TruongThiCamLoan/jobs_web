const express = require('express');
const router = express.Router();
// Đảm bảo import đúng Controller chứa các hàm báo cáo
const reportController = require('../controllers/admin/repost.controller'); 
const authMiddleware = require('../middleware/authJwt'); 

// 💡 ÁP DỤNG BẢO MẬT: Đảm bảo chỉ Admin có quyền truy cập
router.use(authMiddleware.verifyToken, authMiddleware.isAdmin); 

// --- ROUTE BÁO CÁO VÀ THỐNG KÊ (PREFIX: /api/v1/admin/reports) ---

// 1. Lấy thống kê Hiệu suất Tin tuyển dụng (jobStats)
// GET /admin/reports/jobs
router.get('/jobs', reportController.getJobPerformanceStats); 

// 2. Lấy log Tương tác Người dùng (interactionStats)
// GET /admin/reports/interactions
// router.get('/interactions', reportController.getInteractionLogs); 

// 3. Lấy thống kê Tổng hợp theo Tháng (statistic chart data)
// GET /admin/reports/monthly?year=2025&fromMonth=1&toMonth=12
router.get('/monthly', reportController.getMonthlyStatistics); 

// 4. (Optional) Các route khác cho việc Export hoặc Tổng quan

module.exports = router;