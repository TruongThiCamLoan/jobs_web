import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Dropdown, Spinner } from "react-bootstrap";
// Import các icon cần thiết từ react-bootstrap-icons
import { Search, GeoAlt, FunnelFill, Briefcase, CashStack, Clock, Award, List } from "react-bootstrap-icons"; 
import { Link, useLocation } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import JobService from "../services/job.service"; // Đã chứa getDynamicFilters
import "./style.css"; 
import logoPlaceholder from "../img/Banner.jpg";

// Danh sách cố định MOCK_FILTERS được loại bỏ, thay bằng dynamicFilters

// Hàm ánh xạ tên filter và Icon (Không đổi)
const FILTER_ICONS = {
    career: { icon: List, label: "Ngành nghề" },
    level: { icon: Award, label: "Cấp bậc" },
    experience: { icon: Clock, label: "Kinh nghiệm" },
    salary: { icon: CashStack, label: "Mức lương" },
    jobType: { icon: Briefcase, label: "Loại công việc" },
};


export default function JobSearchPage() {
    const location = useLocation();
    
    // ⭐ STATE MỚI: Dữ liệu lọc động từ API
    const [dynamicFilters, setDynamicFilters] = useState({
        career: [], level: [], experience: [], salary: [], jobType: []
    });
    const [filterLoading, setFilterLoading] = useState(true);

    // Khởi tạo state filters
    const [filters, setFilters] = useState({
        search: "",
        location: "",
        salary: "",
        experience: "",
        jobType: "",
        career: "", 
        level: "" 
    });

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    // --- HÀM TẢI DỮ LIỆU LỌC TỪ API (MỚI) ---
    const fetchDynamicFilters = async () => {
        setFilterLoading(true);
        try {
            const data = await JobService.getDynamicFilters(); 
            setDynamicFilters(data);
        } catch (error) {
            console.error("Lỗi tải bộ lọc động:", error);
            // Sẽ không đặt apiError nghiêm trọng nếu chỉ là lỗi tải bộ lọc
        } finally {
            setFilterLoading(false);
        }
    };
    
    // Hàm gọi API tìm kiếm Jobs (Không đổi)
    const fetchJobs = useCallback(async (currentFilters) => {
        setLoading(true);
        setApiError(null);
        try {
            const activeFilters = {};
            Object.keys(currentFilters).forEach(key => {
                if (currentFilters[key]) activeFilters[key] = currentFilters[key];
            });

            const data = await JobService.getJobList(activeFilters);
            setJobs(data);
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
            setApiError("Không thể tải danh sách việc làm. Vui lòng kiểm tra trạng thái API hoặc kết nối mạng.");
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // ⭐ useEffect 1: Tải bộ lọc động khi component mount
    useEffect(() => {
        fetchDynamicFilters();
    }, []); 
    
    // ⭐ useEffect 2: Xử lý URL và Tải Jobs (Chạy khi URL HOẶC filterLoading thay đổi)
    useEffect(() => {
        // Chỉ chạy khi dynamicFilters đã được tải xong
        if (filterLoading) return; 

        const queryParams = new URLSearchParams(location.search);
        const searchFromUrl = queryParams.get("search") || "";
        const locationFromUrl = queryParams.get("location") || "";
        
        setFilters(prev => {
            const newFilters = { 
                ...prev, 
                search: searchFromUrl, 
                location: locationFromUrl,
                // Reset các bộ lọc dropdown khi có tìm kiếm mới từ trang chủ
                salary: "",
                experience: "",
                jobType: "",
                career: "", 
                level: "" 
            };
            
            // Tải jobs ngay sau khi filters được cập nhật
            fetchJobs(newFilters);
            return newFilters;
        });

    }, [location.search, filterLoading, fetchJobs]);

    // Xử lý thay đổi bộ lọc (Cho cả Input và Dropdown)
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Áp dụng bộ lọc hiện tại và tải lại jobs
        fetchJobs(filters);
    };

    // Hàm tạo tiêu đề Dropdown động (SỬ DỤNG dynamicFilters)
    const getDropdownLabel = (name, defaultValue) => {
        const value = filters[name];
        if (!value) return defaultValue;
        
        // ⭐ SỬ DỤNG dynamicFilters
        const options = dynamicFilters[name];
        const selectedOption = options ? options.find(opt => opt.value === value) : null;
        
        return selectedOption ? selectedOption.label : value;
    };
    
    // Component Dropdown Button tùy chỉnh
    const FilterDropdown = ({ name, title, mockOptions, icon }) => {
        const Icon = icon;
        const currentLabel = getDropdownLabel(name, title);
        const isActive = filters[name];

        return (
            <Dropdown onSelect={(eventKey) => handleFilterChange(name, eventKey)}>
                <Dropdown.Toggle 
                    variant="light" 
                    id={`dropdown-${name}`} 
                    className={`filter-button-custom ${isActive ? 'active-filter' : 'text-dark'}`}
                >
                    <Icon className="me-2" />
                    {currentLabel}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {mockOptions && mockOptions.map(item => (
                        <Dropdown.Item 
                            key={item.value} 
                            eventKey={item.value}
                            active={filters[name] === item.value}
                        >
                            {item.label}
                        </Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey={""} className="text-danger">Xóa lọc</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    };


    return (
        <div className="bg-light min-vh-100">
            <AppNavbar />
            
            {/* --- THANH LỌC NGANG (HORIZONTAL FILTER BAR) --- */}
            <div className="bg-white border-bottom mb-4 shadow-sm" style={{ paddingTop: '70px' }}>
                <Container className="py-2">
                    {/* Hiển thị Loading Bộ lọc */}
                    {filterLoading ? (
                        <div className="text-center py-2 text-primary">
                            <Spinner animation="border" size="sm" className="me-2" /> Đang tải bộ lọc...
                        </div>
                    ) : (
                        <div className="d-flex flex-wrap gap-2">
                            
                            {/* Ngành nghề (SỬ DỤNG DYNAMIC DATA) */}
                            <FilterDropdown 
                                name="career" 
                                title="Ngành nghề" 
                                icon={List} 
                                mockOptions={dynamicFilters.career}
                            />

                            {/* Cấp bậc (SỬ DỤNG DYNAMIC DATA) */}
                            <FilterDropdown 
                                name="level" 
                                title="Cấp bậc" 
                                icon={Award} 
                                mockOptions={dynamicFilters.level}
                            />
                            
                            {/* Kinh nghiệm (SỬ DỤNG DYNAMIC DATA) */}
                            <FilterDropdown 
                                name="experience" 
                                title="Kinh nghiệm" 
                                icon={Clock} 
                                mockOptions={dynamicFilters.experience}
                            />

                            {/* Mức lương (SỬ DỤNG DYNAMIC DATA) */}
                            <FilterDropdown 
                                name="salary" 
                                title="Mức lương" 
                                icon={CashStack} 
                                mockOptions={dynamicFilters.salary}
                            />

                            {/* Loại công việc (SỬ DỤNG DYNAMIC DATA) */}
                            <FilterDropdown 
                                name="jobType" 
                                title="Loại công việc" 
                                icon={Briefcase} 
                                mockOptions={dynamicFilters.jobType}
                            />
                            
                            {/* Input Search và Location và Nút Áp dụng */}
                            <Form onSubmit={handleSearchSubmit} className="d-flex flex-wrap gap-2">

                                {Object.values(filters).some(v => v) && (
                                    <Button 
                                        type="button" 
                                        variant="outline-danger" 
                                        size="sm" 
                                        className="my-1 fw-bold"
                                        onClick={() => setFilters({ search: '', location: '', salary: '', experience: '', jobType: '', career: '', level: '' })}
                                    >
                                        Xóa tất cả
                                    </Button>
                                )}
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    size="sm" 
                                    className="my-1 fw-bold"
                                >
                                    Áp dụng
                                </Button>
                            </Form>

                        </div>
                    )}
                </Container>
            </div>
            
            {/* --- CSS TÙY CHỈNH CHO FILTER BUTTON (Không đổi) --- */}
            <style jsx="true">{`
                .filter-button-custom {
                    background-color: #f0f4f7;
                    border: 1px solid #d4e0e8;
                    color: #333;
                    border-radius: 20px !important;
                    padding: 8px 15px;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    transition: background-color 0.2s, border-color 0.2s;
                    min-height: 40px; 
                }
                .filter-button-custom:hover, .active-filter {
                    background-color: #e0f0ff !important;
                    border-color: #007bff !important;
                    color: #007bff !important;
                    box-shadow: none !important;
                }
                .filter-button-custom::after {
                    margin-left: 10px;
                }
                .active-filter {
                    background-color: #e0f0ff;
                    border-color: #007bff;
                    color: #007bff;
                }
            `}</style>


            <Container className="my-4">
                <Row>
                    {/* --- DANH SÁCH KẾT QUẢ --- */}
                    <Col lg={12}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold">
                                {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${jobs.length} việc làm tại ${filters.location || 'khu vực'}`}
                            </h5>
                            <div className="text-muted small">Sắp xếp theo: <span className="fw-bold text-dark">Mới nhất</span></div>
                        </div>
                        
                        {apiError && <Alert variant="danger" className="text-center">{apiError}</Alert>}
                        {loading && <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>}

                        {!loading && jobs.length === 0 && !apiError && (
                            <Alert variant="warning" className="text-center py-5">
                                <h5>Không tìm thấy công việc nào.</h5>
                                <p>Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
                            </Alert>
                        )}

                        {!loading && jobs.map(job => (
                            <Card key={job.jobId} className="mb-3 border-0 shadow-sm job-card-hover">
                                <Card.Body className="p-3">
                                    <Row>
                                        <Col xs={2} md={1} className="d-flex align-items-center justify-content-center">
                                            <img 
                                                src={job.employer?.logoUrl || logoPlaceholder} 
                                                alt="Logo" 
                                                className="img-fluid rounded border"
                                                style={{ maxHeight: '60px', maxWidth: '60px' }}
                                            />
                                        </Col>
                                        <Col xs={10} md={8}>
                                            <h5 className="mb-1">
                                                <Link to={`/jobs/${job.jobId}`} className="text-decoration-none text-dark fw-bold job-title-link">
                                                    {job.title}
                                                </Link>
                                            </h5>
                                            <p className="text-muted small mb-2">{job.employer?.companyName || "Công ty chưa cập nhật"}</p>
                                            <div className="d-flex gap-3 text-secondary small">
                                                <span><CashStack className="me-1"/> {job.salary || "Thương lượng"}</span>
                                                <span><GeoAlt className="me-1"/> {job.location}</span>
                                                <span><Clock className="me-1"/> {new Date(job.postDate).toLocaleDateString()}</span>
                                            </div>
                                        </Col>
                                        <Col md={3} className="d-flex flex-column justify-content-center align-items-end">
                                            <span className="badge bg-light text-primary border border-primary mb-2">Tuyển gấp</span>
                                            <Button as={Link} to={`/jobs/${job.jobId}`} variant="primary" size="sm" className="px-4">Ứng tuyển</Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}