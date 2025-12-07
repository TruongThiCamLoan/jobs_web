const express = require('express');
const router = express.Router();
// Đảm bảo Controller này có export hàm getResumes
const profileController = require('../controllers/profile.controller'); 
const { verifyToken } = require('../middleware/authJwt'); 

// =======================================================
// LẤY HỒ SƠ (GET)
// =======================================================

// GET /api/profile: Lấy hồ sơ cá nhân (Student hoặc Employer), bao gồm dữ liệu đa bảng
router.get(
    '/', 
    [verifyToken], 
    profileController.getProfile
); 

// ✅ ROUTE MỚI: GET /api/profile/resumes (hoặc /api/resumes nếu được gắn đúng)
// Mục đích: Lấy danh sách hồ sơ của Student (Front-end ResumePage.js gọi endpoint này)
router.get(
    '/resumes', // <-- THÊM ĐƯỜNG DẪN NÀY
    [verifyToken], 
    profileController.getResumes // <-- HÀM XỬ LÝ LẤY DANH SÁCH RESUMES
); 

// =======================================================
// CẬP NHẬT THEO TỪNG BƯỚC CHO STUDENT PROFILE (PUT)
// =======================================================

// BƯỚC 1 & 2: Thông tin cá nhân & Liên hệ
router.put(
    '/step1-2', 
    [verifyToken], 
    profileController.createOrUpdateProfileStep1And2
); 

// ... (Các routes PUT khác giữ nguyên)

router.put(
    '/education', 
    [verifyToken], 
    profileController.updateEducation
); 

router.put(
    '/languages', 
    [verifyToken], 
    profileController.updateLanguages
); 

router.put(
    '/experiences', 
    [verifyToken], 
    profileController.updateExperiences
); 

router.put(
    '/references', 
    [verifyToken], 
    profileController.updateReferences
); 

router.put(
    '/skills', 
    [verifyToken], 
    profileController.updateSkills
); 

router.put(
    '/career-goal', 
    [verifyToken], 
    profileController.updateCareerGoal
); 

router.put(
    '/search-status', 
    [verifyToken], 
    profileController.updateSearchStatus
); 

module.exports = router;