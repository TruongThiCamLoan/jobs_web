// jobs-api/routes/job.routes.js (CODE HOÀN CHỈNH)

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { verifyToken, isRecruiter } = require('../middleware/authJwt'); 

// Route tạo Job (Protected)
router.post(
  '/', 
  [verifyToken, isRecruiter], 
  jobController.createJob
); 

// Route Cập nhật Job (Protected)
router.put(
  '/:id', 
  [verifyToken, isRecruiter], 
  jobController.updateJob
); 

// Route Xóa Job (Protected)
router.delete(
  '/:id', 
  [verifyToken, isRecruiter], 
  jobController.deleteJob
); 

// Route Lấy Danh sách Job (Public)
router.get('/', jobController.getJobList); 

// Route Lấy Chi tiết Job (Public)
router.get('/:id', jobController.getJobDetail); 

module.exports = router;