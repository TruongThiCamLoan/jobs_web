import React, { useState } from "react";
// Import Bootstrap CSS từ CDN trong index.html hoặc App.js, 
// nhưng nếu bạn muốn import trực tiếp: import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// --- COMPONENT INPUT CÓ CON MẮT TÁI SỬ DỤNG ---
// Component này bao gồm input và nút toggle hiển thị mật khẩu
const PasswordInputWithToggle = ({ name, value, onChange, placeholder, label }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <>
            <label className="form-label fw-semibold">{label}</label>
            <div className="input-group">
                <input
                    // Dùng state showPassword để quyết định type là "text" hay "password"
                    type={showPassword ? "text" : "password"}
                    name={name}
                    className="form-control"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required
                />
                {/* THÊM NÚT CON MẮT */}
                <span 
                    className="input-group-text bg-white" 
                    onClick={handleTogglePassword}
                    style={{ cursor: 'pointer' }} // Thêm style để người dùng biết là có thể click
                >
                    <i 
                        // Thay đổi icon dựa trên state showPassword
                        className={showPassword ? "bi bi-eye-slash-fill text-muted" : "bi bi-eye-fill text-muted"}
                    ></i>
                </span>
            </div>
        </>
    );
};
// -----------------------------------------------------

export default function EmployerRegisterPage() {
    const [formData, setFormData] = useState({ 
        companyName: "", 
        email: "", 
        password: "", 
        confirmPassword: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);
        
        const { companyName, email, password, confirmPassword } = formData;

        if (password.length < 6) {
             setErrorMessage("Mật khẩu phải từ 6 ký tự trở lên.");
             setLoading(false);
             return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Mật khẩu xác nhận không khớp.");
            setLoading(false);
            return;
        }
        
        // GỌI API ĐĂNG KÝ VỚI ROLE "Employer"
        const result = await register(
            companyName, 
            email, 
            password, 
            "Employer" 
        );

        setLoading(false);
        
        if (!result.success) {
            setErrorMessage(result.message || "Đăng ký thất bại. Lỗi hệ thống.");
            return;
        }

        alert("Đăng ký tài khoản Nhà tuyển dụng thành công! Vui lòng đăng nhập.");
        navigate("/login"); 
    };
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div
                className="shadow-lg rounded-xl p-5 bg-white border"
                style={{ maxWidth: "500px", width: "100%" }}
            >
                <div className="text-center mb-4">
                    <h4 className="text-primary fw-bold">Đăng ký Nhà Tuyển Dụng</h4>
                    <p className="text-muted">Tìm kiếm nhân tài và xây dựng đội ngũ vững mạnh</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">{errorMessage}</div>
                    )}

                    {/* Tên công ty (GIỮ NGUYÊN) */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Tên công ty</label>
                        <input 
                            type="text" 
                            name="companyName" 
                            className="form-control" 
                            placeholder="Nhập tên công ty của bạn" 
                            required 
                            value={formData.companyName} 
                            onChange={handleChange} 
                        />
                    </div>

                    {/* Email (GIỮ NGUYÊN) */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email doanh nghiệp</label>
                        <input 
                            type="email" 
                            name="email" 
                            className="form-control" 
                            placeholder="hr@congty.com" 
                            required 
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                    </div>

                    {/* Mật khẩu (DÙNG COMPONENT MỚI) */}
                    <div className="mb-3">
                         <PasswordInputWithToggle 
                            label="Mật khẩu"
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="Tối thiểu 6 ký tự" 
                        />
                    </div>

                    {/* Xác nhận Mật khẩu (DÙNG COMPONENT MỚI) */}
                    <div className="mb-4">
                        <PasswordInputWithToggle 
                            label="Xác nhận mật khẩu"
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            placeholder="Nhập lại mật khẩu" 
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-dark w-100 py-2 fw-bold" disabled={loading}>
                        {loading ? "Đang xử lý..." : "Đăng ký Tài khoản NTD"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="small mb-1">Đã có tài khoản?</p>
                    <Link to="/login" className="text-decoration-none fw-bold">Đăng nhập ngay</Link>
                </div>
                
                <hr className="my-4"/>
                
                <div className="text-center">
                    <p className="small text-muted mb-1">Bạn là người tìm việc?</p>
                    <Link to="/register" className="btn btn-outline-primary btn-sm rounded-pill px-4">
                        Đăng ký Ứng viên
                    </Link>
                </div>
            </div>
        </div>
    );
}