import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

import logo from "../img/logo.png";
import banner1 from "../img/banner1.jpg";
import banner2 from "../img/banner2.jpg";
import banner3 from "../img/banner3.jpg";
import banner4 from "../img/banner4.jpg";
import Banner from "../img/Banner.jpg";

const banners = [banner1, banner2, banner3, banner4];

function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate();

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

// Sửa hàm handleSelectRole cho modal đăng nhập
const handleSelectRole = (role, isRegister) => {
  if (isRegister) {
    setShowRegisterModal(false);
    navigate(`/register?role=${role}`);
  } else {
    setShowLoginModal(false);
    if (role === "candidate") {
      navigate("/login"); // ứng viên -> trang login
    } else if (role === "employer") {
      navigate("/employer"); // nhà tuyển dụng -> trang employer
    }
  }
};


  return (
    <div>
      {/* Top bar */}
      <div className="top-bar">
        <span>📞 Đăng tuyển: 0977.850.321</span>
        <span>📱 Tìm việc: 0977.785.032</span>
        <span>✉️ Email: vieclamsinhvien@gmail.com</span>
        <div className="top-bar-right">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowRegisterModal(true);
            }}
          >
            🧾 Đăng ký
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowLoginModal(true);
            }}
          >
            🔑 Đăng nhập
          </a>
          <a href="/employer" className="btn-employer">
            Dành cho nhà tuyển dụng
          </a>
        </div>
      </div>

      {/* Search bar */}
      <section className="search-bar-top">
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
      </section>

      {/* Header */}
      <header
        className="header-with-banner"
        style={{ backgroundImage: `url(${Banner})` }}
      >
        <div className="logo">
          <img src={logo} alt="Logo" height="60" />
          <h1>Việc Làm Sinh Viên</h1>
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

      {/* Banner slider */}
      <div className="banner-slider">
        <img src={banners[currentBanner]} alt={`Banner ${currentBanner + 1}`} />
        <button className="banner-btn left" onClick={prevBanner}>
          &#10094;
        </button>
        <button className="banner-btn right" onClick={nextBanner}>
          &#10095;
        </button>
      </div>

      {/* Modal Đăng ký */}
      {showRegisterModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRegisterModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>CHỌN LOẠI TÀI KHOẢN ĐĂNG KÝ</h2>
            <div className="register-card-container">
              <div className="register-card register-candidate">
                <h5 className="text-primary fw-bold">Đăng ký ứng viên</h5>
                <ul>
                  <li>+ 1.500.000 công việc được cập nhật thường xuyên</li>
                  <li>Ứng tuyển công việc yêu thích HOÀN TOÀN MIỄN PHÍ</li>
                </ul>
                <button
                  className="btn btn-primary mt-3 w-100"
                  onClick={() => handleSelectRole("candidate", true)}
                >
                  Đăng ký ứng viên
                </button>
              </div>

              <div className="register-card register-employer">
                <h5 className="text-warning fw-bold">Đăng ký nhà tuyển dụng</h5>
                <ul>
                  <li>+ 3.000.000 ứng viên tiếp cận thông tin tuyển dụng</li>
                  <li>Không giới hạn tương tác với ứng viên qua hệ thống</li>
                </ul>
                <button
                  className="btn btn-warning mt-3 w-100 text-white fw-bold"
                  onClick={() => handleSelectRole("employer", true)}
                >
                  Đăng ký nhà tuyển dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Đăng nhập */}
      {showLoginModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowLoginModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>CHỌN LOẠI TÀI KHOẢN ĐĂNG NHẬP</h2>
            <div className="register-card-container">
              <div className="register-card register-candidate">
                <h5 className="text-primary fw-bold">Đăng nhập ứng viên</h5>
                <ul>
                  <li>Đăng nhập với vai trò ứng viên</li>
                </ul>
                <button
                  className="btn btn-primary mt-3 w-100"
                  onClick={() => handleSelectRole("candidate", false)}
                >
                  Đăng nhập ứng viên
                </button>
              </div>

              <div className="register-card register-employer">
                <h5 className="text-warning fw-bold">Đăng nhập nhà tuyển dụng</h5>
                <ul>
                  <li>Đăng nhập với vai trò nhà tuyển dụng</li>
                </ul>
                <button
                  className="btn btn-warning mt-3 w-100 text-white fw-bold"
                  onClick={() => handleSelectRole("employer", false)}
                >
                  Đăng nhập nhà tuyển dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <p>&copy; 2025 - Hệ thống việc làm sinh viên | Node.js + React</p>
      </footer>
    </div>
  );
}

export default HomePage;
