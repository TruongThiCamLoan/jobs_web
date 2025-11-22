import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth(); // 🔹 Chỉ cần register, không tự login

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) =>
    /^[\w-.]+@[\w-]+\.(edu\.vn|com|org)$/.test(email);

  const validateForm = () => {
    const errs = {};
    const { fullName, email, password, confirmPassword, phone } = form;

    const storedUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];

    if (!fullName.trim()) errs.fullName = "Vui lòng nhập họ và tên.";
    else if (fullName.length < 3)
      errs.fullName = "Họ tên phải từ 3 ký tự trở lên.";

    if (!email.trim()) errs.email = "Vui lòng nhập email.";
    else if (!validateEmail(email)) errs.email = "Email không hợp lệ.";
    else if (storedUsers.some((u) => u.email === email))
      errs.email = "Email đã được sử dụng.";

    if (!password) errs.password = "Vui lòng nhập mật khẩu.";
    else if (password.length < 6)
      errs.password = "Mật khẩu phải từ 6 ký tự.";

    if (!confirmPassword)
      errs.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    else if (password !== confirmPassword)
      errs.confirmPassword = "Mật khẩu xác nhận không trùng khớp.";

    if (!phone.trim()) errs.phone = "Vui lòng nhập số điện thoại.";

    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const errs = validateForm();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const newUser = {
      id: Date.now(),
      name: form.fullName,
      email: form.email,
      password: form.password,
      phone: form.phone,
      avatar: null,
    };

    register(newUser); // 🔹 Lưu user vào mock DB

    alert("Đăng ký thành công! Vui lòng đăng nhập.");
    navigate("/login"); // 🔹 Chuyển sang trang Login
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="shadow-sm rounded p-5 bg-white border"
        style={{ maxWidth: "430px", width: "100%" }}
      >
        <h4 className="text-center text-primary fw-bold mb-2">
          Tạo tài khoản ứng viên
        </h4>
        <p className="text-center text-muted mb-4">
          Tạo hồ sơ để tìm kiếm cơ hội nghề nghiệp lý tưởng
        </p>

        <form onSubmit={handleRegister}>
          {/* Họ và tên */}
          <div className="mb-3">
            <input
              type="text"
              name="fullName"
              className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
              placeholder="Họ và tên"
              value={form.fullName}
              onChange={handleChange}
            />
            {errors.fullName && (
              <div className="invalid-feedback">{errors.fullName}</div>
            )}
          </div>

          {/* Số điện thoại */}
          <div className="mb-3">
            <input
              type="text"
              name="phone"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone}</div>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          {/* Mật khẩu */}
          <div className="mb-3">
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="mb-3">
            <input
              type="password"
              name="confirmPassword"
              className={`form-control ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
              placeholder="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>

          {/* Đồng ý điều khoản */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              required
              id="agree"
            />
            <label className="form-check-label" htmlFor="agree">
              Tôi đồng ý với điều khoản sử dụng
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2">
            Đăng ký
          </button>

          <p className="text-center mt-3">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-primary text-decoration-none">
              Đăng nhập
            </Link>
          </p>
        </form>

        <hr />
        <div className="text-center small">
          <p className="mb-1 fw-semibold">Bạn gặp khó khăn khi đăng ký?</p>
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
