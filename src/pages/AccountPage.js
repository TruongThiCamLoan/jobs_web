import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Button, Nav, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Person } from "react-bootstrap-icons"; 
import { User, Key, Mail, Edit, Phone, MapPin, Calendar, Clock, CheckCircle, Trash2, Briefcase, FileText, Heart, Bell } from 'lucide-react'; 
import axios from 'axios'; 
import AppNavbar from "../components/Navbar"; 
import { useAuth } from '../context/AuthContext'; 

// =====================================================================
// CẤU HÌNH API
// =====================================================================

// Base URL: Ví dụ http://localhost:8080/api
const API_BASE_URL = "http://localhost:8080/api"; 
// Endpoint cho hồ sơ cá nhân (GET/DELETE)
const PROFILE_API_URL = `${API_BASE_URL}/profile`; 
// Endpoint cho cập nhật hồ sơ bước 1&2 (PATCH/PUT) - Dùng khi triển khai chỉnh sửa
const PROFILE_STEP_1_2_URL = `${PROFILE_API_URL}/step1-2`; 
// URL Placeholder cho Avatar
const DEFAULT_AVATAR_URL = "https://placehold.co/80x80/cccccc/333333?text=TVN"; 

// =====================================================================
// HELPER FUNCTIONS
// =====================================================================

// Hàm định dạng ngày tháng
const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
        const cleanedDateString = dateString.split('T')[0]; 
        const date = new Date(cleanedDateString);
        
        if (isNaN(date)) {
             return new Date(dateString).toLocaleDateString("vi-VN");
        }
        
        return date.toLocaleDateString("vi-VN");
    } catch {
        return dateString;
    }
};

// Component hiển thị thông tin từng hàng
const InfoRow = ({ label, value, icon, onEdit }) => (
    <div className="d-flex align-items-center py-3 border-bottom">
        <Col xs={4} md={3} className="text-muted small d-flex align-items-center">
            {icon && React.createElement(icon, { size: 16, className: "me-2 text-secondary" })}
            {label}
        </Col>
        <Col xs={6} md={7} className="fw-semibold">
            {value || "--"}
            {/* Giả định email đã xác thực nếu có giá trị */}
            {label === "Địa chỉ email" && value && <CheckCircle size={14} className="ms-2 text-success" title="Đã xác thực" />}
        </Col>
        <Col xs={2} md={2} className="text-end">
            {/* RE-ADDING EDIT BUTTON (Currently console logs action) */}
            {/* <Button variant="link" size="sm" onClick={onEdit} className="text-primary fw-semibold p-0">
                <Edit size={14} className="me-1" /> Chỉnh sửa
            </Button> */}
        </Col>
    </div>
);

