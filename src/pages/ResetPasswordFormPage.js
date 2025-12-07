import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export default function ResetPasswordFormPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { resetPassword } = useAuth();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    // ✅ STATE MỚI: Để quản lý trạng thái hiển thị của mật khẩu
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // -----------------------------------------------------------------

    const email = location.state?.email;
    const otpCode = location.state?.otpCode || location.state?.otp; 

    useEffect(() => {
        if (!email || !otpCode) {
            navigate('/forgot-password', { replace: true });
        }
    }, [email, otpCode, navigate]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Xác nhận mật khẩu không khớp.');
            return;
        }

        setLoading(true);

        try {
            const result = await resetPassword(email, newPassword, otpCode);

            if (result.success) {
                setSuccess('Đặt lại mật khẩu thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.');
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 3000);
            } else {
                setError(result.message || 'Lỗi không xác định khi đặt lại mật khẩu.');
            }
        } catch (err) {
            console.error("Lỗi Reset Password:", err);
            setError('Lỗi hệ thống hoặc kết nối. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };
    
    if (!email || !otpCode) {
        return null; 
    }

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="bg-white shadow rounded p-5" style={{ maxWidth: "500px", width: "100%" }}>
                <h3 className="text-center text-danger mb-4">Đặt lại Mật khẩu</h3>
                <p className="text-center text-muted mb-4">
                    Nhập mật khẩu mới cho tài khoản: <strong>{email}</strong>
                </p>

                {error && <div className="alert alert-danger text-center">{error}</div>}
                {success && <div className="alert alert-success text-center">{success}</div>}

                <form onSubmit={handleResetPassword}>
                    {/* ======================================================= */}
                    {/* TRƯỜNG MẬT KHẨU MỚI */}
                    <div className="mb-3">
                        <label className="form-label">Mật khẩu mới (Tối thiểu 6 ký tự)</label>
                        <div className="input-group">
                            <input
                                type={showNewPassword ? "text" : "password"} // ✅ Dùng state để chuyển đổi type
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={loading || !!success}
                            />
                            {/* NÚT CHUYỂN ĐỔI */}
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                disabled={loading || !!success}
                            >
                                {/* SỬ DỤNG ICON (GIẢ ĐỊNH DÙNG ICON BOOTSTRAP HOẶC TƯƠNG TỰ) */}
                                <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'}`}>{showNewPassword ? '🔒' : '👁️'}</i>
                            </button>
                        </div>
                    </div>
                    {/* ======================================================= */}

                    {/* ======================================================= */}
                    {/* TRƯỜNG XÁC NHẬN MẬT KHẨU MỚI */}
                    <div className="mb-4">
                        <label className="form-label">Xác nhận Mật khẩu mới</label>
                        <div className="input-group">
                            <input
                                type={showConfirmPassword ? "text" : "password"} // ✅ Dùng state để chuyển đổi type
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading || !!success}
                            />
                            {/* NÚT CHUYỂN ĐỔI */}
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={loading || !!success}
                            >
                                {/* SỬ DỤNG ICON */}
                                <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}>{showConfirmPassword ? '🔒' : '👁️'}</i>
                            </button>
                        </div>
                    </div>
                    {/* ======================================================= */}

                    <button type="submit" className="btn btn-danger w-100" disabled={loading || !!success}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Đang xử lý...
                            </>
                        ) : (
                            "Đặt lại Mật khẩu"
                        )}
                    </button>
                    
                    <p className="text-center mt-3">
                        <Link to="/login" className="text-decoration-none text-muted"> Quay lại Đăng nhập</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}