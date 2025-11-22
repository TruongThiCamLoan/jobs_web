// src/pages/CreateResumeStep1.js
import React from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { PersonCircle, ArrowRight } from "react-bootstrap-icons";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

export default function CreateResumeStep1() {
  const steps = [
    "Thông tin cá nhân",
    "Thông tin liên hệ",
    "Học vấn",
    "Ngoại ngữ",
    "Kinh nghiệm làm việc",
    "Người tham khảo",
    "Kỹ năng",
    "Mục tiêu nghề nghiệp",
    "Trạng thái hồ sơ",
  ];

  return (
    <div className="create-resume-page">
      <AppNavbar />

      {/* THANH 9 BƯỚC – DÍNH ĐẦU */}
      <div
        className="progress-steps-wrapper position-sticky top-64 bg-white shadow-sm"
        style={{ zIndex: 1020 }}
      >
        <Container className="py-2">
          <div className="d-flex overflow-auto text-center">
            {steps.map((step, index) => (
              <div key={index} className="flex-shrink-0 mx-1" style={{ minWidth: 100 }}>
                <div
                  className={`border rounded px-2 py-1 ${
                    index === 0 ? "bg-primary text-white" : "bg-light text-muted"
                  }`}
                >
                  <div className="fw-bold">{`Bước ${index + 1}`}</div>
                  <div className="small">{step}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* NỘI DUNG CHÍNH */}
      <Container className="my-5 pt-4">
        <h4 className="text-center fw-bold mb-5">Thông tin cá nhân</h4>

        <Form>
          <Row className="g-4 justify-content-center">
            {/* TIÊU ĐỀ HỒ SƠ */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Tiêu đề hồ sơ <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="VD: Ứng viên IT - Fullstack Developer"
                />
              </Form.Group>
            </Col>

            {/* HỌ VÀ TÊN + QUỐC TỊCH */}
            <Col lg={8}>
              <Row className="g-4">
                <Col md={8}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Họ và tên <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control type="text" defaultValue="Loan Truong Thi Cam" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Quốc tịch <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select defaultValue="">
                      <option value="" disabled>
                        -- Chọn quốc tịch --
                      </option>
                      <option>Việt Nam</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Col>

            {/* NGÀY SINH + ẢNH ĐẠI DIỆN */}
            <Col lg={8}>
              <Row className="g-4">
                {/* NGÀY SINH */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Ngày sinh <span className="text-danger">*</span>
                    </Form.Label>
                    <Row>
                      <Col xs={4}>
                        <Form.Select>
                          <option>Ngày</option>
                        </Form.Select>
                      </Col>
                      <Col xs={4}>
                        <Form.Select>
                          <option>Tháng</option>
                        </Form.Select>
                      </Col>
                      <Col xs={4}>
                        <Form.Select>
                          <option>Năm</option>
                        </Form.Select>
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>

                {/* ẢNH ĐẠI DIỆN */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Ảnh đại diện</Form.Label>
                    <div className="border rounded p-3 text-center bg-light">
                      <PersonCircle size={80} className="text-muted mb-2" />
                      <br />
                      <small className="text-muted">(JPEG/PNG/GIF, ≤ 1MB)</small>
                      <br />
                      <Button variant="outline-primary" size="sm" className="mt-2">
                        Chọn ảnh
                      </Button>
                    </div>
                  </Form.Group>
                </Col>

                {/* TÌNH TRẠNG HÔN NHÂN */}
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Tình trạng hôn nhân <span className="text-danger">*</span>
                    </Form.Label>
                    <div>
                      <Form.Check inline type="radio" label="Độc thân" name="marital" />
                      <Form.Check inline type="radio" label="Đã kết hôn" name="marital" />
                    </div>
                  </Form.Group>
                </Col>

                {/* GIỚI TÍNH */}
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Giới tính <span className="text-danger">*</span>
                    </Form.Label>
                    <div>
                      <Form.Check inline type="radio" label="Nam" name="gender" />
                      <Form.Check inline type="radio" label="Nữ" name="gender" />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* NÚT ĐIỀU HƯỚNG */}
          <div className="text-center mt-5">
            <Button variant="secondary" className="me-3">
              Lưu và Thoát
            </Button>
            <Button variant="primary">
              Tiếp tục <ArrowRight className="ms-1" />
            </Button>
          </div>
        </Form>
      </Container>

      {/* ZALO GÓC DƯỚI */}
      <div className="position-fixed bottom-0 end-0 p-3 z-3">
        <a
          href="#"
          className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: 50, height: 50 }}
        >
          <img
            src="https://img.icons8.com/color/48/000000/zalo.png"
            alt="Zalo"
            width={32}
          />
        </a>
      </div>
    </div>
  );
}
