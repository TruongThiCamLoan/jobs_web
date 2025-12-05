// routes/report.routes.js

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

// ✅ SỬA LỖI: Require trực tiếp đối tượng authJwt đã được export
const authJwt = require('../middleware/authJwt'); 

router.post(
    "/job/:jobId", 
    // ✅ Bây giờ authJwt.verifyToken đã được định nghĩa
    [authJwt.verifyToken], 
    reportController.createJobReport
);

module.exports = router;