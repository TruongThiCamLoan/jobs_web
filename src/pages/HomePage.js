import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AppNavbar from "../components/Navbar"; 
import JobService from "../services/job.service"; 
import { Search, GeoAlt } from "react-bootstrap-icons";
import "./style.css";

// IMPORT MOCK ASSETS
import banner1 from "../img/banner1.jpg";
import banner2 from "../img/banner2.jpg";
import banner3 from "../img/banner3.jpg";
import banner4 from "../img/banner4.jpg"; 
import Banner from "../img/Banner.jpg";
import logoPlaceholder from "../img/Banner.jpg";

// DỮ LIỆU DỰ PHÒNG (FALLBACK) CẦN ĐƯỢC KHAI BÁO LẠI (Sử dụng ID/Value mock)
const MOCK_CATEGORIES_FALLBACK = [
    { label: "Kế toán / Kiểm toán", value: "mock_1", icon: "calculator", link: "/jobs/search?career=mock_1" },
    { label: "Quảng cáo / Marketing", value: "mock_2", icon: "megaphone", link: "/jobs/search?career=mock_2" },
    { label: "Nông nghiệp / Lâm nghiệp", value: "mock_3", icon: "seedling", link: "/jobs/search?career=mock_3" },
    { label: "Nghệ thuật / Sáng tạo", value: "mock_4", icon: "brush", link: "/jobs/search?career=mock_4" },
    { label: "Ngân hàng / Tài chính", value: "mock_5", icon: "university", link: "/jobs/search?career=mock_5" },
    { label: "Thư ký / Hành chính", value: "mock_6", icon: "tools", link: "/jobs/search?career=mock_6" },
];


// Hàm ánh xạ ID job thành logo giả định (Không đổi)
const getMockLogo = (jobId) => {
    switch (jobId % 3) {
        case 0: return banner2;
        case 1: return banner3;
        case 2: return banner4;
        default: return Banner;
    }
}

// Helper: Lấy Icon cho Ngành nghề (Không đổi)
const CategoryIcon = ({ name }) => {
    switch (name) {
        case 'calculator': return <i className="bi bi-calculator-fill text-primary" style={{ fontSize: '2rem' }}></i>;
        case 'megaphone': return <i className="bi bi-megaphone-fill text-primary" style={{ fontSize: '2rem' }}></i>;
        case 'seedling': return <i className="bi bi-flower1 text-primary" style={{ fontSize: '2rem' }}></i>;
        case 'brush': return <i className="bi bi-brush-fill text-primary" style={{ fontSize: '2rem' }}></i>;
        case 'university': return <i className="bi bi-bank text-primary" style={{ fontSize: '2rem' }}></i>;
        case 'tools': return <i className="bi bi-gear-fill text-primary" style={{ fontSize: '2rem' }}></i>;
        default: return <i className="bi bi-briefcase-fill text-primary" style={{ fontSize: '2rem' }}></i>;
    }
};

// DỮ LIỆU DỰ PHÒNG (FALLBACK) CHO NHÀ TUYỂN DỤNG
const MOCK_EMPLOYERS_FALLBACK = [
    { 
        id: 1,
        name: "Công ty TNHH Aeon Delight Việt Nam", 
        jobs: 10, 
        location: "Hưng Yên, Hà Nội", 
        logo: banner2 
    },
    { 
        id: 2,
        name: "Công Ty TNHH Vietnam Concentrix Service", 
        jobs: 317, 
        location: "Hồ Chí Minh", 
        logo: banner3 
    },
    { 
        id: 3,
        name: "SGS Vietnam Ltd.", 
        jobs: 69, 
        location: "Hồ Chí Minh", 
        logo: banner4
    },
    { 
        id: 4,
        name: "CÔNG TY TNHH ID DECOR", 
        jobs: 0, 
        location: "Hồ Chí Minh", 
        logo: Banner
    },
];


