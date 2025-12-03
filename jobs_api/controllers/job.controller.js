const { Sequelize } = require('sequelize'); // Sử dụng CommonJS cho Sequelize
const Op = Sequelize.Op; // Lấy toán tử Op từ Sequelize

const db = require('../models');
const Job = db.Job;
const Employer = db.Employer; 
const User = db.User;

// Danh sách các cột chi tiết cần lấy từ bảng Jobs
const JOB_ATTRIBUTES = [
    'jobId', 'employerId', 'title', 'description', 'requirements', 
    'salary', 'location', 'postDate', 'deadline', 'status',
    'quantity', 'experience', 'academicLevel', 'workingHours', 
    'industry', 'benefits', 'tags', 'jobLevel', 'jobType', 'gender'
];

// ----------------- Hàm Tạo Job (Protected) -----------------
exports.createJob = async (req, res) => {
    const userId = req.userId; // ID người dùng từ JWT
    const { 
        title, description, location, salary, requirements, status,
        quantity, experience, academicLevel, workingHours, industry, 
        benefits, tags, jobLevel, jobType, gender
    } = req.body; // Lấy thêm các trường mới

    try {
        // 1. Lấy employerId từ userId
        const employerProfile = await Employer.findOne({ where: { userId: userId } });
        if (!employerProfile) {
            return res.status(403).send({ message: "Lỗi: Bạn cần có hồ sơ nhà tuyển dụng để đăng tin." });
        }
        const employerId = employerProfile.employerId;

        // 2. Tạo Job mới (bao gồm các cột mới)
        const job = await Job.create({
            employerId, 
            title,
            description,
            requirements,
            location,
            salary,
            status: status || 'Active', 
            postDate: new Date(),
            // Thêm các trường mới vào đây
            quantity: quantity, 
            experience: experience, 
            academicLevel: academicLevel, 
            workingHours: workingHours, 
            industry: industry, 
            benefits: benefits, 
            tags: tags, 
            jobLevel: jobLevel, 
            jobType: jobType, 
            gender: gender
        });

        res.status(201).send({ message: "Đăng tin tuyển dụng thành công!", job: job });
    } catch (error) {
        console.error("Lỗi khi tạo Job:", error);
        res.status(500).send({ message: error.message || "Lỗi server khi tạo bài đăng." });
    }
};

// ----------------- Hàm Lấy Danh sách Job (Public - TÌM KIẾM & LỌC) -----------------
exports.getJobList = async (req, res) => {
    // Lấy tham số search và location từ URL
    const { search, location } = req.query; 

    const where = {};
    
    // Xử lý bộ lọc tìm kiếm (Search Term): Lọc theo Title, Description, Requirements, Industry
    if (search) {
        const searchCondition = {
            [Op.or]: [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { requirements: { [Op.like]: `%${search}%` } },
                { industry: { [Op.like]: `%${search}%` } }, // Thêm lọc theo industry
            ]
        };
        // Gán điều kiện tìm kiếm chung vào where
        Object.assign(where, searchCondition);
    }

    // Xử lý bộ lọc địa điểm (Location)
    if (location) {
        // Thêm điều kiện location vào where
        where.location = { [Op.like]: `%${location}%` };
    }


    try {
        const jobs = await Job.findAll({
            where: where, // Áp dụng các điều kiện tìm kiếm
            attributes: JOB_ATTRIBUTES, // FIX: Lấy tất cả các cột chi tiết
            include: [{ 
                model: Employer, 
                as: 'employer',
                // FIX: Thêm logoUrl và website vào thuộc tính Employer
                attributes: ['companyName', 'companyDescription', 'companyAddress', 'logoUrl', 'website'] 
            }],
            order: [['postDate', 'DESC']]
        });
        
        return res.status(200).json(jobs);
    } catch (error) {
        console.error("Lỗi tải danh sách việc làm:", error);
        return res.status(500).json({ message: 'Lỗi server khi lấy danh sách việc làm.' });
    }
};

// ----------------- Hàm Lấy Chi tiết Job (Public) -----------------
exports.getJobDetail = async (req, res) => {
    const jobId = req.params.id;

    try {
        const job = await Job.findByPk(jobId, {
            attributes: JOB_ATTRIBUTES, // FIX: Lấy tất cả các cột chi tiết
            include: [{ 
                model: Employer, 
                as: 'employer',
                // FIX: Thêm logoUrl và website vào thuộc tính Employer
                attributes: ['companyName', 'companyDescription', 'companyAddress', 'phoneNumber', 'website', 'logoUrl'] 
            }]
        });
        
        if (!job) {
            return res.status(404).json({ message: 'Không tìm thấy bài đăng tuyển dụng.' });
        }
        
        // FIX: Trả về kết quả JSON để tags (JSON type) được parse đúng
        return res.status(200).json(job); 
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết Job:", error);
        return res.status(500).json({ message: 'Lỗi server khi lấy chi tiết việc làm.' });
    }
};

// ----------------- Hàm Cập nhật Job (Protected) -----------------
exports.updateJob = async (req, res) => {
    const jobId = req.params.id;
    const userId = req.userId; // ID người dùng hiện tại từ JWT

    try {
        const job = await Job.findByPk(jobId, {
            include: [{ model: Employer, as: 'employer' }]
        });

        if (!job) {
            return res.status(404).send({ message: "Không tìm thấy bài đăng tuyển dụng." });
        }

        // Kiểm tra quyền: Đảm bảo người dùng này là Employer và là người sở hữu Job
        const employerProfile = await Employer.findOne({ where: { userId: userId } });
        if (!employerProfile || employerProfile.employerId !== job.employerId) {
            return res.status(403).send({ message: "Bạn không có quyền chỉnh sửa bài đăng này." });
        }

        const [updated] = await Job.update(req.body, {
            where: { jobId: jobId }
        });

        if (updated) {
            const updatedJob = await Job.findByPk(jobId);
            return res.status(200).send({ message: "Cập nhật thành công!", job: updatedJob });
        }

        return res.status(200).send({ message: "Không có thay đổi nào được thực hiện." });

    } catch (error) {
        console.error("Lỗi khi cập nhật Job:", error);
        res.status(500).send({ message: error.message || "Lỗi server khi cập nhật." });
    }
};

// ----------------- Hàm Xóa Job (Protected) -----------------
exports.deleteJob = async (req, res) => {
    const jobId = req.params.id;
    const userId = req.userId; // ID người dùng hiện tại từ JWT

    try {
        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).send({ message: "Không tìm thấy bài đăng tuyển dụng để xóa." });
        }

        // Kiểm tra quyền: Đảm bảo người dùng này là Employer và là người sở hữu Job
        const employerProfile = await Employer.findOne({ where: { userId: userId } });
        if (!employerProfile || employerProfile.employerId !== job.employerId) {
            return res.status(403).send({ message: "Bạn không có quyền xóa bài đăng này." });
        }
        
        const deleted = await Job.destroy({
            where: { jobId: jobId }
        });

        if (deleted) {
            return res.status(200).send({ message: "Xóa bài đăng tuyển dụng thành công!" });
        }

    } catch (error) {
        console.error("Lỗi khi xóa Job:", error);
        res.status(500).send({ message: error.message || "Lỗi server khi xóa." });
    }
};