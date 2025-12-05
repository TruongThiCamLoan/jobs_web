import React, { useState, useEffect, useCallback } from "react";
// SỬ DỤNG ICON LUCIDE-REACT ĐỂ TRÁNH LỖI BIÊN DỊCH VỚI react-bootstrap-icons
import { Heart, Globe, CheckCircle, AlertTriangle, Tag, Flag, X } from 'lucide-react';
import { Container, Row, Col, Card, Button, Tab, Nav, Alert, Badge, Spinner, Modal } from "react-bootstrap";
// ĐÃ LOẠI BỎ: import 'bootstrap/dist/css/bootstrap.min.css'; // Gây lỗi biên dịch
import axios from "axios"; 
import { useParams, Link } from "react-router-dom"; 

// ====================================================================
// KHÔI PHỤC IMPORTS GỐC CỦA DỰ ÁN BẠN
// ====================================================================
import AppNavbar from "../components/Navbar"; 
import JobService from "../services/job.service"; // Dịch vụ lấy chi tiết công việc
import { useAuth } from "../context/AuthContext";
import "./style.css"; 
import logoPlaceholder from "../img/Banner.jpg"; 


// Định nghĩa các thuộc tính chi tiết (FIXED: Trỏ tới Association mới)
const DETAIL_ATTRIBUTES = [
    { label: "Loại công việc", key: "jobTypeCategory.name", default: "Toàn thời gian" },
    { label: "Cấp bậc", key: "jobLevelCategory.name", default: "Nhân viên" },
    { label: "Ngành nghề", key: "industryCategory.name", default: "Kinh doanh" },
    
    { label: "Giới tính", key: "gender", default: "Không yêu cầu" },
    { label: "Học vấn", "key": "academicLevel", default: "Đại học" }, 
    { label: "Kinh nghiệm", "key": "experience", default: "1 năm" },
    { label: "Thời gian", "key": "workingHours", default: "Thứ 2 - Thứ 6" }, 
];

// Hàm helper (Giữ nguyên)
const getValueOrDefault = (value, defaultValue = '—') => {
    if (value === null || value === undefined) { return defaultValue; }
    if (typeof value === 'string' && value.trim() === '') { return defaultValue; }
    if (value === 0 && defaultValue === '—') { return 0; }
    return value;
};

// FIX: Hàm lấy giá trị lồng (nested) từ object (CẦN THIẾT cho Association.name)
const getNestedValue = (obj, path, defaultValue = '—') => {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
        if (!current || !current.hasOwnProperty(part)) {
            return defaultValue;
        }
        current = current[part];
    }
    return getValueOrDefault(current, defaultValue);
};

// Hàm định dạng ngày tháng (Giữ nguyên)
const formatDate = (d) => {
    if (!d) return "—";
    try {
        const date = new Date(d);
        if (isNaN(date.getTime()) || date.getFullYear() < 1900) return "—";
        return date.toLocaleDateString("vi-VN");
    } catch {
        return "—";
    }
};


