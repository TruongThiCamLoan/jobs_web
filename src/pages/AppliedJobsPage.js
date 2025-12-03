// src/pages/AppliedJobsPage.js
import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button, Nav, Badge, Spinner, Alert } from "react-bootstrap";
import { BriefcaseFill, Heart, Bell, FileText, Printer,Briefcase, XCircle, Person } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import axios from "axios"; // Thêm Axios
import { useAuth } from "../context/AuthContext"; // Thêm useAuth
import AppNavbar from "../components/Navbar";
import "./style.css";

// TÀI SẢN CỤC BỘ (FIX: Thay thế URL không hoạt động)
// Giả định logoPlaceholder tồn tại trong thư mục img
import logoPlaceholder from "../img/Banner.jpg"; 

// Hàm định dạng thời gian nộp đơn
const formatAppliedDate = (dateString) => {
    if (!dateString) return "Không rõ";
    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString('vi-VN');
    } catch {
        return "Không rõ";
    }
};

// Hàm ánh xạ trạng thái sang màu Badge
const getStatusBadge = (status) => {
    switch (status) {
        case 'Hired':
            return { variant: 'success', label: 'Đã trúng tuyển' };
        case 'Interview':
            return { variant: 'info', label: 'Đã mời phỏng vấn' };
        case 'Reviewed':
            return { variant: 'primary', label: 'Đã xem hồ sơ' };
        case 'Rejected':
            return { variant: 'warning', label: 'Bị từ chối' };
        case 'Closed':
            return { variant: 'danger', label: 'Công việc đã đóng' };
        case 'Pending':
        default:
            return { variant: 'secondary', label: 'Chờ xét duyệt' };
    }
};

