import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert, NavDropdown, Dropdown, DropdownButton } from "react-bootstrap";
import { Search, GeoAlt, FunnelFill, Briefcase, CashStack, Clock, Award, Book, PeopleFill, CalendarCheck, FileText, Building, List, ChevronDown } from "react-bootstrap-icons";
import { Link, useLocation } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import JobService from "../services/job.service";
import "./style.css"; // Dùng chung style
import logoPlaceholder from "../img/Banner.jpg";

// Danh sách cố định cho các bộ lọc Dropdown
const MOCK_FILTERS = {
    experience: [
        { label: "Chưa kinh nghiệm", value: "không yêu cầu" },
        { label: "1 - 3 năm", value: "1 - 3 năm" },
        { label: "Trên 5 năm", value: "trên 5 năm" }
    ],
    salary: [
        { label: "Dưới 10 triệu", value: "dưới 10" },
        { label: "10 - 20 triệu", value: "10 - 20" },
        { label: "Trên 20 triệu", value: "trên 20" },
        { label: "Thương lượng", value: "thương lượng" }
    ],
    jobType: [
        { label: "Toàn thời gian", value: "toàn thời gian" },
        { label: "Bán thời gian", value: "bán thời gian" },
        { label: "Thực tập", value: "thực tập" }
    ]
};

// Hàm ánh xạ tên filter và Icon
const FILTER_ICONS = {
    career: { icon: List, label: "Ngành nghề" },
    level: { icon: Award, label: "Cấp bậc" },
    experience: { icon: Clock, label: "Kinh nghiệm" },
    salary: { icon: CashStack, label: "Mức lương" },
    jobType: { icon: Briefcase, label: "Loại công việc" },
};