export default function HomePage() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [topEmployers, setTopEmployers] = useState([]);
    
    // STATE: Danh sách ngành nghề động
    const [industryCategories, setIndustryCategories] = useState([]);
    const [loadingIndustries, setLoadingIndustries] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [loading, setLoading] = useState(true); 
    const [loadingEmployers, setLoadingEmployers] = useState(true); 
    const [error, setError] = useState(null);
    const [errorEmployers, setErrorEmployers] = useState(null);
    const [errorIndustries, setErrorIndustries] = useState(null);


    // Hàm định dạng ngày (Không đổi)
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        if (diffHours < 24) return `${diffHours} giờ trước`;
        
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays <= 7) return `${diffDays} ngày trước`;
        return 'Hơn 1 tuần';
    };


    // HÀM TẢI DỮ LIỆU JOB TỪ BACKEND (Không đổi)
    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const jobData = await JobService.getJobList({
                search: searchTerm, 
                location: locationFilter
            });
            setJobs(jobData);
        } catch (e) {
            console.error("Lỗi tải danh sách việc làm:", e);
            setError("Không thể tải danh sách việc làm. Vui lòng kiểm tra kết nối Backend.");
        } finally {
            setLoading(false);
        }
    };
    
    // HÀM TẢI DỮ LIỆU NHÀ TUYỂN DỤNG TỪ BACKEND (Giữ nguyên)
    const fetchTopEmployers = async () => {
        setLoadingEmployers(true);
        setErrorEmployers(null);
        try {
            const employerData = await JobService.getTopEmployers(); 
            if (employerData && employerData.length > 0) {
                 setTopEmployers(employerData);
            } else {
                 setTopEmployers(MOCK_EMPLOYERS_FALLBACK);
            }
        } catch (e) {
            console.error("Lỗi tải nhà tuyển dụng:", e);
            setErrorEmployers("Không thể tải danh sách nhà tuyển dụng từ API.");
            setTopEmployers(MOCK_EMPLOYERS_FALLBACK); 
        } finally {
            setLoadingEmployers(false);
        }
    };

    // HÀM TẢI NGÀNH NGHỀ TỪ API DANH MỤC (Cập nhật logic fallback)
    const fetchIndustryCategories = useCallback(async () => {
        setLoadingIndustries(true);
        setErrorIndustries(null);
        try {
            const allFilters = await JobService.getDynamicFilters();
            
            // Dữ liệu thật từ API
            if (allFilters.career && allFilters.career.length > 0) {
                setIndustryCategories(allFilters.career);
            } else {
                // Nếu API trả về mảng rỗng, dùng fallback
                setIndustryCategories(MOCK_CATEGORIES_FALLBACK);
            }
            
        } catch (e) {
            console.error("Lỗi tải ngành nghề:", e);
            setErrorIndustries("Không thể tải danh mục ngành nghề.");
            // Dùng fallback nếu lỗi API
            setIndustryCategories(MOCK_CATEGORIES_FALLBACK);
        } finally {
            setLoadingIndustries(false);
        }
    }, []);


    // Tải Job, Employers và Industries khi Component mount
    useEffect(() => {
        fetchJobs(); 
        fetchTopEmployers();
        fetchIndustryCategories(); 
    }, [fetchIndustryCategories]); 

    // Xử lý tìm kiếm khi người dùng nhấn nút (CHUYỂN HƯỚNG SANG JOBSearchPage)
    const handleSearch = (e) => {
        e.preventDefault();
        const query = new URLSearchParams();
        if (searchTerm) query.append('search', searchTerm);
        if (locationFilter) query.append('location', locationFilter);
        
        navigate(`/jobs/search?${query.toString()}`);
    };

    // Hàm giả định để lấy số lượng job (vì API danh mục không trả về count)
    const getMockJobCount = (index) => {
        return (index + 1) * 100 + (index * 5); 
    }


    return (
        <div className="homepage">
            <AppNavbar />

            {/* HERO SECTION */}
            <section className="hero-section position-relative">
                <img src={Banner} alt="Banner" className="banner-img" />
                <div className="banner-overlay"></div>

                <div className="banner-content position-absolute w-100 text-center text-white">
                    <Container className="h-100 d-flex flex-column justify-content-center align-items-center">
                        <h1 className="display-4 fw-bold mb-3">VIECLAM24H.vn</h1>
                        <h3 className="fw-medium mb-4">
                            nay đã có mặt trên <span className="text-warning fw-bold">Zalo OA</span>
                        </h3>

                        {/* SEARCH BAR TÍCH HỢP */}
                        <form onSubmit={handleSearch} className="w-100">
                            <Row className="justify-content-center w-100 mb-4 g-3">
                                <Col lg={3}>
                                    <div className="search-box bg-white shadow-sm rounded">
                                        <div className="d-flex align-items-center h-100 px-3">
                                            <input
                                                type="text"
                                                placeholder="Tên vị trí, công ty, từ khóa"
                                                className="border-0 flex-grow-1 py-3"
                                                style={{ outline: "none" }}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={3}>
                                    <div className="search-box bg-white shadow-sm rounded">
                                        <div className="d-flex align-items-center h-100 px-3">
                                            <input
                                                type="text"
                                                placeholder="Tỉnh / Thành phố"
                                                className="border-0 flex-grow-1 py-3"
                                                style={{ outline: "none" }}
                                                value={locationFilter}
                                                onChange={(e) => setLocationFilter(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={2}>
                                    <button type="submit" className="search-btn btn btn-primary w-100 h-100 rounded fw-bold d-flex align-items-center justify-content-center">
                                        <Search className="me-2"/> {'Tìm kiếm'}
                                    </button>
                                </Col>
                            </Row>
                        </form>

                        <img src={banner1} alt="QR Zalo" className="qr-img mb-3" />
                        <Button variant="primary" size="lg" className="px-5 py-2 rounded-pill fw-bold">
                            Tìm Hiểu Thêm
                        </Button>
                    </Container>
                    <div className="p-3 text-center">
                        

[Image of Job Search Form]

                    </div>
                </div>
            </section>

            {/* JOB LIST DỮ LIỆU ĐỘNG */}
            <Container className="my-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="fw-bold">Việc làm hấp dẫn</h4>
                    <Link to="/jobs/search" className="text-primary fw-semibold">
                        Xem tất cả
                    </Link>
                </div>
                
                {error && <div className="alert alert-danger text-center">{error}</div>}
                {loading && <div className="text-center text-primary fw-semibold"><Spinner animation="border" size="sm" className="me-2"/> Đang tải việc làm...</div>}


                <Row className="g-3">
                    {!loading && jobs.length > 0 ? (
                        jobs.map(job => (
                            <Col md={4} key={job.jobId}>
                                <Link to={`/jobs/${job.jobId}`} style={{ textDecoration: 'none' }}>
                                    <Card className="job-card shadow-sm border-0 h-100 transition-shadow">
                                        <Card.Body>
                                            {job.status === 'Active' && <span className="badge bg-danger mb-2">HOT</span>} 
                                            <div className="d-flex align-items-center mb-2">
                                                <img 
                                                    src={job.employer?.logoUrl || getMockLogo(job.jobId)} 
                                                    alt={job.employer?.companyName || 'Công ty'} 
                                                    height="40" 
                                                    className="me-3 rounded" 
                                                />
                                                <div>
                                                    <Card.Title className="h6 fw-bold mb-0 text-primary">
                                                        {job.title}
                                                    </Card.Title>
                                                    <Card.Text className="text-muted small mb-1">
                                                        {job.employer?.companyName || 'Công ty chưa cập nhật'} 
                                                    </Card.Text>
                                                    <Card.Text className="text-muted small mb-1">{job.location}</Card.Text>
                                                    <Card.Text className="text-muted small">{job.salary || 'Thương lượng'}</Card.Text>
                                                </div>
                                            </div>
                                        </Card.Body>
                                        <Card.Footer className="text-muted small bg-white border-0">
                                            Đăng {formatTimeAgo(job.createdAt)}
                                        </Card.Footer>
                                    </Card>
                                </Link>
                            </Col>
                        ))
                    ) : !loading && (
                        <Col><p className="text-center text-muted w-100">Không tìm thấy việc làm nào phù hợp.</p></Col>
                    )}
                </Row>
            </Container>

            {/* --- VIỆC LÀM THEO NGÀNH NGHỀ (DYNAMIC) --- */}
            <Container className="my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold">Việc làm theo ngành nghề</h4>
                    <Link to="/jobs/search" className="text-primary fw-semibold">
                        Xem tất cả
                    </Link>
                </div>
                
                {loadingIndustries && <div className="text-center text-primary fw-semibold"><Spinner animation="border" size="sm" className="me-2"/> Đang tải ngành nghề...</div>}
                {errorIndustries && <div className="alert alert-danger text-center">{errorIndustries}</div>}

                <Row className="g-3">
                    {!loadingIndustries && industryCategories.length > 0 ? (
                        industryCategories.map((category, index) => (
                            <Col xs={6} sm={4} md={2} key={category.value}> 
                                {/* Link sẽ chuyển hướng đến trang tìm kiếm với bộ lọc career=ID (category.value) */}
                                <Link to={`/jobs/search?career=${category.value}`} style={{ textDecoration: 'none' }}>
                                    <Card className="text-center h-100 p-2 shadow-sm border-0 category-card transition-shadow">
                                        <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                                            <div className="category-icon-wrapper rounded-circle p-3 mb-2 border border-primary" style={{ backgroundColor: '#e0f0ff' }}>
                                                {/* Vẫn sử dụng logic mock/fallback cho icon vì API danh mục không cung cấp icon */}
                                                <CategoryIcon name={MOCK_CATEGORIES_FALLBACK[index % MOCK_CATEGORIES_FALLBACK.length]?.icon || 'briefcase'} /> 
                                            </div>
                                            <div className="fw-semibold text-dark mb-1 small">{category.label}</div>
                                            {/* Số lượng việc làm: Dùng hàm mock tạm thời */}
                                            <div className="text-muted small">{getMockJobCount(index)} việc làm</div>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))
                    ) : !loadingIndustries && (
                         <Col><p className="text-center text-muted w-100">Không có ngành nghề nào được tìm thấy.</p></Col>
                    )}
                </Row>
            </Container>
            
            {/* --- NHÀ TUYỂN DỤNG HÀNG ĐẦU (DYNAMIC) --- */}
            <Container className="my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold">Nhà tuyển dụng hàng đầu</h4>
                    <Link to="/employers" className="text-primary fw-semibold">
                        Xem tất cả
                    </Link>
                </div>
                {errorEmployers && <div className="alert alert-danger text-center">{errorEmployers}</div>}

                <Row className="g-3">
                    {loadingEmployers ? (
                        <div className="text-center text-primary fw-semibold"><Spinner animation="border" size="sm" className="me-2"/> Đang tải nhà tuyển dụng...</div>
                    ) : (
                        topEmployers.map((employer, index) => (
                            <Col xs={6} sm={4} md={3} key={employer.id || index}>
                                <Link to={`/employer/${employer.id}`} style={{ textDecoration: 'none' }}>
                                    <Card className="text-center h-100 p-3 shadow-sm border-0 employer-card transition-shadow">
                                        <Card.Body className="d-flex flex-column align-items-center justify-content-start">
                                            <div className="employer-logo-wrapper mb-3 border rounded-circle p-2" style={{ width: '80px', height: '80px' }}>
                                                <img 
                                                    src={employer.logo || employer.logoUrl || logoPlaceholder} 
                                                    alt={employer.name} 
                                                    className="rounded-circle w-100 h-100" 
                                                    style={{ objectFit: 'cover' }}
                                                    onError={(e) => { e.target.onerror = null; e.target.src=logoPlaceholder; }}
                                                />
                                            </div>
                                            <Card.Title className="h6 fw-bold mb-1 text-dark">{employer.name}</Card.Title>
                                            <div className="text-muted small">{employer.jobs || 0} việc đang tuyển</div>
                                            <div className="text-secondary small mt-1"><GeoAlt size={12} className="me-1"/> {employer.location}</div>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))
                    )}
                </Row>
            </Container>


            <footer className="text-center py-3 bg-light border-top">
                <small>© 2025 - Việc Làm Sinh Viên | React + Bootstrap</small>
            </footer>
        </div>
    );
}