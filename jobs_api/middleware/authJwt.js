// jobs-api/middleware/authJwt.js (CODE HOÀN CHỈNH)

const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

// Lấy SECRET KEY đã dùng trong hàm signin
const config = {
    secret: "YOUR_VERY_SECRET_KEY" // PHẢI KHỚP VỚI SECRET KEY TRONG auth.controller.js
};

// ----------------- 1. Hàm xác minh Token -----------------
const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "Không có Token được cung cấp!" });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Không được phép! Token không hợp lệ hoặc đã hết hạn." });
    }
    // Lưu ID và Role (Student, Employer, Admin)
    req.userId = decoded.id; 
    req.userRole = decoded.role; // Role là chuỗi: 'Student', 'Employer', 'Admin'
    next(); 
  });
};

// ----------------- 2. Hàm kiểm tra vai trò Recruiter -----------------
const isRecruiter = (req, res, next) => {
  // Role 'Employer' = Nhà tuyển dụng
  if (req.userRole && req.userRole === 'Employer') {
    next();
    return;
  }
  res.status(403).send({ message: "Yêu cầu quyền Nhà tuyển dụng (Employer)!" });
};

// ----------------- 3. Hàm kiểm tra vai trò Admin -----------------
const isAdmin = (req, res, next) => {
  // Role 'Admin' = Quản trị viên
  if (req.userRole && req.userRole === 'Admin') {
    next();
    return;
  }
  res.status(403).send({ message: "Yêu cầu quyền Quản trị viên (Admin)!" });
};


// ----------------- Export các hàm Middleware -----------------
const authJwt = {
  verifyToken: verifyToken,
  isRecruiter: isRecruiter,
  isAdmin: isAdmin, // 👈 Đã export hàm isAdmin
};

module.exports = authJwt;