export default function JobSearchPage() {
    const location = useLocation();
    
    // Khởi tạo state filters với giá trị mặc định rỗng (không phụ thuộc vào location ban đầu)
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
    const [apiError, setApiError] = useState(null); // Thêm state để lưu lỗi API

    // Hàm gọi API
    const fetchJobs = async (currentFilters) => {
        setLoading(true);
        setApiError(null); // Reset lỗi
        try {
            const activeFilters = {};
            Object.keys(currentFilters).forEach(key => {
                if (currentFilters[key]) activeFilters[key] = currentFilters[key];
            });

            const data = await JobService.getJobList(activeFilters);
            setJobs(data);
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
            // FIX: Cung cấp thông báo lỗi rõ ràng hơn
            setApiError("Không thể tải danh sách việc làm. Vui lòng kiểm tra trạng thái API hoặc kết nối mạng.");
            setJobs([]); // Đảm bảo danh sách job rỗng khi có lỗi
        } finally {
            setLoading(false);
        }
    };

    // FIX: useEffect để xử lý tải lại khi URL thay đổi (từ trang chủ)
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchFromUrl = queryParams.get("search") || "";
        const locationFromUrl = queryParams.get("location") || "";
        
        // Cập nhật state filters từ URL params, giữ nguyên các bộ lọc dropdown khác
        setFilters(prev => {
            const newFilters = { 
                ...prev, 
                search: searchFromUrl, 
                location: locationFromUrl,
                // Đảm bảo các bộ lọc dropdown được reset khi có tìm kiếm mới từ trang chủ
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

    }, [location.search]); // Chạy khi URL search params thay đổi

    // Xử lý thay đổi bộ lọc (Cho cả Input và Dropdown)
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        // Không gọi fetchJobs ở đây, chờ nút Apply
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Khi nhấn nút tìm kiếm trên trang này, ta dùng filters hiện tại
        fetchJobs(filters);
    };

    // Hàm tạo tiêu đề Dropdown động
    const getDropdownLabel = (name, defaultValue) => {
        const value = filters[name];
        if (!value) return defaultValue;
        
        const options = MOCK_FILTERS[name];
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
            <div className="bg-white border-bottom mb-4 shadow-sm" style={{ paddingTop: '100px' }}> {/* <-- ĐÃ THÊM PADDING TOP */}
                <Container className="py-2">
                    <div className="d-flex flex-wrap gap-2">
                        
                        {/* Ngành nghề (Mock) */}
                        <FilterDropdown 
                            name="career" 
                            title="Ngành nghề" 
                            icon={List} 
                            mockOptions={[
                                { label: "IT - Phần mềm", value: "IT" },
                                { label: "Kinh doanh", value: "Kinh doanh" },
                                { label: "Kế toán", value: "Kế toán" }
                            ]}
                        />

                        {/* Cấp bậc (Mock) */}
                        <FilterDropdown 
                            name="level" 
                            title="Cấp bậc" 
                            icon={Award} 
                            mockOptions={[
                                { label: "Nhân viên", value: "Nhân viên" },
                                { label: "Quản lý", value: "Quản lý" },
                                { label: "Thực tập", value: "Thực tập" }
                            ]}
                        />
                        
                        {/* Kinh nghiệm */}
                        <FilterDropdown 
                            name="experience" 
                            title="Kinh nghiệm" 
                            icon={Clock} 
                            mockOptions={MOCK_FILTERS.experience}
                        />

                        {/* Mức lương */}
                        <FilterDropdown 
                            name="salary" 
                            title="Mức lương" 
                            icon={CashStack} 
                            mockOptions={MOCK_FILTERS.salary}
                        />

                        {/* Loại công việc */}
                        <FilterDropdown 
                            name="jobType" 
                            title="Loại công việc" 
                            icon={Briefcase} 
                            mockOptions={MOCK_FILTERS.jobType}
                        />
                        
                        {/* INPUT Tìm kiếm (Tùy chọn: nếu muốn tìm kiếm chung ở đây) */}
                        {/* FIX: Bọc Input Search và Location vào Form để có thể gọi handleSearchSubmit khi Enter */}
                        <Form onSubmit={handleSearchSubmit} className="d-flex flex-wrap gap-2">
                            <Form.Control 
                                placeholder="Từ khóa tìm kiếm..." 
                                name="search"
                                value={filters.search}
                                onChange={(e) => handleFilterChange(e.target.name, e.target.value)}
                                style={{ maxWidth: '200px', borderRadius: '20px' }}
                                className="form-control-sm my-1"
                            />
                            <Form.Control 
                                placeholder="Địa điểm..." 
                                name="location"
                                value={filters.location}
                                onChange={(e) => handleFilterChange(e.target.name, e.target.value)}
                                style={{ maxWidth: '150px', borderRadius: '20px' }}
                                className="form-control-sm my-1"
                            />

                            {/* Nút Áp dụng/Xóa lọc */}
                            {Object.values(filters).some(v => v) && (
                                <Button 
                                    type="button" // Đặt type="button" để tránh submit form
                                    variant="outline-danger" 
                                    size="sm" 
                                    className="my-1 fw-bold"
                                    onClick={() => setFilters({ search: '', location: '', salary: '', experience: '', jobType: '', career: '', level: '' })}
                                >
                                    Xóa tất cả
                                </Button>
                            )}
                            <Button 
                                type="submit" // Kích hoạt handleSearchSubmit
                                variant="primary" 
                                size="sm" 
                                className="my-1 fw-bold"
                            >
                                Áp dụng
                            </Button>
                        </Form>

                    </div>
                </Container>
            </div>
            
            {/* --- CSS TÙY CHỈNH CHO FILTER BUTTON --- */}
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
                    min-height: 40px; /* Thêm min-height */
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
                        
                        {/* HIỂN THỊ LỖI API CỤ THỂ HƠN */}
                        {apiError && <Alert variant="danger" className="text-center">{apiError}</Alert>}
                        {loading && <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>}

                        {!loading && jobs.length === 0 && !apiError && ( // Không hiển thị nếu đã có apiError
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