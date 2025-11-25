import React from "react";
import "./Employer.css";

function Employer() {
  return (
    <div className="employer-page">
      <div className="employer-header">
        <h2>Khu vực Nhà Tuyển Dụng</h2>
        <p>Quản lý tin tuyển dụng, xem hồ sơ ứng viên và thống kê tuyển dụng.</p>
      </div>

      <div className="employer-actions">
        <button>Đăng tin tuyển dụng mới</button>
        <button>Quản lý tin tuyển dụng</button>
        <button>Xem hồ sơ ứng viên</button>
      </div>
    </div>
  );
}

export default Employer;
