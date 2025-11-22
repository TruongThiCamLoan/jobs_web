// src/pages/AppliedJobsPage.js
import React from "react";
import { Container, Row, Col, Button, Nav, Badge } from "react-bootstrap";
import { BriefcaseFill, Heart, Bell, FileText } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import "./style.css";

export default function AppliedJobsPage() {
  return (
    <div className="applied-jobs-page">
      <AppNavbar />

      {/* SUBMENU */}
      <div className="bg-light border-bottom py-2">
        <Container>
          <Nav className="flex-wrap small">
            <Nav.Link as={Link} to="/myjobs" className="text-dark">
              My CareerLink
            </Nav.Link>
            <Nav.Link as={Link} to="/resume" className="text-dark">
              Hồ sơ xin việc (0)
            </Nav.Link>
            <Nav.Link as={Link} to="/saved-jobs" className="text-dark">
              Việc đã lưu (1)
            </Nav.Link>
            <Nav.Link href="/applied-jobs" className="text-primary fw-semibold border-bottom border-primary border-3 pb-1">
              <BriefcaseFill className="me-1" /> Việc đã ứng tuyển (2)
            </Nav.Link>
            <Nav.Link as={Link} to="/job-alerts" className="text-dark">
              Thông báo việc làm (0)
            </Nav.Link>
            <Nav.Link href="#" className="text-dark">
              Tài khoản
            </Nav.Link>
          </Nav>
        </Container>
      </div>

      <Container className="my-5">
        <Row className="g-4">
          {/* LEFT COLUMN: VIỆC ĐÃ ỨNG TUYỂN (8/12) */}
          <Col lg={8}>
            <h5 className="fw-bold mb-3">Việc đã ứng tuyển (2)</h5>

            {/* 30 NGÀY QUA */}
            <div className="text-muted small mb-3">30 ngày qua</div>

            {/* JOB 1 */}
            <div className="bg-white p-4 rounded shadow-sm mb-3 border">
              <div className="d-flex align-items-start justify-content-between">
                <div className="d-flex align-items-start">
                  <img src="https://fakeimg.pl/40x40/003366/FFF/?text=Logo" alt="Logo" className="me-3 flex-shrink-0" />
                  <div>
                    <h6 className="fw-bold mb-1">
                      NHÂN VIÊN KINH DOANH LOGISTICS (Tiếng Anh, Tiếng Trung)
                      <Badge bg="danger" className="ms-2 small">Công việc đã đóng</Badge>
                    </h6>
                    <div className="small text-muted mb-1">
                      <strong>Công Ty TNHH MTV Nam Đạt</strong>
                    </div>
                    <div className="small text-muted">
                      Đã nộp: 18:24, 05/11/2025
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <Button variant="outline-primary" size="sm" className="mb-2">
                    Đã xem
                  </Button>
                  <div>
                    <a href="#" className="text-muted small">
                      <i className="bi bi-printer"></i> In
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* JOB 2 */}
            <div className="bg-white p-4 rounded shadow-sm mb-3 border">
              <div className="d-flex align-items-start justify-content-between">
                <div className="d-flex align-items-start">
                  <img src="https://fakeimg.pl/40x40/336699/FFF/?text=Logo" alt="Logo" className="me-3 flex-shrink-0" />
                  <div>
                    <h6 className="fw-bold mb-1">
                      [HCM] Chăm Sóc Khách Hàng - Tiếng Nhật - Mức thu nhập trên 21 triệu
                      <a href="#" className="text-primary small ms-2">Xem công việc</a>
                    </h6>
                    <div className="small text-muted mb-1">
                      <strong>VIETNAM CONCENTRIX SERVICES COMPANY LIMITED</strong>
                    </div>
                    <div className="small text-muted">
                      Đã nộp: 16:50, 05/11/2025
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <Button variant="outline-primary" size="sm" className="mb-2">
                    Đã xem
                  </Button>
                  <div>
                    <a href="#" className="text-muted small">
                      <i className="bi bi-printer"></i> In
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* RIGHT COLUMN: QUẢNG CÁO + GỢI Ý (4/12) */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: "80px" }}>
              {/* QUẢNG CÁO VIETCV */}
              <div className="bg-gradient text-white p-4 rounded shadow-sm mb-4" style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)" }}>
                <h6 className="fw-bold mb-3">Tạo CV chất với VietCV.io</h6>
                <p className="small mb-3">Ứng tuyển việc làm với CareerLink.vn</p>
                <div className="d-flex justify-content-center gap-2 mb-3">
                  <img src="https://fakeimg.pl/80x100/10b981/FFF/?text=CV1" alt="CV" className="rounded shadow-sm" />
                  <img src="https://fakeimg.pl/80x100/22c55e/FFF/?text=CV2" alt="CV" className="rounded shadow-sm" />
                </div>
                <p className="small mb-0">Chọn mẫu - Điền thông tin - Lưu - Tải về - Nộp đơn</p>
                <div className="text-end mt-2">
                  <img src="https://fakeimg.pl/60x20/ffffff/000/?text=VietCV" alt="VietCV" />
                </div>
              </div>

              {/* GỢI Ý VIỆC LÀM */}
              <div className="bg-white p-3 rounded shadow-sm">
                <h6 className="fw-bold mb-2">Gợi ý việc làm</h6>
                <p className="text-muted small mb-3">
                  Dựa trên việc làm đã xem. Xóa lịch sử để nhận gợi ý mới
                </p>

                <div className="job-suggestion-card p-3 border rounded mb-2">
                  <div className="d-flex align-items-center">
                    <img src="https://fakeimg.pl/32x32/003366/FFF/?text=Logo" alt="" className="me-2" />
                    <div className="flex-grow-1">
                      <div className="small fw-bold text-primary">Kỹ sư xây dựng</div>
                      <div className="small text-muted">Công ty Hà Tăng</div>
                    </div>
                    <Heart size={14} className="text-muted" />
                  </div>
                </div>

                <div className="job-suggestion-card p-3 border rounded">
                  <div className="d-flex align-items-center">
                    <img src="https://fakeimg.pl/32x32/FF6600/FFF/?text=Logo" alt="" className="me-2" />
                    <div className="flex-grow-1">
                      <div className="small fw-bold text-primary">Kỹ sư giám sát</div>
                      <div className="small text-muted">HANDONG</div>
                    </div>
                    <Heart size={14} className="text-muted" />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* ZALO BUTTON */}
      <div className="position-fixed bottom-0 end-0 p-3">
        <a href="#" className="btn btn-primary rounded-circle shadow-lg" style={{ width: 50, height: 50 }}>
          <img src="https://img.icons8.com/color/48/000000/zalo.png" alt="Zalo" />
        </a>
      </div>
    </div>
  );
}