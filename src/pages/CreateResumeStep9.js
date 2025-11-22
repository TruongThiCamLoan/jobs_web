// src/pages/CreateResumeStep9.js
import React, { useState } from "react";
import { Container, Form, Row, Col, Button, Card } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

export default function CreateResumeStep9() {
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

  const [allowSearch, setAllowSearch] = useState(true);

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
                    index === 8 ? "bg-primary text-white" : "bg-light text-muted"
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
        <h4 className="text-center fw-bold mb-5">Trạng thái hồ sơ</h4>

        <Form>
          <Row className="g-4 justify-content-center">
            {/* CHO PHÉP TÌM KIẾM */}
            <Col lg={8}>
              <Card
                className={`cursor-pointer ${allowSearch ? "border-primary shadow-sm" : "border-light"}`}
                onClick={() => setAllowSearch(true)}
              >
                <Card.Body className="d-flex align-items-start">
                  <Form.Check
                    type="radio"
                    id="allow-search"
                    checked={allowSearch}
                    onChange={() => setAllowSearch(true)}
                    className="me-3 mt-1"
                  />
                  <div>
                    <strong className="d-block">Cho phép tìm kiếm</strong>
                    <p className="text-muted small mb-0">
                      Nhà tuyển dụng có thể tìm thấy hồ sơ của bạn trong kho hồ sơ. 
                      Chi tiết liên lạc (ví dụ: email, tên) chỉ hiển thị trong mỗi sơ yếu lý lịch 
                      và không thể tìm kiếm bởi nhà tuyển dụng.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* KHÔNG CHO PHÉP TÌM KIẾM */}
            <Col lg={8}>
              <Card
                className={`cursor-pointer mt-3 ${!allowSearch ? "border-primary shadow-sm" : "border-light"}`}
                onClick={() => setAllowSearch(false)}
              >
                <Card.Body className="d-flex align-items-start">
                  <Form.Check
                    type="radio"
                    id="deny-search"
                    checked={!allowSearch}
                    onChange={() => setAllowSearch(false)}
                    className="me-3 mt-1"
                  />
                  <div>
                    <strong className="d-block">Không cho phép tìm kiếm</strong>
                    <p className="text-muted small mb-0">
                      Sơ yếu lý lịch của bạn sẽ không được hiển thị trong mục tìm kiếm tài năng 
                      của nhà tuyển dụng.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* NÚT ĐIỀU HƯỚNG */}
          <div className="text-center mt-5 d-flex justify-content-center gap-3">
            <Button variant="outline-primary">
              <ArrowLeft className="me-1" /> Quay lại
            </Button>
            <Button variant="primary">
              Lưu tìm kiếm
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
