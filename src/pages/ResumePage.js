import React, { useState } from "react"; // IMPORT useState
import { Container, Row, Col, Button, Nav } from "react-bootstrap";
import { FileText, Plus, Heart, Briefcase, Person, Bell } from "react-bootstrap-icons"; // Thêm Person, Briefcase
import { Link, useNavigate } from "react-router-dom"; // IMPORT useNavigate
import AppNavbar from "../components/Navbar";
import CreateResumeModal from "../components/CreateResumeModal"; // IMPORT MODAL
import "./style.css"; 

export default function ResumePage() {
    const navigate = useNavigate(); // KHỞI TẠO HOOK CHUYỂN HƯỚNG
    
    // 1. TẠO STATE ĐỂ QUẢN LÝ MODAL
    const [showCreateResumeModal, setShowCreateResumeModal] = useState(false);

    // Hàm mở/đóng modal
    const handleShow = () => setShowCreateResumeModal(true);
    const handleClose = () => setShowCreateResumeModal(false);

    // HÀM XỬ LÝ CHUYỂN HƯỚNG KHI CHỌN "Tạo hồ sơ theo từng bước"
    const handleCreateNewResumeBySteps = () => {
        handleClose(); // Đóng Modal
        navigate("/create-resume/step1"); // Chuyển sang bước 1
    };
    
    // HÀM XỬ LÝ KHI CHỌN "Hồ sơ đính kèm" (ĐÃ SỬA: Chuyển hướng đến trang upload)
    const handleUploadResume = () => {
        handleClose(); // Đóng Modal
        navigate("/upload-resume"); // Chuyển sang trang tải lên mới
    };

    return (
        <div className="resume-page pt-5 mt-5 bg-light min-vh-100">
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
                        <Nav.Link as={Link} to="/resume" className="text-primary fw-semibold border-bottom border-primary border-3 pb-1">
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


            <Container className="my-5">
                <Row className="g-4">
                    {/* LEFT COLUMN: RỘNG HƠN (8/12) */}
                    <Col lg={8}>
                        {/* HỒ SƠ XIN VIỆC – TO, RỘNG */}
                        <div className="bg-white p-5 rounded shadow-sm text-center mb-4">
                            <h5 className="fw-bold mb-4">Hồ sơ xin việc (0)</h5>
                            <div className="profile-icon-circle-large mb-4 mx-auto" style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: '#f0f4f8', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileText size={48} className="text-primary" />
                            </div>
                            <p className="text-muted mb-4 px-5">
                                Hiện tại bạn chưa có hồ sơ nào, xin hãy chọn nút <strong>“Tạo hồ sơ mới”</strong> để tạo hồ sơ cho bạn.
                            </p>
                            {/* THAY LOGIC ĐỂ MỞ MODAL */}
                            <Button variant="outline-primary" size="lg" className="px-5" onClick={handleShow}>
                                <Plus className="me-2" /> Tạo hồ sơ mới
                            </Button>
                        </div>

                        {/* THƯ XIN VIỆC */}
                        <div className="bg-white p-5 rounded shadow-sm text-center mb-4">
                            <h5 className="fw-bold mb-4">Thư xin việc (0)</h5>
                            <div className="profile-icon-circle-large mb-4 mx-auto" style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: '#f0f4f8', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileText size={48} className="text-muted" />
                            </div>
                            <p className="text-muted mb-4">
                                Bạn chưa có thư xin việc nào.
                            </p>
                            <Button variant="outline-primary" size="lg" className="px-5">
                                <Plus className="me-2" /> Tạo thư mới
                            </Button>
                        </div>

                        {/* CV TẠI VIETCV */}
                        <div className="bg-white p-5 rounded shadow-sm text-center">
                            <h5 className="fw-bold mb-4">CV tại VietCV</h5>
                            <p className="text-muted mb-4 px-5">
                                Bạn có thể thấy những CV của bạn đã tạo với VietCV.io tại đây. Bạn có thể dùng những CV này ở bước ứng tuyển. Hãy đăng nhập để bắt đầu.
                            </p>
                            <Button variant="success" size="lg" className="w-100 px-5">
                                Đăng nhập vào VietCV
                            </Button>
                        </div>
                    </Col>

                    {/* RIGHT COLUMN (Giữ nguyên) */}
                    <Col lg={4}>
                        <div className="bg-white p-4 rounded shadow-sm sticky-top" style={{ top: "80px" }}>
                            <h6 className="fw-bold mb-3">Gợi ý việc làm</h6>
                            <p className="text-muted small mb-3">
                                Dựa trên việc làm đã xem. Xóa lịch sử để nhận gợi ý mới
                            </p>
                            {/* ... (Job suggestion cards) ... */}
                            <div className="job-suggestion-card mb-3 p-3 border rounded">
                                <div className="d-flex align-items-start">
                                    <img src="https://fakeimg.pl/36x36/003366/FFF/?text=Logo" alt="Logo" className="me-2 flex-shrink-0" />
                                    <div className="flex-grow-1">
                                        <div className="fw-bold small text-primary">Kỹ sư xây dựng</div>
                                        <div className="small text-muted">Công Ty CP Hà Tăng</div>
                                        <div className="small text-success fw-bold">18 - 20 triệu</div>
                                    </div>
                                    <Heart className="text-muted flex-shrink-0" size={16} />
                                </div>
                            </div>
                            <div className="job-suggestion-card p-3 border rounded">
                                <div className="d-flex align-items-start">
                                    <img src="https://fakeimg.pl/36x36/336699/FFF/?text=Logo" alt="Logo" className="me-2 flex-shrink-0" />
                                    <div className="flex-grow-1">
                                        <div className="fw-bold small text-primary">QUẢN LÝ GIA CÔNG</div>
                                        <div className="small text-muted">Gunze Việt Nam</div>
                                        <div className="small text-success fw-bold">Thương lượng</div>
                                    </div>
                                    <Heart className="text-muted flex-shrink-0" size={16} />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* ZALO BUTTON */}
            <div className="position-fixed bottom-0 end-0 p-3">
                <a href="#" className="btn btn-primary rounded-circle shadow-lg" style={{ width: 50, height: 50 }}>
                    <img src="https://img.icons8.com/color/48/000000/zalo.png" alt="Zalo" />
                </a>
            </div>
            
            {/* THÊM MODAL VÀO COMPONENT */}
            <CreateResumeModal 
                show={showCreateResumeModal} 
                handleClose={handleClose} 
                onCreateBySteps={handleCreateNewResumeBySteps} // Truyền hàm chuyển hướng
                onUploadResume={handleUploadResume} // Truyền hàm xử lý upload
            />
        </div>
    );
}