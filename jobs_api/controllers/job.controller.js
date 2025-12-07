const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const db = require('../models');
const Job = db.Job;
const Employer = db.Employer; 
const User = db.User;
const Category = db.Category; 

// Danh sách các cột chi tiết cần lấy từ bảng Jobs
const JOB_ATTRIBUTES = [
    'jobId', 'employerId', 'title', 'description', 'requirements', 
    'salary', 'location', 'postDate', 'deadline', 'status',
    'quantity', 'experience', 'academicLevel', 'workingHours', 
    'industryId', 'benefits', 'tags', 'jobLevelId', 'jobTypeId', 'gender'
];

// ----------------- Hàm Tạo Job (Protected) -----------------
exports.createJob = async (req, res) => {
    const userId = req.userId; // ID người dùng từ JWT
    const { 
        title, description, location, salary, requirements, status,
        quantity, experience, academicLevel, workingHours, industryId, 
        benefits, tags, jobLevelId, jobTypeId, gender
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
            industryId: industryId,
            benefits: benefits, 
            tags: tags, 
            jobLevelId: jobLevelId,
            jobTypeId: jobTypeId,
            gender: gender
        });

        res.status(201).send({ message: "Đăng tin tuyển dụng thành công!", job: job });
    } catch (error) {
        console.error("Lỗi khi tạo Job:", error);
        res.status(500).send({ message: error.message || "Lỗi server khi tạo bài đăng." });
    }
};

// ----------------- Hàm Lấy Danh sách Job (Public - TÌM KIẾM & LỌC) - ĐÃ SỬA LỌC -----------------
exports.getJobList = async (req, res) => {
    // ⭐ Lấy tất cả các tham số lọc từ Frontend
    const { search, location, career, level, jobType } = req.query; 

    const where = {};
    
    // 1. Xử lý bộ lọc tìm kiếm (Search Term)
    if (search) {
        const searchCondition = {
            [Op.or]: [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { requirements: { [Op.like]: `%${search}%` } },
            ]
        };
        Object.assign(where, searchCondition);
    }

    // 2. Xử lý bộ lọc địa điểm (Location)
    if (location) {
        where.location = { [Op.like]: `%${location}%` };
    }
    
    // ⭐ 3. XỬ LÝ LỌC THEO NGÀNH NGHỀ (Career -> industryId)
    if (career) {
        // 'career' là Category ID, lọc bằng khóa ngoại industryId
        where.industryId = career; 
    }

    // ⭐ 4. XỬ LÝ LỌC THEO CẤP BẬC (Level -> jobLevelId)
    if (level) {
        // 'level' là Category ID, lọc bằng khóa ngoại jobLevelId
        where.jobLevelId = level;
    }

    // ⭐ 5. XỬ LÝ LỌC THEO LOẠI CÔNG VIỆC (JobType -> jobTypeId)
    if (jobType) {
        // 'jobType' là Category ID, lọc bằng khóa ngoại jobTypeId
        where.jobTypeId = jobType;
    }
    
    // Ghi chú: Có thể thêm logic cho salary/experience nếu bạn sử dụng Category ID cho chúng


    try {
        const jobs = await Job.findAll({
            where: where, // Áp dụng TẤT CẢ các điều kiện
            attributes: JOB_ATTRIBUTES,
            include: [
                { 
                    model: Employer, 
                    as: 'employer',
                    attributes: ['companyName', 'companyDescription', 'companyAddress', 'logoUrl', 'website'] 
                },
                // BƯỚC SỬA: INCLUDE ASSOCIATIONS ĐỂ LẤY TÊN DANH MỤC
                { 
                    model: Category, 
                    as: 'industryCategory', 
                    attributes: ['name'] 
                },
                { 
                    model: Category, 
                    as: 'jobLevelCategory', 
                    attributes: ['name'] 
                },
                { 
                    model: Category, 
                    as: 'jobTypeCategory', 
                    attributes: ['name'] 
                }
            ],
            order: [['postDate', 'DESC']]
        });
        
        return res.status(200).json(jobs);
    } catch (error) {
        console.error("Lỗi tải danh sách việc làm:", error);
        return res.status(500).json({ message: error.message || 'Lỗi server khi lấy danh sách việc làm.' });
    }
};

// ----------------- Hàm Lấy Chi tiết Job (Public) -----------------
exports.getJobDetail = async (req, res) => {
    const jobId = req.params.id;

    try {
        const job = await Job.findByPk(jobId, {
            attributes: JOB_ATTRIBUTES,
            include: [
                { 
                    model: Employer, 
                    as: 'employer',
                    attributes: ['companyName', 'companyDescription', 'companyAddress', 'phoneNumber', 'website', 'logoUrl'] 
                },
                { 
                    model: Category, 
                    as: 'industryCategory', 
                    attributes: ['name'] 
                },
                { 
                    model: Category, 
                    as: 'jobLevelCategory', 
                    attributes: ['name'] 
                },
                { 
                    model: Category, 
                    as: 'jobTypeCategory', 
                    attributes: ['name'] 
                }
            ]
        });
        
        if (!job) {
            return res.status(404).json({ message: 'Không tìm thấy bài đăng tuyển dụng.' });
        }
        
        return res.status(200).json(job); 
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết Job:", error);
        return res.status(500).json({ message: 'Lỗi server khi lấy chi tiết việc làm.' });
    }
};

// ----------------- Hàm Cập nhật Job (Protected) -----------------
exports.updateJob = async (req, res) => {
    const jobId = req.params.id;
    const userId = req.userId;

    try {
        const job = await Job.findByPk(jobId, {
            include: [{ model: Employer, as: 'employer' }]
        });

        if (!job) {
            return res.status(404).send({ message: "Không tìm thấy bài đăng tuyển dụng." });
        }

        const employerProfile = await Employer.findOne({ where: { userId: userId } });
        if (!employerProfile || employerProfile.employerId !== job.employerId) {
            return res.status(403).send({ message: "Bạn không có quyền chỉnh sửa bài đăng này." });
        }

        const [updated] = await Job.update(req.body, {
            where: { jobId: jobId }
        });

        if (updated) {
            const updatedJob = await Job.findByPk(jobId, { attributes: JOB_ATTRIBUTES });
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
    const userId = req.userId; 

    try {
        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).send({ message: "Không tìm thấy bài đăng tuyển dụng để xóa." });
        }

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