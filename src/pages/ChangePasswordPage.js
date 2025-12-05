import React, { useState } from "react";
import { Container, Row, Col, Card, Nav, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Person } from "react-bootstrap-icons"; 
import { User, Key, Mail, Edit, Phone, MapPin, Calendar, Clock, CheckCircle, Trash2, Briefcase, FileText, Heart, Bell, Eye, EyeOff } from 'lucide-react'; // 👈 IMPORT Eye and EyeOff
import axios from 'axios';
import AppNavbar from "../components/Navbar"; 

// 💥 IMPORT useAuth hook
import { useAuth } from '../context/AuthContext'; 

// =====================================================================
// CẤU HÌNH API
// =====================================================================

// Thay thế bằng Base URL Backend của bạn
const API_BASE_URL = "http://localhost:8080/api"; 
// Endpoint ĐỔI MẬT KHẨU
const CHANGE_PASSWORD_API_URL = `${API_BASE_URL}/auth/change-password`; 

// Component Sidebar menu (Giữ nguyên)
const AccountSidebar = ({ activeKey }) => (
    <Card className="shadow-sm">
        <Card.Body className="p-0">
            <Nav variant="pills" className="flex-column">
                <Nav.Link as={Link} to="/account" active={activeKey === 'account'} className={`py-2 px-3 ${activeKey === 'account' ? 'fw-bold' : 'text-dark'}`}>
                    <User size={16} className="me-2" /> Tài khoản
                </Nav.Link>
                <Nav.Link as={Link} to="/account/password" active={activeKey === 'password'} className={`py-2 px-3 ${activeKey === 'password' ? 'fw-bold' : 'text-dark'}`}>
                    <Key size={16} className="me-2" /> Đổi mật khẩu
                </Nav.Link>
                <Nav.Link as={Link} to="/account/notifications" active={activeKey === 'notifications'} className={`py-2 px-3 ${activeKey === 'notifications' ? 'fw-bold' : 'text-dark'}`}>
                    <Mail size={16} className="me-2" /> Thông báo email
                </Nav.Link>
            </Nav>
        </Card.Body>
    </Card>
);

