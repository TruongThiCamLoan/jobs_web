const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const db = require('../models');
const Employer = db.Employer;
const Job = db.Job; // FIX: Đã sửa thành chữ hoa 'J' để đảm bảo import đúng Model Job

// ----------------- Hàm Lấy Danh sách Nhà Tuyển Dụng Hàng Đầu (Public) -----------------
exports.getTopEmployers = async (req, res) => {
    try {
        // Sử dụng Subquery (literal) để đếm Job đang Active cho mỗi công ty.
        // Phương pháp này tránh lỗi phức tạp của Sequelize Eager Loading khi dùng GROUP BY.
        const jobsCountLiteral = Sequelize.literal(`(
            SELECT COUNT(*)
            FROM Jobs AS job
            WHERE
                job.employerId = Employer.employerId
                AND job.status = 'Active'
        )`);

        const employers = await Employer.findAll({
            // Chọn các thuộc tính cần thiết, bao gồm cả cột đếm
            attributes: [
                'employerId', 
                'companyName', 
                'companyAddress', 
                'logoUrl', 
                'website',
                // FIX: Sử dụng literal để đếm job, đặt tên là 'jobsCount'
                [jobsCountLiteral, 'jobsCount']
            ],
            // Loại bỏ include vì đã sử dụng subquery để đếm
            
            // Order theo số lượng Jobs đang tuyển giảm dần (Top Employers)
            order: [[Sequelize.literal('jobsCount'), 'DESC']],
            
            // Giới hạn kết quả (ví dụ: 10 công ty hàng đầu)
            limit: 10 
        });

        // Chuẩn hóa dữ liệu trả về
        const finalEmployers = employers.map(emp => {
            const empJson = emp.toJSON();
            
            const rawAddress = empJson.companyAddress || ''; 
            
            let location = 'Toàn quốc';
            if (rawAddress) {
                 // Xử lý location an toàn: Tách theo dấu phẩy, lấy phần tử cuối cùng
                location = rawAddress.split(',').pop()?.trim() || rawAddress.trim() || 'Toàn quốc';
            }
            
            return {
                id: empJson.employerId,
                name: empJson.companyName,
                // Đảm bảo trường jobs được parse từ alias 'jobsCount'
                jobs: empJson.jobsCount ? parseInt(empJson.jobsCount, 10) : 0, 
                location: location,
                logo: empJson.logoUrl,
                website: empJson.website
            };
        });

        return res.status(200).json(finalEmployers);

    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà tuyển dụng:", error);
        // FIX: Trả về lỗi 500 khi có lỗi Server/Truy vấn
        return res.status(500).json({ message: 'Lỗi server khi lấy danh sách nhà tuyển dụng.', detail: error.message });
    }

};

// --- 1. Lấy danh sách Tin tuyển dụng của Nhà tuyển dụng đang đăng nhập ---
exports.getEmployerJobs = async (req, res) => {
    try {
        // req.userId được lấy từ middleware (là ID của Employer)
        const jobs = await Job.findAll({
            where: {
                employerId: req.userId // Lọc theo ID của Employer
            },
            order: [['postDate', 'DESC']] // Sắp xếp theo ngày đăng mới nhất
        });
        
        return res.status(200).json(jobs);

    } catch (error) {
        console.error("Lỗi khi lấy danh sách tin tuyển dụng:", error);
        return res.status(500).json({ message: 'Lỗi server khi lấy danh sách tin tuyển dụng.' });
    }
};

// --- 2. Cập nhật Tin tuyển dụng ---
exports.updateJob = async (req, res) => {
    const jobId = req.params.jobId;
    const updateData = req.body;
    
    // Đảm bảo không cho phép sửa employerId
    delete updateData.employerId; 
    
    try {
        const [updatedCount] = await Job.update(
            { ...updateData, updatedAt: new Date() },
            {
                where: {
                    jobId: jobId,
                    employerId: req.userId // CHỈ cho phép Employer sửa tin của chính mình
                }
            }
        );

        if (updatedCount === 0) {
            return res.status(404).json({ message: "Không tìm thấy tin tuyển dụng hoặc bạn không có quyền sửa tin này." });
        }
        
        // Lấy tin đã cập nhật để trả về Front-end
        const updatedJob = await Job.findByPk(jobId);
        return res.status(200).json(updatedJob);

    } catch (error) {
        console.error("Lỗi khi cập nhật tin tuyển dụng:", error);
        return res.status(500).json({ message: 'Lỗi server khi cập nhật tin tuyển dụng.' });
    }
};

// --- 3. Xóa Tin tuyển dụng ---
exports.deleteJob = async (req, res) => {
    const jobId = req.params.jobId;
    
    try {
        const deletedCount = await Job.destroy({
            where: {
                jobId: jobId,
                employerId: req.userId // CHỈ cho phép Employer xóa tin của chính mình
            }
        });

        if (deletedCount === 0) {
            return res.status(404).json({ message: "Không tìm thấy tin tuyển dụng hoặc bạn không có quyền xóa tin này." });
        }
        
        return res.status(200).json({ message: "Xóa tin tuyển dụng thành công." });

    } catch (error) {
        console.error("Lỗi khi xóa tin tuyển dụng:", error);
        return res.status(500).json({ message: 'Lỗi server khi xóa tin tuyển dụng.' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        // Lấy thông tin hồ sơ dựa trên ID của người dùng đã xác thực (req.userId)
        const profile = await Employer.findOne({
            where: { employerId: req.userId },
            attributes: ['companyName', 'companyAddress', 'phone', 'email', 'description', 'logoUrl', 'website']
        });

        if (!profile) {
            return res.status(404).send({ message: "Không tìm thấy hồ sơ công ty." });
        }

        res.status(200).send(profile);
    } catch (error) {
        console.error("Lỗi khi lấy hồ sơ:", error);
        res.status(500).send({ message: "Lỗi server khi tải hồ sơ." });
    }
};

// --- BỔ SUNG: Hàm Cập nhật Hồ sơ Công ty (PUT /api/employers/profile) ---
exports.updateProfile = async (req, res) => {
    const updateData = req.body;
    try {
        const [updated] = await Employer.update(
            { ...updateData },
            { where: { employerId: req.userId } }
        );

        if (updated === 0) {
            return res.status(404).send({ message: "Không tìm thấy hồ sơ để cập nhật." });
        }

        const updatedProfile = await Employer.findByPk(req.userId);
        return res.status(200).send(updatedProfile);

    } catch (error) {
        console.error("Lỗi khi cập nhật hồ sơ:", error);
        res.status(500).send({ message: "Lỗi server khi cập nhật hồ sơ." });
    }
};