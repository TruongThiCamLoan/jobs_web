// src/pages/SavedJobsPage.js
import React from "react";
import { Container, Row, Col, Button, Nav, Badge } from "react-bootstrap";
import { Heart, Briefcase, FileText, Bell, Person } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import "./style.css";

export default function SavedJobsPage() {
  return (
    <div className="saved-jobs-page">
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
            <Nav.Link href="/saved-jobs" className="text-primary fw-semibold border-bottom border-primary border-3 pb-1">
              <Heart className="me-1" /> Việc đã lưu (1)
            </Nav.Link>
            <Nav.Link href="#" className="text-dark">
              Việc đã ứng tuyển (0)
            </Nav.Link>
            <Nav.Link href="#" className="text-dark">
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
          {/* LEFT COLUMN: VIỆC ĐÃ LƯU (8/12) */}
          <Col lg={8}>
            <h5 className="fw-bold mb-3">Công việc đã lưu (1)</h5>

            {/* JOB ITEM */}
            <div className="bg-white p-4 rounded shadow-sm mb-3 border">
              <div className="d-flex align-items-start justify-content-between">
                <div className="d-flex align-items-start">
                  <Heart className="text-primary me-3" size={24} />
                  <div>
                    <h6 className="fw-bold text-success mb-1">
                      NHÂN VIÊN TELESALE (Bán Hàng Qua Điện Thoại)
                    </h6>
                    <div className="small text-muted mb-1">
                      <strong>CÔNG TY TNHH ĐẦU TƯ KIBA</strong>
                    </div>
                    <div className="small text-success">
                      Hết hạn: 17 ngày tới
                    </div>
                  </div>
                </div>
                <Button variant="outline-primary" size="sm">
                  Ứng tuyển ngay
                </Button>
              </div>
            </div>

            {/* HÔM NAY */}
            <div className="text-muted small mt-4">Hôm nay</div>
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