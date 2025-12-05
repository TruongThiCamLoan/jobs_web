// jobs_api/utils/appError.js

class AppError extends Error {
    /**
     * @param {string} message - Thông báo lỗi (ví dụ: 'Không tìm thấy tài nguyên').
     * @param {number} statusCode - Mã trạng thái HTTP (ví dụ: 404, 400).
     */
    constructor(message, statusCode) {
        // Gọi constructor của lớp Error
        super(message);

        this.statusCode = statusCode;
        // Xác định trạng thái dựa trên mã HTTP (4xx -> 'fail', 5xx -> 'error')
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        // Đánh dấu đây là lỗi hoạt động (lỗi mong muốn, không phải lỗi lập trình)
        this.isOperational = true; 

        // Ghi lại stack trace, giúp định vị lỗi trong code
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;