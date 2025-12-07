import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { sendEmail } from '../services/email.service'; 

// Thời gian hết hạn OTP (5 phút = 300 giây)
const OTP_EXPIRY_SECONDS = 60; 

export default function EnterOtpPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { sendOtp } = useAuth(); 
    
    const [otpInput, setOtpInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // --- STATE MỚI CHO BỘ ĐẾM NGƯỢC ---
    const [remainingTime, setRemainingTime] = useState(OTP_EXPIRY_SECONDS); // 300s = 5 phút
    const [isExpired, setIsExpired] = useState(false);
    // ------------------------------------
    
    const [resendLoading, setResendLoading] = useState(false);
    const [resendStatus, setResendStatus] = useState('');

    // Lấy dữ liệu từ state của trang ForgotPasswordPage
    const email = location.state?.email;
    const initialOtpCode = location.state?.otp; 

    // CHUYỂN HƯỚNG NẾU KHÔNG HỢP LỆ
    useEffect(() => {
        if (!email || !initialOtpCode) {
            navigate('/forgot-password', { replace: true });
        }
    }, [email, initialOtpCode, navigate]);

    // =======================================================
    // ✅ LOGIC BỘ ĐẾM NGƯỢC
    // =======================================================
    useEffect(() => {
        if (remainingTime <= 0) {
            setIsExpired(true);
            return;
        }

        const timer = setInterval(() => {
            setRemainingTime(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer); // Cleanup khi component unmount
    }, [remainingTime]); 

    // Hàm định dạng thời gian (ví dụ: 04:59)
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    // =======================================================
    
    // Hàm xử lý xác nhận OTP
    const handleConfirmOtp = async (e) => {
        e.preventDefault();
        setError('');

        // CHẶN XÁC NHẬN NẾU MÃ HẾT HẠN
        if (isExpired) {
            setError('Mã xác minh đã hết hạn! Vui lòng gửi lại yêu cầu.');
            return;
        }
        
        if (otpInput.length !== 6) {
            setError('Mã xác minh phải có 6 chữ số.');
            return;
        }

        setLoading(true);
        
        // CẢNH BÁO: Vẫn giữ logic xác nhận OTP ở Front-end
        if (otpInput === initialOtpCode) {
            // Chuyển hướng đến trang đặt lại mật khẩu và truyền email + otp
            navigate('/reset-password', { 
                state: { email, otpCode: otpInput },
                replace: true 
            });
        } else {
             setError('Mã xác minh không chính xác. Vui lòng kiểm tra lại.');
        }

        setLoading(false);
    };
    
    // Hàm xử lý gửi lại OTP (gọi API /send-otp)
    const handleResendOtp = async () => {
        if (!email) {
            setError("Không tìm thấy email để gửi lại. Vui lòng quay lại trang trước.");
            return;
        }
        
        setResendLoading(true);
        setResendStatus('');
        setError('');

        try {
            // 1. Gọi API Back-end để tạo và lưu OTP mới
            const sendOtpResponse = await sendOtp(email); 
            
            if (sendOtpResponse.success) {
                const newOtpCode = sendOtpResponse.otpCode;
                
                // 2. Gửi email bằng EmailJS với mã mới nhận được từ Server
                await sendEmail({
                    serviceId: "service_5q8d4nr", // ✅ SỬ DỤNG ID ĐÃ HOẠT ĐỘNG
                    templateId: "template_jchuvse", 
                    publicKey: "jMVWFjbzNWko1v5d2", 
                    templateParams: {
                        email: email,
                        otp: newOtpCode,
                    },
                });
                
                // 3. Cập nhật state và reset bộ đếm ngược
                location.state.otp = newOtpCode; // Cập nhật mã OTP trong state tạm thời
                setRemainingTime(OTP_EXPIRY_SECONDS); // Reset thời gian
                setIsExpired(false); // Reset trạng thái hết hạn
                
                setResendStatus('Mã xác minh mới đã được gửi. Vui lòng kiểm tra email!');
            } else {
                // Lỗi Server: Email không tồn tại, v.v.
                setError(sendOtpResponse.message || "Lỗi Server: Không thể gửi lại mã xác minh.");
            }
        } catch (err) {
            console.error("Lỗi gửi lại OTP:", err);
            setError("Lỗi mạng hoặc hệ thống khi gửi lại mã. Vui lòng thử lại sau.");
        } finally {
            setResendLoading(false);
        }
    };
    
    if (!email) {
        return <div className="text-center mt-5">Đang chuyển hướng...</div>;
    }

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="bg-white shadow rounded p-5" style={{ maxWidth: "500px", width: "100%" }}>
                <h3 className="text-center text-primary mb-4">Xác minh tài khoản</h3>
                <p className="text-center text-muted mb-4">
                    Mã xác minh đã được gửi tới: <strong>{email}</strong>
                </p>

                {error && <div className="alert alert-danger text-center">{error}</div>}
                {resendStatus && <div className="alert alert-success text-center">{resendStatus}</div>}
                
                {/* HIỂN THỊ BỘ ĐẾM NGƯỢC */}
                <div className="text-center mb-3">
                    {isExpired ? (
                        <p className="text-danger fw-bold">Mã đã hết hạn!</p>
                    ) : (
                        <p className="text-muted">
                            Mã có hiệu lực trong: 
                            <span className="text-primary fw-bold ms-1">{formatTime(remainingTime)}</span>
                        </p>
                    )}
                </div>
                {/* KẾT THÚC BỘ ĐẾM NGƯỢC */}

                <form onSubmit={handleConfirmOtp}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control text-center fs-4 fw-bold"
                            placeholder="Nhập mã xác minh (6 chữ số)"
                            maxLength="6"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                            disabled={loading || isExpired} // VÔ HIỆU HÓA INPUT KHI HẾT HẠN
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading || isExpired}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Đang xác minh...
                            </>
                        ) : (
                            "Xác nhận mã"
                        )}
                    </button>
                </form>
                
                <div className="text-center">
                    <button 
                        onClick={handleResendOtp}
                        className="btn btn-link text-decoration-none"
                        // CHỈ CHO PHÉP GỬI LẠI KHI ĐÃ HẾT HẠN (isExpired) HOẶC LẦN ĐẦU
                        disabled={resendLoading || (!isExpired && remainingTime > 0)} 
                    >
                        {resendLoading ? 'Đang gửi lại...' : 'Gửi lại mã xác minh'}
                    </button>
                    <p className="mt-2 text-sm">
                        <Link to="/forgot-password" className="text-decoration-none text-muted"> Quay lại nhập Email</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}