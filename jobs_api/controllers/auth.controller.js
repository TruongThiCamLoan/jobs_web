const db = require('../models');
const config = require('../config/db.config'); // Cần có file này để lấy SECRET KEY (nếu có)
const User = db.User;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// =======================================================
// 1. Hàm Đăng ký (SIGNUP)
// =======================================================
exports.signup = async (req, res) => {
    
    // BƯỚC 1: LOG DỮ LIỆU NHẬN ĐƯỢC
    console.log("=====================================");
    console.log("DỮ LIỆU ĐĂNG KÝ NHẬN ĐƯỢC (req.body):", req.body);
    console.log("=====================================");
    
    let { fullName, email, password, role } = req.body;

    // BƯỚC 2: KIỂM TRA & SỬA LỖI ĐÓNG GÓI DỮ LIỆU TỪ FRONTEND (Giữ nguyên logic của bạn)
    if (typeof fullName === 'object' && fullName !== null && fullName.email && fullName.password) {
        console.warn("CẢNH BÁO: Dữ liệu gửi từ Frontend bị đóng gói sai. Tiến hành trích xuất...");
        email = fullName.email;
        password = fullName.password;
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
            // Giả định db.Employer tồn tại
            await db.Employer.create({ 
                userId: user.id, 
                companyName: fullName, // Sử dụng fullName từ form (tên công ty)
                contactEmail: user.email, 
            });
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

// =======================================================
// 2. Hàm Đăng nhập (SIGNIN)
// =======================================================
exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. TÌM USER VÀ LẤY TẤT CẢ THÔNG TIN TRẠNG THÁI TỪ BẢNG USER
        const user = await db.User.findOne({ 
            where: { email: email },
            // Lấy các trường trạng thái cần thiết từ bảng User
            attributes: ['id', 'fullName', 'email', 'password', 'role', 'isLocked', 'lockReason', 'lockUntil']
        });
        
        if (!user) return res.status(404).send({ message: "Không tìm thấy người dùng." }); 

        // 2. KIỂM TRA MẬT KHẨU
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ accessToken: null, message: "Mật khẩu không chính xác!" });
        }

        // ----------------------------------------------------
        // 3. KIỂM TRA QUY TẮC NGHIỆP VỤ (Khóa & Duyệt)
        // ----------------------------------------------------

        // A. KIỂM TRA KHÓA TÀI KHOẢN (Áp dụng cho Student, Employer, Admin)
        if (user.isLocked) {
            // Chặn đăng nhập nếu bị khóa và trả về chi tiết lỗi 403
            return res.status(403).send({ 
                message: "Tài khoản của bạn đã bị khóa.",
                isLocked: true,
                lockReason: user.lockReason,
                lockUntil: user.lockUntil
            });
        }

        // B. KIỂM TRA TRẠNG THÁI DUYỆT (Chỉ áp dụng cho Employer)
        let isVerified = (user.role !== 'Employer'); // Mặc định là true nếu không phải Employer
        let rejectionReason = null;

        if (user.role === 'Employer') {
            // Giả định db.Employer tồn tại
            const employerProfile = await db.Employer.findOne({ 
                where: { userId: user.id },
                attributes: ['isVerified', 'rejectionReason']
            });
            
            if (employerProfile) {
                isVerified = employerProfile.isVerified;
                rejectionReason = employerProfile.rejectionReason;
            }
            
            // Gán trạng thái vào response data (cho bước 4 sử dụng)
            user.dataValues.isVerified = isVerified;
            user.dataValues.rejectionReason = rejectionReason;
        }


        // 4. CẤP TOKEN VÀ TRẢ VỀ DỮ LIỆU (Chỉ khi đã qua các bước kiểm tra)
        const token = jwt.sign({ id: user.id, role: user.role },
                            "YOUR_VERY_SECRET_KEY", // TỐT NHẤT NÊN DÙNG config.secret
                            { expiresIn: 86400 } 
                          );

        res.status(200).send({
            // Các trường thông tin cơ bản
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            accessToken: token,
            
            // Trạng thái
            isLocked: false, // Luôn là false nếu đến được đây
            isVerified: isVerified,
            rejectionReason: rejectionReason, 
        });

    } catch (error) {
        console.error("LỖI ĐĂNG NHẬP SERVER:", error);
        res.status(500).send({ message: error.message });
    }
};

// =======================================================
// 3. XỬ LÝ ĐỔI MẬT KHẨU (POST /api/auth/change-password)
// =======================================================
exports.changePassword = async (req, res) => {
    try {
        const userId = req.userId; // Lấy userId từ Token đã xác thực
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).send({ message: "Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới." });
        }

        // 1. Tìm người dùng
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({ message: "Người dùng không tồn tại." });
        }

        // 2. Xác minh mật khẩu hiện tại
        const passwordIsValid = bcrypt.compareSync(
            oldPassword,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Mật khẩu hiện tại không chính xác!"
            });
        }
        
        // 3. Kiểm tra mật khẩu mới có trùng mật khẩu cũ không
        const isNewPasswordSame = bcrypt.compareSync(newPassword, user.password);
        if (isNewPasswordSame) {
            return res.status(400).send({ message: "Mật khẩu mới phải khác mật khẩu hiện tại." });
        }

        // 4. Mã hóa (hash) và cập nhật mật khẩu mới
        const hashedNewPassword = bcrypt.hashSync(newPassword, 8);
        await user.update({ password: hashedNewPassword });

        // 5. Trả về thành công
        res.status(200).send({
            message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại với mật khẩu mới.",
        });

    } catch (error) {
        console.error("Lỗi đổi mật khẩu:", error);
        res.status(500).send({ message: "Lỗi server trong quá trình đổi mật khẩu.", error: error.message });
    }
};