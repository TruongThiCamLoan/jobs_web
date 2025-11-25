// src/pages/Home.js
import React, { useState } from "react";
import "../App.css";
import logo from "../img/logo.png";
import bannerBg from "../img/Banner.jpg";

const banners = [
  "https://via.placeholder.com/1200x400?text=Banner+1",
  "https://via.placeholder.com/1200x400?text=Banner+2",
  "https://via.placeholder.com/1200x400?text=Banner+3",
];

function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="home-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="contact-info">
          <span>Đăng tuyển: 0977.850.32</span>
          <span>Tìm việc: 0977.785.032</span>
          <span>Phone: 02926.282.383</span>
          <span>metawork247@gmail.com</span>
        </div>
        <div className="auth-buttons">
          <button className="login-btn">Đăng ký</button>
          <button className="register-btn">Đăng nhập</button>
          <a href="/employer" className="post-job-btn">DÀNH CHO NHÀ TUYỂN DỤNG</a>
        </div>
      </div>

      {/* Header */}
      <header className="main-header">
        <div className="logo-section">
          <img src={logo} alt="Logo" height="60" />
          <div className="site-title">VIỆC LÀM CẦN THƠ</div>
        </div>
        <nav className="main-nav">
          <a href="#">TẠO HỒ SƠ</a>
          <a href="#">CÔNG TY NỔI BẬT</a>
          <a href="#">VIỆC MỚI NHẤT</a>
          <a href="#">TÌM ỨNG VIÊN</a>
          <a href="#">BẢNG GIÁ VIP</a>
          <a href="#">LIÊN HỆ</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${bannerBg})` }}>
        <div className="hero-content">
          <h1>
            VIỆC LÀM CẦN THƠ
            <br />
            <span className="subtitle">Tuyển Dụng Việc Làm Tại Cần Thơ</span>
          </h1>

          <div className="stats">
            <div className="stat-item">
              <div className="label">Việc làm hôm nay:</div>
              <div className="number">21</div>
            </div>
            <div className="stat-item">
              <div className="label">Việc làm đang tuyển</div>
              <div className="number">1.860</div>
            </div>
            <div className="date">14/11/2025</div>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <input type="text" placeholder="Tiêu đề công việc, vị trí..." className="search-input" />
            </div>
            <select className="filter-select">
              <option>Lọc theo ngành nghề</option>
              <option>CNTT - Phần mềm</option>
              <option>Kinh doanh - Bán hàng</option>
            </select>
            <select className="filter-select">
              <option>Lọc theo địa điểm</option>
              <option>Cần Thơ</option>
              <option>Hà Nội</option>
            </select>
            <button className="search-btn">Tìm kiếm</button>
          </div>

          <div className="quick-stats">
            <button className="stat-btn blue">668 Cty đang tuyển dụng</button>
            <button className="stat-btn gray">32.855 Hồ sơ ứng viên</button>
            <select className="advanced-filter">
              <option>Lọc nâng cao</option>
            </select>
          </div>
        </div>
      </section>

      {/* Banner Slider */}
      <div className="banner-slider">
        <img src={banners[currentBanner]} alt="Banner" />
        <button className="slider-btn left" onClick={prevBanner}>Left Arrow</button>
        <button className="slider-btn right" onClick={nextBanner}>Right Arrow</button>
      </div>

      {/* Footer */}
      <footer className="main-footer">
        <p>© 2025 - Hệ thống việc làm sinh viên | Node.js + React</p>
      </footer>
    </div>
  );
}

export default Home;