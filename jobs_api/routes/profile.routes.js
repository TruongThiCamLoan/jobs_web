const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { verifyToken } = require('../middleware/authJwt'); // Giả định hàm verifyToken

// =======================================================
// LẤY HỒ SƠ (GET)
// =======================================================

// GET /api/profile: Lấy hồ sơ cá nhân (Student hoặc Employer), bao gồm dữ liệu đa bảng cho Student
router.get(
  '/', 
  [verifyToken], 
  profileController.getProfile
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

// BƯỚC 3: Học vấn (Xóa cũ, tạo mới danh sách)
router.put(
  '/education', 
  [verifyToken], 
  profileController.updateEducation
); 

// BƯỚC 4: Ngoại ngữ (Xóa cũ, tạo mới danh sách)
router.put(
  '/languages', 
  [verifyToken], 
  profileController.updateLanguages
); 

// BƯỚC 5: Kinh nghiệm làm việc (Cập nhật summary và chi tiết danh sách)
router.put(
  '/experiences', 
  [verifyToken], 
  profileController.updateExperiences
); 

// BƯỚC 6: Người tham khảo (Xóa cũ, tạo mới danh sách)
router.put(
  '/references', 
  [verifyToken], 
  profileController.updateReferences
); 

// BƯỚC 7: Kỹ năng (Xóa cũ, tạo mới danh sách)
router.put(
  '/skills', 
  [verifyToken], 
  profileController.updateSkills
); 

// BƯỚC 8: Mục tiêu nghề nghiệp (Cập nhật bảng Students và các bảng phụ Ngành nghề/Địa điểm mong muốn)
router.put(
  '/career-goal', 
  [verifyToken], 
  profileController.updateCareerGoal
); 

// BƯỚC 9: Trạng thái hồ sơ (Cập nhật bảng Students: isSearchable)
router.put(
  '/search-status', 
  [verifyToken], 
  profileController.updateSearchStatus
); 

// Lưu ý: Đã loại bỏ router.put('/') cũ vì nó không còn phù hợp với logic cập nhật đa bảng.

module.exports = router;