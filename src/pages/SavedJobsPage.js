// src/pages/SavedJobsPage.js
import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button, Nav, Alert, Spinner } from "react-bootstrap";
import { Heart, FileText, XCircle, HeartFill, Briefcase, Person, Bell } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom"; // IMPORT useNavigate
import axios from "axios"; 
import { useAuth } from "../context/AuthContext"; 
import AppNavbar from "../components/Navbar";
import "./style.css";

// TÀI SẢN CỤC BỘ (FIX: Thay thế URL không hoạt động)
import logoPlaceholder from "../img/Banner.jpg"; 

// Hàm giả định tính ngày hết hạn
const getDaysUntilExpiry = (deadline) => {
    if (!deadline) return "Không rõ";
    return Math.floor(Math.random() * 30) + 5; 
};

export default function SavedJobsPage() {
    const { authToken, isStudent } = useAuth(); // Cần isStudent để kiểm tra vai trò
    const navigate = useNavigate(); // Hook chuyển hướng
    
    const [savedJobs, setSavedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 🎯 STATE MỚI: Để theo dõi công việc đang được nộp đơn
    const [isApplyingId, setIsApplyingId] = useState(null); 

    // 1. LẤY DANH SÁCH VIỆC ĐÃ LƯU (SỬ DỤNG useCallback)
    const fetchSavedJobs = useCallback(async () => {
        if (!authToken) {
            setIsLoading(false);
            setError("Vui lòng đăng nhập để xem công việc đã lưu.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:8080/api/saved-jobs", {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setSavedJobs(response.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách công việc đã lưu:", err);
            setError("Không thể tải danh sách công việc. Vui lòng kiểm tra kết nối API.");
            setSavedJobs([]);
        } finally {
            setIsLoading(false);
        }
    }, [authToken]);


    // 2. XÓA VIỆC ĐÃ LƯU QUA API (SỬ DỤNG useCallback)
    const handleRemoveJob = useCallback(async (jobIdToRemove) => {
        if (!authToken) return;
        
        const jobToRemove = savedJobs.find(job => job.jobId === jobIdToRemove);
        setSavedJobs(prevJobs => prevJobs.filter(job => job.jobId !== jobIdToRemove));

        try {
            const endpoint = `http://localhost:8080/api/saved-jobs/toggle-save/${jobIdToRemove}`;
            await axios.post(endpoint, {}, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            
        } catch (error) {
            console.error("Lỗi khi xóa công việc đã lưu:", error);
            setError("Không thể xóa công việc đã lưu. Vui lòng thử lại.");
            
            if (jobToRemove) {
                setSavedJobs(prevJobs => [jobToRemove, ...prevJobs].sort((a, b) => new Date(b.savedDate) - new Date(a.savedDate))); 
            }
        }
    }, [authToken, savedJobs]);


    // 🎯 3. HÀM XỬ LÝ ỨNG TUYỂN NHANH (MỚI)
    const handleQuickApply = async (jobId) => {
        if (!authToken) {
            setError("Vui lòng đăng nhập để nộp đơn.");
            return;
        }
        if (!isStudent) {
             setError("Bạn phải là ứng viên để nộp đơn.");
            return;
        }

        setIsApplyingId(jobId); // Bắt đầu hiển thị spinner
        setError(null);
        
        try {
            // ENDPOINT: POST /api/applications/:jobId (API ứng tuyển)
            const response = await axios.post(`http://localhost:8080/api/applications/${jobId}`, {}, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            
            // Xử lý thành công: Xóa công việc khỏi danh sách đã lưu và chuyển hướng
            setSavedJobs(prevJobs => prevJobs.filter(job => job.jobId !== jobId));
            
            // Chuyển hướng người dùng đến trang lịch sử ứng tuyển
            navigate('/applied-jobs');
            
        } catch (error) {
            console.error("Lỗi khi ứng tuyển nhanh:", error);
            const msg = error.response?.data?.message || "Lỗi nộp đơn. Vui lòng kiểm tra hồ sơ.";
            setError(msg);
            
        } finally {
            setIsApplyingId(null); // Tắt spinner
        }
    };


    useEffect(() => {
        fetchSavedJobs();
    }, [fetchSavedJobs]);

    // Hiển thị loading/error khi cần
    if (isLoading) {
        return (
            <>
                <AppNavbar />
                <Container className="text-center p-5 pt-5 mt-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Đang tải danh sách việc làm đã lưu...</p>
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
                                 <Briefcase size={14} className="me-1" /> My Jobs
                             </Nav.Link>
                             
                             {/* 2. HỒ SƠ XIN VIỆC (ĐANG ACTIVE LÀ MỤC CON: Tải hồ sơ lên) */}
                             <Nav.Link as={Link} to="/resume" className="text-dark py-1">
                                 <FileText size={14} className="me-1" /> Hồ sơ xin việc (0)
                             </Nav.Link>
     
                             {/* 3. VIỆC ĐÃ LƯU */}
                             <Nav.Link as={Link} to="/saved-jobs" className="text-primary fw-semibold border-bottom border-primary border-3 pb-1">
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
                    {/* LEFT COLUMN: VIỆC ĐÃ LƯU (8/12) */}
                    <Col lg={8}>
                        <h5 className="fw-bold mb-3">Công việc đã lưu ({savedJobs.length})</h5>
                        
                        {error && <Alert variant="danger">{error}</Alert>}

                        {savedJobs.length === 0 ? (
                            <Alert variant="info" className="text-center">
                                Bạn chưa lưu công việc nào.
                            </Alert>
                        ) : (
                            savedJobs.map(job => (
                                // JOB ITEM
                                <div key={job.jobId} className="bg-white p-4 rounded shadow-sm mb-3 border">
                                    <div className="d-flex align-items-start justify-content-between">
                                        <div className="d-flex align-items-start">
                                            {/* Icon trái tim màu đỏ */}
                                            <HeartFill className="text-danger me-3 mt-1" size={24} /> 
                                            <div className="flex-grow-1">
                                                {/* Dùng Link để chuyển đến trang chi tiết */}
                                                <Link to={`/jobs/${job.jobId}`} className="text-decoration-none">
                                                    <h6 className="fw-bold text-success mb-1 action-hover-text">
                                                        {job.title}
                                                    </h6>
                                                </Link>
                                                <div className="small text-muted mb-1">
                                                    <strong>{job.companyName}</strong>
                                                </div>
                                                <div className="small text-danger">
                                                    Hết hạn: {getDaysUntilExpiry(job.deadline)} ngày tới
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="d-flex align-items-center gap-2">
                                            {/* Nút Xóa */}
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleRemoveJob(job.jobId)}
                                                title="Xóa khỏi danh sách đã lưu"
                                            >
                                                <XCircle size={14} /> Xóa
                                            </Button>

                                            {/* Nút Ứng tuyển nhanh (Đã sửa) */}
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                onClick={() => handleQuickApply(job.jobId)} // Gọi hàm xử lý ứng tuyển
                                                disabled={isApplyingId === job.jobId || !authToken || !isStudent} // Disable nếu đang tải/chưa đăng nhập
                                            >
                                                {isApplyingId === job.jobId ? (
                                                    <Spinner animation="border" size="sm" />
                                                ) : (
                                                    "Ứng tuyển ngay"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
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

            {/* ZALO BUTTON
            <div className="position-fixed bottom-0 end-0 p-3">
                <a href="#" className="btn btn-primary rounded-circle shadow-lg" style={{ width: 50, height: 50 }}>
                    <img src="https://img.icons8.com/color/48/000000/zalo.png" alt="Zalo" />
                </a>
            </div> */}
        </div>
    );
}