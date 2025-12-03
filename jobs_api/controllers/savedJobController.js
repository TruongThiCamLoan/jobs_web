// Giả định bạn có các Models/DB Client được import ở đây
const db = require('../models'); // Đã import db

// Lấy các Model cần thiết từ db (Giả định tên Model là SavedJob, Job, Employer, và Student)
const SavedJob = db.SavedJob;
const Job = db.Job;
const Employer = db.Employer;
const Student = db.Student; // THÊM MODEL STUDENT VÌ BẠN CÓ FOREIGN KEY ĐẾN BẢNG NÀY

// ==========================================================
// LOGIC TƯƠNG TÁC VỚI DATABASE THẬT (SEQUELIZE)
// ==========================================================

// Hàm helper để tìm Student ID từ User ID (req.userId)
const getStudentIdFromUserId = async (userId) => {
    // ⚠️ CHÚ Ý: Logic này giả định rằng User ID (req.userId)
    // được lưu trong một cột gọi là 'userId' trong bảng Students.
    // Nếu bảng Students của bạn có mối quan hệ 1-1 với Users, bạn cần dùng logic này.
    const studentProfile = await Student.findOne({ 
        where: { userId: userId }, // Giả định Student Model có cột userId
        attributes: ['studentId'] 
    });

    // Nếu không tìm thấy hồ sơ Student, trả về null
    return studentProfile ? studentProfile.studentId : null;
};

const SavedJobModel = {
    // 1. Tìm kiếm một SavedJob (Dùng cho Toggle Save)
    findOne: async (conditions) => {
        // studentId ở đây là ID từ bảng Students
        return SavedJob.findOne({ 
            where: { studentId: conditions.studentId, jobId: conditions.jobId }
        });
    },

    // 2. Tạo một SavedJob mới (Lưu)
    create: async (data) => {
        // studentId ở đây là ID từ bảng Students
        return SavedJob.create({ 
            studentId: data.studentId, 
            jobId: data.jobId 
        });
    },

    // 3. Xóa một SavedJob (Bỏ lưu)
    deleteOne: async (conditions) => {
        // studentId ở đây là ID từ bảng Students
        return SavedJob.destroy({
            where: { studentId: conditions.studentId, jobId: conditions.jobId }
        });
    },

    // 4. HÀM QUAN TRỌNG: Tìm kiếm và Populated dữ liệu chi tiết
    findAndPopulate: async (conditions) => {
        // studentId ở đây là ID từ bảng Students
        const savedJobs = await SavedJob.findAll({
            where: { studentId: conditions.studentId },
            // THỰC HIỆN JOIN VỚI JOB VÀ EMPLOYER ĐỂ LẤY CHI TIẾT HIỂN THỊ
            include: [
                {
                    model: Job, // Job Model
                    as: 'Job', // Tên alias của mối quan hệ với Job
                    attributes: ['jobId', 'title', 'deadline', 'salary', 'experience', 'location'],
                    include: [{
                        model: Employer, // Employer Model
                        as: 'employer', // Tên alias của mối quan hệ với Employer
                        attributes: ['companyName', 'logoUrl'] // Chỉ lấy tên và logo công ty
                    }]
                }
            ],
            // Order theo ngày lưu gần nhất (Giả định bạn có trường 'createdAt' hoặc 'savedDate' trong SavedJob Model)
            order: [['createdAt', 'DESC']] 
        });

        // Định dạng lại dữ liệu để gửi về frontend
        return savedJobs.map(sj => ({
            // Thông tin cơ bản từ SavedJob
            jobId: sj.jobId,
            savedDate: sj.createdAt || new Date(), 

            // Thông tin từ Job
            title: sj.Job ? sj.Job.title : null,
            deadline: sj.Job ? sj.Job.deadline : null,
            salary: sj.Job ? sj.Job.salary : null,
            
            // Thông tin từ Employer (thông qua Job)
            companyName: (sj.Job && sj.Job.employer) ? sj.Job.employer.companyName : 'Công ty không rõ',
            logoUrl: (sj.Job && sj.Job.employer) ? sj.Job.employer.logoUrl : null,
        }));
    }
};