// =====================================================================
// COMPONENT CHÍNH
// =====================================================================
export default function AccountPage() {
    
    // 💥 SỬ DỤNG useAuth hook để lấy authToken và trạng thái loading
    const { authToken, isAuthenticated, loading: authLoading } = useAuth();
    // ----------------------------------------------------------------------------------

    const [profile, setProfile] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    // 1. Fetch Profile Data (Sử dụng API thật: GET /api/profile)
    const fetchProfile = useCallback(async (token) => {
        
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(PROFILE_API_URL, {
                headers: {
                    // Gửi Token với tiền tố Bearer
                    Authorization: `Bearer ${token}`, 
                }
            });
            
            const apiData = response.data;
            
            // 💡 Ánh xạ dữ liệu từ API Controller (GET /api/profile)
            setProfile({
                fullName: apiData.fullName,
                email: apiData.email,
                gender: apiData.gender,
                dateOfBirth: apiData.dateOfBirth ? formatDate(apiData.dateOfBirth) : null,
                maritalStatus: apiData.maritalStatus,
                phoneNumber: apiData.phone, // Controller trả về 'phone'
                address: apiData.address,
                registrationDate: apiData.createdAt, // Để formatDate xử lý, hoặc dùng ngày đăng ký thật
                avatarUrl: apiData.avatarUrl,
            });
            
        } catch (err) {
            console.error("Failed to fetch profile:", err.response || err);
            const errorMessage = err.response?.data?.message || "Không thể tải thông tin tài khoản.";
            
            // Nếu lỗi 401 hoặc 403, báo lỗi xác thực
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                 setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                 // Tùy chọn: navigate('/login');
            } else {
                 setError(errorMessage);
            }

        } finally {
            setIsLoading(false);
        }
    }, []);

    // 2. Chạy fetchProfile khi authToken thay đổi và có giá trị
    useEffect(() => {
        // Chỉ fetch khi AuthContext đã tải xong (authLoading === false) VÀ có authToken
        if (!authLoading && authToken) {
            fetchProfile(authToken);
        }
        // Nếu authLoading đã xong nhưng không có authToken, hiển thị thông báo Đăng nhập
        else if (!authLoading && !authToken) {
            setIsLoading(false);
            // setError("Vui lòng đăng nhập để xem thông tin tài khoản."); // Báo lỗi sẽ được hiển thị qua JSX
        }
    }, [authToken, fetchProfile, authLoading]);
    
    // Hàm xử lý chỉnh sửa (Sẽ cần Modal/Form và API PATCH/PUT /api/profile/step1-2)
    const handleEdit = (field) => {
        // ✅ FIX LOG URL: Sử dụng hằng số PROFILE_STEP_1_2_URL đã định nghĩa
        console.log(`Kích hoạt Modal để chỉnh sửa trường: ${field}. API PATCH/PUT cần gọi tới: ${PROFILE_STEP_1_2_URL}`);
    };

    // Hàm gọi API xóa tài khoản (DELETE /api/profile)
    const handleDeleteAccount = async () => {
        // ⚠️ Vui lòng thay thế window.confirm() bằng Custom Modal/Dialog
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể hoàn tác.");
        
        if (isConfirmed) {
            setIsLoading(true); 
            setError(null);
            try {
                await axios.delete(PROFILE_API_URL, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, 
                    }
                });
                
                // Xóa token khỏi localStorage sau khi xóa tài khoản thành công
                localStorage.removeItem('userToken'); 

                // ⚠️ Vui lòng thay thế alert() bằng Custom Notification/Toast
                alert("Xóa tài khoản thành công! Đang chuyển hướng về trang đăng nhập.");
                navigate('/login'); 
                
            } catch (err) {
                console.error("Failed to delete account:", err.response || err);
                const errorMessage = err.response?.data?.message || "Lỗi: Không thể xóa tài khoản. Vui lòng liên hệ hỗ trợ.";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
    };


    return (
        <div className="account-page bg-light pt-5 mt-5 min-vh-100">
            {/* -------------------- NAVBAR -------------------- */}
            <AppNavbar />
            <div className="bg-white border-bottom py-0">
                <Container>
                    <Nav className="flex-wrap small gap-5">
                        <Nav.Link as={Link} to="/myjobs" className="text-dark py-1">
                            <Briefcase size={14} className="me-1" /> My Jobs
                        </Nav.Link>
                        <Nav.Link as={Link} to="/resume" className="text-dark py-1">
                            <FileText size={14} className="me-1" /> Hồ sơ xin việc 
                        </Nav.Link>
                        <Nav.Link as={Link} to="/saved-jobs" className="text-dark py-1">
                            <Heart size={14} className="me-1" /> Việc đã lưu 
                        </Nav.Link>
                        <Nav.Link as={Link} to="/applied-jobs" className="text-dark py-1">
                            <Briefcase size={14} className="me-1" /> Việc đã ứng tuyển 
                        </Nav.Link>
                        <Nav.Link as={Link} to="/job-alerts" className="text-dark py-1">
                            <Bell size={14} className="me-1" /> Thông báo việc làm 
                        </Nav.Link>
                        <Nav.Link as={Link} to="/account" className="text-primary fw-semibold border-bottom border-primary border-3 pb-1">
                            <Person className="me-1" /> Tài khoản
                        </Nav.Link>
                    </Nav>
                </Container>
            </div>

            {/* -------------------- MAIN CONTENT -------------------- */}
            <Container className="my-5">
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Row className="g-4">
                    {/* LEFT SIDEBAR */}
                    <Col lg={3}>
                        <Card className="shadow-sm">
                            <Card.Body className="p-0">
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Link as={Link} to="/account" active className="py-2 px-3 fw-bold">
                                        <User size={16} className="me-2" /> Tài khoản
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/account/password" className="py-2 px-3 text-dark">
                                        <Key size={16} className="me-2" /> Đổi mật khẩu
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/account/notifications" className="py-2 px-3 text-dark">
                                        <Mail size={16} className="me-2" /> Thông báo email
                                    </Nav.Link>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* RIGHT CONTENT: TÀI KHOẢN */}
                    <Col lg={9}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-white fw-bold h5">Tài khoản</Card.Header>
                            <Card.Body className="p-4">
                                <p className="text-muted small">Hãy cập nhật thông tin mới nhất.</p>
                                
                                {authLoading || (isLoading && authToken) ? ( 
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-2 text-muted">Đang tải thông tin cá nhân...</p>
                                    </div>
                                ) : !authToken ? ( 
                                    <div className="text-center py-5 bg-light rounded-3">
                                        <Key size={48} className="text-danger mb-3" />
                                        <h4 className="fw-bold text-danger">Truy Cập Bị Hạn Chế</h4>
                                        <p className="text-muted">Bạn cần đăng nhập để xem thông tin chi tiết tài khoản.</p>
                                        <Button 
                                            variant="primary" 
                                            as={Link} 
                                            to="/login" // Thay thế bằng path đăng nhập thật
                                            className="mt-3 fw-semibold"
                                        >
                                            <User size={18} className="me-2" /> Đăng nhập ngay
                                        </Button>
                                    </div>
                                ) : ( // Hiển thị nội dung profile
                                    <>
                                        {/* AVATAR & HEADER */}
                                        <Row className="mb-4 pb-3 border-bottom d-flex align-items-center">
                                            <Col xs={12} md={9} className="d-flex align-items-center">
                                                <img 
                                                    src={profile.avatarUrl || DEFAULT_AVATAR_URL} 
                                                    alt="Avatar" 
                                                    className="rounded-circle me-3 border"
                                                    style={{ width: 80, height: 80, objectFit: 'cover' }}
                                                />
                                                <div>
                                                    <h5 className="fw-bold mb-0">{profile.fullName}</h5>
                                                    <small className="text-muted">(JPEG/PNG/GIF, ≤ 1MB)</small>
                                                </div>
                                            </Col>
                                            <Col xs={12} md={3} className="text-md-end mt-2 mt-md-0">
                                                <Button variant="outline-secondary" size="sm" onClick={() => handleEdit('avatar')}>
                                                    <Edit size={14} className="me-1" /> Chỉnh sửa
                                                </Button>
                                            </Col>
                                        </Row>

                                        {/* CHI TIẾT THÔNG TIN CÁ NHÂN */}
                                        <h6 className="fw-bold mt-4 mb-3">Thông tin cá nhân</h6>
                                        <p className="text-muted small">Thông tin cá nhân dưới đây sẽ tự động điền khi bạn tạo hồ sơ mới.</p>
                                        
                                        <div className="my-4">
                                            <InfoRow label="Họ và tên" value={profile.fullName} icon={User} onEdit={() => handleEdit('fullName')} />
                                            <InfoRow label="Địa chỉ email" value={profile.email} icon={Mail} onEdit={() => handleEdit('email')} />
                                            <InfoRow label="Giới tính" value={profile.gender} icon={null} onEdit={() => handleEdit('gender')} />
                                            <InfoRow label="Ngày sinh" value={profile.dateOfBirth} icon={Calendar} onEdit={() => handleEdit('dateOfBirth')} />
                                            <InfoRow label="Tình trạng hôn nhân" value={profile.maritalStatus} icon={null} onEdit={() => handleEdit('maritalStatus')} />
                                            <InfoRow label="Số điện thoại" value={profile.phoneNumber} icon={Phone} onEdit={() => handleEdit('phoneNumber')} />
                                            <InfoRow label="Địa chỉ" value={profile.address} icon={MapPin} onEdit={() => handleEdit('address')} />
                                            
                                            {/* Ngày đăng ký (Read-only) */}
                                            <div className="d-flex align-items-center py-3 border-bottom">
                                                <Col xs={4} md={3} className="text-muted small d-flex align-items-center">
                                                    <Clock size={16} className="me-2 text-secondary" />
                                                    Ngày đăng ký
                                                </Col>
                                                <Col xs={6} md={7} className="fw-semibold small">
                                                    {formatDate(profile.registrationDate)}
                                                </Col>
                                                <Col xs={2} md={2} className="text-end">
                                                    {/* EMPTY BUTTON SPACE */}
                                                </Col>
                                            </div>
                                        </div>
                                    </>
                                )
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}