// ĐỔI TÊN FILE NÀY THÀNH admin.report.routes.js (hoặc tên chuẩn)

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/admin/report.controller'); 

// ⭐️ Đảm bảo reportController đã được tải thành công trước khi dùng

// GET /api/v1/admin/reports?status=...&search=...
router.get('/', reportController.getReports); 

// GET /api/v1/admin/reports/:reportId
router.get('/:reportId', reportController.getReportDetail); 

// PUT /api/v1/admin/reports/:reportId/process (Xử lý thành Resolved)
router.put('/:reportId/process', reportController.processReport); 

// PUT /api/v1/admin/reports/:reportId/ignore
router.put('/:reportId/ignore', reportController.ignoreReport); 

module.exports = router;