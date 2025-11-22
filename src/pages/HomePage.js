// src/pages/HomePage.js
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import AppNavbar from "../components/Navbar"; // DÙNG NAVBAR CHUNG
import "./style.css";

import banner1 from "../img/banner1.jpg";
import banner2 from "../img/banner2.jpg";
import banner3 from "../img/banner3.jpg";
import banner4 from "../img/banner4.jpg";
import Banner from "../img/Banner.jpg";

export default function HomePage() {
  return (
    <div className="homepage">
      <AppNavbar />

      {/* HERO SECTION */}
      <section className="hero-section position-relative">
        <img src={Banner} alt="Banner" className="banner-img" />
        <div className="banner-overlay"></div>

        <div className="banner-content position-absolute w-100 text-center text-white">
          <Container className="h-100 d-flex flex-column justify-content-center align-items-center">
            <h1 className="display-4 fw-bold mb-3">CareerLink.vn</h1>
            <h3 className="fw-medium mb-4">
              nay đã có mặt trên <span className="text-warning fw-bold">Zalo OA</span>
            </h3>

            {/* SEARCH BAR */}
            <Row className="justify-content-center w-100 mb-4 g-3">
              <Col lg={3}>
                <div className="search-box bg-white shadow-sm rounded">
                  <div className="d-flex align-items-center h-100 px-3">
                    <input
                      type="text"
                      placeholder="Tên vị trí, công ty, từ khóa"
                      className="border-0 flex-grow-1 py-3"
                      style={{ outline: "none" }}
                    />
                  </div>
                </div>
              </Col>
              <Col lg={3}>
                <div className="search-box bg-white shadow-sm rounded">
                  <div className="d-flex align-items-center h-100 px-3">
                    <input
                      type="text"
                      placeholder="Tỉnh / Thành phố"
                      className="border-0 flex-grow-1 py-3"
                      style={{ outline: "none" }}
                    />
                  </div>
                </div>
              </Col>
              <Col lg={2}>
                <button className="search-btn btn btn-primary w-100 h-100 rounded fw-bold d-flex align-items-center justify-content-center">
                  Tìm kiếm
                </button>
              </Col>
            </Row>

            <img src={banner1} alt="QR Zalo" className="qr-img mb-3" />
            <Button variant="primary" size="lg" className="px-5 py-2 rounded-pill fw-bold">
              Tìm Hiểu Thêm
            </Button>
          </Container>
        </div>
      </section>

      {/* JOB LIST */}
      <Container className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Việc làm hấp dẫn</h4>
          <a href="#" className="text-primary fw-semibold">
            Xem tất cả
          </a>
        </div>

        <Row className="g-3">
          <Col md={4}>
            <Card className="job-card shadow-sm border-0">
              <Card.Body>
                <span className="badge bg-danger mb-2">HOT</span>
                <div className="d-flex align-items-center mb-2">
                  <img src={banner2} alt="CIMC" height="40" className="me-3 rounded" />
                  <div>
                    <Card.Title className="h6 fw-bold mb-0 text-primary">
                      NHÂN VIÊN KINH DOANH (Biết Tiếng Anh)
                    </Card.Title>
                    <Card.Text className="text-muted small mb-1">
                      CÔNG TY TNHH CIMC VEHICLES (VIỆT NAM)
                    </Card.Text>
                    <Card.Text className="text-muted small mb-1">Hà Nội</Card.Text>
                    <Card.Text className="text-muted small">Trên 15 triệu</Card.Text>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="text-muted small bg-white border-0">
                3 ngày trước
              </Card.Footer>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="job-card shadow-sm border-0">
              <Card.Body>
                <span className="badge bg-danger mb-2">HOT</span>
                <div className="d-flex align-items-center mb-2">
                  <img src={banner3} alt="Hexagon" height="40" className="me-3 rounded" />
                  <div>
                    <Card.Title className="h6 fw-bold mb-0 text-primary">
                      CHUYÊN VIÊN THANH QUYẾT TOÁN
                    </Card.Title>
                    <Card.Text className="text-muted small mb-1">
                      CÔNG TY CỔ PHẦN ỨNG DỤNG CÔNG NGHỆ HEXAGON
                    </Card.Text>
                    <Card.Text className="text-muted small mb-1">Đà Nẵng</Card.Text>
                    <Card.Text className="text-muted small">Thương lượng</Card.Text>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="text-muted small bg-white border-0">
                13 giờ trước
              </Card.Footer>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="job-card shadow-sm border-0">
              <Card.Body>
                <span className="badge bg-danger mb-2">HOT</span>
                <div className="d-flex align-items-center mb-2">
                  <img src={banner4} alt="Fulco" height="40" className="me-3 rounded" />
                  <div>
                    <Card.Title className="h6 fw-bold mb-0 text-primary">
                      Nhân Viên Về ISO, Tạo Quy Trình (Có XP)
                    </Card.Title>
                    <Card.Text className="text-muted small mb-1">
                      CÔNG TY TNHH PHÚ CƠ
                    </Card.Text>
                    <Card.Text className="text-muted small mb-1">Tây Ninh</Card.Text>
                    <Card.Text className="text-muted small">Thương lượng</Card.Text>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="text-muted small bg-white border-0">
                2 ngày trước
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>

      <footer className="text-center py-3 bg-light border-top">
        <small>© 2025 - Việc Làm Sinh Viên | React + Bootstrap</small>
      </footer>
    </div>
  );
}