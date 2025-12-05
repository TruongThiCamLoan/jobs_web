// Ví dụ về logic controller trong report.controller.js
const db = require('../models');
const Report = db.Report; // Giả sử bạn có Model Report

exports.createJobReport = async (req, res) => {
    // userId (người báo cáo)
    const userId = req.userId; 
    // jobId (entityId)
    const reportedJobId = req.params.jobId; 
    // reason (description)
    const { reason } = req.body; 

    // Dữ liệu cố định
    const reportType = 'Job'; // Loại đối tượng bị báo cáo là 'Job'
    const status = 'Pending'; // Trạng thái ban đầu

    if (!reason || reason.length < 10) {
        return res.status(400).send({ message: "Lý do báo cáo (description) phải có ít nhất 10 ký tự." });
    }

    try {
        // 1. Kiểm tra xem người dùng đã báo cáo công việc này chưa (tùy chọn)
        const existingReport = await Report.findOne({ 
            where: { 
                userId: userId, 
                entityId: reportedJobId,
                reportType: reportType
            } 
        });

        if (existingReport) {
            return res.status(409).send({ message: "Bạn đã báo cáo công việc này rồi. Admin sẽ sớm xem xét." });
        }

        // 2. Tạo báo cáo mới với mapping cột chính xác
        const newReport = await Report.create({
            // Khóa chính reportId sẽ tự động tạo (nếu là auto-increment)
            userId: userId,
            reportType: reportType,         // Loại: 'Job'
            entityId: reportedJobId,        // ID của Job bị báo cáo
            description: reason,            // Nội dung khiếu nại
            reportDate: new Date(),         // Ngày báo cáo
            status: status,                 // Trạng thái: 'Pending'
            // createdAt, updatedAt sẽ tự động tạo bởi Sequelize
        });

        res.status(201).send({ 
            message: "Báo cáo đã được gửi thành công đến Admin!", 
            reportId: newReport.reportId 
        });

    } catch (error) {
        console.error("Lỗi khi tạo báo cáo:", error);
        res.status(500).send({ message: "Lỗi máy chủ khi xử lý báo cáo." });
    }
};