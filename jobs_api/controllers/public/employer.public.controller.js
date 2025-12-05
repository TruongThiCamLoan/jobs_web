// File: controllers/public/employer.public.controller.js

const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const db = require('../../models');
const { Employer, User, Job } = db;
const catchAsync = require('../../utils/catchAsync');

// Literal để đếm số Job đang Active
const jobsCountLiteral = Sequelize.literal(`(
    SELECT COUNT(*)
    FROM Jobs AS job
    WHERE
        job.employerId = Employer.employerId
        AND job.status = 'Active'
)`);

// =========================================================
// API Công khai: Lấy danh sách Nhà tuyển dụng (lọc + phân trang)
// =========================================================
exports.getAllEmployersPublic = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    // Điều kiện bắt buộc
    const employerWhere = { isVerified: 0 };
    const userWhere = { isLocked: 0, role: 'Employer' };

    // ===============================
    // 🔍 Lọc Search — chỉ áp nếu có giá trị
    // ===============================
    if (req.query.search && req.query.search.trim() !== "") {
        employerWhere.companyName = { [Op.like]: `%${req.query.search.trim()}%` };
    }

    // ===============================
    // 📍 Lọc Location — chỉ áp nếu có giá trị
    // ===============================
    if (req.query.location && req.query.location.trim() !== "") {
        employerWhere.city = { [Op.like]: `%${req.query.location.trim()}%` };
    }

    // ===============================
    // 📏 Lọc Size (nếu dùng)
    // ===============================
    if (req.query.size && req.query.size.trim() !== "") {
        employerWhere.size = req.query.size.trim();
    }

    // ===============================
    // 📌 Query DB
    // ===============================
    const { count, rows: employers } = await Employer.findAndCountAll({
        where: employerWhere,
        limit,
        offset,

        order: [[Sequelize.literal('jobsCount'), 'DESC']],

        include: [{
            model: User,
            as: 'user',
            where: userWhere,
            attributes: [],
            required: true
        }],

        attributes: [
            'employerId',
            'companyName',
            'companyAddress',
            'logoUrl',
            [jobsCountLiteral, 'jobsCount']
        ],
    });

    // ===============================
    // Chuẩn hóa dữ liệu trả về
    // ===============================
    const finalEmployers = employers.map(emp => {
        const e = emp.toJSON();
        const rawAddress = e.companyAddress || "";
        const location = rawAddress.split(',').pop()?.trim() || "Toàn quốc";

        return {
            id: e.employerId,
            name: e.companyName,
            jobs: e.jobsCount ? parseInt(e.jobsCount, 10) : 0,
            location,
            logo: e.logoUrl
        };
    });

    // ===============================
    // Response về frontend
    // ===============================
    res.status(200).json({
        status: "success",
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count
        },
        data: {
            employers: finalEmployers
        }
    });
});
