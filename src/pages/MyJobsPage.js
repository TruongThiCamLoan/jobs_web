// src/pages/MyJobsPage.js
import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, ProgressBar, Button, Nav } from "react-bootstrap";
import {
  Briefcase, FileText, Heart, Bell, Person, Building,
  Plus, ArrowRight, PencilSquare, PersonCircle
} from "react-bootstrap-icons";
import AppNavbar from "../components/Navbar";
import "./style.css";

export default function MyJobsPage() {
  return (
    <div className="mycareerlink-page">
      <AppNavbar />

      {/* SUBMENU */}
      <div className="bg-light border-bottom py-2">
        <Container>
          <Nav className="flex-wrap small">
            <Nav.Link href="/myjobs" className="text-primary fw-semibold border-bottom border-primary border-3 pb-1">
              <Briefcase className="me-1" /> My CareerLink
            </Nav.Link>
            <Nav.Link href="#" className="text-dark">
              <FileText className="me-1" /> Hồ sơ xin việc (0)
            </Nav.Link>
            <Nav.Link href="#" className="text-dark">
              <Heart className="me-1" /> Việc đã lưu (0)
            </Nav.Link>
            <Nav.Link href="#" className="text-dark">
              <ArrowRight className="me-1" /> Việc đã ứng tuyển (0)
            </Nav.Link>
            <Nav.Link href="#" className="text-dark">
              <Bell className="me-1" /> Thông báo việc làm (0)
            </Nav.Link>
            <Nav.Link href="#" className="text-dark">
              <Person className="me-1" /> Tài khoản
            </Nav.Link>
          </Nav>
        </Container>
      </div>

      {/* MAIN CONTENT */}
      <Container className="my-5">
        <Row>
          {/* LEFT COLUMN */}
          <Col lg={4}>
            {/* PROFILE CARD */}
            <div className="bg-white p-4 rounded shadow-sm mb-4">
              <div className="d-flex align-items-center mb-3">
                <PersonCircle size={56} className="text-muted me-3" />
                <div>
                  <h6 className="mb-0 fw-bold">Loan Truong Thi Cam</h6>
                  <small className="text-muted">ttcloancntt2211064@student...</small>
                </div>
                <PencilSquare className="ms-auto text-primary" />
              </div>
              <div className="mb-3">
                <small className="text-muted">Hoàn thành 0%</small>
                <ProgressBar now={0} className="mt-1" style={{ height: "6px" }} />
              </div>
             <Button
  variant="primary"
  className="w-100 mb-2"
  as={Link}
  to="/create-resume/step1"
>
  Hoàn tất hồ sơ xin việc
</Button>
              <div className="text-muted small d-flex justify-content-between">
                <span>Ngày đăng ký 27-10-2025</span>
                <a href="#" className="text-decoration-underline">Thoát</a>
              </div>
            </div>

            {/* HỒ SƠ XIN VIỆC */}
            <div className="bg-white p-4 rounded shadow-sm text-center mb-4">
              <h6 className="fw-bold mb-3">Hồ sơ xin việc</h6>
              <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80 }}>
                <FileText size={36} className="text-primary" />
              </div>
              <p className="text-muted small">
                Hiện tại bạn chưa có hồ sơ nào, xin hãy chọn nút “Tạo hồ sơ mới” để tạo hồ sơ cho bạn.
              </p>
              <Button variant="outline-primary">
                <Plus /> Tạo hồ sơ mới
              </Button>
            </div>

            {/* CV TẠI VIETCV */}
            <div className="bg-white p-4 rounded shadow-sm text-center mb-4">
              <h6 className="fw-bold mb-3">CV tại VietCV</h6>
              <p className="text-muted small mb-3">
                Bạn có thể thấy những CV của bạn đã tạo với VietCV.io tại đây. Bạn có thể dùng những CV này ở bước ứng tuyển. Hãy đăng nhập để bắt đầu.
              </p>
              <Button variant="success" className="w-100">
                Đăng nhập vào VietCV
              </Button>
            </div>

            {/* THƯ XIN VIỆC */}
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <h6 className="fw-bold mb-3">Thư xin việc</h6>
              <p className="text-muted small mb-3">
                Bạn chưa có thư xin việc nào.
              </p>
              <Button variant="outline-primary">
                <Plus /> Tạo thư mới
              </Button>
            </div>
          </Col>

          {/* RIGHT COLUMN */}
          <Col lg={8}>
            {/* STATS */}
            <Row className="g-3 mb-4">
              <Col>
                <div className="bg-white p-3 rounded shadow-sm text-center">
                  <h3 className="text-primary fw-bold">0</h3>
                  <small>NHÀ TUYỂN DỤNG XEM HỒ SƠ</small>
                </div>
              </Col>
              <Col>
                <div className="bg-white p-3 rounded shadow-sm text-center">
                  <h3 className="text-danger fw-bold">0</h3>
                  <small>VIỆC ĐÃ LƯU</small>
                </div>
              </Col>
              <Col>
                <div className="bg-white p-3 rounded shadow-sm text-center">
                  <h3 className="text-warning fw-bold">0</h3>
                  <small>VIỆC ĐÃ ỨNG TUYỂN</small>
                </div>
              </Col>
              <Col>
                <div className="bg-white p-3 rounded shadow-sm text-center">
                  <h3 className="text-success fw-bold">0</h3>
                  <small>THÔNG BÁO VIỆC LÀM</small>
                </div>
              </Col>
            </Row>

            {/* ỨNG TUYỂN GẦN ĐÂY */}
            <h6 className="fw-bold mb-3">Việc đã ứng tuyển gần đây</h6>
            <div className="bg-white p-5 rounded shadow-sm text-center mb-4">
              <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 100, height: 100 }}>
                <ArrowRight size={48} className="text-primary" />
              </div>
              <p className="text-muted">Không có việc ứng tuyển gần đây</p>
              <Button variant="outline-primary">Đến trang tìm việc</Button>
            </div>

            {/* GỢI Ý VIỆC LÀM */}
            <h6 className="fw-bold mb-3">Gợi ý việc làm</h6>
            <p className="text-muted small mb-4">
              Dựa trên việc làm đã xem. Xóa lịch sử việc làm đã xem để nhận gợi ý mới
            </p>

            <Row className="g-3">
              {/* JOB 1 */}
              <Col md={6}>
                <div className="border p-3 rounded">
                  <div className="d-flex align-items-start">
                    <img src="https://fakeimg.pl/40x40/003366/FFF/?text=Logo" alt="Logo" className="me-2" />
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-primary">Kỹ sư xây dựng / Cán bộ kỹ thuật hiện trường</div>
                      <div className="small text-muted">Công Ty CP Đầu Tư Xây Dựng Hà Tăng</div>
                      <div className="small text-muted">Hồng Hà</div>
                      <div className="small text-muted">Hải Phòng</div>
                      <div className="fw-bold text-success small">18 triệu - 20 triệu</div>
                    </div>
                    <Heart className="text-muted" size={18} />
                  </div>
                </div>
              </Col>

              {/* JOB 2 */}
              <Col md={6}>
                <div className="border p-3 rounded">
                  <div className="d-flex align-items-start">
                    <img src="https://fakeimg.pl/40x40/FF6600/FFF/?text=Logo" alt="Logo" className="me-2" />
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-primary">[Hải Phòng] Kỹ Sư Giám Sát Công Trình Xây Dựng</div>
                      <div className="small text-muted">CÔNG TY CỔ PHẦN KỸ THUẬT & XÂY DỰNG HANDONG</div>
                      <div className="small text-muted">Hải Phòng</div>
                      <div className="fw-bold text-success small">Cạnh tranh</div>
                    </div>
                    <Heart className="text-muted" size={18} />
                  </div>
                </div>
              </Col>

              {/* JOB 3 */}
              <Col md={6}>
                <div className="border p-3 rounded">
                  <div className="d-flex align-items-start">
                    <img src="https://fakeimg.pl/40x40/336699/FFF/?text=Logo" alt="Logo" className="me-2" />
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-primary">QUẢN LÝ GIA CÔNG</div>
                      <div className="small text-muted">Công ty TNHH Gunze (Việt Nam)</div>
                      <div className="small text-muted">Hồ Chí Minh</div>
                      <div className="fw-bold text-success small">Thương lượng</div>
                    </div>
                    <Heart className="text-muted" size={18} />
                  </div>
                </div>
              </Col>

              {/* JOB 4 */}
              <Col md={6}>
                <div className="border p-3 rounded">
                  <div className="d-flex align-items-start">
                    <img src="https://fakeimg.pl/40x40/CC0000/FFF/?text=Logo" alt="Logo" className="me-2" />
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-primary">KIẾN TRÚC SƯ - CÔNG TRÌNH DÂN DỤNG</div>
                      <div className="small text-muted">CÔNG TY CỔ PHẦN BẤT ĐỘNG SẢN FUTA LAND</div>
                      <div className="small text-muted">Đà Nẵng</div>
                      <div className="fw-bold text-success small">20 triệu - 35 triệu</div>
                    </div>
                    <Heart className="text-muted" size={18} />
                  </div>
                </div>
              </Col>

              {/* JOB 5 */}
              <Col md={6}>
                <div className="border p-3 rounded">
                  <div className="d-flex align-items-start">
                    <img src="https://fakeimg.pl/40x40/FF3333/FFF/?text=Logo" alt="Logo" className="me-2" />
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-primary">CHUYÊN VIÊN ĐẦU TƯ - PHÁP CHẾ</div>
                      <div className="small text-muted">Công Ty Cổ Phần Petro Times</div>
                      <div className="small text-muted">Hải Phòng</div>
                      <div className="fw-bold text-success small">15 triệu - 35 triệu</div>
                    </div>
                    <Heart className="text-muted" size={18} />
                  </div>
                </div>
              </Col>

              {/* JOB 6 */}
              <Col md={6}>
                <div className="border p-3 rounded">
                  <div className="d-flex align-items-start">
                    <img src="https://fakeimg.pl/40x40/003366/FFF/?text=Logo" alt="Logo" className="me-2" />
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-primary">Biên - Phiên Dịch Tiếng Nhật (đào tạo làm việc tại Nhật)</div>
                      <div className="small text-muted">Công Ty TNHH Quadrille Việt Nam</div>
                      <div className="small text-muted">Đồng Nai</div>
                      <div className="fw-bold text-success small">10 triệu - 12 triệu</div>
                    </div>
                    <Heart className="text-muted" size={18} />
                  </div>
                </div>
              </Col>

              {/* JOB 7 */}
              <Col md={6}>
                <div className="border p-3 rounded">
                  <div className="d-flex align-items-start">
                    <img src="https://fakeimg.pl/40x40/669933/FFF/?text=Logo" alt="Logo" className="me-2" />
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-primary">CHUYÊN VIÊN THIẾT KẾ (DESIGN)</div>
                      <div className="small text-muted">CÔNG TY CỔ PHẦN BẤT ĐỘNG SẢN FUTA LAND</div>
                      <div className="small text-muted">Đà Nẵng</div>
                      <div className="fw-bold text-success small">18 triệu - 25 triệu</div>
                    </div>
                    <Heart className="text-muted" size={18} />
                  </div>
                </div>
              </Col>
            </Row>
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