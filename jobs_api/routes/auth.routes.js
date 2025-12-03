// jobs-api/routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller'); 

// Route Đăng ký
router.post('/signup', authController.signup); 

// Route Đăng nhập
router.post('/signin', authController.signin);

module.exports = router;