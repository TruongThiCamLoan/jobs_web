import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button, Nav, ListGroup, Spinner, Alert , ProgressBar} from "react-bootstrap";
import { FileText, Plus, Heart, Briefcase, Person, Bell, PencilSquare, Trash, LockFill, UnlockFill } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 
import { useAuth } from "../context/AuthContext"; 
import AppNavbar from "../components/Navbar";
import CreateResumeModal from "../components/CreateResumeModal"; 
import "./style.css"; 

// URL mặc định cho placeholder ảnh
const DEFAULT_AVATAR_URL = "https://placehold.co/80x80/cccccc/333333?text=Avatar";

// =======================================================
// ✅ HÀM TÍNH TOÁN PHẦN TRĂM HOÀN THÀNH HỒ SƠ
// =======================================================
const calculateCompletionPercentage = (profileData) => {
    // Tổng số bước chính = 9
    let completedSteps = 0;
    const totalSteps = 9; 

    if (!profileData) return 0;

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
    // Kiểm tra BƯỚC 6: Người tham khảo
    if (profileData.references && profileData.references.length > 0) { 
        completedSteps++;
    }
    // Kiểm tra BƯỚC 7: Kỹ năng
    if (profileData.skills && profileData.skills.length > 0) { 
        completedSteps++;
    }
    // Kiểm tra BƯỚC 8: Mục tiêu nghề nghiệp
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


export default function ResumePage() {
    const navigate = useNavigate();
    const { authToken, currentUser } = useAuth(); // ✅ ĐÃ THÊM currentUser
    
    const [showCreateResumeModal, setShowCreateResumeModal] = useState(false);
    
    // ✅ STATE MỚI CHO PROFILE VÀ COMPLETION
    const [profile, setProfile] = useState(null); 
    const [completion, setCompletion] = useState(0); 
    
    // STATE THỰC TẾ CỦA DANH SÁCH RESUMES
    const [resumes, setResumes] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const hasResumes = resumes.length > 0;

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

    // =======================================================
    // ✅ HÀM GỌI API ĐỂ LẤY THÔNG TIN PROFILE (Chi tiết) VÀ DANH SÁCH HỒ SƠ
    // =======================================================
    const fetchProfileAndResumes = useCallback(async () => {
        if (!authToken) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        
        let loadError = null;

        try {
            // --- 1. CALL API GET PROFILE (Thông tin chi tiết) ---
            const profileResponse = await axios.get("http://localhost:8080/api/profile", {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            const profileData = profileResponse.data;
            setProfile(profileData);
            setCompletion(calculateCompletionPercentage(profileData));

        } catch (err) {
            console.error("Lỗi khi tải Profile:", err);
            if (err.response?.status === 404) {
                setProfile({}); // Profile rỗng
                setCompletion(0);
            } else {
                loadError = "Không thể tải hồ sơ chi tiết. Vui lòng kiểm tra kết nối Backend.";
            }
        }
        
        // --- 2. CALL API GET RESUMES (Danh sách các hồ sơ) ---
        try {
            const resumesResponse = await axios.get("http://localhost:8080/api/profile/resumes", {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setResumes(resumesResponse.data); 
            
        } catch (resumeError) {
             console.error("Lỗi khi tải danh sách hồ sơ:", resumeError);
             // Xử lý nếu API /resumes trả về 404/rỗng
            if (resumeError.response?.status === 404 || (resumeError.response?.status === 200 && resumeError.response.data.length === 0)) {
                 setResumes([]); 
            } else {
                 loadError = loadError || "Không thể tải danh sách hồ sơ. Vui lòng kiểm tra kết nối API.";
            }
        }
        
        if (loadError) setError(loadError);
        setIsLoading(false);

    }, [authToken]);
    
    // ✅ GỌI HÀM KHI COMPONENT MOUNT HOẶC KHI TOKEN THAY ĐỔI
    useEffect(() => {
        fetchProfileAndResumes();
    }, [fetchProfileAndResumes]);


    // --- Dữ liệu hiển thị (Dùng Profile/currentUser data) ---
    const displayFullName = profile?.fullName || currentUser?.fullName || "Ứng viên";
    const displayEmail = profile?.email || currentUser?.email || "Chưa có Email";
    const displayAvatar = profile?.avatarUrl || DEFAULT_AVATAR_URL;
    const displayResumeTitle = profile?.resumeTitle || "Chưa đặt tiêu đề";


    // --- RENDER LOADING STATE ---
    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Đang tải hồ sơ...</span>
                </Spinner>
            </Container>
        );
    }
    
    // --- RENDER HỒ SƠ THẬT ---
    const renderResumeList = () => (
        <div className="bg-white p-4 rounded shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Hồ sơ xin việc ({resumes.length})</h5>
                <Button variant="outline-primary" size="sm" onClick={handleShow}>
                    <Plus className="me-1" /> Tạo hồ sơ mới
                </Button>
            </div>
            <p className="text-muted small">
                Bạn có tổng cộng **{resumes.length}** hồ sơ, trong đó chỉ có hồ sơ mặc định được cho phép tìm kiếm. Các hồ sơ khác có thể dùng để ứng tuyển.
            </p>

            <ListGroup variant="flush">
                {resumes.map((resume) => (
                    // LƯU Ý: Đảm bảo Back-end trả về các trường sau: id, fileName, lastEdited, status, isSearchable
                    <ListGroup.Item key={resume.id} className="px-0 d-flex align-items-center">
                        {/* ICON & RESUME THUMBNAIL */}
                        <div className="d-flex align-items-center flex-shrink-0 me-3" style={{ width: '60px' }}>
                            <FileText size={32} className="text-primary me-2" />
                        </div>

                        {/* INFO & STATUS */}
                        <div className="flex-grow-1">
                            <div className="fw-bold text-dark">{resume.fileName}</div>
                            {/* Chuyển đổi trạng thái hiển thị */}
                            <div className="small text-muted">
                                {resume.lastEdited} 
                                <span className={`badge ms-2 ${resume.status === 'Bản nháp' ? 'bg-secondary' : 'bg-success'}`}>
                                    {resume.status}
                                </span>
                            </div>
                            
                            {/* KÍCH HOẠT TÌM KIẾM */}
                            <div className="d-flex align-items-center mt-2 small">
                                <span className={`me-2 ${resume.isSearchable ? 'text-success' : 'text-danger'}`}>
                                    {resume.isSearchable ? <UnlockFill /> : <LockFill />}
                                </span>
                                <input 
                                    type="checkbox" 
                                    checked={resume.isSearchable} 
                                    readOnly 
                                    className="me-2" 
                                />
                                <span className="text-muted">Cho phép tìm kiếm hồ sơ</span>
                                {/* Giả định: Back-end không cung cấp view count */}
                                <span className="ms-3 text-secondary">👁️ 0</span> 
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex-shrink-0 d-flex gap-2">
                            {/* Chuyển đến trang chỉnh sửa: Giả định URL là /edit-resume/id */}
                            <Button variant="outline-primary" size="sm" className="p-1" as={Link} to={`/create-resume/step1`}>
                                <PencilSquare size={16} />
                            </Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
    
    // --- RENDER TRƯỜNG HỢP CHƯA CÓ HỒ SƠ (Giữ nguyên) ---
    const renderEmptyResumeState = () => (
        <div className="bg-white p-5 rounded shadow-sm text-center mb-4">
            <h5 className="fw-bold mb-4">Hồ sơ xin việc </h5>
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

            {/* Sub-Navbar */}
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
                            <Heart size={14} className="me-1" /> Việc đã lưu 
                        </Nav.Link>
                        <Nav.Link as={Link} to="/applied-jobs" className="text-dark py-1">
                            <Briefcase size={14} className="me-1" /> Việc đã ứng tuyển 
                        </Nav.Link>
                        <Nav.Link as={Link} to="/job-alerts" className="text-dark py-1">
                            <Bell size={14} className="me-1" /> Thông báo việc làm 
                        </Nav.Link>
                        <Nav.Link as={Link} to="/account" className="text-dark py-1">
                            <Person className="me-1" /> Tài khoản
                        </Nav.Link>
                    </Nav>
                </Container>
            </div>

            <Container className="my-5">
                {error && <Alert variant="danger">{error}</Alert>}
                <Row className="g-4">
                    <Col lg={8}>
                        {/* HIỂN THỊ HỒ SƠ THẬT HOẶC TRẠNG THÁI RỖNG */}
                        {hasResumes ? renderResumeList() : renderEmptyResumeState()}
                    </Col>

                    {/* RIGHT COLUMN (CẬP NHẬT DYNAMIC) */}
                    <Col lg={4}>
                         <div className="bg-white p-4 rounded shadow-sm sticky-top" style={{ top: "80px" }}>
                             {/* ✅ PROFILE CARD (DYNAMIC) */}
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
                                {/* ✅ PROGRESS BAR DYNAMIC */}
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

                             <h6 className="fw-bold mb-3">Gợi ý việc làm</h6>
                             <p className="text-muted small mb-3">Dựa trên việc làm đã xem. Xóa lịch sử để nhận gợi ý mới</p>
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