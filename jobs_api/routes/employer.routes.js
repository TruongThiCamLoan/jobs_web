// employer.routes.js
const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employer.controller');

// GET /api/employers -> gọi controller.getTopEmployers
router.get('/', employerController.getTopEmployers); 

module.exports = router;