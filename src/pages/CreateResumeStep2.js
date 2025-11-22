// src/pages/CreateResumeStep2.js
import React from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

export default function CreateResumeStep2() {
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

      {/* THANH 9 BƯỚC – DÍNH ĐẦU, KHÔNG BỊ CHE */}
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
              index === 1 ? "bg-primary text-white" : "bg-light text-muted"
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
        <h4 className="text-center fw-bold mb-5">Thông tin liên hệ</h4>

        <Form>
          <Row className="g-4 justify-content-center">
            {/* DÒNG 1: ĐIỆN THOẠI */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">Điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập số điện thoại"
                  className="h-100"
                />
              </Form.Group>
            </Col>

            {/* DÒNG 2: EMAIL */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  E-mail <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  defaultValue="ttcloancntt2211064@student.ctuet.edu.vn"
                  className="h-100"
                />
              </Form.Group>
            </Col>

            {/* DÒNG 3: QUỐC GIA */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Quốc gia <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select defaultValue="">
                  <option value="" disabled>Vui lòng chọn</option>
                  <option>Việt Nam</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* DÒNG 4: TỈNH + QUẬN/HUYỆN */}
            <Col lg={8}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Tỉnh <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select defaultValue="">
                      <option value="" disabled>Vui lòng chọn</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Quận/Huyện <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select defaultValue="">
                      <option value="" disabled>Vui lòng chọn</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Col>

            {/* DÒNG 5: ĐỊA CHỈ ĐƯỜNG */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">Địa chỉ đường</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập địa chỉ"
                  className="h-100"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* NÚT ĐIỀU HƯỚNG */}
          <div className="text-center mt-5 d-flex justify-content-center gap-3">
            <Button variant="secondary">Lưu và Thoát</Button>
            <Button variant="outline-primary">
              <ArrowLeft className="me-1" /> Quay lại
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