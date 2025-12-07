const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const authJwt = require('../middleware/authJwt'); // Import authJwt

// [API DÙNG ĐỂ LẤY DANH SÁCH ỨNG TUYỂN]
// Endpoint: GET /api/applications
// Mô tả: Lấy tất cả lịch sử ứng tuyển của Student hiện tại.
router.get(
    '/',
    authJwt.verifyToken,
    applicationController.getAppliedJobs // Hàm mới được gọi
);

// [API DÙNG ĐỂ KIỂM TRA TRẠNG THÁI ỨNG TUYỂN TRƯỚC]
// Endpoint: GET /api/applications/:jobId/status
// Mô tả: Kiểm tra xem sinh viên hiện tại đã nộp đơn cho công việc này chưa.
router.get(
    '/:jobId/status',
    authJwt.verifyToken,
    applicationController.checkApplicationStatus
);

// [API DÙNG ĐỂ NỘP ĐƠN]
// Endpoint: POST /api/applications/:jobId
// Mô tả: Sinh viên nộp đơn cho một công việc cụ thể.
router.post(
    '/:jobId',
    authJwt.verifyToken,
    applicationController.createApplication
);

router.get(
    '/employer',
    [authJwt.verifyToken, authJwt.isRecruiter], 
    applicationController.getEmployerCandidates
);

// 🎯 BỔ SUNG: PUT /api/applications/:id/status -> Cập nhật trạng thái đơn ứng tuyển (Duyệt/Từ chối)
router.put(
    '/:id/status',
    [authJwt.verifyToken, authJwt.isRecruiter], 
    applicationController.updateApplicationStatus
);

module.exports = router;