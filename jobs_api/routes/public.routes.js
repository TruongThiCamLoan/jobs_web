// File: routes/public.routes.js

const express = require('express');
const router = express.Router();
// Đảm bảo đường dẫn import Controller là chính xác
const employerPublicController = require('../controllers/public/employer.public.controller'); 
const categoryController = require('../controllers/admin/category.controller');

// API công khai: GET /api/v1/employers
// Route này không cần middleware kiểm tra quyền Admin
router.get('/employers', employerPublicController.getAllEmployersPublic); 
router.get('/categories', categoryController.getAllCategories);

module.exports = router;