// jobs-api/controllers/report.controller.js (CODE HOÀN CHỈNH)

const db = require('../models');
const Report = db.Report;
const Complaint = db.Complaint;
const User = db.User; // Để join lấy thông tin người gửi

// ----------------- REPORT APIs -----------------

// Hàm 1: Gửi Báo cáo (Tất cả người dùng)
exports.submitReport = async (req, res) => {
    const userId = req.userId; // ID người gửi báo cáo từ JWT
    const { reportType, entityId, description } = req.body;

    if (!reportType || !entityId) {
        return res.status(400).send({ message: "Vui lòng cung cấp loại báo cáo và ID đối tượng." });
    }

    try {
        const report = await Report.create({
            userId,
            reportType,
            entityId,
            description,
            status: 'Pending'
        });

        res.status(201).send({ message: "Báo cáo đã được gửi thành công!", report });
    } catch (error) {
        console.error("Lỗi khi gửi báo cáo:", error);
        res.status(500).send({ message: error.message || "Lỗi server khi gửi báo cáo." });
    }
};

// Hàm 2: Lấy tất cả Báo cáo (Chỉ Admin)
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: [{ model: User, as: 'user', attributes: ['fullName', 'email', 'role'] }],
            order: [['reportDate', 'DESC']]
        });
        res.status(200).json(reports);
    } catch (error) {
        console.error("Lỗi khi lấy báo cáo:", error);
        res.status(500).send({ message: error.message || "Lỗi server khi lấy danh sách báo cáo." });
    }
};

// Hàm 3: Cập nhật Trạng thái Báo cáo (Chỉ Admin)
exports.updateReportStatus = async (req, res) => {
    const reportId = req.params.id;
    const { status } = req.body;
    
    const validStatuses = ['Pending', 'Resolved', 'Ignored'];
    if (!validStatuses.includes(status)) {
        return res.status(400).send({ message: "Trạng thái báo cáo không hợp lệ." });
    }

    try {
        const [updated] = await Report.update({ status: status }, {
            where: { reportId: reportId }
        });

        if (updated) {
            return res.status(200).send({ message: "Cập nhật trạng thái báo cáo thành công!", newStatus: status });
        }
        
        return res.status(404).send({ message: "Không tìm thấy báo cáo để cập nhật." });

    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái báo cáo:", error);
        res.status(500).send({ message: error.message || "Lỗi server khi cập nhật." });
    }
};


// ----------------- COMPLAINT APIs -----------------

// Hàm 4: Gửi Khiếu nại (Tất cả người dùng)
exports.submitComplaint = async (req, res) => {
    const userId = req.userId; // ID người gửi khiếu nại từ JWT
    const { title, details } = req.body;

    if (!title || !details) {
        return res.status(400).send({ message: "Vui lòng cung cấp tiêu đề và chi tiết khiếu nại." });
    }

    try {
        const complaint = await Complaint.create({
            userId,
            title,
            details,
            status: 'Pending'
        });

        res.status(201).send({ message: "Khiếu nại đã được gửi thành công!", complaint });
    } catch (error) {
        console.error("Lỗi khi gửi khiếu nại:", error);
        res.status(500).send({ message: error.message || "Lỗi server khi gửi khiếu nại." });
    }
};

// Hàm 5: Lấy tất cả Khiếu nại (Chỉ Admin)
exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.findAll({
            include: [{ model: User, as: 'user', attributes: ['fullName', 'email', 'role'] }],
            order: [['complaintDate', 'DESC']]
        });
        res.status(200).json(complaints);
    } catch (error) {
        console.error("Lỗi khi lấy khiếu nại:", error);
        res.status(500).send({ message: error.message || "Lỗi server khi lấy danh sách khiếu nại." });
    }
};

// Hàm 6: Cập nhật Trạng thái Khiếu nại (Chỉ Admin)
exports.updateComplaintStatus = async (req, res) => {
    const complaintId = req.params.id;
    const { status } = req.body;
    
    const validStatuses = ['Pending', 'Processing', 'Closed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).send({ message: "Trạng thái khiếu nại không hợp lệ." });
    }

    try {
        const [updated] = await Complaint.update({ status: status }, {
            where: { complaintId: complaintId }
        });

        if (updated) {
            return res.status(200).send({ message: "Cập nhật trạng thái khiếu nại thành công!", newStatus: status });
        }
        
        return res.status(404).send({ message: "Không tìm thấy khiếu nại để cập nhật." });

    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái khiếu nại:", error);
        res.status(500).send({ message: error.message || "Lỗi server khi cập nhật." });
    }
};