export default function JobDetailPage() {
    const { id: jobId } = useParams(); 
    const { currentUser, isStudent, authToken } = useAuth(); 
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [alertMessage, setAlertMessage] = useState(null); 
    
    const [isApplying, setIsApplying] = useState(false);
    const [applyStatus, setApplyStatus] = useState(null); 
    const [hasApplied, setHasApplied] = useState(false); 

    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [isReporting, setIsReporting] = useState(false);

    // 1. Kiểm tra trạng thái đã ứng tuyển trước đó
    const checkApplicationStatus = useCallback(async () => {
        if (!authToken || !jobId) return;

        try {
            // SỬ DỤNG AXIOS GỐC
            const response = await axios.get(`http://localhost:8080/api/applications/${jobId}/status`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            
            if (response.data.hasApplied === true) {
                setHasApplied(true);
                setApplyStatus("success");
            }
        } catch (e) {
            setHasApplied(false);
        }
    }, [authToken, jobId]);


    // 2. Kiểm tra trạng thái lưu
    const checkSavedStatus = useCallback(async () => {
        if (!authToken || !jobId) {
            setIsSaved(false);
            return;
        }
        try {
            // SỬ DỤNG AXIOS GỐC
            const response = await axios.get("http://localhost:8080/api/saved-jobs", {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            
            // Giả định API /saved-jobs trả về mảng các đối tượng chứa jobId
            const jobIds = response.data.map(j => j.jobId.toString()); 
            setIsSaved(jobIds.includes(jobId));
        } catch (e) {
            console.error("Failed to check saved status:", e);
            setIsSaved(false);
        }
    }, [authToken, jobId]);
    

    // 3. Hàm Toggle Save (Gọi API /api/saved-jobs/toggle-save/:jobId)
    const handleToggleSaveJob = async () => {
        if (!authToken) {
            return setAlertMessage({ variant: "danger", message: "Vui lòng đăng nhập để lưu công việc." });
        }

        setIsSaving(true);
        setAlertMessage(null);

        try {
            // SỬ DỤNG AXIOS GỐC
            const endpoint = `http://localhost:8080/api/saved-jobs/toggle-save/${jobId}`;
            await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${authToken}` } });

            setIsSaved(prev => {
                setAlertMessage({ variant: "success", message: prev ? "Đã xóa khỏi danh sách lưu." : "Đã lưu vào danh sách yêu thích!" });
                return !prev;
            }); 

        } catch (error) {
            console.error("Lỗi khi lưu/bỏ lưu công việc:", error);
            setAlertMessage({ variant: "danger", message: "Lỗi: Không thể thực hiện thao tác lưu." });
        } finally {
            setIsSaving(false);
        }
    };


    // 4. Hàm Nộp đơn (handleApply)
    const handleApply = async () => {
        setAlertMessage(null);

        if (!authToken || !currentUser) {
            return setAlertMessage({ variant: "danger", message: "Vui lòng đăng nhập để ứng tuyển." });
        }
        if (!isStudent) {
            return setAlertMessage({ variant: "warning", message: "Bạn phải dùng tài khoản Ứng viên (Student) để nộp đơn." });
        }
        if (hasApplied || applyStatus === 'success') {
            return setAlertMessage({ variant: "info", message: "Bạn đã nộp đơn cho công việc này rồi." });
        }
        
        setIsApplying(true); 

        try {
            // SỬ DỤNG AXIOS GỐC
            const response = await axios.post(`http://localhost:8080/api/applications/${jobId}`, { resumeId: 1 }, { 
                headers: { Authorization: `Bearer ${authToken}` },
            });
            
            setApplyStatus("success");
            setHasApplied(true);
            setAlertMessage({ variant: "success", message: response.data.message || "Ứng tuyển thành công!" });

        } catch (error) {
            console.error("Lỗi khi ứng tuyển:", error.response || error);
            let errorMessage = "Lỗi: Không thể ứng tuyển. Vui lòng kiểm tra hồ sơ.";
            if (error.response?.data?.message) {
                 errorMessage = `Lỗi: ${error.response.data.message}`;
            }

            setApplyStatus("error");
            setAlertMessage({ variant: "danger", message: errorMessage });
        } finally {
            setIsApplying(false);
        }
    };

    const handleReportJob = async () => {
    if (!authToken) {
        return setAlertMessage({ variant: "danger", message: "Vui lòng đăng nhập để báo cáo công việc." });
    }
    if (!reportReason || reportReason.length < 10) {
        return setAlertMessage({ variant: "warning", message: "Vui lòng cung cấp lý do báo cáo chi tiết (tối thiểu 10 ký tự)." });
    }
    
    setIsReporting(true);
    setAlertMessage(null);

    try {
        // Thay thế URL này bằng endpoint API thực tế của bạn
        const endpoint = `http://localhost:8080/api/reports/job/${jobId}`;
        await axios.post(endpoint, { reason: reportReason }, { 
            headers: { Authorization: `Bearer ${authToken}` },
        });
        
        setAlertMessage({ variant: "success", message: "✅ Báo cáo của bạn đã được gửi đến Admin để xử lý!" });
        setShowReportModal(false);
        setReportReason(""); // Reset lý do
    } catch (error) {
        console.error("Lỗi khi báo cáo công việc:", error.response || error);
        const errorMessage = error.response?.data?.message || "Lỗi: Không thể gửi báo cáo.";
        setAlertMessage({ variant: "danger", message: errorMessage });
    } finally {
        setIsReporting(false);
    }
};

    // Load job detail khi component mount hoặc jobId thay đổi
    useEffect(() => {
        const load = async () => {
            try {
                // SỬ DỤNG JobService GỐC
                const response = await JobService.getJobDetail(jobId); 
                // Cần đảm bảo JobService trả về data thuần túy, hoặc trích xuất response.data ở đây.
                // Giữ lại logic trích xuất response.data để tương thích với các bước sửa lỗi trước đó.
                const jobData = response.data || response; 
                
                let tagsArray = [];
                if (jobData.tags) {
                    try {
                        tagsArray = (typeof jobData.tags === 'string' && jobData.tags.startsWith('[')) ? JSON.parse(jobData.tags) : jobData.tags;
                    } catch (e) { tagsArray = []; }
                }
                
                const finalJobData = {
                    ...jobData,
                    tags: Array.isArray(tagsArray) ? tagsArray : [],
                    employer: {
                        ...jobData.employer,
                        companyName: getValueOrDefault(jobData.employer?.companyName),
                        companyAddress: getValueOrDefault(jobData.employer?.companyAddress, 'Đang cập nhật địa chỉ'),
                        website: jobData.employer?.website || null 
                    }
                };

                setJob(finalJobData);

            } catch (err) {
                setError("Không tìm thấy công việc hoặc lỗi kết nối.");
            }
            setLoading(false);
            
            checkApplicationStatus();
            checkSavedStatus();
        };
        load();
    }, [jobId, checkApplicationStatus, checkSavedStatus]); 


    if (loading)
        return (
            <>
                <AppNavbar />
                <div className="text-center p-5 pt-5 mt-5">
                    <Spinner animation="border" className="text-primary"></Spinner>
                    <p className="mt-2">Đang tải thông tin...</p>
                </div>
            </>
        );

    if (error)
        return (
            <>
                <AppNavbar />
                <Container className="pt-5 mt-5">
                    <Alert variant="danger">{error}</Alert>
                </Container>
            </>
        );

    const employer = job?.employer || {};
    const jobSalary = getValueOrDefault(job.salary, 'Thương lượng');
    const jobExperience = getValueOrDefault(job.experience, 'Đang cập nhật');
    const jobGender = getValueOrDefault(job.gender, 'Không yêu cầu');
    
    // FIX: Lấy tên danh mục từ các Association mới bằng hàm getNestedValue
    const jobLevel = getNestedValue(job, 'jobLevelCategory.name', 'Nhân viên');
    const jobType = getNestedValue(job, 'jobTypeCategory.name', 'Toàn thời gian');
    const jobIndustry = getNestedValue(job, 'industryCategory.name', 'Kinh doanh');

    return (
        <div className="bg-light">
            <AppNavbar />

            {/* ======================= BANNER TOP ======================= */}
            <div className="job-header-bg border-bottom mt-5" style={{ padding: '2rem 0' }}>
                <Container className="py-4">

                    {/* Breadcrumb */}
                    <div className="text-muted small mb-2">
                        <Link to="/" className="text-decoration-none text-muted">Trang chủ</Link> /
                        <Link to="/jobs/search" className="text-decoration-none text-muted ms-1">Tìm việc</Link> /
                        <span className="ms-1 text-dark fw-semibold">{job.title}</span>
                    </div>

                    <Row>
                        {/* Left: Title + Company */}
                        <Col lg={8}>
                             <h2 className="fw-bold text-primary">{job.title}</h2>
                            <h5 className="text-muted">{employer.companyName}</h5>
                            <div className="d-flex align-items-center small text-muted mt-2">
                                <Globe size={16} className="me-2" /> Ngành: {jobIndustry}
                            </div>
                        </Col>
                        

                        {/* Right: Buttons */}
                        <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
                        <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => { 
                                if (authToken) {
                                    setShowReportModal(true);
                                } else {
                                    setAlertMessage({ variant: "danger", message: "Vui lòng đăng nhập để báo cáo công việc." });
                                }
                            }}
                            className="me-3 px-3 fw-semibold small"
                            disabled={!authToken || isReporting}
                        >
                            <Flag size={14} className="me-1" /> Báo cáo
                        </Button>
                            {/* NÚT NỘP ĐƠN NGAY */}
                            <Button
                                variant={hasApplied ? "success" : "primary"}
                                className="px-4 me-2 fw-semibold"
                                onClick={handleApply}
                                disabled={hasApplied || isApplying || !isStudent} 
                            >
                                {isApplying ? (
                                    <Spinner animation="border" size="sm" className="me-2" />
                                ) : hasApplied ? (
                                    <><CheckCircle size={16} className="me-2" />Đã nộp</>
                                ) : (
                                    "Nộp đơn ngay"
                                )}
                            </Button>

                            {/* NÚT LƯU CÔNG VIỆC */}
                            <Button 
                                variant={isSaved ? "danger" : "outline-primary"} 
                                onClick={handleToggleSaveJob}
                                disabled={isSaving || !authToken} 
                                title={isSaved ? "Bỏ lưu" : "Lưu việc làm"}
                            >
                                {isSaving ? <Spinner animation="border" size="sm" /> : (isSaved ? <Heart size={16} /> : <Heart size={16} />)}
                            </Button>

                            {alertMessage &&
                                <Alert
                                    variant={alertMessage.variant}
                                    className="mt-2 small text-center"
                                    onClose={() => setAlertMessage(null)} // Thêm hàm đóng Alert
                                    dismissible // Cho phép đóng Alert
                                >
                                    {alertMessage.message}
                                </Alert>
                            }
                        </Col>
                    </Row>

                </Container>
            </div>

            {/* ======================= PAGE BODY ======================= */}
            <Container className="py-4">

                <Row>

                    {/* ======================= LEFT COLUMN ======================= */}
                    <Col lg={8}>

                        {/* ==== THÔNG TIN CHUNG (JOB ATTRIBUTES) ===== */}
                        <Card className="border mb-4">
                            <Card.Body>
                                <Row className="g-3 small">

                                    <Col md={4}>
                                        <div className="text-muted">Mức lương</div>
                                        <div className="fw-semibold">{jobSalary}</div>
                                    </Col>

                                    <Col md={4}>
                                        <div className="text-muted">Kinh nghiệm</div>
                                        <div className="fw-semibold">{jobExperience}</div>
                                    </Col>

                                    <Col md={4}>
                                        <div className="text-muted">Hạn nộp hồ sơ</div>
                                        <div className="fw-semibold">{formatDate(job.deadline)}</div>
                                    </Col>

                                    <Col md={4}>
                                        <div className="text-muted">Giới tính</div>
                                        <div className="fw-semibold">{jobGender}</div>
                                    </Col>

                                    <Col md={4}>
                                        <div className="text-muted">Cấp bậc</div>
                                        <div className="fw-semibold">{jobLevel}</div> 
                                    </Col>

                                    <Col md={4}>
                                        <div className="text-muted">Hình thức làm việc</div>
                                        <div className="fw-semibold">{jobType}</div>
                                    </Col>

                                </Row>
                            </Card.Body>
                        </Card>

                        {/* ==== TABS (Mô tả, Yêu cầu, Quyền lợi) ===== */}
                        <Card className="border mb-4">
                            <Card.Body className="p-0">

                                <Tab.Container defaultActiveKey="mota">
                                    <Nav variant="tabs" className="border-bottom small px-3">
                                        <Nav.Item><Nav.Link eventKey="mota">Mô tả công việc</Nav.Link></Nav.Item>
                                        <Nav.Item><Nav.Link eventKey="yeucau">Yêu cầu</Nav.Link></Nav.Item>
                                        <Nav.Item><Nav.Link eventKey="quyenloi">Quyền lợi</Nav.Link></Nav.Item>
                                    </Nav>

                                    <Tab.Content className="p-4 small">

                                        {/* MÔ TẢ */}
                                        <Tab.Pane eventKey="mota">
                                            <h6 className="fw-bold mb-2">Mô tả công việc</h6>
                                            <div style={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
                                                {job.description || "Chưa có mô tả chi tiết."}
                                            </div>
                                        </Tab.Pane>

                                        {/* YÊU CẦU */}
                                        <Tab.Pane eventKey="yeucau">
                                            <h6 className="fw-bold mb-2">Yêu cầu ứng viên (Bao gồm Kỹ năng/Kinh nghiệm chi tiết)</h6>
                                            <div style={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
                                                {job.requirements || "Chưa có yêu cầu cụ thể."}
                                            </div>
                                            
                                            {/* KHỐI MÔ TẢ THUỘC TÍNH CHI TIẾT (Lấy từ array mới) */}
                                            <h6 className="fw-bold mt-4 mb-3">Mô tả các thuộc tính chi tiết</h6>
                                            <Row className="g-3 row-cols-2 row-cols-md-3 small">
                                                {DETAIL_ATTRIBUTES.map((detail, index) => (
                                                    <Col key={index}>
                                                        <Card className="p-2 border-0 bg-light">
                                                            <div className="fw-bold">{detail.label}</div>
                                                            <div className="text-muted">
                                                                {/* SỬ DỤNG getNestedValue CHO CÁC TRƯỜNG ASSOCIATION */}
                                                                {getNestedValue(job, detail.key, detail.default)}
                                                            </div>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>

                                        </Tab.Pane>

                                        {/* QUYỀN LỢI */}
                                        <Tab.Pane eventKey="quyenloi">
                                            <h6 className="fw-bold mb-2">Quyền lợi</h6>
                                            <div style={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
                                                {job.benefits || "Đang cập nhật phúc lợi."}
                                            </div>
                                        </Tab.Pane>

                                    </Tab.Content>
                                </Tab.Container>

                            </Card.Body>
                        </Card>

                        {/* ==== TAGS ===== */}
                        <Card className="border mb-4">
                            <Card.Body className="small">
                                <h6 className="fw-bold mb-2"><Tag size={16} className="me-2" />Từ khóa</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {/* Chắc chắn job.tags là một mảng trước khi map */}
                                    {(job.tags && Array.isArray(job.tags) ? job.tags : []).map((t, i) => (
                                        <Badge key={i} bg="light" text="dark" className="border px-3 py-2">
                                            {t}
                                        </Badge>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>

                        {/* ==== CẢNH BÁO ===== */}
                        <Alert variant="warning" className="small d-flex">
                            <AlertTriangle size={16} className="me-2 mt-1" />
                            <div>
                                KHÔNG chuyển bất kỳ khoản phí nào cho nhà tuyển dụng. Hãy cảnh giác nếu thấy dấu hiệu lừa đảo.
                            </div>
                        </Alert>

                    </Col>

                    {/* ======================= RIGHT SIDEBAR ======================= */}
                    <Col lg={4}>

                        {/* ---- COMPANY CARD ---- */}
                        <Card className="border mb-4 sticky-top" style={{ top: '80px', zIndex: 1 }}>
                            <Card.Body className="text-center">
                                <img
                                    src={employer.logoUrl || "https://placehold.co/90x90/ccc/white?text=Logo"}
                                    style={{ width: 90, height: 90, objectFit: "contain" }}
                                    className="border rounded p-2 bg-white"
                                />

                                <h6 className="fw-bold mt-3">{employer.companyName}</h6>

                                <div className="text-muted small mb-3">
                                    {employer.companyAddress}
                                </div>

                                <a href={employer.website || "#"} target="_blank" rel="noreferrer"
                                    className="btn btn-outline-primary w-100 btn-sm"
                                    disabled={!employer.website || employer.website === '—'}
                                >
                                    <Globe size={16} className="me-2" /> Website
                                </a>

                                <Button
                                    as={Link}
                                    to={`/employer/${employer.id}`}
                                    variant="link"
                                    className="btn-sm w-100 text-decoration-none mt-2"
                                >
                                    Xem trang công ty
                                </Button>
                            </Card.Body>
                        </Card>

                        {/* ---- SIMILAR JOBS ---- */}
                        <Card className="border mb-4">
                            <Card.Header className="fw-bold small bg-white">
                                Việc làm tương tự
                            </Card.Header>

                            <Card.Body className="p-0">

                                {[1, 2, 3].map((idx) => (
                                    <Link
                                        key={idx}
                                        to={`/jobs/${idx}`}
                                        className="d-block p-3 border-bottom small text-decoration-none action-hover"
                                    >
                                        <div className="fw-semibold text-primary">
                                            Nhân viên Sales Admin
                                        </div>
                                        <div className="text-muted small">Công ty TNHH ABC</div>

                                        <div className="d-flex justify-content-between mt-2">
                                            <span className="text-success fw-bold">10 - 15 triệu</span>
                                            <span className="text-muted">Hà Nội</span>
                                        </div>
                                    </Link>
                                ))}

                            </Card.Body>
                        </Card>

                    </Col>

                </Row>
            </Container>
            <Modal show={showReportModal} onHide={() => setShowReportModal(false)} centered>
    <Modal.Header closeButton>
        <Modal.Title className="fw-bold small d-flex align-items-center">
            <Flag size={20} className="me-2 text-warning"/> Báo cáo tin tuyển dụng
        </Modal.Title>
    </Modal.Header>
    <Modal.Body className="small">
        <p>Vui lòng cho chúng tôi biết lý do bạn muốn báo cáo công việc **{job?.title}** của công ty **{employer.companyName}**.</p>
        
        <div className="form-group mb-3">
            <label className="fw-semibold mb-1">Lý do báo cáo:</label>
            <textarea
                className="form-control"
                rows="4"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Ví dụ: Công việc có dấu hiệu lừa đảo, thông tin sai lệch, hoặc yêu cầu thu phí..."
                disabled={isReporting}
            ></textarea>
            <small className="text-muted">Tối thiểu 10 ký tự.</small>
        </div>

        {alertMessage && alertMessage.variant !== 'success' && (
            <Alert variant={alertMessage.variant} className="small">
                {alertMessage.message}
            </Alert>
        )}
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowReportModal(false)} disabled={isReporting}>
            <X size={16} className="me-1" /> Hủy
        </Button>
        <Button variant="warning" onClick={handleReportJob} disabled={isReporting || reportReason.length < 10}>
            {isReporting ? <Spinner animation="border" size="sm" className="me-2" /> : <Flag size={16} className="me-1" />}
            Gửi báo cáo
        </Button>
    </Modal.Footer>
</Modal>

            {/* FOOTER */}
            <footer className="py-4 border-top text-center small text-muted bg-white">
                © 2025 CareerLink Clone. All rights reserved.
            </footer>
        </div>
    );
}