// Giả định bạn có các Models/DB Client được import ở đây
const db = require('../models'); 

// Lấy các Model cần thiết từ db
// FIX: Sử dụng tên Model chính xác là JobApplication
const Application = db.JobApplication; 
const Job = db.Job;
const Student = db.Student; 
const Employer = db.Employer; // THÊM EMPLOYER ĐỂ JOIN KHI LẤY DANH SÁCH

// ==========================================================
// LOGIC TƯƠNG TÁC VỚI DATABASE THẬT (SEQUELIZE)
// ==========================================================

// Hàm helper để tìm Student ID từ User ID (req.userId) - Giống SavedJobController
const getStudentIdFromUserId = async (userId) => {
    // Logic này giả định bảng Students có cột userId trỏ đến Users.
    const studentProfile = await Student.findOne({ 
        where: { userId: userId }, 
        attributes: ['studentId'] 
    });

    return studentProfile ? studentProfile.studentId : null;
};

const ApplicationModel = {
    // 1. Kiểm tra trạng thái đã ứng tuyển (findOne)
    findOne: async (conditions) => {
        // Kiểm tra an toàn trước khi gọi, tránh lỗi undefined
        if (!Application) throw new Error("Model JobApplication không được tìm thấy. Vui lòng kiểm tra tên Model trong index.js.");
        
        // conditions: { studentId: ID_STUDENT, jobId: ID_JOB }
        return Application.findOne({
            where: { studentId: conditions.studentId, jobId: conditions.jobId }
        });
    },

    // 2. Tạo đơn ứng tuyển mới (create)
    create: async (data) => {
        // Kiểm tra an toàn trước khi gọi, tránh lỗi undefined
        if (!Application) throw new Error("Model JobApplication không được tìm thấy. Vui lòng kiểm tra tên Model trong index.js.");
        
        // data: { studentId: ID_STUDENT, jobId: ID_JOB, resumeId: ID_RESUME, ... }
        return Application.create({
            studentId: data.studentId,
            jobId: data.jobId,
            resumeId: data.resumeId, // Đảm bảo resumeId có tồn tại trong request body
            status: 'Pending',
            // Dòng applicationDate bị loại bỏ, Sequelize sẽ dùng createdAt/updatedAt
        });
    },
    
    // 3. Lấy danh sách ứng tuyển với Populate Data (MỚI)
    findAndPopulate: async (studentId) => {
        if (!Application) throw new Error("Model JobApplication không được tìm thấy.");
        
        const applications = await Application.findAll({
            where: { studentId: studentId },
            include: [
                {
                    model: Job,
                    as: 'job', // Tên alias phải khớp với index.js (db.JobApplication.belongsTo(db.Job, { as: 'job' }))
                    attributes: ['jobId', 'title', 'status', 'deadline', 'salary'],
                    include: [{
                        model: Employer,
                        as: 'employer', // Tên alias phải khớp với index.js
                        attributes: ['companyName', 'logoUrl']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Định dạng lại dữ liệu để gửi về frontend
        return applications.map(app => ({
            applicationId: app.applicationId,
            jobId: app.jobId,
            status: app.status, // Trạng thái ứng tuyển
            createdAt: app.createdAt, // Thời gian nộp đơn
            
            // Thông tin Job
            title: app.job ? app.job.title : 'Công việc đã bị xóa',
            jobStatus: app.job ? app.job.status : 'Closed', // Trạng thái công việc
            
            // Thông tin Employer
            companyName: (app.job && app.job.employer) ? app.job.employer.companyName : 'Công ty không rõ',
            logoUrl: (app.job && app.job.employer) ? app.job.employer.logoUrl : null,
            
            // Các trường khác như salary, deadline có thể được thêm vào đây
        }));
    }
};

const JobModel = {
    // Hàm tìm kiếm công việc và kiểm tra deadline
    findById: async (jobId) => {
        // Tìm kiếm công việc chỉ lấy deadline
        return Job.findByPk(jobId, {
            attributes: ['jobId', 'deadline'] 
        });
    }
};


// 1. Kiểm tra trạng thái ứng tuyển (/api/applications/:jobId/status)
exports.checkApplicationStatus = async (req, res) => {
    // 1. Kiểm tra Vai trò
    if (req.userRole !== 'Student') {
        return res.status(403).json({ message: "Chỉ tài khoản ứng viên (Student) mới có thể thực hiện thao tác này." });
    }
    
    // 2. LẤY STUDENT ID TỪ USER ID
    const studentId = await getStudentIdFromUserId(req.userId);
    
    // Nếu không có hồ sơ student, không thể ứng tuyển
    if (!studentId) {
        return res.status(200).json({ hasApplied: false, message: "Chưa có hồ sơ ứng viên (Student)." });
    }
    
    try {
        const { jobId } = req.params;
        
        if (!jobId) {
            return res.status(400).json({ message: "Job ID là bắt buộc." });
        }

        // 3. Tìm kiếm đơn ứng tuyển đã tồn tại
        const existingApplication = await ApplicationModel.findOne({
            studentId: studentId,
            jobId: jobId,
        });

        // 4. Trả về kết quả mà frontend mong muốn
        if (existingApplication) {
            return res.json({ hasApplied: true, status: existingApplication.status });
        } else {
            return res.json({ hasApplied: false });
        }

    } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái ứng tuyển:", error.message);
        res.status(500).json({ message: "Lỗi Server nội bộ khi kiểm tra trạng thái." });
    }
};


// 2. Tạo đơn ứng tuyển (/api/applications/:jobId)
exports.createApplication = async (req, res) => {
    // 1. Kiểm tra Vai trò
    if (req.userRole !== 'Student') {
        return res.status(403).json({ message: "Bạn phải dùng tài khoản Ứng viên (Student) để nộp đơn." });
    }
    
    // 2. LẤY STUDENT ID TỪ USER ID
    const studentId = await getStudentIdFromUserId(req.userId);

    if (!studentId) {
        return res.status(400).json({ message: "Vui lòng tạo hồ sơ ứng viên (Student) trước khi nộp đơn." });
    }
    
    const { jobId } = req.params;
    // Ta giả định cho tính năng ứng tuyển nhanh, ta dùng hồ sơ mặc định 1
    const resumeId = req.body.resumeId || 1; 

    try {
        if (!jobId) {
            return res.status(400).json({ message: "Job ID là bắt buộc." });
        }

        // 3. Kiểm tra công việc còn hạn nộp không
        const job = await JobModel.findById(jobId);
        
        if (!job) {
             return res.status(404).json({ message: "Công việc không tồn tại." });
        }
        if (new Date(job.deadline) < new Date()) {
             return res.status(400).json({ message: "Công việc đã hết hạn nộp hồ sơ." });
        }

        // 4. Kiểm tra đã ứng tuyển chưa (tránh nộp đơn trùng)
        const existingApplication = await ApplicationModel.findOne({
            studentId: studentId,
            jobId: jobId
        });

        if (existingApplication) {
            return res.status(409).json({ message: "Bạn đã nộp đơn cho công việc này rồi." });
        }

        // 5. Tạo đơn ứng tuyển mới
        const newApplication = await ApplicationModel.create({
            studentId: studentId,
            jobId: jobId,
            resumeId: resumeId, // ID resume
        });

        res.status(201).json({
            message: "Ứng tuyển thành công! Hồ sơ của bạn đã được gửi.",
            application: newApplication
        });

    } catch (error) {
        console.error("LỖI KHI TẠO ĐƠN ỨNG TUYỂN (500):", error.message);
        
        // Bắt lỗi khóa ngoại JobId
        if (error.name === 'SequelizeForeignKeyConstraintError') {
             return res.status(400).json({ message: "Lỗi khóa ngoại: Job ID hoặc Resume ID không hợp lệ." });
        }
        
        res.status(500).json({ message: "Lỗi Server nội bộ khi nộp đơn." });
    }
};

// 3. Lấy danh sách ứng tuyển của Student (/api/applications) (MỚI)
exports.getAppliedJobs = async (req, res) => {
    // 1. Kiểm tra Vai trò
    if (req.userRole !== 'Student') {
        return res.status(403).json({ message: "Chỉ tài khoản ứng viên (Student) mới có thể xem lịch sử ứng tuyển." });
    }
    
    // 2. LẤY STUDENT ID TỪ USER ID
    const studentId = await getStudentIdFromUserId(req.userId);

    if (!studentId) {
        return res.status(200).json([]); // Trả về mảng rỗng nếu chưa có hồ sơ
    }

    try {
        // 3. Lấy dữ liệu ứng tuyển đã Populated
        const applicationsWithDetails = await ApplicationModel.findAndPopulate(studentId);
        
        // 4. Trả về dữ liệu
        res.status(200).json(applicationsWithDetails);

    } catch (error) {
        console.error("LỖI KHI LẤY DANH SÁCH ỨNG TUYỂN (500):", error.message);
        res.status(500).json({ message: "Lỗi Server nội bộ khi lấy danh sách ứng tuyển." });
    }
};