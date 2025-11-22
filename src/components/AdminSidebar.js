import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AdminSidebar.css";

export default function AdminSidebarLayout({ children }) {
  const location = useLocation();
  const notiRef = useRef();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth >= 768);
  const [notifications] = useState([
    { id: 1, type: "success", message: "Có 3 hồ sơ ứng tuyển mới." },
    { id: 2, type: "warning", message: "1 nhà tuyển dụng bị báo cáo vi phạm." },
  ]);
  const [userInfo] = useState({
    name: "Admin",
    avatar: "/default-avatar.png",
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsSidebarVisible(width >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Click outside notification
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);
  const handleCloseSidebar = () => {
    if (windowWidth < 768) setIsSidebarVisible(false);
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100 bg-light">
      {/* Sidebar */}
      <div
        className={`text-white p-3 sidebar-custom position-fixed top-0 bottom-0 start-0 z-2 ${
          isSidebarVisible ? "d-block" : "d-none"
        }`}
        style={{
          width: "310px",
          top: 0,
          overflowY: "auto",
          height: "100%",
          background: "linear-gradient(180deg, #1a273f, #2a5298)",
          borderRight: "2px solid #ffffff33",
          transition: "transform 0.3s",
          zIndex: 1050,
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-white">Việc Làm 24h</h5>
          {windowWidth < 768 && (
            <button className="btn btn-sm btn-outline-light" onClick={handleCloseSidebar}>
              <i className="bi bi-x" />
            </button>
          )}
        </div>

        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <div className="nav-link text-white fw-bold rounded border border-white border-opacity-25 p-2">
              <i className="bi bi-people-fill me-2" /> Quản lý người dùng
            </div>
            <ul className="nav flex-column ms-4 mt-2">
              <li>
                <Link
                  to="/admin/employers"
                  className={`nav-link rounded px-2 py-1 ${
                    isActive("/admin/employers")
                      ? "bg-white text-primary fw-bold"
                      : "text-white"
                  }`}
                  onClick={handleCloseSidebar}
                >
                  <i className="bi bi-building me-2" /> Nhà tuyển dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/students"
                  className={`nav-link rounded px-2 py-1 ${
                    isActive("/admin/students")
                      ? "bg-white text-primary fw-bold"
                      : "text-white"
                  }`}
                  onClick={handleCloseSidebar}
                >
                  <i className="bi bi-person-lines-fill me-2" /> Ứng viên (Sinh viên)
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item mt-2">
            <Link
              to="/admin/categories"
              className={`nav-link rounded px-2 py-1 ${
                isActive("/admin/categories")
                  ? "bg-white text-primary fw-bold"
                  : "text-white"
              }`}
              onClick={handleCloseSidebar}
            >
              <i className="bi bi-tags-fill me-2" /> Quản lý danh mục 
            </Link>
          </li>

          <li className="nav-item mt-2">
            <Link
              to="/admin/complaints"
              className={`nav-link rounded px-2 py-1 ${
                isActive("/admin/complaints")
                  ? "bg-white text-primary fw-bold"
                  : "text-white"
              }`}
              onClick={handleCloseSidebar}
            >
              <i className="bi bi-exclamation-triangle me-2" /> Quản lý khiếu nại & vi phạm
            </Link>
          </li>

                    <li className="nav-item mt-2">
            <Link
              to="/admin/reports"
              className={`nav-link rounded px-2 py-1 ${
                isActive("/admin/reports")
                  ? "bg-white text-primary fw-bold"
                  : "text-white"
              }`}
              onClick={handleCloseSidebar}
            >
              <i className="bi bi-bar-chart-line-fill me-2" /> Thống kê - Báo cáo
            </Link>
          </li>

          <li className="nav-item mt-4">
            <Link to="/" className="nav-link text-danger" onClick={handleCloseSidebar}>
              <i className="bi bi-box-arrow-left me-2" /> Đăng xuất
            </Link>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div
        className="flex-grow-1"
        style={{
          paddingLeft: isSidebarVisible && windowWidth >= 768 ? "280px" : "0",
          transition: "padding-left 0.3s",
        }}
      >
        {/* Top bar */}
        <div
          className="d-flex justify-content-between align-items-center px-3 py-2 shadow-sm bg-white sticky-top"
          style={{
            zIndex: 1040,
            position: "fixed",
            top: 0,
            width: "100%",
            left: isSidebarVisible && windowWidth >= 768 ? "310px" : "0",
            transition: "left 0.3s",
          }}
        >
          {/* Nút 3 gạch */}
          {windowWidth < 768 && (
            <button
              className="btn btn-outline-secondary"
              onClick={handleToggleSidebar}
            >
              <i className="bi bi-list fs-4" />
            </button>
          )}

          <div className="d-flex align-items-center gap-3 ms-auto">
            <div className="position-relative" ref={notiRef}>
              <button
                className="btn btn-outline-secondary position-relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="bi bi-bell fs-5" />
                {notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div
                  className="position-absolute bg-white shadow p-3 rounded"
                  style={{
                    right: 0,
                    top: "calc(100% + 10px)",
                    width: "300px",
                    zIndex: 999,
                  }}
                >
                  <h6 className="mb-2">🔔 Thông báo (Admin)</h6>
                  {notifications.length === 0 ? (
                    <div className="text-muted small">Không có thông báo.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`alert alert-${
                          n.type === "success" ? "success" : "warning"
                        } py-2 mb-2`}
                        style={{ fontSize: "0.9rem" }}
                      >
                        {n.message}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="d-flex align-items-center">
              <img
                src={userInfo.avatar}
                alt="admin"
                className="rounded-circle me-2"
                style={{ width: 40, height: 40, objectFit: "cover" }}
              />
              <span className="fw-semibold">{userInfo.name}</span>
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="p-4" style={{ marginTop: "50px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
