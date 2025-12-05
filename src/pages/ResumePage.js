import React, { useState } from "react"; 
import { Container, Row, Col, Button, Nav, ListGroup } from "react-bootstrap"; // Thêm ListGroup
import { FileText, Plus, Heart, Briefcase, Person, Bell, PencilSquare, Trash, LockFill, UnlockFill } from "react-bootstrap-icons"; // Thêm biểu tượng
import { Link, useNavigate } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import CreateResumeModal from "../components/CreateResumeModal"; 
import "./style.css"; 

// Dữ liệu giả định cho trường hợp ĐÃ CÓ HỒ SƠ (Giống hình ảnh bạn gửi)
const MOCK_RESUMES = [
    {
        id: 1,
        fileName: "BANG_USSECASE.docx",
        status: "Bản nháp",
        lastEdited: "Chỉnh sửa lần cuối 3/12/2025",
        isSearchable: false,
        type: "upload"
    },
    {
        id: 2,
        fileName: "PT",
        status: "Kích hoạt",
        lastEdited: "Chỉnh sửa lần cuối 3/12/2025",
        isSearchable: true,
        type: "created"
    }
];

export default function ResumePage() {
    const navigate = useNavigate();
    const [showCreateResumeModal, setShowCreateResumeModal] = useState(false);
    
    // TẠO STATE HỒ SƠ - KHỞI TẠO VỚI DỮ LIỆU GIẢ ĐỊNH (2 hồ sơ)
    // Để chuyển sang giao diện "chưa có hồ sơ", bạn có thể đổi thành useState([]);
    const [resumes, setResumes] = useState(MOCK_RESUMES); // THAY ĐỔI
    
    const hasResumes = resumes.length > 0; // CHECK: Có hồ sơ hay không

    const handleShow = () => setShowCreateResumeModal(true);
    const handleClose = () => setShowCreateResumeModal(false);

    const handleCreateNewResumeBySteps = () => {
        handleClose();
        navigate("/create-resume/step1");
    };
    
    const handleUploadResume = () => {
        handleClose();
        navigate("/upload-resume"); 
    };

    // --- RENDER HỒ SƠ ---
    const renderResumeList = () => (
        <div className="bg-white p-4 rounded shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Hồ sơ xin việc ({resumes.length})</h5>
                {/* Nút Tạo hồ sơ mới - Mở Modal */}
                <Button variant="outline-primary" size="sm" onClick={handleShow}>
                    <Plus className="me-1" /> Tạo hồ sơ mới
                </Button>
            </div>
            <p className="text-muted small">
                Bạn có tổng cộng **{resumes.length}** hồ sơ, trong đó chỉ có hồ sơ mặc định được cho phép tìm kiếm. Các hồ sơ khác có thể dùng để ứng tuyển.
            </p>

            <ListGroup variant="flush">
                {resumes.map((resume) => (
                    <ListGroup.Item key={resume.id} className="px-0 d-flex align-items-center">
                        {/* ICON & RESUME THUMBNAIL */}
                        <div className="d-flex align-items-center flex-shrink-0 me-3" style={{ width: '60px' }}>
                            <FileText size={32} className="text-primary me-2" />
                        </div>

                        {/* INFO & STATUS */}
                        <div className="flex-grow-1">
                            <div className="fw-bold text-dark">{resume.fileName}</div>
                            <div className="small text-muted">{resume.lastEdited} <span className={`badge ${resume.status === 'Bản nháp' ? 'bg-secondary' : 'bg-success'}`}>{resume.status}</span></div>
                            
                            {/* KÍCH HOẠT TÌM KIẾM */}
                            <div className="d-flex align-items-center mt-2 small">
                                <span className={`me-2 ${resume.isSearchable ? 'text-success' : 'text-danger'}`}>
                                    {resume.isSearchable ? <UnlockFill /> : <LockFill />}
                                </span>
                                <input 
                                    type="checkbox" 
                                    checked={resume.isSearchable} 
                                    readOnly // Giả lập checkbox
                                    className="me-2" 
                                />
                                <span className="text-muted">Cho phép tìm kiếm hồ sơ</span>
                                <span className="ms-3 text-secondary">👁️ 0</span>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex-shrink-0 d-flex gap-2">
                            <Button variant="outline-primary" size="sm" className="p-1">
                                <PencilSquare size={16} />
                            </Button>
                            <Button variant="outline-danger" size="sm" className="p-1">
                                <Trash size={16} />
                            </Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );

    // --- RENDER TRƯỜNG HỢP CHƯA CÓ HỒ SƠ ---
    const renderEmptyResumeState = () => (
        <div className="bg-white p-5 rounded shadow-sm text-center mb-4">
            <h5 className="fw-bold mb-4">Hồ sơ xin việc (0)</h5>
            <div className="profile-icon-circle-large mb-4 mx-auto" style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: '#f0f4f8', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={48} className="text-primary" />
            </div>
            <p className="text-muted mb-4 px-5">
                Hiện tại bạn chưa có hồ sơ nào, xin hãy chọn nút <strong>“Tạo hồ sơ mới”</strong> để tạo hồ sơ cho bạn.
            </p>
            <Button variant="outline-primary" size="lg" className="px-5" onClick={handleShow}>
                <Plus className="me-2" /> Tạo hồ sơ mới
            </Button>
        </div>
    );


    return (
        <div className="resume-page pt-5 mt-5 bg-light min-vh-100">
            <AppNavbar />

            {/* Sub-Navbar (Giữ nguyên) */}
            <div className="bg-white border-bottom py-0">
                <Container>
                    <Nav className="flex-wrap small gap-5">
                        <Nav.Link as={Link} to="/myjobs" className="text-dark py-1">
                            <Briefcase size={14} className="me-1" /> My Jobs
                        </Nav.Link>
                        <Nav.Link as={Link} to="/resume" className="text-primary fw-semibold border-bottom border-primary border-3 pb-1">
                            <FileText size={14} className="me-1" /> Hồ sơ xin việc ({resumes.length})
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
                        <Nav.Link as={Link} to="/account" className="text-dark py-1">
                            <Person className="me-1" /> Tài khoản
                        </Nav.Link>
                    </Nav>
                </Container>
            </div>

            <Container className="my-5">
                <Row className="g-4">
                    <Col lg={8}>
                        {/* LOGIC HIỂN THỊ */}
                        {hasResumes ? renderResumeList() : renderEmptyResumeState()}
                        
                        {/* THƯ XIN VIỆC (Giữ nguyên) */}
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
                        
                        {/* CV TẠI VIETCV (Giữ nguyên) */}
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
                            {/* Job suggestion cards */}
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

            <CreateResumeModal 
                show={showCreateResumeModal} 
                handleClose={handleClose} 
                onCreateBySteps={handleCreateNewResumeBySteps}
                onUploadResume={handleUploadResume}
            />
        </div>
    );
}