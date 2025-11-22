// src/pages/CreateResumeStep7.js
import React, { useState } from "react";
import { Container, Form, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { ArrowLeft, ArrowRight, Plus } from "react-bootstrap-icons";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

export default function CreateResumeStep7() {
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

  // Danh sách kỹ năng
  const [skills, setSkills] = useState([
    {
      id: 1,
      name: "",
      level: 0, // 0-100%
      description: "",
      isActive: false, // đánh dấu kỹ năng đang chọn
    },
  ]);

  const addSkill = () => {
    setSkills([
      ...skills,
      {
        id: Date.now(),
        name: "",
        level: 0,
        description: "",
        isActive: false,
      },
    ]);
  };

  const removeSkill = (id) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const updateSkill = (id, field, value) => {
    setSkills(
      skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  const setActiveSkill = (id) => {
    setSkills(
      skills.map((skill) => ({
        ...skill,
        isActive: skill.id === id,
      }))
    );
  };

  // Chuyển % thành màu thanh tiến độ
  const getProgressVariant = (level) => {
    if (level <= 33) return "danger";
    if (level <= 66) return "warning";
    return "success";
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
              <div key={index} className="flex-shrink-0 mx-1" style={{ minWidth: 100 }}>
                <div
                  className={`border rounded px-2 py-1 ${
                    index === 6 ? "bg-primary text-white" : "bg-light text-muted"
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
        <h4 className="text-center fw-bold mb-2">Kỹ năng</h4>
        <p className="text-center text-muted small mb-5">(Không bắt buộc)</p>

        <Form>
          {skills.map((skill, idx) => (
            <div
              key={skill.id}
              className={`mb-5 p-3 rounded border ${
                skill.isActive ? "border-primary bg-light" : "border-light"
              }`}
              onClick={() => setActiveSkill(skill.id)}
            >
              <Row className="g-4 justify-content-center">
                {/* KỸ NĂNG + TRÌNH ĐỘ */}
                <Col lg={8}>
                  <Row className="g-3 align-items-center">
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Kỹ năng <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ex: Microsoft Word"
                          value={skill.name}
                          onFocus={() => setActiveSkill(skill.id)}
                          onChange={(e) =>
                            updateSkill(skill.id, "name", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Trình độ</Form.Label>
                        <Form.Range
                          min="0"
                          max="100"
                          step="1"
                          value={skill.level}
                          onChange={(e) =>
                            updateSkill(skill.id, "level", parseInt(e.target.value))
                          }
                          className="skill-range"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <div className="text-center">
                        <Form.Label className="fw-semibold d-block">Số cấp</Form.Label>
                        <span className="badge bg-primary fs-6">
                          {skill.level}%
                        </span>
                      </div>
                    </Col>
                  </Row>
                </Col>

                {/* THANH TRÌNH ĐỘ */}
                <Col lg={8}>
                  <ProgressBar
                    now={skill.level}
                    variant={getProgressVariant(skill.level)}
                    className="skill-progress"
                    style={{ height: "12px" }}
                  />
                </Col>

                {/* MÔ TẢ KỸ NĂNG */}
                <Col lg={8}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Mô tả kỹ năng</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="(Tùy chọn) Mô tả chi tiết kỹ năng"
                      value={skill.description}
                      onFocus={() => setActiveSkill(skill.id)}
                      onChange={(e) =>
                        updateSkill(skill.id, "description", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>

                {/* NÚT XÓA (từ kỹ năng thứ 2) */}
                {idx > 0 && (
                  <Col lg={8}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeSkill(skill.id)}
                    >
                      Xóa kỹ năng này
                    </Button>
                  </Col>
                )}
              </Row>

              {/* PHÂN CÁCH */}
              {idx < skills.length - 1 && (
                <hr className="my-5" style={{ borderTop: "2px dashed #dee2e6" }} />
              )}
            </div>
          ))}

          {/* NÚT THÊM KỸ NĂNG */}
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <Button
                variant="primary"
                className="d-inline-flex align-items-center"
                onClick={addSkill}
              >
                <Plus size={20} className="me-1" /> Thêm kỹ năng
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
