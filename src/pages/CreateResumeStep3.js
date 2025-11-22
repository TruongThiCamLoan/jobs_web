// src/pages/CreateResumeStep3.js
import React, { useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

export default function CreateResumeStep3() {
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

  const [activeStep, setActiveStep] = useState(2); // step 3 = index 2

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
              <div
                key={index}
                className="flex-shrink-0 mx-1"
                style={{ minWidth: 100, cursor: "pointer" }}
                onClick={() => setActiveStep(index)}
              >
                <div
                  className={`border rounded px-2 py-1 ${
                    index === activeStep ? "bg-primary text-white" : "bg-light text-muted"
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
        <h4 className="text-center fw-bold mb-5">Học vấn</h4>

        <Form>
          <Row className="g-4 justify-content-center">
            {/* TRÌNH ĐỘ HỌC VẤN */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Trình độ học vấn <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select defaultValue="">
                  <option value="" disabled>Vui lòng chọn</option>
                  <option>Trung học</option>
                  <option>Trung cấp</option>
                  <option>Cao đẳng</option>
                  <option>Đại học</option>
                  <option>Thạc sĩ</option>
                  <option>Tiến sĩ</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* TÊN TRƯỜNG */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Tên trường <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select defaultValue="">
                  <option value="" disabled>Vui lòng chọn</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* CHUYÊN MÔN */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Chuyên môn <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select defaultValue="">
                  <option value="" disabled>Vui lòng chọn</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* NGÀY BẮT ĐẦU + KẾT THÚC */}
            <Col lg={8}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Ngày Bắt Đầu <span className="text-danger">*</span>
                    </Form.Label>
                    <Row>
                      <Col xs={6}>
                        <Form.Select>
                          <option>--</option>
                        </Form.Select>
                      </Col>
                      <Col xs={6}>
                        <Form.Select>
                          <option>--</option>
                        </Form.Select>
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Ngày Kết Thúc <span className="text-danger">*</span>
                    </Form.Label>
                    <Row>
                      <Col xs={6}>
                        <Form.Select>
                          <option>--</option>
                        </Form.Select>
                      </Col>
                      <Col xs={6}>
                        <Form.Select>
                          <option>--</option>
                        </Form.Select>
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>
            </Col>

            {/* QUÁ TRÌNH HỌC VẤN */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">Quá trình học vấn</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="(Tùy chọn) Mô tả quá trình học vấn"
                  className="resize-none"
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