// ==========================================================
// CONTROLLER LOGIC
// ==========================================================

// 1. Lấy danh sách việc làm đã lưu (/api/saved-jobs)
exports.getSavedJobs = async (req, res) => {
    // 1. Kiểm tra Vai trò
    if (req.userRole !== 'Student') {
        return res.status(403).json({ message: "Chỉ tài khoản ứng viên (Student) mới có thể xem danh sách đã lưu." });
    }
    
    // 2. LẤY STUDENT ID TỪ USER ID
    const studentId = await getStudentIdFromUserId(req.userId);
    
    if (!studentId) {
        return res.status(404).json({ message: "Không tìm thấy hồ sơ ứng viên (Student) tương ứng với tài khoản này." });
    }

    try {
        // 3. Lấy dữ liệu Populated từ DB
        const savedJobsWithDetails = await SavedJobModel.findAndPopulate({ studentId: studentId });
        
        // 4. Trả về dữ liệu chi tiết
        res.status(200).json(savedJobsWithDetails);

    } catch (error) {
        console.error("Lỗi khi lấy danh sách Saved Jobs:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ khi lấy danh sách đã lưu." });
    }
};

// 2. Bật/Tắt Lưu công việc (/api/saved-jobs/toggle-save/:jobId)
exports.toggleSaveJob = async (req, res) => {
    // 1. Kiểm tra Vai trò
    if (req.userRole !== 'Student') {
        return res.status(403).json({ message: "Chỉ tài khoản ứng viên (Student) mới có thể lưu/bỏ lưu công việc." });
    }
    
    // 2. LẤY STUDENT ID TỪ USER ID
    const studentId = await getStudentIdFromUserId(req.userId);

    if (!studentId) {
        // Tránh lỗi khóa ngoại nếu không có hồ sơ Student
        return res.status(404).json({ message: "Không tìm thấy hồ sơ ứng viên (Student) tương ứng với tài khoản này. Vui lòng tạo hồ sơ trước." });
    }
    
    const { jobId } = req.params;
    
    // --- GHI LOG ĐẦU VÀO ĐỂ DEBUG ---
    console.log(`[Toggle Save] Starting. User ID: ${req.userId} (-> Student ID: ${studentId}), Job ID: ${jobId}`);

    try {
        if (!jobId) {
            return res.status(400).json({ message: "Job ID là bắt buộc." });
        }
        
        const conditions = { studentId: studentId, jobId: jobId };
        
        // --- CHÚ Ý: Job ID đang là String ('6') trong log, nên tôi giữ jobId là string trong DB queries. ---
        // Nếu DB của bạn cần jobId là INTEGER, bạn cần thêm parseInt(jobId).
        
        const existingSavedJob = await SavedJobModel.findOne(conditions);

        if (existingSavedJob) {
            // Trường hợp 1: Đã lưu -> BỎ LƯU
            await SavedJobModel.deleteOne(conditions);
            return res.status(200).json({ 
                message: "Đã xóa khỏi danh sách yêu thích.",
                action: "removed"
            });
        } else {
            // Trường hợp 2: Chưa lưu -> LƯU
            await SavedJobModel.create(conditions);
            return res.status(201).json({ 
                message: "Đã lưu vào danh sách yêu thích!",
                action: "saved"
            });
        }

    } catch (error) {
        // --- GHI LOG LỖI CHI TIẾT CỦA SEQUELIZE ---
        console.error("LỖI KHI TOGGLE SAVED JOB (500):", error.message);
        
        // Cần phải kiểm tra nếu lỗi khóa ngoại JobId, vì lỗi studentId đã được kiểm tra ở trên
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ message: "Công việc này không tồn tại trong hệ thống." });
        }
        
        if (error.errors) {
            console.error("Sequelize Validation/DB Errors:", error.errors.map(e => e.message));
        } else {
            console.error("Full Error Stack:", error.stack);
        }
        
        res.status(500).json({ message: "Lỗi Server nội bộ khi lưu/bỏ lưu công việc." });
    }
};