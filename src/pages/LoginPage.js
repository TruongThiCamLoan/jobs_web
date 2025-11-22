import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Gọi hàm login trong AuthContext
    const result = login(email, password);

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Đăng nhập thành công!");
    navigate("/"); // quay về trang chủ
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-white">
      <div
        className="shadow-sm rounded p-5 bg-white border"
        style={{ maxWidth: "430px", width: "100%" }}
      >
        <h4 className="text-center text-primary fw-bold mb-2">
          Chào mừng bạn đã quay trở lại
        </h4>
        <p className="text-center text-muted mb-4">
          Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-envelope-fill text-primary"></i>
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                type="password"
                className="form-control"
                placeholder="Mật khẩu"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="text-end mt-1">
              <Link
                to="/forgot-password"
                className="text-primary text-decoration-none"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2">
            Đăng nhập
          </button>
        </form>

        <div className="text-center mt-3 text-muted">Hoặc đăng nhập bằng</div>
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-outline-danger w-100 me-2">
            <i className="bi bi-google me-2"></i>Google
          </button>
          <button className="btn btn-outline-primary w-100 me-2">
            <i className="bi bi-facebook me-2"></i>Facebook
          </button>
        </div>

        <p className="text-center mt-4">
          Bạn chưa có tài khoản?{" "}
          <Link to="/register" className="text-primary text-decoration-none">
            Đăng ký ngay
          </Link>
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
