import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Button, Nav, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Person } from "react-bootstrap-icons"; 
import { User, Key, Mail, Edit, Phone, MapPin, Calendar, Clock, CheckCircle, Trash2, Briefcase, FileText, Heart, Bell } from 'lucide-react'; 

// --- ĐÃ LOẠI BỎ ĐỊNH NGHĨA NAVBAR GIẢ ĐỊNH ---
import AppNavbar from "../components/Navbar"; 

// URL Placeholder cho Avatar
const DEFAULT_AVATAR_URL = "https://placehold.co/80x80/cccccc/333333?text=TVN"; 

// Hàm định dạng ngày tháng
const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    } catch {
        return null;
    }
};

// Dữ liệu giả lập cho Profile (Cần thay thế bằng useAuth hook hoặc API call thật)
const MOCK_PROFILE_DATA = {
    fullName: "Truong Vo Nhut",
    email: "vntruongcritt2211034@student.ctuet.edu.vn",
    gender: "Nam",
    dateOfBirth: "2000-01-01",
    maritalStatus: "Độc thân",
    phoneNumber: "0705002189",
    address: "Cần Thơ, Việt Nam",
    registrationDate: "2025-10-27T10:00:00Z",
    avatarUrl: null
};


// Component hiển thị thông tin từng hàng
const InfoRow = ({ label, value, icon, link, onEdit }) => (
    <div className="d-flex align-items-center py-3 border-bottom">
        <Col xs={4} md={3} className="text-muted small d-flex align-items-center">
            {icon && React.createElement(icon, { size: 16, className: "me-2 text-secondary" })}
            {label}
        </Col>
        <Col xs={6} md={7} className="fw-semibold">
            {value || "--"}
            {label === "Địa chỉ email" && <CheckCircle size={14} className="ms-2 text-success" title="Đã xác thực" />}
        </Col>
        <Col xs={2} md={2} className="text-end">
            <Button variant="link" size="sm" onClick={onEdit} className="text-primary fw-semibold p-0">
                <Edit size={14} className="me-1" /> Chỉnh sửa
            </Button>
        </Col>
    </div>
);

