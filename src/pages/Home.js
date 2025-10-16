// src/components/HomePage.js

import React from 'react';
import './style.css'; // Đảm bảo bạn đã có style.css trong src/components hoặc src

function HomePage() {
  return (
    <div>
      {/* Thanh thông tin trên cùng */}
      <div className="top-bar">
        <span>📞 Đăng tuyển: 0977.850.321</span>
        <span>📱 Tìm việc: 0977.785.032</span>
        <span>✉️ Email: vieclamsinhvien@gmail.com</span>
        <div className="top-bar-right">
          <a href="/register">🧾 Đăng ký</a>
          <a href="/login">🔑 Đăng nhập</a>
          <a href="/employer" className="btn-employer">Dành cho nhà tuyển dụng</a>
        </div>
      </div>

      {/* Header chính */}
      <header>
        <div className="logo">
          <h1>
            <img src="/img/logo.png" alt="Logo" height="50" />
            🎓 Việc Làm Sinh Viên
          </h1>
        </div>

        <nav>
          <a href="/">Trang chủ</a>
          <a href="#">Tạo hồ sơ</a>
          <a href="#">Công ty nổi bật</a>
          <a href="#">Việc mới nhất</a>
          <a href="#">Tìm ứng viên</a>
          <a href="#">Liên hệ</a>
        </nav>
      </header>

      {/* Banner */}
      <section className="banner">
        <div className="banner-content">
          <h2>VIỆC LÀM SINH VIÊN</h2>
          <p>Kết nối sinh viên và nhà tuyển dụng nhanh chóng - uy tín - hiệu quả!</p>

          <div className="search-bar">
            <input type="text" placeholder="🔍 Tiêu đề công việc, vị trí..." />
            
            <select>
              <option>Lọc theo ngành nghề</option>
              <option>CNTT</option>
              <option>Kinh tế</option>
              <option>Giáo dục</option>
            </select>

            <select>
              <option>Lọc theo địa điểm</option>
              <option>Cần Thơ</option>
              <option>Hà Nội</option>
              <option>TP.HCM</option>
            </select>

            <button>Tìm kiếm</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 - Hệ thống việc làm sinh viên | Node.js + React</p>
      </footer>
    </div>
  );
}

export default HomePage;