// src/components/Navbar.js
import React from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Building,
  FileText,
  Flag,
  PersonCircle,
  ChevronDown,
  Briefcase,
  Heart,
  BriefcaseFill,
  Bell,
  BoxArrowRight,
} from "react-bootstrap-icons";

import logo from "../img/logo.png";
import "./style.css";
import { useAuth } from "../context/AuthContext";

export default function AppNavbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isLoggedIn = !!user;
  const userName = user?.name || "Người dùng";

  const isMyJobs = location.pathname === "/myjobs";
  const isResume = location.pathname === "/resume";
  const isSavedJobs = location.pathname === "/saved-jobs";
  const isJobAlerts = location.pathname === "/job-alerts";
  const isAppliedJobs = location.pathname === "/applied-jobs";
  const isCreateResumeStep1 = location.pathname === "/create-resume/step1";
  const isCreateResumeStep2 = location.pathname === "/create-resume/step2";
  const isCreateResumeStep3 = location.pathname === "/create-resume/step3";
  const isCreateResumeStep4 = location.pathname === "/create-resume/step4";
  const isCreateResumeStep5 = location.pathname === "/create-resume/step5";
  const isCreateResumeStep6 = location.pathname === "/create-resume/step6";
  const isCreateResumeStep7 = location.pathname === "/create-resume/step7";
  const isCreateResumeStep8 = location.pathname === "/create-resume/step8";
  const isCreateResumeStep9 = location.pathname === "/create-resume/step9";
  const isMyCareerLinkSection =
    isMyJobs || isResume || isSavedJobs || isJobAlerts || isAppliedJobs || isCreateResumeStep1 || isCreateResumeStep2 || isCreateResumeStep3 || isCreateResumeStep4 || isCreateResumeStep5 || isCreateResumeStep6 || isCreateResumeStep7 || isCreateResumeStep8 || isCreateResumeStep9;


  return (
    <Navbar
      bg="white"
      expand="lg"
      className="py-1 fixed-top border-bottom"
      style={{ height: "64px" }}
    >
      <Container className="d-flex justify-content-between align-items-center">

        {/* LOGO */}
        <Navbar.Brand as={Link} to="/" className="p-0">
          <img src={logo} alt="CareerLink" height="40" />
        </Navbar.Brand>

        {/* SEARCH BAR TRONG MYCAREERLINK */}
        {isMyCareerLinkSection && (
          <div
            className="d-flex align-items-center flex-grow-1 mx-lg-4 flex-nowrap"
            style={{ maxWidth: "600px" }}
          >
            <input
              type="text"
              placeholder="Nhập tên vị trí, công ty, từ khóa"
              className="form-control form-control-sm me-1"
              style={{ width: "45%" }}
            />
            <input
              type="text"
              placeholder="Nhập tỉnh, thành phố"
              className="form-control form-control-sm me-1"
              style={{ width: "35%" }}
            />
            <Button variant="primary" size="sm" style={{ width: "20%" }}>
              <Search className="me-1" /> Tìm kiếm
            </Button>
          </div>
        )}

        {/* MENU TRÊN TRANG CHỦ */}
        {!isMyCareerLinkSection && (
          <Nav className="d-none d-lg-flex align-items-center flex-grow-1 justify-content-center mx-auto">
            <Nav.Link className="d-flex align-items-center text-secondary small mx-2">
              <Search className="me-1" size={16} /> Ngành nghề/Địa điểm
            </Nav.Link>

            <Nav.Link className="d-flex align-items-center text-secondary small mx-2">
              <Building className="me-1" size={16} /> Công ty
            </Nav.Link>

            <Nav.Link className="d-flex align-items-center text-secondary small mx-2">
              <FileText className="me-1" size={16} /> Cẩm nang việc làm
            </Nav.Link>

            <Nav.Link className="d-flex align-items-center text-secondary small mx-2">
              <FileText className="me-1" size={16} /> Mẫu CV xin việc
            </Nav.Link>
          </Nav>
        )}

        {/* BÊN PHẢI - ĐĂNG NHẬP / ĐĂNG KÝ / USER */}
        <Nav className="align-items-center ms-auto">

          {isLoggedIn ? (
            <>
              {/* USER DROPDOWN */}
              <NavDropdown
                title={
                  <span className="d-flex align-items-center text-primary fw-semibold small">
                    <div className="avatar-circle me-1">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="avatar"
                          className="rounded-circle"
                          width="20"
                          height="20"
                        />
                      ) : (
                        <PersonCircle size={18} />
                      )}
                    </div>
                    {userName}
                    <ChevronDown className="ms-1" size={12} />
                  </span>
                }
                id="user-dropdown"
                align="end"
                className="user-dropdown me-2"
              >
                <div className="dropdown-header text-center py-3 border-bottom">
                  <div
                    className="avatar-circle mx-auto mb-2"
                    style={{ width: "48px", height: "48px" }}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="rounded-circle w-100 h-100"
                      />
                    ) : (
                      <PersonCircle size={28} />
                    )}
                  </div>
                  <div className="fw-bold">{userName}</div>
                  <small className="text-muted">Tài khoản</small>
                </div>

                <NavDropdown.Item as={Link} to="/myjobs">
                  <Briefcase className="me-2" /> My CareerLink
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/resume">
                  <FileText className="me-2" /> Hồ sơ xin việc
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/saved-jobs">
                  <Heart className="me-2" /> Việc đã lưu
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/applied-jobs">
                  <BriefcaseFill className="me-2" /> Việc đã ứng tuyển
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/job-alerts">
                  <Bell className="me-2" /> Thông báo việc làm
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item
                  onClick={logout}
                  className="d-flex align-items-center text-danger"
                >
                  <BoxArrowRight className="me-2" /> Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>

              {/* NHÀ TUYỂN DỤNG */}
              <Nav.Link className="text-dark fw-semibold d-flex align-items-center small d-none d-lg-flex">
                <Flag className="me-1 text-danger" size={16} /> Nhà tuyển dụng
              </Nav.Link>
            </>
          ) : (
            <>
              {/* CHƯA ĐĂNG NHẬP */}
              <Button
                as={Link}
                to="/login"
                variant="primary"
                size="sm"
                className="me-2 rounded-pill px-3"
              >
                Đăng nhập
              </Button>

              <Button
                as={Link}
                to="/register"
                variant="outline-primary"
                size="sm"
                className="rounded-pill px-3"
              >
                Đăng ký
              </Button>
            </>
          )}
        </Nav>

        <Navbar.Toggle aria-controls="main-navbar" className="ms-2" />
      </Container>
    </Navbar>
  );
}
