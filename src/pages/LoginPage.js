import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        const { email, password } = formData;

        const result = await login(email, password);

        // --- 1. XỬ LÝ LỖI ĐĂNG NHẬP CHUNG (Mật khẩu sai, User không tồn tại) ---
        if (!result.success) {
            const user = result.user || {}; 
            
            // 1a. Nếu bị khóa (Vẫn giữ logic chặn đăng nhập chi tiết nếu bị Admin khóa)
            if (user.isLocked) {
                let lockMessage = "Tài khoản của bạn đã bị khóa bởi quản trị viên.";
                
                if (user.lockReason) {
                    lockMessage += ` Lý do: ${user.lockReason}.`;
                }
                if (user.lockUntil) {
                    const unlockDate = new Date(user.lockUntil).toLocaleDateString('vi-VN');
                    lockMessage += ` Tài khoản sẽ tự động mở khóa vào ngày ${unlockDate}.`;
                } else {
                    lockMessage += ` Vui lòng liên hệ hỗ trợ để được mở khóa.`;
                }

                setErrorMessage(lockMessage);
                logout(); 
                return;
            }

            // 1b. Nếu là lỗi chung (Mật khẩu/Email sai)
            setErrorMessage(result.message || "Đã xảy ra lỗi khi đăng nhập.");
            return;
        }

        // --- 2. XỬ LÝ KHI ĐĂNG NHẬP THÀNH CÔNG (Mật khẩu đúng) ---
        
        const user = result.user;
        const role = user.role;
        
        // ❌ BỎ KHỐI KIỂM TRA TRẠNG THÁI DUYỆT CŨ (user.isVerified !== true) Ở ĐÂY.
        // Employer được đăng nhập bình thường.
        
        // --- 3. ĐĂNG NHẬP THÀNH CÔNG VÀ CHUYỂN HƯỚNG ---
        
        if (role === 'Student') {
            alert("Đăng nhập Ứng viên thành công!");
            navigate("/");
        } else if (role === 'Employer') {
            alert("Đăng nhập Nhà tuyển dụng thành công!");
            // Sẽ chuyển đến dashboard, nơi kiểm tra isVerified để ẩn/hiện nút Đăng Bài
            navigate("/employer/dashboard");
        } else if (role === 'Admin') {
            alert("Đăng nhập Quản trị viên thành công!");
            navigate("/admin");
        } else {
            // Fallback or cleanup
            logout(); 
            navigate("/");
        }
    };
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-white">
            <div
                className="shadow-sm rounded p-5 bg-white border"
                style={{ maxWidth: "430px", width: "100%" }}
            >
                <h4 className="text-center text-primary fw-bold mb-2">Chào mừng bạn đã quay trở lại</h4>
                <p className="text-center text-muted mb-4">Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng</p>

                <form onSubmit={handleSubmit}>
                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">{errorMessage}</div>
                    )}

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white"><i className="bi bi-envelope-fill text-primary"></i></span>
                            <input 
                                type="email" 
                                name="email" 
                                className="form-control" 
                                placeholder="Email" 
                                required 
                                value={formData.email} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    {/* Mật khẩu */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Mật khẩu</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white">
                                <i className="bi bi-shield-lock-fill text-primary"></i>
                            </span>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                className="form-control" 
                                placeholder="Mật khẩu" 
                                required 
                                value={formData.password} 
                                onChange={handleChange} 
                            />
                            {/* THÊM NÚT CON MẮT */}
                            <span 
                                className="input-group-text bg-white cursor-pointer" 
                                onClick={handleTogglePassword}
                                style={{ cursor: 'pointer' }}
                            >
                                <i 
                                    className={showPassword ? "bi bi-eye-slash-fill text-muted" : "bi bi-eye-fill text-muted"}
                                ></i>
                            </span>
                        </div>
                        <div className="text-end mt-1">
                            <Link to="/forgot-password" className="text-primary text-decoration-none">Quên mật khẩu?</Link>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-2">Đăng nhập</button>
                </form>

                {/* <div className="text-center mt-3 text-muted">Hoặc đăng nhập bằng</div>
                <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-outline-danger w-100 me-2"><i className="bi bi-google me-2"></i>Google</button>
                    <button className="btn btn-outline-primary w-100 me-2"><i className="bi bi-facebook me-2"></i>Facebook</button>
                </div> */}

                <p className="text-center mt-4">
                    Bạn chưa có tài khoản?{" "}
                    <Link to="/register" className="text-primary text-decoration-none">Đăng ký ngay</Link>
                </p>

                <hr />
                <div className="text-center small">
                    <p className="mb-1 fw-semibold">Bạn gặp khó khăn khi tạo tài khoản?</p>
                    <p>
                        Vui lòng gọi tới số{" "}
                        <span className="text-primary fw-bold">(024) 6680 5588</span>{" "}
                        (giờ hành chính)
                    </p>
                </div>
            </div>
        </div>
    );
}