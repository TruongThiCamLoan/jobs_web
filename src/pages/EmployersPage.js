import React, { useState, useEffect, useCallback } from "react";
import { 
    Container, 
    Row, 
    Col, 
    Card, 
    Form, 
    Button, 
    InputGroup, 
    Alert, 
} from "react-bootstrap";
import { Search, GeoAlt } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import "./style.css"; 
import logoPlaceholder from "../img/Banner.jpg";
import Pagination from "../components/Pagination"; // Giả định bạn có component Pagination

// 💡 CẬP NHẬT: IMPORT HÀM API THẬT
// Đảm bảo đường dẫn này là chính xác đến Public Service của bạn
import { getAllEmployersPublic } from "../services/public.service"; 

// Dữ liệu Mock cho bộ lọc (GIỮ LẠI CHO UI)
const MOCK_LOCATIONS = [
    "An Giang", "Bình Dương", "Bình Định", "Bắc Giang", "Bắc Kạn", "Hà Nội", "TP. Hồ Chí Minh"
];

const MOCK_SIZES = [
    { label: "25 - 99 nhân viên", value: "25-99" },
    { label: "100 - 499 nhân viên", value: "100-499" },
    { label: "500 - 999 nhân viên", value: "500-999" },
    { label: "1.000 - 4.999 nhân viên", value: "1000-4999" },
    { label: "5.000 - 9.999 nhân viên", value: "5000-9999" },
    { label: "10.000 - 19.999 nhân viên", value: "10000+" },
];

const ITEMS_PER_PAGE = 12; // Cần khớp với limit trong API Backend

