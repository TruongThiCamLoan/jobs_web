// jobs_api/utils/catchAsync.js

/**
 * Hàm tiện ích để bắt lỗi bất đồng bộ (async/await) và chuyển tiếp lỗi đó 
 * tới middleware xử lý lỗi toàn cục (global error handler).
 * * @param {Function} fn - Hàm controller bất đồng bộ (ví dụ: async (req, res, next) => { ... })
 */
module.exports = fn => {
    // Trả về một hàm Express Middleware (req, res, next)
    // .catch(next) sẽ tự động bắt lỗi và gọi next(error)
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};