const db = require('../../models'); 
const Report = db.Report; 
const { Op } = require('sequelize'); 

// =================================================================
// 1. GET /api/v1/admin/reports - Lấy Danh sách Báo cáo (với 3 Trạng thái)
// =================================================================
exports.getReports = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 7 } = req.query;
        
        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);
        const offset = (pageInt - 1) * limitInt;

        // Xây dựng điều kiện WHERE cho Sequelize
        let condition = {};
        
        // ⭐️ CẬP NHẬT: Thêm 'Ignored' vào điều kiện lọc trạng thái
        if (status && ['Pending', 'Resolved', 'Ignored'].includes(status)) { 
            condition.status = status;
        } else {
            // Mặc định chỉ hiển thị 'Pending' nếu trạng thái không hợp lệ
            condition.status = 'Pending';
        }

        if (search) {
             condition[Op.or] = [
                { description: { [Op.like]: `%${search}%` } },
                { reportType: { [Op.like]: `%${search}%` } }
             ];
        }

        // 1. Lấy dữ liệu
        const reports = await Report.findAll({ 
            where: condition, 
            limit: limitInt, 
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        // 2. Lấy tổng số lượng
        const totalCount = await Report.count({ where: condition }); 
        
        res.status(200).json({
            message: 'Danh sách báo cáo được lấy thành công.',
            data: reports,
            pagination: {
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / limitInt),
                currentPage: pageInt,
                limit: limitInt
            },
        });
    } catch (error) {
        console.error("❌ Lỗi nghiêm trọng trong getReports:", error.message, error.stack);
        
        res.status(500).json({ 
            message: 'Lỗi server nội bộ khi tải báo cáo.', 
            errorDetail: 'Vui lòng kiểm tra log server (controllers/admin/report.controller.js) để biết chi tiết.'
        });
    }
};

// =================================================================
// 2. GET /api/v1/admin/reports/:reportId - Lấy Chi tiết Báo cáo (ĐÃ THÊM LẠI)
// =================================================================
exports.getReportDetail = async (req, res) => {
    try {
        const { reportId } = req.params;
        const report = await Report.findByPk(reportId); 

        if (!report) {
            return res.status(404).json({ message: 'Không tìm thấy báo cáo này.' });
        }

        res.status(200).json({
            message: 'Chi tiết báo cáo được lấy thành công.',
            data: report,
        });
    } catch (error) {
        console.error("❌ Lỗi trong getReportDetail:", error.message);
        res.status(500).json({ message: 'Lỗi server nội bộ khi lấy chi tiết báo cáo.' });
    }
};


// =================================================================
// 3. PUT /api/v1/admin/reports/:reportId/process - Xử lý Báo cáo (Resolved)
// =================================================================
exports.processReport = async (req, res) => {
    const { reportId } = req.params;
    const { action, reason, violation_result } = req.body; 

    if (!action || !reason) {
        return res.status(400).json({ message: "Vui lòng cung cấp Hình thức xử lý và Lý do/Phản hồi." });
    }
    
    const finalViolationResult = `[${action} - ${new Date().toLocaleString()}] Lý do: ${reason}. Kết quả: ${violation_result || action}`;
    
    try {
        const [affectedRows] = await Report.update(
            { 
                status: 'Resolved', 
                violation_result: finalViolationResult, 
                updatedAt: new Date() 
            },
            { where: { reportId: reportId, status: 'Pending' } }
        );

        if (affectedRows === 0) {
            return res.status(400).json({ message: 'Báo cáo không tìm thấy hoặc đã được xử lý trước đó.' });
        }

        res.status(200).json({
            message: 'Xử lý báo cáo thành công và cập nhật trạng thái.',
            reportId,
            newStatus: 'Resolved', 
        });
    } catch (error) {
        console.error("❌ Lỗi trong processReport:", error.message);
        res.status(500).json({ message: 'Lỗi server nội bộ khi xử lý báo cáo.' });
    }
};

// =================================================================
// 4. PUT /api/v1/admin/reports/:reportId/ignore - Bỏ qua Báo cáo (Ignored)
// =================================================================
exports.ignoreReport = async (req, res) => {
    const { reportId } = req.params;
    
    try {
        // Cập nhật trạng thái thành Ignored
        const [affectedRows] = await Report.update(
            { 
                status: 'Ignored', 
                violation_result: 'Báo cáo bị hệ thống/Admin đánh dấu Bỏ qua (Ignored).', 
                updatedAt: new Date() 
            },
            { where: { reportId: reportId, status: 'Pending' } }
        );

        if (affectedRows === 0) {
            return res.status(400).json({ message: 'Báo cáo không tìm thấy hoặc đã được xử lý trước đó.' });
        }

        res.status(200).json({
            message: 'Đã đánh dấu báo cáo là Bỏ qua (Ignored) thành công.',
            reportId,
            newStatus: 'Ignored',
        });
    } catch (error) {
        console.error("❌ Lỗi trong ignoreReport:", error.message);
        res.status(500).json({ message: 'Lỗi server nội bộ khi xử lý báo cáo.' });
    }
};