// src/pages/JobAlertsPage.js
import React from "react";
import { Container, Row, Col, Button, Nav } from "react-bootstrap";
import { Bell, Plus, Heart, Briefcase, FileText, Person } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import "./style.css";

export default function JobAlertsPage() {
      return (
             <div className="resume-page pt-5 mt-5 bg-light min-vh-100">
                 <AppNavbar />
     
                    <div className="bg-white border-bottom py-0">
                     <Container>
                         {/* THÊM GAP-3 ĐỂ CÁC MỤC GẦN NHAU HƠN */}
                         <Nav className="flex-wrap small gap-5">
                             {/* 1. My Jobs */}
                             <Nav.Link as={Link} to="/myjobs" className="text-dark py-1">
                                 <Briefcase size={14} className="me-1" /> My Jobs
                             </Nav.Link>
                             
                             {/* 2. HỒ SƠ XIN VIỆC (ĐANG ACTIVE LÀ MỤC CON: Tải hồ sơ lên) */}
                             <Nav.Link as={Link} to="/resume" className="text-dark py-1">
                                 <FileText size={14} className="me-1" /> Hồ sơ xin việc 
                             </Nav.Link>
     
                             {/* 3. VIỆC ĐÃ LƯU */}
                             <Nav.Link as={Link} to="/saved-jobs" className="text-dark py-1">
                                 <Heart size={14} className="me-1" /> Việc đã lưu 
                             </Nav.Link>
                             
                             {/* 4. VIỆC ĐÃ ỨNG TUYỂN */}
                             <Nav.Link as={Link} to="/applied-jobs" className="text-dark py-1">
                                 <Briefcase size={14} className="me-1" /> Việc đã ứng tuyển 
                             </Nav.Link>
                             
                              {/* 5. THÔNG BÁO VIỆC LÀM */}
                             <Nav.Link as={Link} to="/job-alerts" className="text-primary fw-semibold border-bottom border-primary border-3 pb-1">
                                 <Bell size={14} className="me-1" /> Thông báo việc làm 
                             </Nav.Link>
                             
                              {/* 6. TÀI KHOẢN */}
                              <Nav.Link as={Link} to="/account" className="text-dark py-1">
                                  <Person className="me-1" /> Tài khoản
                             </Nav.Link>
                             
                         </Nav>
                     </Container>
                 </div>

      <Container className="my-5">
        <Row className="g-4">
          {/* LEFT COLUMN: THÔNG BÁO (8/12) */}
          <Col lg={8}>
            <h5 className="fw-bold mb-4">Thông báo việc làm của tôi (0)</h5>

            {/* EMPTY STATE */}
            <div className="bg-white p-5 rounded shadow-sm text-center">
              <div className="profile-icon-circle-large mx-auto mb-4">
                <Bell size={48} className="text-primary" />
              </div>
              <p className="text-muted mb-4">
                Chưa có thông báo việc làm nào được thiết lập
              </p>
              <Button variant="primary" size="lg">
                <Plus className="me-2" /> Tạo thông báo việc làm mới
              </Button>
            </div>
          </Col>

          {/* RIGHT COLUMN: GỢI Ý (4/12) */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: "80px" }}>
              <div className="bg-white p-4 rounded shadow-sm">
                <h6 className="fw-bold mb-3">Gợi ý việc làm</h6>
                <p className="text-muted small mb-3">
                  Dựa trên việc làm đã xem. Xóa lịch sử để nhận gợi ý mới
                </p>

                {/* JOB 1 */}
                <div className="job-suggestion-card p-3 border rounded mb-3">
                  <div className="d-flex align-items-start">
                    <img src="https://fakeimg.pl/40x40/003366/FFF/?text=Logo" alt="Logo" className="me-2 flex-shrink-0" />
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-primary">Kỹ sư xây dựng / Cán bộ kỹ thuật hiện trường</div>
                      <div className="small text-muted">Công Ty CP Đầu Tư Xây Dựng Hà Tăng...</div>
                      <div className="small text-muted">Hải Phòng</div>
                      <div className="fw-bold text-success small">18 triệu - 20 triệu</div>
                    </div>
                    <Heart className="text-muted flex-shrink-0" size={18} />
                  </div>
                </div>

                {/* JOB 2 */}
                <div className="job-suggestion-card p-3 border rounded mb-3">
                  <div className="d-flex align-items-start">
                    <img src="https://fakeimg.pl/40x40/FF6600/FFF/?text=Logo" alt="Logo" className="me-2 flex-shrink-0" />
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-primary">[Hải Phòng] Kỹ Sư Giám Sát Công Trình</div>
                      <div className="small text-muted">CÔNG TY CỔ PHẦN KỸ THUẬT & XÂY DỰNG...</div>
                      <div className="small text-muted">Hải Phòng</div>
                      <div className="fw-bold text-success small">Cạnh tranh</div>
                    </div>
                    <Heart className="text-muted flex-shrink-0" size={18} />
                  </div>
                </div>

                {/* JOB 3 */}
                <div className="job-suggestion-card p-3 border rounded mb-3">
                  <div className="d-flex align-items-start">
                    <img src="https://fakeimg.pl/40x40/336699/FFF/?text=Logo" alt="Logo" className="me-2 flex-shrink-0" />
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-primary">QUẢN LÝ GIA CÔNG</div>
                      <div className="small text-muted">Công ty TNHH Gunze (Việt Nam)</div>
                      <div className="small text-muted">Hồ Chí Minh</div>
                      <div className="fw-bold text-success small">Thương lượng</div>
                    </div>
                    <Heart className="text-muted flex-shrink-0" size={18} />
                  </div>
                </div>

                {/* JOB 4 */}
                <div className="job-suggestion-card p-3 border rounded">
                  <div className="d-flex align-items-start">
                    <img src="https://fakeimg.pl/40x40/CC0000/FFF/?text=Logo" alt="Logo" className="me-2 flex-shrink-0" />
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-primary">KIẾN TRÚC SƯ - CÔNG TRÌNH DÂN DỤNG</div>
                      <div className="small text-muted">CÔNG TY CỔ PHẦN BẤT ĐỘNG SẢN FUTA LAND</div>
                      <div className="small text-muted">Đà Nẵng</div>
                      <div className="fw-bold text-success small">20 triệu - 35 triệu</div>
                    </div>
                    <Heart className="text-muted flex-shrink-0" size={18} />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}