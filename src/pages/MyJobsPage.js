import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, ProgressBar, Button, Nav, Spinner, Alert } from "react-bootstrap";
import {
  Briefcase, FileText, Heart, Bell, Person, ArrowRight, PencilSquare, PersonCircle, Plus
} from "react-bootstrap-icons";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; 
import AppNavbar from "../components/Navbar";
import "./style.css"; 

// URL mặc định cho placeholder ảnh
const DEFAULT_AVATAR_URL = "https://placehold.co/80x80/cccccc/333333?text=Avatar";

// Hàm tính toán phần trăm hoàn thành hồ sơ
const calculateCompletionPercentage = (profileData) => {
    // Tổng số bước chính = 9
    let completedSteps = 0;
    const totalSteps = 9; 

    // Kiểm tra BƯỚC 1: Thông tin cá nhân (Cần 3 trường chính)
    if (profileData.resumeTitle && profileData.fullName && profileData.dateOfBirth) {
        completedSteps++;
    }
    
    // Kiểm tra BƯỚC 2: Thông tin liên hệ (Cần email và ít nhất 2 trường địa chỉ)
    if (profileData.email && profileData.country && profileData.province) { 
        completedSteps++;
    }

    // Kiểm tra BƯỚC 3: Học vấn
    if (profileData.education && profileData.education.length > 0) { 
        completedSteps++;
    }
    // Kiểm tra BƯỚC 4: Ngoại ngữ
    if (profileData.languages && profileData.languages.length > 0) { 
        completedSteps++;
    }
    // Kiểm tra BƯỚC 5: Kinh nghiệm làm việc
    if (profileData.experiences && profileData.experiences.length > 0) { 
        completedSteps++;
    }
    // Kiểm tra BƯỚC 6: Người tham khảo (Giả định: cần ít nhất một người)
    if (profileData.references && profileData.references.length > 0) { 
        completedSteps++;
    }
    // Kiểm tra BƯỚC 7: Kỹ năng
    if (profileData.skills && profileData.skills.length > 0) { 
        completedSteps++;
    }
    // Kiểm tra BƯỚC 8: Mục tiêu nghề nghiệp (Cần trường careerGoal và ít nhất 1 mong muốn lương)
    if (profileData.careerGoal && (profileData.desiredSalaryFrom || profileData.desiredPosition)) { 
        completedSteps++;
    }
    // Kiểm tra BƯỚC 9: Trạng thái hồ sơ
    if (profileData.profileStatus) { 
        completedSteps++;
    }

    const percentage = Math.floor((completedSteps / totalSteps) * 100);
    return Math.min(100, percentage); 
};


