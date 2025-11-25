// src/pages/EmployerRegister.js
import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/Navbar";

export default function EmployerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    console.log("🏢 Dữ liệu đăng ký nhà tuyển dụng:", formData);

    alert("Đăng ký thành công!");
    navigate("/employer");
  };

  return (
    <div>
      <AppNavbar />

      <Container className="py-5" style={{ maxWidth: "650px" }}>
        <Card className="shadow border-0">
          <Card.Body className="p-4">
            <h3 className="fw-bold text-center mb-4">Đăng ký Nhà Tuyển Dụng</h3>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên công ty</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ví dụ: Công Ty TNHH ABC"
                  name="companyName"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email liên hệ</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email công ty"
                  name="email"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="SĐT công ty"
                  name="phone"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Địa chỉ doanh nghiệp"
                  name="address"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu"
                  name="password"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nhập lại mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  name="confirmPassword"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                className="w-100 py-2"
                type="submit"
              >
                Đăng ký nhà tuyển dụng
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
