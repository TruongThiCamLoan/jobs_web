const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
const db = require('../../models');

// ✅ Chỉ giữ lại các Models cần thiết
const { Job, User, Employer } = db; 
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

// 💡 Subquery đếm số lượt ứng tuyển (Job Applications) cho mỗi Job
const applicationsCountLiteral = Sequelize.literal(`(
    SELECT COUNT(*)
    FROM JobApplications AS ja 
    WHERE ja.jobId = Job.jobId 
)`);

// =========================================================
// Hàm 1: Thống kê Hiệu suất Tin tuyển dụng (jobStats)
// =========================================================
exports.getJobPerformanceStats = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // ❌ Đã bỏ giả định về trường 'views'
    const { count, rows: jobs } = await Job.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']],
        
        include: [
            {
                model: Employer,
                as: 'employer',
                attributes: ['companyName'] // Lấy tên công ty
            }
        ],

        attributes: [
            'jobId', 
            'title', 
            [applicationsCountLiteral, 'applicationsCount'] // Số lượt ứng tuyển
        ]
    });

    const jobStats = jobs.map(job => ({
        id: job.jobId,
        title: job.title,
        employerName: job.employer?.companyName || 'N/A',
        // ❌ Đã loại bỏ trường views khỏi kết quả trả về
        applications: parseInt(job.dataValues.applicationsCount, 10) || 0,
    }));

    res.status(200).json({
        status: 'success',
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count
        },
        data: { jobStats }
    });
});


// ❌ Hàm 2: getInteractionLogs đã được loại bỏ

// =========================================================
// Hàm 3: Thống kê theo Tháng (statistic) - Chỉ giữ Jobs
// =========================================================
exports.getMonthlyStatistics = catchAsync(async (req, res, next) => {
    const { year, fromMonth, toMonth } = req.query; 

    if (!year || !fromMonth || !toMonth) {
        return next(new AppError('Vui lòng cung cấp năm, tháng bắt đầu và tháng kết thúc.', 400));
    }

    const startMonth = parseInt(fromMonth);
    const endMonth = parseInt(toMonth);
    const targetYear = parseInt(year);

    // Xây dựng điều kiện ngày bắt đầu và kết thúc (cho toàn bộ phạm vi)
    const startDate = new Date(targetYear, startMonth - 1, 1);
    const endDate = new Date(targetYear, endMonth, 0); 
    
    // 1. LẤY SỐ LƯỢNG JOBS VÀ APPLICATIONS TỪNG THÁNG
    // Chúng ta sẽ dùng Job.findAll với Subquery Literal để đếm ứng tuyển.
    const statsByMonth = await Job.findAll({
        attributes: [
            [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
            // Đếm số lượng tin tuyển dụng được đăng trong tháng
            [Sequelize.fn('COUNT', Sequelize.col('jobId')), 'jobsPosted'],
            // Tính tổng số lượt ứng tuyển cho TẤT CẢ các Job được tạo trong tháng đó
            [Sequelize.fn('SUM', applicationsCountLiteral), 'applicationsTotal'] 
        ],
        where: {
            createdAt: { [Op.between]: [startDate, endDate] }
        },
        group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
        raw: true
    });
    
    
    // 2. CHUẨN HÓA DỮ LIỆU ĐỂ TẠO BIỂU ĐỒ
    const monthlyDataMap = {};

    statsByMonth.forEach(item => {
        monthlyDataMap[item.month] = {
            month: `Tháng ${item.month}`,
            jobsPosted: parseInt(item.jobsPosted, 10),
            // Lấy tổng số ứng tuyển
            applicationsTotal: parseInt(item.applicationsTotal, 10) || 0
        };
    });


    // 3. SẮP XẾP VÀ ĐẢM BẢO ĐỦ THÁNG TRONG PHẠM VI
    const chartData = [];
    for (let m = startMonth; m <= endMonth; m++) {
        chartData.push(monthlyDataMap[m] || {
            month: `Tháng ${m}`,
            jobsPosted: 0,
            applicationsTotal: 0
        });
    }

    res.status(200).json({
        status: 'success',
        data: { chartData }
    });
});