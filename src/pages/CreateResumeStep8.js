// src/pages/CreateResumeStep8.js
import React, { useState } from "react";
import { Container, Form, Row, Col, Button, FormCheck } from "react-bootstrap";
import { ArrowLeft, ArrowRight, Plus } from "react-bootstrap-icons";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

export default function CreateResumeStep8() {
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

  // Dữ liệu form
  const [formData, setFormData] = useState({
    desiredPosition: "",
    recentSalary: "",
    recentCurrency: "VND",
    desiredSalaryFrom: "",
    desiredSalaryTo: "",
    desiredCurrency: "VND",
    jobType: "",
    jobLevel: "",
    industries: [""],
    preferredLocations: [""],
    careerGoal: "",
  });

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const addIndustry = () => {
    setFormData({ ...formData, industries: [...formData.industries, ""] });
  };

  const removeIndustry = (index) => {
    setFormData({
      ...formData,
      industries: formData.industries.filter((_, i) => i !== index),
    });
  };

  const updateIndustry = (index, value) => {
    const newIndustries = [...formData.industries];
    newIndustries[index] = value;
    setFormData({ ...formData, industries: newIndustries });
  };

  const addLocation = () => {
    setFormData({ ...formData, preferredLocations: [...formData.preferredLocations, ""] });
  };

  const removeLocation = (index) => {
    setFormData({
      ...formData,
      preferredLocations: formData.preferredLocations.filter((_, i) => i !== index),
    });
  };

  const updateLocation = (index, value) => {
    const newLocations = [...formData.preferredLocations];
    newLocations[index] = value;
    setFormData({ ...formData, preferredLocations: newLocations });
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
                    index === 7 ? "bg-primary text-white" : "bg-light text-muted"
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
        <h4 className="text-center fw-bold mb-5">Mục tiêu nghề nghiệp</h4>

        <Form>
          <Row className="g-4 justify-content-center">
            {/* VỊ TRÍ MONG MUỐN */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Vị trí mong muốn <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={formData.desiredPosition}
                  onChange={(e) => updateField("desiredPosition", e.target.value)}
                />
              </Form.Group>
            </Col>

            {/* MỨC LƯƠNG GẦN ĐÂY NHẤT */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">Mức lương gần đây nhất</Form.Label>
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={formData.recentSalary}
                    onChange={(e) => updateField("recentSalary", e.target.value)}
                  />
                  <FormCheck
                    type="radio"
                    label="VND"
                    name="recentCurrency"
                    checked={formData.recentCurrency === "VND"}
                    onChange={() => updateField("recentCurrency", "VND")}
                  />
                  <FormCheck
                    type="radio"
                    label="USD"
                    name="recentCurrency"
                    checked={formData.recentCurrency === "USD"}
                    onChange={() => updateField("recentCurrency", "USD")}
                  />
                </div>
              </Form.Group>
            </Col>

            {/* MỨC LƯƠNG MONG MUỐN */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Mức lương mong muốn <span className="text-danger">*</span>
                </Form.Label>
                <Row className="g-3 align-items-center">
                  <Col xs={4}>
                    <Form.Select
                      value={formData.desiredSalaryFrom}
                      onChange={(e) => updateField("desiredSalaryFrom", e.target.value)}
                    >
                      <option value="">Nhập</option>
                      <option>10</option>
                      <option>15</option>
                      <option>20</option>
                    </Form.Select>
                  </Col>
                  <Col xs={4}>
                    <Form.Control
                      type="text"
                      placeholder="Từ *"
                      value={formData.desiredSalaryFrom}
                      onChange={(e) => updateField("desiredSalaryFrom", e.target.value)}
                    />
                  </Col>
                  <Col xs={4}>
                    <Form.Control
                      type="text"
                      placeholder="Đến"
                      value={formData.desiredSalaryTo}
                      onChange={(e) => updateField("desiredSalaryTo", e.target.value)}
                    />
                  </Col>
                  <Col xs={12} className="mt-2">
                    <FormCheck
                      inline
                      type="radio"
                      label="VND"
                      name="desiredCurrency"
                      checked={formData.desiredCurrency === "VND"}
                      onChange={() => updateField("desiredCurrency", "VND")}
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="USD"
                      name="desiredCurrency"
                      checked={formData.desiredCurrency === "USD"}
                      onChange={() => updateField("desiredCurrency", "USD")}
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Col>

            {/* LOẠI CÔNG VIỆC */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Loại công việc <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.jobType}
                  onChange={(e) => updateField("jobType", e.target.value)}
                >
                  <option value="">...</option>
                  <option>Toàn thời gian</option>
                  <option>Bán thời gian</option>
                  <option>Làm việc từ xa</option>
                  <option>Thực tập</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* CẤP BẬC MONG MUỐN */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Cấp bậc mong muốn <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.jobLevel}
                  onChange={(e) => updateField("jobLevel", e.target.value)}
                >
                  <option value="">...</option>
                  <option>Nhân viên</option>
                  <option>Trưởng nhóm</option>
                  <option>Quản lý</option>
                  <option>Giám đốc</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* NGÀNH NGHỀ MONG MUỐN */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Ngành nghề mong muốn <span className="text-danger">*</span>
                </Form.Label>
                {formData.industries.map((industry, index) => (
                  <Row key={index} className="g-2 mb-2 align-items-center">
                    <Col>
                      <Form.Select
                        value={industry}
                        onChange={(e) => updateIndustry(index, e.target.value)}
                      >
                        <option value="">Vui lòng chọn</option>
                        <option>IT - Phần mềm</option>
                        <option>Marketing</option>
                        <option>Kinh doanh</option>
                      </Form.Select>
                    </Col>
                    {index > 0 && (
                      <Col xs="auto">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeIndustry(index)}
                        >
                          Xóa
                        </Button>
                      </Col>
                    )}
                  </Row>
                ))}
                <Button
                  variant="link"
                  className="text-primary p-0 d-flex align-items-center"
                  onClick={addIndustry}
                >
                  <Plus size={20} className="me-1" /> Thêm ngành nghề
                </Button>
              </Form.Group>
            </Col>

            {/* NƠI LÀM VIỆC ƯA THÍCH */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Nơi làm việc ưa thích <span className="text-danger">*</span>
                </Form.Label>
                {formData.preferredLocations.map((location, index) => (
                  <Row key={index} className="g-2 mb-2 align-items-center">
                    <Col md={6}>
                      <Form.Select
                        value={location}
                        onChange={(e) => updateLocation(index, e.target.value)}
                      >
                        <option value="">Vui lòng chọn</option>
                        <option>Hà Nội</option>
                        <option>TP. Hồ Chí Minh</option>
                        <option>Đà Nẵng</option>
                      </Form.Select>
                    </Col>
                    <Col md={6}>
                      <Form.Select>
                        <option>Tất cả quận/huyện</option>
                      </Form.Select>
                    </Col>
                    {index > 0 && (
                      <Col xs="auto">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeLocation(index)}
                        >
                          Xóa
                        </Button>
                      </Col>
                    )}
                  </Row>
                ))}
                <Button
                  variant="link"
                  className="text-primary p-0 d-flex align-items-center"
                  onClick={addLocation}
                >
                  <Plus size={20} className="me-1" /> Thêm nơi làm việc
                </Button>
              </Form.Group>
            </Col>

            {/* MỤC TIÊU NGHỀ NGHIỆP */}
            <Col lg={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Mục tiêu nghề nghiệp <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder=""
                  value={formData.careerGoal}
                  onChange={(e) => updateField("careerGoal", e.target.value)}
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