export default function ChangePasswordPage() {
    // 💥 SỬ DỤNG useAuth để lấy token và các hàm
    const { authToken, logout } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    // State để điều khiển việc hiển thị mật khẩu
    const [showPassword, setShowPassword] = useState(false); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const { currentPassword, newPassword, confirmNewPassword } = formData;
        
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setMessage({ type: 'danger', text: 'Vui lòng điền đầy đủ tất cả các trường.' });
            return false;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'danger', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
            return false;
        }

        if (newPassword !== confirmNewPassword) {
            setMessage({ type: 'danger', text: 'Mật khẩu mới và Gõ lại mật khẩu mới không khớp.' });
            return false;
        }
        
        if (newPassword === currentPassword) {
            setMessage({ type: 'danger', text: 'Mật khẩu mới phải khác mật khẩu hiện tại.' });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!validateForm()) {
            return;
        }
        
        if (!authToken) {
            setMessage({ type: 'danger', text: 'Lỗi xác thực: Không tìm thấy Token.' });
            return;
        }

        setIsLoading(true);

        // --- BẮT ĐẦU API CALL ĐỔI MẬT KHẨU THẬT ---
        try {
            const response = await axios.post(CHANGE_PASSWORD_API_URL, 
                {
                    // Backend Controller của bạn cần đọc: oldPassword (currentPassword) và newPassword
                    oldPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            // API thành công (Thường trả về status 200 hoặc 204)
            setMessage({ type: 'success', text: response.data.message || 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.' });
            
            // Xóa dữ liệu form
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });

            // Sau khi đổi mật khẩu thành công, yêu cầu người dùng đăng nhập lại (logout)
            setTimeout(() => {
                logout(); // Xóa token hiện tại
                navigate('/login'); // Chuyển hướng
            }, 2000); 

        } catch (err) {
            console.error("Change password failed:", err.response || err);
            
            let errorText = 'Đã xảy ra lỗi trong quá trình cập nhật mật khẩu.';
            if (err.response) {
                // Xử lý các lỗi HTTP cụ thể
                if (err.response.status === 401 || err.response.status === 403) {
                     errorText = 'Mật khẩu hiện tại không đúng hoặc phiên đăng nhập đã hết hạn.';
                } else if (err.response.data && err.response.data.message) {
                    errorText = err.response.data.message;
                }
            }
            setMessage({ type: 'danger', text: errorText });

        } finally {
            setIsLoading(false);
        }
        // --- KẾT THÚC API CALL THẬT ---
    };

    // Hàm Toggle Password
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    // Kiểm tra nếu chưa đăng nhập, hiển thị hộp thoại đăng nhập ngay lập tức
    if (!authToken) {
        return (
             <div className="account-page bg-light pt-5 mt-5 min-vh-100">
                <AppNavbar />
                <Container className="my-5">
                    <Row className="justify-content-center">
                        <Col lg={9}>
                            <Card className="shadow-sm">
                                <Card.Header className="bg-white fw-bold h5">Thay đổi mật khẩu</Card.Header>
                                <Card.Body className="p-4">
                                    <div className="text-center py-5 bg-light rounded-3">
                                        <Key size={48} className="text-danger mb-3" />
                                        <h4 className="fw-bold text-danger">Yêu cầu Xác thực</h4>
                                        <p className="text-muted">Bạn cần đăng nhập để thay đổi mật khẩu.</p>
                                        <Button 
                                            variant="primary" 
                                            as={Link} 
                                            to="/login"
                                            className="mt-3 fw-semibold"
                                        >
                                            <User size={18} className="me-2" /> Đăng nhập
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
    
    return (
        <div className="account-page bg-light pt-5 mt-5 min-vh-100">
            <AppNavbar />
                <div className="bg-white border-bottom py-0">
                <Container>
                    {/* NAV LINK MENU */}
                    <Nav className="flex-wrap small gap-5">
                        <Nav.Link as={Link} to="/myjobs" className="text-dark py-1">
                            <Briefcase size={14} className="me-1" /> My Jobs
                        </Nav.Link>
                        <Nav.Link as={Link} to="/resume" className="text-dark py-1">
                            <FileText size={14} className="me-1" /> Hồ sơ xin việc (0)
                        </Nav.Link>
                        <Nav.Link as={Link} to="/saved-jobs" className="text-dark py-1">
                            <Heart size={14} className="me-1" /> Việc đã lưu (0)
                        </Nav.Link>
                        <Nav.Link as={Link} to="/applied-jobs" className="text-dark py-1">
                            <Briefcase size={14} className="me-1" /> Việc đã ứng tuyển (0)
                        </Nav.Link>
                        <Nav.Link as={Link} to="/job-alerts" className="text-dark py-1">
                            <Bell size={14} className="me-1" /> Thông báo việc làm (0)
                        </Nav.Link>
                        <Nav.Link as={Link} to="/account" className="text-primary fw-semibold border-bottom border-primary border-3 pb-1">
                            <Person className="me-1" /> Tài khoản
                        </Nav.Link>
                    </Nav>
                </Container>
            </div>

            <Container className="my-5">
                <Row className="g-4">
                    {/* LEFT SIDEBAR */}
                    <Col lg={3}>
                        <AccountSidebar activeKey="password" />
                    </Col>
                    
                    {/* RIGHT CONTENT: ĐỔI MẬT KHẨU */}
                    <Col lg={9}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-white fw-bold h5">Thay đổi mật khẩu</Card.Header>
                            <Card.Body className="p-4">
                                <p className="text-muted small">Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn.</p>

                                {message.text && <Alert variant={message.type}>{message.text}</Alert>}

                                <Form onSubmit={handleSubmit}>
                                    
                                    {/* Mật khẩu hiện tại */}
                                    <Form.Group className="mb-4" controlId="currentPassword">
                                        <Form.Label className="fw-semibold small">Mật khẩu hiện tại *</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type="password" // Luôn để type là password để trình duyệt không lưu
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleChange}
                                                required
                                                placeholder="••••••••"
                                            />
                                            {/* Nút Quên mật khẩu */}
                                            <Link to="/forgot-password" className="position-absolute top-50 end-0 translate-middle-y me-3 small text-decoration-none">
                                                Quên mật khẩu?
                                            </Link>
                                        </div>
                                    </Form.Group>
                                    
                                    {/* Mật khẩu mới */}
                                    <Form.Group className="mb-4" controlId="newPassword">
                                        <Form.Label className="fw-semibold small">Mật khẩu mới *</Form.Label>
                                        <div className="position-relative"> 
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                required
                                                placeholder="Nhập mật khẩu mới"
                                                minLength={6}
                                            />
                                            {/* Toggle Icon */}
                                            <Button 
                                                variant="link" 
                                                className="position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-secondary"
                                                onClick={togglePasswordVisibility}
                                                aria-label="Toggle password visibility"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </Button>
                                        </div>
                                    </Form.Group>
                                    
                                    {/* Gõ lại mật khẩu mới */}
                                    <Form.Group className="mb-4" controlId="confirmNewPassword">
                                        <Form.Label className="fw-semibold small">Gõ lại mật khẩu mới *</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                name="confirmNewPassword"
                                                value={formData.confirmNewPassword}
                                                onChange={handleChange}
                                                required
                                                placeholder="Xác nhận mật khẩu mới"
                                                minLength={6}
                                            />
                                            {/* Toggle Icon */}
                                            <Button 
                                                variant="link" 
                                                className="position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-secondary"
                                                onClick={togglePasswordVisibility}
                                                aria-label="Toggle password visibility"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    {/* Xóa checkbox hiển thị mật khẩu thừa */}

                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="fw-bold"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    className="me-2"
                                                />
                                                Đang cập nhật...
                                            </>
                                        ) : 'Cập nhật mật khẩu'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}