// src/pages/CreateResumeStep5.js
import React, { useState } from "react";
import { Container, Form, Row, Col, Button, FormCheck } from "react-bootstrap";
import { ArrowLeft, ArrowRight, Plus } from "react-bootstrap-icons";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

export default function CreateResumeStep5() {
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

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      totalYears: "",
      company: "",
      position: "",
      industry: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      isCurrent: false,
      description: "",
    },
  ]);

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now(),
        totalYears: "",
        company: "",
        position: "",
        industry: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        isCurrent: false,
        description: "",
      },
    ]);
  };

  const removeExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id, field, value) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const toggleCurrentJob = (id) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, isCurrent: !exp.isCurrent } : exp
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
                style={{ minWidth: 100 }}
              >
                <div
                  className={`border rounded px-2 py-1 ${
                    index === 4 ? "bg-primary text-white" : "bg-light text-muted"
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
        <h4 className="text-center fw-bold mb-5">Kinh nghiệm làm việc</h4>

        <Form>
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="mb-5">
              <Row className="g-4 justify-content-center">
                {/* TỔNG SỐ NĂM KINH NGHIỆM */}
                {idx === 0 && (
                  <Col lg={8}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Tổng số năm kinh nghiệm làm việc{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Select
                          style={{ width: "auto" }}
                          value={exp.totalYears}
                          onChange={(e) =>
                            updateExperience(exp.id, "totalYears", e.target.value)
                          }
                        >
                          <option value="" disabled>
                            Vui lòng chọn
                          </option>
                          {[...Array(11).keys()].map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </Form.Select>
                        <span className="ms-2">năm</span>
                      </div>
                    </Form.Group>
                  </Col>
                )}

                {/* TÊN CÔNG TY + CHỨC DANH */}
                <Col lg={8}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Tên công ty <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(exp.id, "company", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Chức danh <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={exp.position}
                          onChange={(e) =>
                            updateExperience(exp.id, "position", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>

                {/* NGÀNH NGHỀ */}
                <Col lg={8}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Ngành nghề việc làm <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={exp.industry}
                      onChange={(e) =>
                        updateExperience(exp.id, "industry", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Vui lòng chọn
                      </option>
                      <option>IT - Phần mềm</option>
                      <option>Marketing</option>
                      <option>Kinh doanh</option>
                      <option>Tài chính</option>
                      <option>Nhân sự</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* NGÀY BẮT ĐẦU */}
                <Col lg={8}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Ngày Bắt Đầu <span className="text-danger">*</span>
                    </Form.Label>
                    <Row className="g-3">
                      <Col xs={6}>
                        <Form.Select
                          value={exp.startMonth}
                          onChange={(e) =>
                            updateExperience(exp.id, "startMonth", e.target.value)
                          }
                        >
                          <option value="">--</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i + 1}>
                              Tháng {i + 1}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col xs={6}>
                        <Form.Select
                          value={exp.startYear}
                          onChange={(e) =>
                            updateExperience(exp.id, "startYear", e.target.value)
                          }
                        >
                          <option value="">--</option>
                          {Array.from({ length: 30 }, (_, i) => {
                            const year = 2025 - i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>

                {/* NGÀY KẾT THÚC + CÔNG VIỆC HIỆN TẠI */}
                <Col lg={8}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Ngày Kết Thúc <span className="text-danger">*</span>
                    </Form.Label>
                    <Row className="g-3 align-items-center">
                      <Col xs={5}>
                        <Form.Select
                          value={exp.endMonth}
                          onChange={(e) =>
                            updateExperience(exp.id, "endMonth", e.target.value)
                          }
                          disabled={exp.isCurrent}
                        >
                          <option value="">--</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i + 1}>
                              Tháng {i + 1}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>

                      <Col xs={5}>
                        <Form.Select
                          value={exp.endYear}
                          onChange={(e) =>
                            updateExperience(exp.id, "endYear", e.target.value)
                          }
                          disabled={exp.isCurrent}
                        >
                          <option value="">--</option>
                          {Array.from({ length: 30 }, (_, i) => {
                            const year = 2025 - i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Col>

                      <Col xs={2}>
                        <FormCheck
                          type="checkbox"
                          label="Hiện tại"
                          checked={exp.isCurrent}
                          onChange={() => toggleCurrentJob(exp.id)}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>

                {/* MÔ TẢ */}
                <Col lg={8}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Mô tả <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(exp.id, "description", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>

                {/* NÚT XÓA */}
                {idx > 0 && (
                  <Col lg={8}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeExperience(exp.id)}
                    >
                      Xóa kinh nghiệm này
                    </Button>
                  </Col>
                )}
              </Row>

              {idx < experiences.length - 1 && (
                <hr className="my-5" style={{ borderTop: "2px dashed #dee2e6" }} />
              )}
            </div>
          ))}

          {/* NÚT THÊM */}
          <Row className="justify-content-center">
            <Col lg={8}>
              <Button
                variant="link"
                className="text-primary p-0 d-flex align-items-center"
                onClick={addExperience}
              >
                <Plus size={20} className="me-1" /> Thêm kinh nghiệm làm việc
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

      {/* ZALO */}
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
