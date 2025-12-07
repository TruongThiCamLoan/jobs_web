import emailjs from '@emailjs/browser'; 

/**
 * Hàm gửi email xác minh OTP.
 * @param {object} params - Tham số chứa serviceId, templateId, publicKey và templateParams.
 * @returns {Promise<any>}
 */
export const sendEmail = (params) => {
    // 🚨 CHÚ Ý: Đảm bảo bạn đã cài đặt thư viện này: npm install @emailjs/browser
    // và các khóa public/service/template ID đã được cấu hình đúng.
    
    try {
        console.log("Calling EmailJS service to send OTP...");
        return emailjs.send(params.serviceId, params.templateId, params.templateParams, params.publicKey);
    } catch (error) {
        console.error("Lỗi khi gọi EmailJS:", error);
        // Trả về lỗi để hàm gọi (handleSendOtp) có thể bắt được
        throw new Error("Dịch vụ gửi email không khả dụng.");
    }
};