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