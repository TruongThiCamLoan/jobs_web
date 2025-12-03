// jobs-api/routes/report.routes.js (CODE HOÀN CHỈNH)

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken, isAdmin } = require('../middleware/authJwt'); 

// ----------------- REPORT ROUTES -----------------

// 1. Gửi báo cáo (Protected - Tất cả người dùng)
// POST /api/report
router.post(
  '/report', 
  [verifyToken], 
  reportController.submitReport
); 

// 2. Lấy tất cả báo cáo (Protected - Chỉ Admin)
// GET /api/report
router.get(
  '/report', 
  [verifyToken, isAdmin], 
  reportController.getAllReports
); 

// 3. Cập nhật trạng thái báo cáo (Protected - Chỉ Admin)
// PUT /api/report/:id
router.put(
  '/report/:id', 
  [verifyToken, isAdmin], 
  reportController.updateReportStatus
); 

// ----------------- COMPLAINT ROUTES -----------------

// 4. Gửi khiếu nại (Protected - Tất cả người dùng)
// POST /api/complaint
router.post(
  '/complaint', 
  [verifyToken], 
  reportController.submitComplaint
); 

// 5. Lấy tất cả khiếu nại (Protected - Chỉ Admin)
// GET /api/complaint
router.get(
  '/complaint', 
  [verifyToken, isAdmin], 
  reportController.getAllComplaints
); 

// 6. Cập nhật trạng thái khiếu nại (Protected - Chỉ Admin)
// PUT /api/complaint/:id
router.put(
  '/complaint/:id', 
  [verifyToken, isAdmin], 
  reportController.updateComplaintStatus
); 

module.exports = router;