// src/pages/CreateResumeStep4.js
import React, { useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { ArrowLeft, ArrowRight, Plus } from "react-bootstrap-icons";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

export default function CreateResumeStep4() {
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

  const [activeStep, setActiveStep] = useState(3); // step 4 = index 3

  // Danh sách ngôn ngữ (có thể thêm nhiều)
  const [languages, setLanguages] = useState([{ id: 1, name: "", level: "" }]);

  const addLanguage = () => {
    setLanguages([...languages, { id: Date.now(), name: "", level: "" }]);
  };

  const removeLanguage = (id) => {
    setLanguages(languages.filter((lang) => lang.id !== id));
  };

  const updateLanguage = (id, field, value) => {
    setLanguages(
      languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    );
  };

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
                    index === activeStep
                      ? "bg-primary text-white"
                      : "bg-light text-muted"
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
        <h4 className="text-center fw-bold mb-2">Ngoại ngữ</h4>
        <p className="text-center text-muted small mb-5">(Không bắt buộc)</p>

        <Form>
          <Row className="g-4 justify-content-center">
            {/* DANH SÁCH NGÔN NGỮ */}
            {languages.map((lang, idx) => (
              <Col lg={8} key={lang.id}>
                <Row className="g-3 align-items-end">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Ngoại ngữ</Form.Label>
                      <Form.Select
                        value={lang.name}
                        onChange={(e) =>
                          updateLanguage(lang.id, "name", e.target.value)
                        }
                      >
                        <option value="" disabled>Vui lòng chọn</option>
                        <option>Tiếng Anh</option>
                        <option>Tiếng Nhật</option>
                        <option>Tiếng Hàn</option>
                        <option>Tiếng Trung</option>
                        <option>Tiếng Pháp</option>
                        <option>Tiếng Đức</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Trình độ</Form.Label>
                      <Form.Select
                        value={lang.level}
                        onChange={(e) =>
                          updateLanguage(lang.id, "level", e.target.value)
                        }
                      >
                        <option value="" disabled>...</option>
                        <option>Sơ cấp</option>
                        <option>Trung cấp</option>
                        <option>Khá</option>
                        <option>Tốt</option>
                        <option>Xuất sắc</option>
                        <option>Bản ngữ</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={1}>
                    {idx > 0 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="mb-3"
                        onClick={() => removeLanguage(lang.id)}
                      >
                        Xóa
                      </Button>
                    )}
                  </Col>
                </Row>
              </Col>
            ))}

            {/* NÚT THÊM NGÔN NGỮ */}
            <Col lg={8}>
              <Button
                variant="link"
                className="text-primary p-0 d-flex align-items-center"
                onClick={addLanguage}
              >
                <Plus size={20} className="me-1" /> Thêm ngôn ngữ
              </Button>
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
