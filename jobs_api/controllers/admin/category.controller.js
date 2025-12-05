const db = require('../../models');
const Category = db.Category; // Sequelize Model
const { Op } = require("sequelize"); // Import Op từ Sequelize để dùng các toán tử
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

// Danh sách các loại danh mục hợp lệ
const VALID_TYPES = ['INDUSTRY', 'JOB_LEVEL', 'JOB_TYPE'];

/**
 * Hàm kiểm tra và chuẩn hóa loại danh mục
 */
const checkType = (type) => {
    const upperType = type.toUpperCase();
    if (!VALID_TYPES.includes(upperType)) {
        throw new AppError(`Loại danh mục không hợp lệ: ${type}. Các loại hợp lệ là: ${VALID_TYPES.join(', ')}`, 400);
    }
    return upperType;
};

// ----------------- 1. Tạo Danh mục (Create) -----------------
exports.createCategory = catchAsync(async (req, res, next) => {
    const { type: rawType, name, ...rest } = req.body;

    // Nếu không gửi type thì mặc định INDUSTRY
    let type = "INDUSTRY";

    if (rawType) {
        // Nếu có gửi type thì kiểm tra hợp lệ
        type = checkType(rawType);
    }

    const newCategory = await Category.create({ 
        type, 
        name,
        ...rest 
    });

    res.status(201).json({
        status: 'success',
        data: {
            category: newCategory
        }
    });
});

// ----------------- 2. Lấy tất cả Danh mục (Read All) -----------------
exports.getAllCategories = catchAsync(async (req, res, next) => {
    const { type: rawType } = req.query; // Lọc theo type nếu có

    const where = {};
    
    if (rawType) {
        try {
            where.type = checkType(rawType);
        } catch (error) {
            return next(error); // Chuyển lỗi loại không hợp lệ
        }
    }

    const categories = await Category.findAll({ 
        where, 
        order: [['type', 'ASC'], ['name', 'ASC']] // Sắp xếp cho dễ xem
    });

    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: {
            categories
        }
    });
});

// ----------------- 3. Lấy 1 Danh mục theo ID (Read One) -----------------
exports.getCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findByPk(req.params.id); // Dùng findByPk cho khóa chính

    if (!category) {
        return next(new AppError('Không tìm thấy danh mục với ID này.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            category
        }
    });
});

// ----------------- 4. Cập nhật Danh mục (Update) -----------------
exports.updateCategory = catchAsync(async (req, res, next) => {
    const { type: rawType, ...updateData } = req.body;
    let type;
    
    // Kiểm tra và chuẩn hóa loại nếu có trong body
    if (rawType) {
        try {
            type = checkType(rawType);
            updateData.type = type;
        } catch (error) {
            return next(error);
        }
    }
    
    const [numUpdated, updatedCategories] = await Category.update(updateData, {
        where: { id: req.params.id },
        returning: true // Trả về các bản ghi đã cập nhật (chỉ hoạt động với PostgreSQL, SQL Server)
    });

    if (numUpdated === 0) {
        return next(new AppError('Không tìm thấy danh mục để cập nhật.', 404));
    }

    // Nếu không có returning: true (như MySQL), cần phải truy vấn lại
    const updatedCategory = await Category.findByPk(req.params.id); 

    res.status(200).json({
        status: 'success',
        message: 'Cập nhật danh mục thành công.',
        data: {
            category: updatedCategory
        }
    });
});

// ----------------- 5. Xóa Danh mục (Delete) -----------------
exports.deleteCategory = catchAsync(async (req, res, next) => {
    const numDeleted = await Category.destroy({
        where: { id: req.params.id }
    });

    if (numDeleted === 0) {
        return next(new AppError('Không tìm thấy danh mục để xóa.', 404));
    }

    // Xóa thành công, trả về 204 (No Content)
    res.status(204).json({
        status: 'success',
        data: null
    });
});