import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sendEmail } from "../services/email.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false); 
  const navigate = useNavigate();
  const { sendOtp } = useAuth(); 
  
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email.");
      return;
    } 
    
    if (!validateEmail(email)) {
      setError("Email không đúng định dạng. Vui lòng kiểm tra lại.");
      return;
    }
    
    setIsSending(true);

    try {
      // 1. GỌI API BACK-END ĐỂ TẠO VÀ LƯU OTP
      const sendOtpResponse = await sendOtp(email);
      
      if (!sendOtpResponse.success) {
        // Lỗi từ Server: Email không tồn tại, hoặc lỗi gửi/lưu OTP
        setError(sendOtpResponse.message || "Lỗi Server: Không thể gửi mã xác minh.");
      } else {
        // 2. THÀNH CÔNG: Mã OTP đã được lưu vào DB -> Gửi email bằng EmailJS
        const otpCodeFromServer = sendOtpResponse.otpCode; 

        // *** LƯU Ý BẢO MẬT: BẠN VẪN ĐANG TRUYỀN OTP QUA navigate.state
        // Điều này giúp bạn tiện gỡ lỗi, nhưng trong Production nên dùng email thật.
        const isEmailSent = await handleSendOtp(email, otpCodeFromServer);
        
        if (isEmailSent) {
          // Chuyển hướng
          navigate("/enter-otp", { 
            state: { 
              email, 
              otp: otpCodeFromServer, // Giữ lại để bạn tiện gỡ lỗi theo cách cũ
            } 
          });
        } else {
          // Lỗi gửi email (ví dụ: EmailJS lỗi)
          setError("Lỗi dịch vụ email: Không thể gửi email xác minh. Vui lòng thử lại sau.");
        }
      }
    } catch (apiError) {
      console.error("Lỗi API/Mạng:", apiError);
      setError("Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng và thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  // Hàm xử lý gửi OTP qua EmailJS (Đã xóa console.log)
  const handleSendOtp = async (email, otpCode) => {
    try {
      // GỌI EMAILJS ĐỂ GỬI EMAIL THẬT
      await sendEmail({
        serviceId: "service_5q8d4nr", 
        templateId: "template_cnxznrw", 
        publicKey: "xUPg3TlzVy5XjESuW", 
        templateParams: {
          email: email,
          otp: otpCode,
        },
      });
      
      // Dòng console.log hiển thị OTP đã BỊ XÓA khỏi đây
      // Nếu bạn cần debug EmailJS: console.log("Calling EmailJS service to send OTP...");
      
      return true;
    } catch (error) {
      console.error("Lỗi gửi email (EmailJS):", error);
      return false;
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white shadow rounded p-5" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center text-primary mb-4">Khôi phục mật khẩu</h3>
        <p className="text-center text-muted mb-4">
          Vui lòng nhập địa chỉ email đã đăng ký của bạn.
        </p>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSending}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isSending}>
            {isSending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang gửi...
              </>
            ) : (
              "Gửi yêu cầu đặt lại mật khẩu"
            )}
          </button>

          <p className="text-center mt-3">
            Trở lại <Link to="/login" className="text-decoration-none text-primary">Đăng nhập</Link>
          </p>
        </form>
      </div>
    </div>
  );
}