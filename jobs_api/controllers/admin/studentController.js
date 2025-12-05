// Giả định bạn đã khởi tạo các models và db.
const db = require('../../models'); 
// Import các Models cần thiết (chỉ cần Student và User cho 2 hàm này)
const { Student, User, Experience, JobApplication } = db; 

const { Op } = require('sequelize');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

// Hàm 1: Lấy danh sách Ứng viên (có tìm kiếm & phân trang)
exports.getAllStudents = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Khởi tạo điều kiện tìm kiếm cho bảng Student
    const studentWhere = {};
    const userWhere = {}; // Khởi tạo điều kiện tìm kiếm và lọc cho bảng User
    
    // 1. Tìm kiếm theo Tên hoặc Email (DÙNG TRÊN BẢNG STUDENT/USER)
    if (req.query.search) {
        studentWhere.fullName = { [Op.like]: `%${req.query.search}%` };
        userWhere.email = { [Op.like]: `%${req.query.search}%` };
    }
    
    // 2. Lọc theo trạng thái Khóa/Mở khóa (DÙNG TRÊN BẢNG USER)
    const isLockedFilter = req.query.isLocked; // Frontend gửi 'true' hoặc 'false'
    if (isLockedFilter !== undefined) {
        // Chuyển chuỗi 'true'/'false' thành giá trị boolean
        const isLockedBoolean = isLockedFilter === 'true';
        userWhere.isLocked = isLockedBoolean;
    }
    
    // 💡 SỬA LỖI ADMIN: Đảm bảo chỉ lấy user có role là 'Student'
    userWhere.role = 'Student'; 

    // 3. Lọc theo trạng thái hồ sơ (Nếu cần)
    if (req.query.profileStatus) {
        studentWhere.profileStatus = req.query.profileStatus;
    }

    const { count, rows: students } = await Student.findAndCountAll({
        where: studentWhere, // Điều kiện lọc trên bảng Student
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']],
        
        // Cần thiết phải JOIN với bảng User để lọc isLocked và role
        include: [
            {
                model: User, 
                as: 'user',    
                where: userWhere, // Dùng điều kiện đã có isLocked, email và role='Student'
                // Lấy các thuộc tính cần thiết để frontend hiển thị trạng thái khóa, email, và role
                attributes: ['id', 'email', 'role', 'lockReason', 'isLocked'], 
                required: true // Bắt buộc phải khớp cả điều kiện userWhere
            }
        ],
        attributes: [
            'studentId', 'fullName', 'phone', 
            'province', 'totalYearsExperience', 'profileStatus', 'isComplete', 'createdAt'
        ]
    });

    res.status(200).json({
        status: 'success',
        results: students.length,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count
        },
        data: {
            students
        }
    });
});

// Hàm 2: Cập nhật trạng thái Khóa/Mở khóa (ĐÃ SỬA LỖI LƯU LY DO KHÓA)
exports.updateStudentStatus = catchAsync(async (req, res, next) => {
    const student = await Student.findOne({ where: { studentId: req.params.id } });

    if (!student) {
        return next(new AppError('Không tìm thấy ứng viên.', 404));
    }

    const user = await User.findOne({ where: { id: student.userId } });

    if (!user) {
        return next(new AppError('Không tìm thấy tài khoản người dùng liên kết.', 404));
    }
    
    // 💡 SỬA LỖI: Trích xuất lockReason (và lockUntil nếu dùng)
    const { isLocked, lockReason, lockUntil } = req.body; 

    const updateFields = { isLocked: !!isLocked };
    
    if (isLocked) {
        // Nếu Khóa: Lưu Lý do (bắt buộc phải có từ Frontend)
        if (!lockReason) {
             return next(new AppError('Vui lòng cung cấp lý do khóa tài khoản.', 400));
        }
        updateFields.lockReason = lockReason;
        updateFields.lockUntil = lockUntil || null; // Có thể cập nhật thời hạn
    } else { 
        // Nếu Mở Khóa: Xóa Lý do và thời hạn
        updateFields.lockReason = null;
        updateFields.lockUntil = null;
    }

    await user.update(updateFields);

    res.status(200).json({
        status: 'success',
        message: `Đã ${isLocked ? 'khóa' : 'mở khóa'} tài khoản ứng viên ${student.fullName}.`,
        data: {
            userStatus: user.isLocked,
            // Trả về dữ liệu cập nhật để frontend có thể refresh trạng thái
            lockReason: user.lockReason,
            lockUntil: user.lockUntil
        }
    });
});

// Hàm deleteStudent ĐÃ ĐƯỢC LOẠI BỎ THEO YÊU CẦU.