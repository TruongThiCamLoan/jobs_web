import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginEmployerPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Thông tin đăng nhập nhà tuyển dụng:", formData);
    // TODO: Thêm API đăng nhập nhà tuyển dụng ở đây
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-white">
      <div
        className="shadow-sm rounded p-5 bg-white border"
        style={{ maxWidth: "430px", width: "100%" }}
      >
        {/* Tiêu đề */}
        <h4 className="text-center text-primary fw-bold mb-2">
          Đăng nhập Nhà tuyển dụng
        </h4>
        <p className="text-center text-muted mb-4">
          Quản lý tin tuyển dụng và theo dõi ứng viên của công ty bạn
        </p>

        {/* Form đăng nhập */}
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
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="text-end mt-1">
              <a
                href="/forgot-password"
                className="text-primary text-decoration-none"
              >
                Quên mật khẩu?
              </a>
            </div>
          </div>

          {/* Nút đăng nhập */}
          <button
            type="submit"
            className="btn btn-primary w-100 mt-2 fw-bold"
          >
            Đăng nhập
          </button>
        </form>

        {/* Liên hệ hỗ trợ */}
        <hr />
        <div className="text-center small">
          <p className="mb-1 fw-semibold">Bạn gặp khó khăn khi đăng nhập?</p>
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
