const db = require('../../models'); 
const { Employer, User, Job } = db; // Import các Models cần thiết
const { Op } = require('sequelize');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

// =========================================================
// Hàm 1: Lấy danh sách Nhà tuyển dụng (Tìm kiếm, Lọc, Phân trang)
// =========================================================
exports.getAllEmployers = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const employerWhere = {};
    const userWhere = { role: 'Employer' }; // Đảm bảo chỉ lấy Nhà tuyển dụng
    
    // 1. Tìm kiếm theo Tên Công ty hoặc Contact Email
    if (req.query.search) {
        employerWhere[Op.or] = [
            { companyName: { [Op.like]: `%${req.query.search}%` } },
            { contactEmail: { [Op.like]: `%${req.query.search}%` } } 
        ];
    }
    
    // 2. Lọc theo trạng thái Phê duyệt (isVerified)
    const isVerifiedFilter = req.query.isVerified; 
    if (isVerifiedFilter !== undefined) {
        const isVerifiedBoolean = isVerifiedFilter === 'true';
        employerWhere.isVerified = isVerifiedBoolean;
    }
    
    // 3. Lọc theo trạng thái Khóa/Mở khóa (isLocked - trong User)
    const isLockedFilter = req.query.isLocked; 
    if (isLockedFilter !== undefined) {
        userWhere.isLocked = isLockedFilter === 'true';
    }

    const { count, rows: employers } = await Employer.findAndCountAll({
        where: employerWhere,
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']],
        
        // JOIN với bảng User để lọc trạng thái khóa và lấy lockReason, lockUntil
        include: [{
            model: User, 
            as: 'user', 
            where: userWhere, 
            // 💡 BỔ SUNG lockUntil
            attributes: ['id', 'isLocked', 'lockReason', 'lockUntil'], 
            required: true 
        }],
        attributes: [
            'employerId', 'companyName', 'contactEmail', 'phoneNumber', 
            'city', 'isVerified', 'rejectionReason', 'createdAt'
        ]
    });

    res.status(200).json({
        status: 'success',
        results: employers.length,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count
        },
        data: {
            employers
        }
    });
});

// =========================================================
// Hàm 2: Phê duyệt/Từ chối hồ sơ công ty (REVIEW)
// =========================================================
exports.reviewEmployerAccount = catchAsync(async (req, res, next) => {
    const { isVerified, rejectionReason } = req.body; 
    const employerId = req.params.id;
    
    if (typeof isVerified !== 'boolean') {
        return next(new AppError('Vui lòng cung cấp giá trị isVerified hợp lệ (true/false).', 400));
    }

    const updateData = { isVerified: isVerified };
    
    // Lưu lý do nếu bị từ chối, ngược lại là null
    if (isVerified === false) {
        updateData.rejectionReason = rejectionReason || 'Không cung cấp đủ giấy tờ chứng minh hoặc vi phạm quy tắc.';
    } else {
        updateData.rejectionReason = null;
    }

    const [updatedRows] = await Employer.update(
        updateData,
        { where: { employerId } }
    );
    
    if (updatedRows === 0) { 
        return next(new AppError('Không tìm thấy nhà tuyển dụng.', 404));
    }

    res.status(200).json({
        status: 'success',
        message: `Tài khoản đã được ${isVerified ? 'phê duyệt' : 'từ chối'}.`
    });
});


// =========================================================
// Hàm 3: Khóa/Mở khóa tài khoản (STATUS) - ĐÃ SỬA LỖI LƯU lockUntil
// =========================================================
exports.updateEmployerStatus = catchAsync(async (req, res, next) => {
    const employer = await Employer.findOne({ where: { employerId: req.params.id } });

    if (!employer) {
        return next(new AppError('Không tìm thấy nhà tuyển dụng.', 404));
    }

    const user = await User.findOne({ where: { id: employer.userId } });

    if (!user) {
        return next(new AppError('Không tìm thấy tài khoản người dùng liên kết.', 404));
    }
    
    // 💡 SỬA LỖI: Bổ sung lockUntil từ req.body
    const { isLocked, lockReason, lockUntil } = req.body; 

    if (typeof isLocked !== 'boolean') {
        return next(new AppError('Vui lòng cung cấp giá trị isLocked hợp lệ (true/false).', 400));
    }
    
    const updateFields = { isLocked: isLocked };
    
    if (isLocked) {
        // Nếu khóa: Lưu lockReason và lockUntil
        updateFields.lockReason = lockReason || 'Lý do không được cung cấp';
        // 💡 LƯU TRỮ THỜI GIAN KHÓA (lockUntil)
        updateFields.lockUntil = lockUntil || null; 
    } else {
        // Nếu mở khóa: Xóa cả lockReason và lockUntil
        updateFields.lockReason = null;
        updateFields.lockUntil = null;
    }

    // Cập nhật các trường đã được thiết lập (bao gồm lockReason và lockUntil)
    await user.update(updateFields);

    res.status(200).json({
        status: 'success',
        message: `Đã ${isLocked ? 'khóa' : 'mở khóa'} tài khoản nhà tuyển dụng ${employer.companyName}.`,
        data: {
            isLocked: user.isLocked,
            lockReason: user.lockReason,
            lockUntil: user.lockUntil // Trả về giá trị đã lưu
        }
    });
});

// =========================================================
// Hàm 4: Xóa vĩnh viễn nhà tuyển dụng (TRANSACTION)
// =========================================================
exports.deleteEmployer = catchAsync(async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
        const employerId = req.params.id;
        
        const employer = await Employer.findOne({ where: { employerId }, transaction: t });
        if (!employer) {
            await t.rollback();
            return next(new AppError('Không tìm thấy nhà tuyển dụng.', 404));
        }
        
        const userIdToDelete = employer.userId;

        // 1. Xóa tất cả các bài đăng tuyển dụng
        await Job.destroy({ where: { employerId }, transaction: t }); 
        
        // 2. Xóa hồ sơ Employer chính
        await Employer.destroy({ where: { employerId }, transaction: t });

        // 3. Xóa tài khoản User (Quan trọng nhất)
        await User.destroy({ where: { id: userIdToDelete }, transaction: t }); 

        await t.commit();

        res.status(204).json({
            status: 'success',
            data: null 
        });

    } catch (error) {
        await t.rollback();
        console.error('Lỗi khi xóa nhà tuyển dụng:', error);
        return next(new AppError('Lỗi hệ thống khi xóa nhà tuyển dụng và dữ liệu liên quan.', 500));
    }
});