// Component chính
export default function AccountPage() {
    // Giả định dùng useAuth hoặc Context để lấy authToken và userId
    // const { authToken, userId } = useAuth();
    const [profile, setProfile] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 1. Fetch Profile Data (Mock/Thật)
    const fetchProfile = useCallback(async () => {
        // --- THAY THẾ BẰNG AXIOS GET THẬT TẠI ĐÂY ---
        
        setIsLoading(true);
        setError(null);
        
        try {
             // Giả lập độ trễ API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // GIẢ LẬP KẾT QUẢ API THÀNH CÔNG
            setProfile({
                ...MOCK_PROFILE_DATA,
                // Định dạng lại ngày sinh
                dateOfBirth: formatDate(MOCK_PROFILE_DATA.dateOfBirth)
            });
            
        } catch (err) {
            console.error("Failed to fetch profile:", err);
            setError("Không thể tải thông tin tài khoản.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);
    
    // Hàm giả lập chỉnh sửa (Sẽ cần API PUT/PATCH thật)
    const handleEdit = (field) => {
        console.log(`Bắt đầu chỉnh sửa trường: ${field}. Cần chuyển đến Modal hoặc Form tương ứng.`);
    };
    
    // ĐÃ SỬA: Loại bỏ confirm() và thay bằng logic Console.log/Placeholder
    const handleDeleteAccount = () => {
        // NOTE: Vui lòng thay thế logic này bằng việc hiển thị Custom Modal xác nhận.
        console.log("--- BƯỚC 1: HIỂN THỊ MODAL XÁC NHẬN ---");
        
        // Giả lập rằng người dùng đã xác nhận trong modal
        const userConfirmed = true; 
        
        if (userConfirmed) {
             console.log("Thao tác xóa tài khoản đang được tiến hành. Cần gọi API DELETE thật.");
             // Thêm logic gọi API DELETE /api/account ở đây.
             // navigate('/logout'); // Chuyển hướng sau khi xóa thành công
        }
    };


    return (
        <div className="account-page bg-light pt-5 mt-5 min-vh-100">
            <AppNavbar />
               <div className="bg-white border-bottom py-0">
                <Container>
                    {/* THÊM GAP-3 ĐỂ CÁC MỤC GẦN NHAU HƠN */}
                    <Nav className="flex-wrap small gap-5">
                        {/* 1. MY CAREERLINK */}
                        <Nav.Link as={Link} to="/myjobs" className="text-dark py-1">
                            <Briefcase size={14} className="me-1" /> My CareerLink
                        </Nav.Link>
                        
                        {/* 2. HỒ SƠ XIN VIỆC (ĐANG ACTIVE LÀ MỤC CON: Tải hồ sơ lên) */}
                        <Nav.Link as={Link} to="/resume" className="text-dark py-1">
                            <FileText size={14} className="me-1" /> Hồ sơ xin việc (0)
                        </Nav.Link>

                        {/* 3. VIỆC ĐÃ LƯU */}
                        <Nav.Link as={Link} to="/saved-jobs" className="text-dark py-1">
                            <Heart size={14} className="me-1" /> Việc đã lưu (0)
                        </Nav.Link>
                        
                        {/* 4. VIỆC ĐÃ ỨNG TUYỂN */}
                        <Nav.Link as={Link} to="/applied-jobs" className="text-dark py-1">
                            <Briefcase size={14} className="me-1" /> Việc đã ứng tuyển (0)
                        </Nav.Link>
                        
                         {/* 5. THÔNG BÁO VIỆC LÀM */}
                        <Nav.Link as={Link} to="/job-alerts" className="text-dark py-1">
                            <Bell size={14} className="me-1" /> Thông báo việc làm (0)
                        </Nav.Link>
                        
                         {/* 6. TÀI KHOẢN */}
                        <Nav.Link as={Link} to="/account" className="text-primary fw-semibold border-bottom border-primary border-3 pb-1">
                             <Person className="me-1" /> Tài khoản
                        </Nav.Link>
                        
                    </Nav>
                </Container>
            </div>


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
                                
                                {isLoading ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-2 text-muted">Đang tải thông tin cá nhân...</p>
                                    </div>
                                ) : (
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
                                            <InfoRow label="Giới tính" value={profile.gender} onEdit={() => handleEdit('gender')} />
                                            <InfoRow label="Ngày sinh" value={profile.dateOfBirth} icon={Calendar} onEdit={() => handleEdit('dateOfBirth')} />
                                            <InfoRow label="Tình trạng hôn nhân" value={profile.maritalStatus} onEdit={() => handleEdit('maritalStatus')} />
                                            <InfoRow label="Số điện thoại" value={profile.phoneNumber} icon={Phone} onEdit={() => handleEdit('phoneNumber')} />
                                            <InfoRow label="Địa chỉ" value={profile.address} icon={MapPin} onEdit={() => handleEdit('address')} />
                                            
                                            {/* Ngày đăng ký (Read-only) */}
                                            <div className="d-flex align-items-center py-3 border-bottom">
                                                <Col xs={4} md={3} className="text-muted small d-flex align-items-center">
                                                    <Clock size={16} className="me-2 text-secondary" />
                                                    Ngày đăng ký
                                                </Col>
                                                <Col xs={6} md={7} className="fw-semibold small">
                                                    {formatDate(MOCK_PROFILE_DATA.registrationDate)}
                                                </Col>
                                                <Col xs={2} md={2} className="text-end">
                                                    {/* EMPTY BUTTON SPACE */}
                                                </Col>
                                            </div>
                                        </div>

                                        {/* NÚT XÓA TÀI KHOẢN */}
                                        <div className="mt-5 pt-3">
                                            <Button 
                                                variant="outline-danger" 
                                                className="fw-semibold" 
                                                onClick={handleDeleteAccount}
                                            >
                                                <Trash2 size={16} className="me-2" /> Xóa tài khoản
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}