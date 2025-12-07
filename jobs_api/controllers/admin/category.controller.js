const db = require('../../models');
const Category = db.Category; // Sequelize Model
const { Op } = require("sequelize"); // Import Op từ Sequelize để dùng các toán tử
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

// Danh sách các loại danh mục hợp lệ
// ⭐ ĐÃ CẬP NHẬT: Thêm SALARY và EXPERIENCE
const VALID_TYPES = ['INDUSTRY', 'JOB_LEVEL', 'JOB_TYPE', 'SALARY', 'EXPERIENCE'];

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
    // ⭐ THÊM query param 'includeJobCount'
    const { type: rawType, includeJobCount } = req.query; 

    let where = {};
    let attributes = ['id', 'type', 'name', 'description'];
    let group = ['Category.id']; // Chỉ cần GROUP BY ID vì các trường khác là duy nhất cho ID
    let include = [];
    let order = [['type', 'ASC'], ['name', 'ASC']];

    if (rawType) {
        try {
            where.type = checkType(rawType);
        } catch (error) {
            return next(error); 
        }
    }

    // ⭐ LOGIC THỐNG KÊ (Nếu includeJobCount = 'true' và type là INDUSTRY)
    // Chỉ đếm số lượng việc làm nếu type là INDUSTRY, vì các loại khác không cần Job Count
    if (includeJobCount === 'true' && where.type === 'INDUSTRY') { 
        
        // 1. Thêm trường đếm vào attributes
        attributes.push([Sequelize.fn('COUNT', Sequelize.col('jobsInIndustry.id')), 'jobCount']);

        // 2. Định nghĩa JOIN với bảng Job, sử dụng alias 'jobsInIndustry'
        include = [{
            model: Job,
            as: 'jobsInIndustry', // ⭐ QUAN TRỌNG: Phải khớp với alias trong file associations
            attributes: [],       // Không lấy các trường của Job
            required: false       // LEFT JOIN: Lấy cả Industry không có Jobs
        }];

        // 3. Phải nhóm theo tất cả các thuộc tính SELECT (trừ COUNT)
        // Vì 'Category.id' là khóa chính, chỉ cần group theo nó
        group = ['Category.id', 'Category.type', 'Category.name', 'Category.description']; 
        
        // 4. Sắp xếp: Theo số lượng việc làm giảm dần, sau đó theo tên
        order = [[Sequelize.fn('COUNT', Sequelize.col('jobsInIndustry.id')), 'DESC'], ['name', 'ASC']];
    }
    
    // Nếu không có thống kê, chúng ta quay lại sắp xếp mặc định theo type và name.

    const categories = await Category.findAll({ 
        where, 
        attributes,
        include, 
        group,   
        order,
        // Dùng raw: true để Sequelize không cố gắng tạo đối tượng model cho kết quả GROUP BY
        // Tuy nhiên, việc map plain: true ở dưới an toàn hơn.
    });

    // Chuyển kết quả về định dạng JSON thuần túy (để trường jobCount hiển thị đúng)
    const resultCategories = categories.map(cat => cat.get({ plain: true }));

    res.status(200).json({
        status: 'success',
        results: resultCategories.length,
        data: {
            categories: resultCategories
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