export default function AppliedJobsPage() {
    const { authToken } = useAuth();
    
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. GỌI API LẤY DANH SÁCH ỨNG TUYỂN
    const fetchAppliedJobs = useCallback(async () => {
        if (!authToken) {
            setIsLoading(false);
            setError("Vui lòng đăng nhập để xem lịch sử ứng tuyển.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            // ENDPOINT: GET /api/applications (Lấy tất cả ứng tuyển của Student)
            const response = await axios.get("http://localhost:8080/api/applications", {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            
            // Giả định API trả về mảng các đối tượng {applicationId, jobId, title, companyName, createdAt, status, ...}
            setAppliedJobs(response.data);
            
        } catch (err) {
            console.error("Lỗi khi tải danh sách đã ứng tuyển:", err.response || err);
            setError("Không thể tải lịch sử ứng tuyển. Vui lòng kiểm tra kết nối API.");
            setAppliedJobs([]);
        } finally {
            setIsLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchAppliedJobs();
    }, [fetchAppliedJobs]);


    // Hiển thị loading khi đang tải
    if (isLoading) {
        return (
            <>
                <AppNavbar />
                <Container className="text-center p-5 pt-5 mt-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Đang tải lịch sử ứng tuyển...</p>
                </Container>
            </>
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
                           <Nav.Link as={Link} to="/applied-jobs" className="text-primary fw-semibold border-bottom border-primary border-3 pb-1">
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
                    {/* LEFT COLUMN: VIỆC ĐÃ ỨNG TUYỂN (8/12) */}
                    <Col lg={8}>
                        <h5 className="fw-bold mb-3">Việc đã ứng tuyển ({appliedJobs.length})</h5>

                        {error && <Alert variant="danger">{error}</Alert>}

                        {appliedJobs.length === 0 ? (
                            <Alert variant="info" className="text-center">
                                Bạn chưa ứng tuyển công việc nào.
                                <div className="mt-3">
                                    <Link to="/jobs" className="btn btn-primary">Tìm kiếm công việc ngay</Link>
                                </div>
                            </Alert>
                        ) : (
                            <>
                                {/* 30 NGÀY QUA (Tiêu đề nhóm) */}
                                <div className="text-muted small mb-3">30 ngày qua</div>

                                {appliedJobs.map(application => {
                                    // jobStatus: trạng thái công việc (Giả định lấy từ API)
                                    // Nếu API không cung cấp, mặc định là 'Open'
                                    const jobStatus = application.jobStatus || 'Open'; 
                                    const appStatus = getStatusBadge(application.status);
                                    
                                    // Badge ưu tiên: Đã đóng > Trạng thái ứng tuyển
                                    const primaryBadge = jobStatus === 'Closed' 
                                        ? { variant: 'danger', label: 'Công việc đã đóng' } 
                                        : appStatus;
                                        
                                    // Logo (Sử dụng logoPlaceholder nếu logoUrl không có)
                                    const logoSrc = application.logoUrl || logoPlaceholder;

                                    return (
                                        <div key={application.applicationId} className="bg-white p-4 rounded shadow-sm mb-3 border">
                                            <div className="d-flex align-items-start justify-content-between">
                                                <div className="d-flex align-items-start">
                                                    <img 
                                                        src={logoSrc} 
                                                        alt="Logo" 
                                                        className="me-3 flex-shrink-0 border p-1 rounded" 
                                                        style={{ width: 40, height: 40, objectFit: 'contain' }}
                                                        onError={(e) => { e.target.onerror = null; e.target.src=logoPlaceholder; }}
                                                    />
                                                    <div>
                                                        <h6 className="fw-bold mb-1">
                                                            {application.title}
                                                            
                                                            {/* Primary Status Badge */}
                                                            <Badge bg={primaryBadge.variant} className="ms-2 small">{primaryBadge.label}</Badge>
                                                            
                                                            {/* Link xem công việc */}
                                                            {jobStatus !== 'Closed' && (
                                                                <Link to={`/jobs/${application.jobId}`} className="text-primary small ms-2 text-decoration-none">Xem công việc</Link>
                                                            )}
                                                        </h6>
                                                        <div className="small text-muted mb-1">
                                                            <strong>{application.companyName}</strong>
                                                        </div>
                                                        <div className="small text-muted">
                                                            Đã nộp: {formatAppliedDate(application.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    {/* Nút chính hiển thị trạng thái */}
                                                    <Button variant={`outline-${appStatus.variant}`} size="sm" className="mb-2" disabled>
                                                        {appStatus.label}
                                                    </Button>
                                                    <div>
                                                        <a href="#" className="text-muted small text-decoration-none">
                                                            <Printer size={14} className="me-1" /> In
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                        
                        <div className="text-muted small mt-4">Hôm nay</div>
                    </Col>

                    {/* RIGHT COLUMN: QUẢNG CÁO + GỢI Ý (4/12) */}
                    <Col lg={4}>
                        <div className="sticky-top" style={{ top: "80px" }}>
                            {/* QUẢNG CÁO VIETCV */}
                            <div className="bg-gradient text-white p-4 rounded shadow-sm mb-4" style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)" }}>
                                <h6 className="fw-bold mb-3">Tạo CV chất với VietCV.io</h6>
                                <p className="small mb-3">Ứng tuyển việc làm với CareerLink.vn</p>
                                <div className="d-flex justify-content-center gap-2 mb-3">
                                    <img src={logoPlaceholder} alt="CV" className="rounded shadow-sm" style={{ width: '80px', height: '100px', objectFit: 'cover' }}/>
                                    <img src={logoPlaceholder} alt="CV" className="rounded shadow-sm" style={{ width: '80px', height: '100px', objectFit: 'cover' }}/>
                                </div>
                                <p className="small mb-0">Chọn mẫu - Điền thông tin - Lưu - Tải về - Nộp đơn</p>
                                <div className="text-end mt-2">
                                    <span className="small fw-semibold">VietCV</span>
                                </div>
                            </div>

                            {/* GỢI Ý VIỆC LÀM */}
                            <div className="bg-white p-3 rounded shadow-sm">
                                <h6 className="fw-bold mb-2">Gợi ý việc làm</h6>
                                <p className="text-muted small mb-3">
                                    Dựa trên việc làm đã xem. Xóa lịch sử để nhận gợi ý mới
                                </p>

                                {/* Job Suggestion 1 */}
                                <div className="job-suggestion-card p-3 border rounded mb-2">
                                    <div className="d-flex align-items-center">
                                        <img src={logoPlaceholder} alt="" className="me-2" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
                                        <div className="flex-grow-1">
                                            <div className="small fw-bold text-primary">Kỹ sư xây dựng</div>
                                            <div className="small text-muted">Công ty Hà Tăng</div>
                                        </div>
                                        <Heart size={14} className="text-muted" />
                                    </div>
                                </div>

                                {/* Job Suggestion 2 */}
                                <div className="job-suggestion-card p-3 border rounded">
                                    <div className="d-flex align-items-center">
                                        <img src={logoPlaceholder} alt="" className="me-2" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
                                        <div className="flex-grow-1">
                                            <div className="small fw-bold text-primary">Kỹ sư giám sát</div>
                                            <div className="small text-muted">HANDONG</div>
                                        </div>
                                        <Heart size={14} className="text-muted" />
                                    </div>
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
        </div>
    );
}