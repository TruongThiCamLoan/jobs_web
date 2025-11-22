// src/pages/ResumePage.js
import React from "react";
import { Container, Row, Col, Button, Nav } from "react-bootstrap";
import { FileText, Plus, Heart } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import "./style.css"; // DÙNG CHUNG

export default function ResumePage() {
  return (
    <div className="resume-page">
      <AppNavbar />

      {/* SUBMENU */}
      <div className="bg-light border-bottom py-2">
        <Container>
          <Nav className="flex-wrap small">
            <Nav.Link as={Link} to="/myjobs" className="text-dark">
              My CareerLink
            </Nav.Link>
            <Nav.Link href="/resume" className="text-primary fw-semibold border-bottom border-primary border-3 pb-1">
              <FileText className="me-1" /> Hồ sơ xin việc (0)
            </Nav.Link>
            <Nav.Link href="#" className="text-dark">
              <Heart className="me-1" /> Việc đã lưu (0)
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
          {/* LEFT COLUMN: RỘNG HƠN (8/12) */}
          <Col lg={8}>
            {/* HỒ SƠ XIN VIỆC – TO, RỘNG */}
            <div className="bg-white p-5 rounded shadow-sm text-center mb-4">
              <h5 className="fw-bold mb-4">Hồ sơ xin việc (0)</h5>
              <div className="profile-icon-circle-large mb-4 mx-auto">
                <FileText size={48} className="text-primary" />
              </div>
              <p className="text-muted mb-4 px-5">
                Hiện tại bạn chưa có hồ sơ nào, xin hãy chọn nút <strong>“Tạo hồ sơ mới”</strong> để tạo hồ sơ cho bạn.
              </p>
              <Button variant="outline-primary" size="lg" className="px-5">
                <Plus className="me-2" /> Tạo hồ sơ mới
              </Button>
            </div>

            {/* THƯ XIN VIỆC – CŨNG TO */}
            <div className="bg-white p-5 rounded shadow-sm text-center mb-4">
              <h5 className="fw-bold mb-4">Thư xin việc (0)</h5>
              <div className="profile-icon-circle-large mb-4 mx-auto">
                <FileText size={48} className="text-muted" />
              </div>
              <p className="text-muted mb-4">
                Bạn chưa có thư xin việc nào.
              </p>
              <Button variant="outline-primary" size="lg" className="px-5">
                <Plus className="me-2" /> Tạo thư mới
              </Button>
            </div>

            {/* CV TẠI VIETCV – TO */}
            <div className="bg-white p-5 rounded shadow-sm text-center">
              <h5 className="fw-bold mb-4">CV tại VietCV</h5>
              <p className="text-muted mb-4 px-5">
                Bạn có thể thấy những CV của bạn đã tạo với VietCV.io tại đây. Bạn có thể dùng những CV này ở bước ứng tuyển. Hãy đăng nhập để bắt đầu.
              </p>
              <Button variant="success" size="lg" className="w-100 px-5">
                Đăng nhập vào VietCV
              </Button>
            </div>
          </Col>

          {/* RIGHT COLUMN: HẸP HƠN (4/12) */}
          <Col lg={4}>
            <div className="bg-white p-4 rounded shadow-sm sticky-top" style={{ top: "80px" }}>
              <h6 className="fw-bold mb-3">Gợi ý việc làm</h6>
              <p className="text-muted small mb-3">
                Dựa trên việc làm đã xem. Xóa lịch sử để nhận gợi ý mới
              </p>

              <div className="job-suggestion-card mb-3 p-3 border rounded">
                <div className="d-flex align-items-start">
                  <img src="https://fakeimg.pl/36x36/003366/FFF/?text=Logo" alt="Logo" className="me-2 flex-shrink-0" />
                  <div className="flex-grow-1">
                    <div className="fw-bold small text-primary">Kỹ sư xây dựng</div>
                    <div className="small text-muted">Công Ty CP Hà Tăng</div>
                    <div className="small text-success fw-bold">18 - 20 triệu</div>
                  </div>
                  <Heart className="text-muted flex-shrink-0" size={16} />
                </div>
              </div>

              <div className="job-suggestion-card mb-3 p-3 border rounded">
                <div className="d-flex align-items-start">
                  <img src="https://fakeimg.pl/36x36/FF6600/FFF/?text=Logo" alt="Logo" className="me-2 flex-shrink-0" />
                  <div className="flex-grow-1">
                    <div className="fw-bold small text-primary">Kỹ Sư Giám Sát</div>
                    <div className="small text-muted">Cty HANDONG</div>
                    <div className="small text-success fw-bold">Cạnh tranh</div>
                  </div>
                  <Heart className="text-muted flex-shrink-0" size={16} />
                </div>
              </div>

              <div className="job-suggestion-card p-3 border rounded">
                <div className="d-flex align-items-start">
                  <img src="https://fakeimg.pl/36x36/336699/FFF/?text=Logo" alt="Logo" className="me-2 flex-shrink-0" />
                  <div className="flex-grow-1">
                    <div className="fw-bold small text-primary">QUẢN LÝ GIA CÔNG</div>
                    <div className="small text-muted">Gunze Việt Nam</div>
                    <div className="small text-success fw-bold">Thương lượng</div>
                  </div>
                  <Heart className="text-muted flex-shrink-0" size={16} />
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