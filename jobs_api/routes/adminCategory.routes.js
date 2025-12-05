const express = require('express');
const router = express.Router();

// Controllers
const categoryController = require('../controllers/admin/category.controller');

// Middleware
const auth = require('../middleware/authJwt'); // import đúng module

// ---------------------------------------------------------
// BẢO MẬT: Áp dụng middleware cho tất cả route bên dưới
// ---------------------------------------------------------
router.use(auth.verifyToken, auth.isAdmin);

// ---------------------------------------------------------
// CRUD CATEGORY
// ---------------------------------------------------------

// /api/admin/categories
router
    .route('/')
    .post(categoryController.createCategory)      // Tạo danh mục
    .get(categoryController.getAllCategories);   // Lấy tất cả danh mục

// /api/admin/categories/:id
router
    .route('/:id')
    .get(categoryController.getCategory)         // Lấy chi tiết danh mục
    .patch(categoryController.updateCategory)    // Cập nhật danh mục
    .delete(categoryController.deleteCategory);  // Xóa danh mục

module.exports = router;
