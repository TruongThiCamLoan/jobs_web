// src/pages/CreateResumeStep6.js
import React, { useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { ArrowLeft, ArrowRight, Plus } from "react-bootstrap-icons";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

export default function CreateResumeStep6() {
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

  // Danh sách người tham khảo
  const [references, setReferences] = useState([
    {
      id: 1,
      relationship: "",
      name: "",
      position: "",
      phone: "",
      email: "",
      notes: "",
    },
  ]);

  const addReference = () => {
    setReferences([
      ...references,
      {
        id: Date.now(),
        relationship: "",
        name: "",
        position: "",
        phone: "",
        email: "",
        notes: "",
      },
    ]);
  };

  const removeReference = (id) => {
    setReferences(references.filter((ref) => ref.id !== id));
  };

  const updateReference = (id, field, value) => {
    setReferences(
      references.map((ref) =>
        ref.id === id ? { ...ref, [field]: value } : ref
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
                    index === 5 ? "bg-primary text-white" : "bg-light text-muted"
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
        <h4 className="text-center fw-bold mb-2">Người tham khảo</h4>
        <p className="text-center text-muted small mb-5">(Không bắt buộc)</p>

        <Form>
          {references.map((ref, idx) => (
            <div key={ref.id} className="mb-5">
              <Row className="g-4 justify-content-center">
                {/* MỐI QUAN HỆ */}
                <Col lg={8}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Mối quan hệ <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      className="highlight-select"
                      value={ref.relationship}
                      onChange={(e) =>
                        updateReference(ref.id, "relationship", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Vui lòng chọn
                      </option>
                      <option>Quản lý cũ</option>
                      <option>Đồng nghiệp</option>
                      <option>Giảng viên</option>
                      <option>Khách hàng</option>
                      <option>Đối tác</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* TÊN + CHỨC DANH */}
                <Col lg={8}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Tên <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder=""
                          value={ref.name}
                          onChange={(e) =>
                            updateReference(ref.id, "name", e.target.value)
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
                          placeholder=""
                          value={ref.position}
                          onChange={(e) =>
                            updateReference(ref.id, "position", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>

                {/* ĐIỆN THOẠI */}
                <Col lg={8}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Điện thoại</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={ref.phone}
                      onChange={(e) =>
                        updateReference(ref.id, "phone", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>

                {/* EMAIL */}
                <Col lg={8}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">E-mail</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder=""
                      value={ref.email}
                      onChange={(e) =>
                        updateReference(ref.id, "email", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>

                {/* THÔNG TIN LIÊN QUAN */}
                <Col lg={8}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Thông tin liên quan
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder=""
                      value={ref.notes}
                      onChange={(e) =>
                        updateReference(ref.id, "notes", e.target.value)
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
                      onClick={() => removeReference(ref.id)}
                    >
                      Xóa người tham khảo này
                    </Button>
                  </Col>
                )}
              </Row>

              {/* PHÂN CÁCH */}
              {idx < references.length - 1 && (
                <hr className="my-5" style={{ borderTop: "2px dashed #dee2e6" }} />
              )}
            </div>
          ))}

          {/* NÚT THÊM NGƯỜI THAM KHẢO */}
          <Row className="justify-content-center">
            <Col lg={8}>
              <Button
                variant="link"
                className="text-primary p-0 d-flex align-items-center"
                onClick={addReference}
              >
                <Plus size={20} className="me-1" /> Thêm người tham khảo
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