export default function MyJobsPage() {
    const { authToken, currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [completion, setCompletion] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        if (!authToken) {
            setIsLoading(false);
            return;
        }

        try {
            // CALL API GET PROFILE
            const response = await axios.get("http://localhost:8080/api/profile", {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            
            const data = response.data;
            setProfile(data);
            
            const calculatedCompletion = calculateCompletionPercentage(data);
            setCompletion(calculatedCompletion);

        } catch (err) {
            console.error("Lỗi khi tải Profile:", err);
            if (err.response?.status === 404) {
                 setProfile({}); 
            } else {
                 setError("Không thể tải hồ sơ. Vui lòng kiểm tra kết nối Backend.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);
    
    // Dữ liệu hiển thị
    const displayFullName = profile?.fullName || currentUser?.fullName || "Ứng viên";
    const displayEmail = profile?.email || currentUser?.email || "Chưa có Email";
    const displayAvatar = profile?.avatarUrl || DEFAULT_AVATAR_URL;
    const displayResumeTitle = profile?.resumeTitle || "Chưa đặt tiêu đề";


    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Đang tải hồ sơ...</span>
                </Spinner>
            </Container>
        );
    }

   return (
          <div className="resume-page pt-5 mt-5 bg-light min-vh-100">
              <AppNavbar />
  
                 <div className="bg-white border-bottom py-0">
                  <Container>
                      {/* THÊM GAP-3 ĐỂ CÁC MỤC GẦN NHAU HƠN */}
                      <Nav className="flex-wrap small gap-5">
                          {/* 1. MY CAREERLINK */}
                          <Nav.Link as={Link} to="/myjobs" className="text-primary fw-semibold border-bottom border-primary border-3 pb-1">
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
                          <Nav.Link as={Link} to="/account" className="text-dark py-1">
                               <Person className="me-1" /> Tài khoản
                          </Nav.Link>
                          
                      </Nav>
                  </Container>
              </div>

            {/* MAIN CONTENT */}
            <Container className="my-5">
                {error && <Alert variant="danger">{error}</Alert>}
                <Row>
                    {/* LEFT COLUMN */}
                    <Col lg={4}>
                        {/* PROFILE CARD (DYNAMIC) */}
                        <div className="bg-white p-4 rounded shadow-sm mb-4">
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    src={displayAvatar}
                                    alt="Avatar"
                                    className="rounded-circle me-3 border border-3"
                                    style={{ width: 56, height: 56, objectFit: 'cover' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR_URL; }} 
                                />
                                <div>
                                    <h6 className="mb-0 fw-bold">{displayFullName}</h6>
                                    <small className="text-muted">{displayEmail}</small>
                                    <div className="small text-secondary mt-1">{displayResumeTitle}</div>
                                </div>
                                <PencilSquare className="ms-auto text-primary" size={20} />
                            </div>

                            <div className="mb-3">
                                <small className="text-muted">Hoàn thành {completion}%</small>
                                <ProgressBar now={completion} className="mt-1" style={{ height: "6px" }} />
                            </div>
                           <Button
                                variant="primary"
                                className="w-100 mb-2"
                                as={Link}
                                to="/create-resume/step1"
                            >
                                {completion === 100 ? "Cập nhật hồ sơ" : "Hoàn tất hồ sơ xin việc"}
                            </Button>
                            
                        </div>

                        {/* HỒ SƠ XIN VIỆC */}
                        <div className="bg-white p-4 rounded shadow-sm text-center mb-4">
                            <h6 className="fw-bold mb-3">Hồ sơ xin việc</h6>
                            <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80 }}>
                                <FileText size={36} className="text-primary" />
                            </div>
                            <p className="text-muted small">
                                Hiện tại bạn chưa có hồ sơ nào, xin hãy chọn nút “Tạo hồ sơ mới” để tạo hồ sơ cho bạn.
                            </p>
                            <Button variant="outline-primary" as={Link} to="/create-resume/step1">
                                <Plus /> Tạo hồ sơ mới
                            </Button>
                        </div>

                        {/* CV TẠI VIETCV */}
                        <div className="bg-white p-4 rounded shadow-sm text-center mb-4">
                            <h6 className="fw-bold mb-3">CV tại VietCV</h6>
                            <p className="text-muted small mb-3">
                                Bạn có thể thấy những CV của bạn đã tạo với VietCV.io tại đây. Bạn có thể dùng những CV này ở bước ứng tuyển. Hãy đăng nhập để bắt đầu.
                            </p>
                            <Button variant="success" className="w-100">
                                Đăng nhập vào VietCV
                            </Button>
                        </div>

                        {/* THƯ XIN VIỆC */}
                        <div className="bg-white p-4 rounded shadow-sm text-center">
                            <h6 className="fw-bold mb-3">Thư xin việc</h6>
                            <p className="text-muted small mb-3">
                                Bạn chưa có thư xin việc nào.
                            </p>
                            <Button variant="outline-primary">
                                <Plus /> Tạo thư mới
                            </Button>
                        </div>
                    </Col>

                    {/* RIGHT COLUMN (STATISTICS AND JOB SUGGESTIONS) */}
                    <Col lg={8}>
                        {/* STATS */}
                        <Row className="g-3 mb-4">
                            <Col>
                                <div className="bg-white p-3 rounded shadow-sm text-center">
                                    <h3 className="text-primary fw-bold">0</h3>
                                    <small>NHÀ TUYỂN DỤNG XEM HỒ SƠ</small>
                                </div>
                            </Col>
                            <Col>
                                <div className="bg-white p-3 rounded shadow-sm text-center">
                                    <h3 className="text-danger fw-bold">0</h3>
                                    <small>VIỆC ĐÃ LƯU</small>
                                </div>
                            </Col>
                            <Col>
                                <div className="bg-white p-3 rounded shadow-sm text-center">
                                    <h3 className="text-warning fw-bold">0</h3>
                                    <small>VIỆC ĐÃ ỨNG TUYỂN</small>
                                </div>
                            </Col>
                            <Col>
                                <div className="bg-white p-3 rounded shadow-sm text-center">
                                    <h3 className="text-success fw-bold">0</h3>
                                    <small>THÔNG BÁO VIỆC LÀM</small>
                                </div>
                            </Col>
                        </Row>

                        {/* ỨNG TUYỂN GẦN ĐÂY */}
                        <h6 className="fw-bold mb-3">Việc đã ứng tuyển gần đây</h6>
                        <div className="bg-white p-5 rounded shadow-sm text-center mb-4">
                            <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 100, height: 100 }}>
                                <ArrowRight size={48} className="text-primary" />
                            </div>
                            <p className="text-muted">Không có việc ứng tuyển gần đây</p>
                            <Button variant="outline-primary" as={Link} to="/jobs/search">Đến trang tìm việc</Button>
                        </div>

                        {/* GỢI Ý VIỆC LÀM */}
                        <h6 className="fw-bold mb-3">Gợi ý việc làm</h6>
                        <p className="text-muted small mb-4">
                            Dựa trên việc làm đã xem. Xóa lịch sử việc làm đã xem để nhận gợi ý mới
                        </p>

                        <Row className="g-3">
                            {/* JOB 1 */}
                            <Col md={6}>
                                <div className="border p-3 rounded">
                                    <div className="d-flex align-items-start">
                                        <img src="https://fakeimg.pl/40x40/003366/FFF/?text=Logo" alt="Logo" className="me-2" />
                                        <div className="flex-grow-1">
                                            <div className="fw-bold small text-primary">Kỹ sư xây dựng / Cán bộ kỹ thuật hiện trường</div>
                                            <div className="small text-muted">Công Ty CP Đầu Tư Xây Dựng Hà Tăng</div>
                                            <div className="small text-muted">Hồng Hà</div>
                                            <div className="small text-muted">Hải Phòng</div>
                                            <div className="fw-bold text-success small">18 triệu - 20 triệu</div>
                                        </div>
                                        <Heart className="text-muted" size={18} />
                                    </div>
                                </div>
                            </Col>

                            {/* JOB 2 */}
                            <Col md={6}>
                                <div className="border p-3 rounded">
                                    <div className="d-flex align-items-start">
                                        <img src="https://fakeimg.pl/40x40/FF6600/FFF/?text=Logo" alt="Logo" className="me-2" />
                                        <div className="flex-grow-1">
                                            <div className="fw-bold small text-primary">[Hải Phòng] Kỹ Sư Giám Sát Công Trình Xây Dựng</div>
                                            <div className="small text-muted">CÔNG TY CỔ PHẦN KỸ THUẬT & XÂY DỰNG HANDONG</div>
                                            <div className="small text-muted">Hải Phòng</div>
                                            <div className="small text-muted">Cạnh tranh</div>
                                            <div className="fw-bold text-success small">Cạnh tranh</div>
                                        </div>
                                        <Heart className="text-muted" size={18} />
                                    </div>
                                </div>
                            </Col>

                            {/* JOB 3 */}
                            <Col md={6}>
                                <div className="border p-3 rounded">
                                    <div className="d-flex align-items-start">
                                        <img src="https://fakeimg.pl/40x40/336699/FFF/?text=Logo" alt="Logo" className="me-2" />
                                        <div className="flex-grow-1">
                                            <div className="fw-bold small text-primary">QUẢN LÝ GIA CÔNG</div>
                                            <div className="small text-muted">Công ty TNHH Gunze (Việt Nam)</div>
                                            <div className="small text-muted">Hồ Chí Minh</div>
                                            <div className="fw-bold text-success small">Thương lượng</div>
                                        </div>
                                        <Heart className="text-muted" size={18} />
                                    </div>
                                </div>
                            </Col>

                            {/* JOB 4 */}
                            <Col md={6}>
                                <div className="border p-3 rounded">
                                    <div className="d-flex align-items-start">
                                        <img src="https://fakeimg.pl/40x40/CC0000/FFF/?text=Logo" alt="Logo" className="me-2" />
                                        <div className="flex-grow-1">
                                            <div className="fw-bold small text-primary">KIẾN TRÚC SƯ - CÔNG TRÌNH DÂN DỤNG</div>
                                            <div className="small text-muted">CÔNG TY CỔ PHẦN BẤT ĐỘNG SẢN FUTA LAND</div>
                                            <div className="small text-muted">Đà Nẵng</div>
                                            <div className="fw-bold text-success small">20 triệu - 35 triệu</div>
                                        </div>
                                        <Heart className="text-muted" size={18} />
                                    </div>
                                </div>
                            </Col>

                            {/* JOB 5 */}
                            <Col md={6}>
                                <div className="border p-3 rounded">
                                    <div className="d-flex align-items-start">
                                        <img src="https://fakeimg.pl/40x40/FF3333/FFF/?text=Logo" alt="Logo" className="me-2" />
                                        <div className="flex-grow-1">
                                            <div className="fw-bold small text-primary">CHUYÊN VIÊN ĐẦU TƯ - PHÁP CHẾ</div>
                                            <div className="small text-muted">Công Ty Cổ Phần Petro Times</div>
                                            <div className="small text-muted">Hải Phòng</div>
                                            <div className="fw-bold text-success small">15 triệu - 35 triệu</div>
                                        </div>
                                        <Heart className="text-muted" size={18} />
                                    </div>
                                </div>
                            </Col>

                            {/* JOB 6 */}
                            <Col md={6}>
                                <div className="border p-3 rounded">
                                    <div className="d-flex align-items-start">
                                        <img src="https://fakeimg.pl/40x40/003366/FFF/?text=Logo" alt="Logo" className="me-2" />
                                        <div className="flex-grow-1">
                                            <div className="fw-bold small text-primary">Biên - Phiên Dịch Tiếng Nhật (đào tạo làm việc tại Nhật)</div>
                                            <div className="small text-muted">Công Ty TNHH Quadrille Việt Nam</div>
                                            <div className="small text-muted">Đồng Nai</div>
                                            <div className="fw-bold text-success small">10 triệu - 12 triệu</div>
                                        </div>
                                        <Heart className="text-muted" size={18} />
                                    </div>
                                </div>
                            </Col>

                            {/* JOB 7 */}
                            <Col md={6}>
                                <div className="border p-3 rounded">
                                    <div className="d-flex align-items-start">
                                        <img src="https://fakeimg.pl/40x40/669933/FFF/?text=Logo" alt="Logo" className="me-2" />
                                        <div className="flex-grow-1">
                                            <div className="fw-bold small text-primary">CHUYÊN VIÊN THIẾT KẾ (DESIGN)</div>
                                            <div className="small text-muted">CÔNG TY CỔ PHẦN BẤT ĐỘNG SẢN FUTA LAND</div>
                                            <div className="small text-muted">Đà Nẵng</div>
                                            <div className="fw-bold text-success small">18 triệu - 25 triệu</div>
                                        </div>
                                        <Heart className="text-muted" size={18} />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            {/* ZALO BUTTON
            <div className="position-fixed bottom-0 end-0 p-3">
                <a href="#" className="btn btn-primary rounded-circle shadow-lg" style={{ width: 50, height: 50 }}>
                    <img src="https://img.icons8.com/color/48/000000/zalo.png" alt="Zalo" />
                </a>
            </div> */}
        </div>
    );
}