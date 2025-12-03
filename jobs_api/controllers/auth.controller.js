// jobs-api/controllers/auth.controller.js (CODE HOÀN CHỈNH ĐÃ FIX LỖI ĐÓNG GÓI DỮ LIỆU)

const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ----------------- Hàm Đăng ký (SIGNUP) -----------------
exports.signup = async (req, res) => {
    
    // BƯỚC 1: LOG DỮ LIỆU NHẬN ĐƯỢC
    console.log("=====================================");
    console.log("DỮ LIỆU ĐĂNG KÝ NHẬN ĐƯỢC (req.body):", req.body);
    console.log("=====================================");
    
    let { fullName, email, password, role } = req.body;

    // BƯỚC 2: KIỂM TRA & SỬA LỖI ĐÓNG GÓI DỮ LIỆU TỪ FRONTEND
    // Nếu req.body có key 'fullName' mà giá trị của nó là 1 object (dữ liệu bị đóng gói sai)
    if (typeof fullName === 'object' && fullName !== null && fullName.email && fullName.password) {
        console.warn("CẢNH BÁO: Dữ liệu gửi từ Frontend bị đóng gói sai. Tiến hành trích xuất...");
        // Trích xuất lại các trường ở cấp cao nhất
        email = fullName.email;
        password = fullName.password;
        // Dùng trường 'name' trong đối tượng bị lỗi làm fullName
        fullName = fullName.name || email; 
        role = fullName.role || 'Student'; 
    }
    
    // --- BẮT BUỘC KIỂM TRA PASSWORD ---
    if (!password || (typeof password === 'string' && password.trim() === '')) {
        console.error("LỖI: Mật khẩu bị thiếu hoặc rỗng.");
        return res.status(400).send({ message: "Mật khẩu không được để trống." });
    }

    // Xử lý fullName cuối cùng
    if (!fullName || (typeof fullName === 'string' && fullName.trim() === '')) {
        fullName = email; 
    }

    // Kiểm tra và hạn chế vai trò
    let finalRole = 'Student'; 
    if (role) {
        const requestedRole = (typeof role === 'string') ? role.trim() : role;
        if (requestedRole === 'Admin') {
            return res.status(403).send({ message: "Lỗi: Không thể đăng ký vai trò Admin qua API." });
        } else if (requestedRole === 'Employer' || requestedRole === 'Student') {
            finalRole = requestedRole;
        } 
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 8); 

        const user = await User.create({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            role: finalRole 
        });
        
        // Tạo Profile liên kết
        if (finalRole === 'Student') {
            await db.Student.create({ userId: user.id, major: 'Chưa cập nhật' });
        } else if (finalRole === 'Employer') {
            await db.Employer.create({ userId: user.id, companyName: fullName + "'s Company" });
        }

        res.status(201).send({ message: "Đăng ký thành công!", role: finalRole });

    } catch (error) {
        console.error("LỖI ĐĂNG KÝ NGHIÊM TRỌNG (SERVER):", error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).send({ message: "Email này đã được sử dụng." });
        }
        
        res.status(500).send({ message: "Đăng ký thất bại. Lỗi hệ thống: " + (error.message || error.name) });
    }
};

// ----------------- Hàm Đăng nhập (SIGNIN) -----------------
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { email: email } });
    
    if (!user) return res.status(404).send({ message: "Không tìm thấy người dùng." }); 

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: "Mật khẩu không chính xác!" });
    }

    const token = jwt.sign({ id: user.id, role: user.role },
                           "YOUR_VERY_SECRET_KEY", 
                           { expiresIn: 86400 } 
                          );

    res.status(200).send({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      accessToken: token
    });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};