export default function EmployersPage() {
    const [employers, setEmployers] = useState([]); // Dùng để lưu dữ liệu thật
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(''); 
    const [selectedSize, setSelectedSize] = useState('');
    
    // State cho Phân trang và Loading
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 

    // ----------------------------------------------------
    // HÀM FETCH DỮ LIỆU THẬT TỪ API (Đã Fix lỗi trích xuất)
    // ----------------------------------------------------
    const fetchEmployers = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        const apiParams = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: searchTerm.trim(),
            location: selectedLocation || undefined,
            size: selectedSize || undefined, 
        };

        try {
            const response = await getAllEmployersPublic(apiParams);
            
            // 💡 FIX LỖI: Trích xuất đúng cấu trúc từ Backend
            // (response.data chứa { pagination, data: { employers } })
const fetchedData = response?.data?.employers || [];
const pagination = response?.pagination || {};


            setEmployers(fetchedData);
            setTotalPages(pagination.totalPages);
            setTotalItems(pagination.totalItems);

        } catch (err) {
            // Lấy thông báo lỗi cụ thể hơn nếu có
            const errorMessage = err.response?.data?.message || "Lỗi kết nối hoặc server từ chối truy cập.";
            console.error("Lỗi khi fetch employers:", err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, selectedLocation, selectedSize]);

    useEffect(() => {
        // Gọi hàm fetch khi component mount và khi các bộ lọc/trang thay đổi
        fetchEmployers(); 
    }, [fetchEmployers]);

    // Hàm xử lý khi nhấn nút Tìm kiếm
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
    };

    // Hàm xử lý chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Hàm xử lý toggle cho Nơi làm việc (Reset trang khi thay đổi lọc)
    const handleLocationToggle = (locationValue) => {
        setSelectedLocation(prev => {
            const newValue = (prev === locationValue ? '' : locationValue);
            setCurrentPage(1); 
            return newValue;
        });
    };

    // Hàm xử lý toggle cho Quy mô (Reset trang khi thay đổi lọc)
    const handleSizeToggle = (sizeValue) => {
        setSelectedSize(prev => {
            const newValue = (prev === sizeValue ? '' : sizeValue);
            setCurrentPage(1); 
            return newValue;
        });
    };
    
    // Custom style cho mục lọc được chọn
    const filterItemStyle = (isSelected) => ({
        cursor: 'pointer',
        padding: '5px 0',
        color: isSelected ? '#007bff' : '#333',
        fontWeight: isSelected ? 'bold' : 'normal',
        transition: 'color 0.2s',
    });


    return (
        <div className="bg-light min-vh-100">
            <AppNavbar />

            {/* --- HEADER TÌM KIẾM --- */}
            <Container className="pt-5 mt-5 mb-4">
                <h4 className="fw-bold mb-4">Nhà tuyển dụng hàng đầu ({totalItems} công ty)</h4>
                
                <Row>
                    <Col lg={12}>
                        <Form onSubmit={handleSearchSubmit}>
                            <InputGroup className="shadow-sm">
                                <InputGroup.Text className="bg-white border-end-0">
                                    <Search />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Tìm công ty"
                                    className="border-start-0"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant="primary" type="submit" disabled={loading}>
                                    Tìm kiếm
                                </Button>
                            </InputGroup>
                        </Form>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row>
                    {/* --- CỘT BỘ LỌC BÊN TRÁI (SIDEBAR) --- */}
                    <Col lg={3}>
                        <Card className="shadow-sm border-0 mb-4 p-3">
                            <Card.Title className="h6 fw-bold mb-3">Nơi làm việc</Card.Title>
                            {MOCK_LOCATIONS.map((loc, index) => (
                                <div
                                    key={index}
                                    style={filterItemStyle(selectedLocation === loc)}
                                    onClick={() => handleLocationToggle(loc)}
                                >
                                    {loc}
                                </div>
                            ))}
                            <div 
                                className="text-danger small mt-2 cursor-pointer" 
                                style={{ fontWeight: selectedLocation === '' ? 'bold' : 'normal' }}
                                onClick={() => handleLocationToggle('')} // Dùng handleLocationToggle để reset
                            >
                                Tất cả
                            </div>
                        </Card>

                        <Card className="shadow-sm border-0 mb-4 p-3">
                            <Card.Title className="h6 fw-bold mb-3">Quy mô</Card.Title>
                            {MOCK_SIZES.map((size, index) => (
                                <div
                                    key={index}
                                    style={filterItemStyle(selectedSize === size.value)}
                                    onClick={() => handleSizeToggle(size.value)}
                                >
                                    {size.label}
                                </div>
                            ))}
                            <div 
                                className="text-danger small mt-2 cursor-pointer" 
                                style={{ fontWeight: selectedSize === '' ? 'bold' : 'normal' }}
                                onClick={() => handleSizeToggle('')} // Dùng handleSizeToggle để reset
                            >
                                Tất cả
                            </div>
                        </Card>
                    </Col>

                    {/* --- CỘT KẾT QUẢ TÌM KIẾM --- */}
                    <Col lg={9}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted">
                                {totalItems} công ty được tìm thấy
                            </h6>
                            <div className="text-muted small">Sắp xếp theo: <span className="fw-bold text-dark">Nổi bật</span></div>
                        </div>
                        
                        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                        {loading && <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>}
                        
                        {!loading && employers.length === 0 && !error && (
                            <Alert variant="warning" className="text-center py-5">
                                <h5>Không tìm thấy nhà tuyển dụng nào.</h5>
                                <p>Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
                            </Alert>
                        )}
                        
                        <Row className="g-3">
                            {/* 💡 SỬ DỤNG DỮ LIỆU THẬT */}
                            {!loading && employers.map(employer => (
                                <Col md={6} lg={4} key={employer.id}>
                                    <Link to={`/employer/${employer.id}`} style={{ textDecoration: 'none' }}>
                                        <Card className="text-center h-100 p-3 shadow-sm border-0 employer-card-listing transition-shadow">
                                            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                                                <div className="employer-logo-wrapper mb-3 border rounded-circle p-2" style={{ width: '80px', height: '80px' }}>
                                                    <img 
                                                        src={employer.logo || logoPlaceholder} // Dùng employer.logo
                                                        alt={employer.name} // Dùng employer.name
                                                        className="rounded-circle w-100 h-100" 
                                                        style={{ objectFit: 'cover' }}
                                                        onError={(e) => { e.target.onerror = null; e.target.src=logoPlaceholder; }}
                                                    />
                                                </div>
                                                <Card.Title className="h6 fw-bold mb-1 text-dark">{employer.name}</Card.Title>
                                                <div className="text-muted small">
                                                    {employer.jobs} việc đang tuyển
                                                </div>
                                                <div className="text-secondary small mt-1">
                                                    <GeoAlt size={12} className="me-1"/> {employer.location || 'Chưa cập nhật'}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                        
                        {/* PHÂN TRANG */}
                        {totalPages > 1 && (
                            <div className="mt-4 d-flex justify-content-center">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>

            <footer className="text-center py-3 bg-light border-top mt-5">
                <small>© 2025 - Việc Làm Sinh Viên | React + Bootstrap</small>
            </footer>
        </div>
    );
}