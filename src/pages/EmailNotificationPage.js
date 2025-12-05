import React, { useState, useCallback, useEffect } from "react";
import { Container, Row, Col, Card, Nav, Form, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Person } from "react-bootstrap-icons"; 
import { User, Key, Mail, Bell, Activity,FileText, Heart, Briefcase, Eye } from 'lucide-react'; 
import AppNavbar from "../components/Navbar"; 

// Dữ liệu giả lập (Thực tế nên lấy từ API)
const MOCK_EMAIL = "tranhaanh553@gmail.com";
const MOCK_SETTINGS = {
    criticalActivity: true, // Hoạt động quan trọng
    jobAlerts: true,        // Bản tin việc làm
    profileViews: true,     // Lượt xem hồ sơ
    careerlinkReminders: true // Nhắc nhở từ CareerLink
};

// Component Sidebar menu (copy từ AccountPage để đảm bảo đồng bộ)
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

// Component cho từng mục thông báo
const NotificationToggle = ({ id, label, description, icon: Icon, isChecked, onChange, disabled }) => (
    <div className="py-3 border-bottom d-flex align-items-start">
        <div className="me-3 mt-1">
            {Icon && <Icon size={20} className="text-primary" />}
        </div>
        <div className="flex-grow-1">
            <h6 className="mb-1 fw-semibold">{label}</h6>
            <p className="text-muted small mb-0">{description}</p>
        </div>
        <Form.Check 
            type="switch"
            id={id}
            checked={isChecked}
            onChange={() => onChange(id)}
            disabled={disabled}
            className="ms-3"
            style={{ transform: 'scale(1.2)' }}
        />
    </div>
);


export default function EmailNotificationPage() {
    const [settings, setSettings] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    
    // 1. Fetch initial settings (Mock/Thật)
    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Giả lập độ trễ API
            await new Promise(resolve => setTimeout(resolve, 500));
            setSettings(MOCK_SETTINGS);
        } catch (err) {
            setError("Không thể tải cài đặt thông báo.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // 2. Handle toggle change (Mock API call)
    const handleToggle = async (id) => {
        if (isSaving) return;

        // Cập nhật trạng thái hiển thị ngay lập tức (Optimistic Update)
        const newSettings = { ...settings, [id]: !settings[id] };
        setSettings(newSettings);
        
        setIsSaving(true);
        setSuccessMessage('');
        setError(null);

        // --- BẮT ĐẦU GIẢ LẬP API CALL CẬP NHẬT THIẾT LẬP ---
        try {
            // Giả lập độ trễ API
            await new Promise(resolve => setTimeout(resolve, 800)); 
            
            // GIẢ LẬP KẾT QUẢ API THÀNH CÔNG
            setSuccessMessage('Cài đặt thông báo đã được cập nhật thành công.');
            
            // Nếu có lỗi API, bạn sẽ thực hiện rollback ở đây: setSettings(settings cũ)
            // Ví dụ: if (response.status !== 200) { setSettings(settings); setError('Lỗi khi lưu.'); }

        } catch (err) {
            console.error("Failed to save settings:", err);
            setError('Đã xảy ra lỗi khi lưu cài đặt.');
            // Rollback trạng thái nếu API thất bại
            setSettings(settings); 
        } finally {
            setIsSaving(false);
            // Tự động xóa thông báo thành công sau 3 giây
            setTimeout(() => setSuccessMessage(''), 3000);
        }
        // --- KẾT THÚC GIẢ LẬP API CALL ---
    };

return (
        <div className="account-page bg-light pt-5 mt-5 min-vh-100">
            <AppNavbar />
               <div className="bg-white border-bottom py-0">
                <Container>
                    {/* THÊM GAP-3 ĐỂ CÁC MỤC GẦN NHAU HƠN */}
                    <Nav className="flex-wrap small gap-5">
                        {/* 1. My Jobs */}
                        <Nav.Link as={Link} to="/myjobs" className="text-dark py-1">
                            <Briefcase size={14} className="me-1" /> My Jobs
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
                <Row className="g-4">
                    {/* LEFT SIDEBAR */}
                    <Col lg={3}>
                        <AccountSidebar activeKey="notifications" />
                    </Col>
                    
                    {/* RIGHT CONTENT: THÔNG BÁO EMAIL */}
                    <Col lg={9}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-white fw-bold h5">Thông báo email</Card.Header>
                            <Card.Body className="p-4">
                                <p className="text-muted small">Thông báo được gửi tới email **{MOCK_EMAIL}**</p>
                                
                                <hr />

                                {error && <Alert variant="danger">{error}</Alert>}
                                {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}

                                {isSaving && (
                                     <Alert variant="info" className="d-flex align-items-center mb-4">
                                         <Spinner animation="border" size="sm" className="me-2" /> Đang lưu cài đặt...
                                     </Alert>
                                )}

                                {isLoading ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-2 text-muted">Đang tải cài đặt thông báo...</p>
                                    </div>
                                ) : (
                                    <div className="my-4">
                                        {/* 1. Hoạt động quan trọng */}
                                        <NotificationToggle
                                            id="criticalActivity"
                                            label="Hoạt động quan trọng"
                                            description="Bạn không thể ngừng đăng ký email cho các hoạt động quan trọng: thông báo tin nhắn mới từ nhà tuyển dụng, xác nhận tài khoản..."
                                            icon={Activity}
                                            isChecked={settings.criticalActivity}
                                            onChange={handleToggle}
                                            // Theo hình ảnh, nút này đang ở trạng thái Bật và không có vẻ chỉnh sửa được
                                            disabled={true} 
                                        />

                                        {/* 2. Bản tin việc làm */}
                                        <NotificationToggle
                                            id="jobAlerts"
                                            label="Bản tin việc làm"
                                            description="Nhận các bản tin mới nhất về Cẩm nang việc làm và các cơ hội nghề nghiệp phù hợp với hồ sơ của bạn."
                                            icon={Briefcase}
                                            isChecked={settings.jobAlerts}
                                            onChange={handleToggle}
                                        />
                                        
                                        {/* 3. Lượt xem hồ sơ */}
                                        <NotificationToggle
                                            id="profileViews"
                                            label="Lượt xem hồ sơ"
                                            description="Nhận email thông báo lượt xem hồ sơ mới từ nhà tuyển dụng mỗi tuần."
                                            icon={Eye}
                                            isChecked={settings.profileViews}
                                            onChange={handleToggle}
                                        />

                                        {/* 4. Nhắc nhở từ CareerLink */}
                                        <NotificationToggle
                                            id="careerlinkReminders"
                                            label="Nhắc nhở từ CareerLink"
                                            description="Nhận email nhắc nhở sử dụng những tính năng của CareerLink dựa trên hoạt động của bạn."
                                            icon={Bell}
                                            isChecked={settings.careerlinkReminders}
                                            onChange={handleToggle}
                                        />

                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

// NOTE: Đảm bảo rằng bạn đã thiết lập React Router để liên kết /account/notifications với component này.
// Ví dụ: <Route path="/account/notifications" element={<EmailNotificationPage />} />