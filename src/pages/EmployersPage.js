import React, { useState, useEffect } from "react";
import { 
    Container, 
    Row, 
    Col, 
    Card, 
    Form, 
    Button, 
    InputGroup, 
    Alert, 
    NavDropdown, 
    Dropdown, 
    DropdownButton,
    FormCheck // Vẫn giữ lại FormCheck để tiện sử dụng nếu cần
} from "react-bootstrap";
import { Search, GeoAlt, Building, List, PeopleFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import "./style.css"; // Dùng chung style
import logoPlaceholder from "../img/Banner.jpg";

// IMPORT MOCK ASSETS (Được sử dụng trong HomePage)
import banner2 from "../img/banner2.jpg";
import banner3 from "../img/banner3.jpg";
import banner4 from "../img/banner4.jpg"; 
import Banner from "../img/Banner.jpg";

// Dữ liệu Mock cho Nhà tuyển dụng
const MOCK_EMPLOYERS = [
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
    { 
        id: 5,
        name: "CÔNG TY CỔ PHẦN OMEXEY HOME...", 
        jobs: 0, 
        location: "Bình Dương", 
        logo: "https://placehold.co/80x80/000000/FFFFFF?text=OMEXEY"
    },
    { 
        id: 6,
        name: "CÔNG TY TNHH FORCE UNIQUE VIỆT NAM", 
        jobs: 1, 
        location: "Hải Dương", 
        logo: "https://placehold.co/80x80/28a745/FFFFFF?text=FORCE"
    },
    { 
        id: 7,
        name: "Công Ty Cổ Phần Sản Xuất Thương Mại LeGroup", 
        jobs: 5, 
        location: "Hà Nội", 
        logo: "https://placehold.co/80x80/dc3545/FFFFFF?text=LeGroup"
    },
];

// MOCK DATA cho bộ lọc
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

export default function EmployersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    // Chuyển sang state có thể toggle (string hoặc rỗng)
    const [selectedLocation, setSelectedLocation] = useState(''); 
    const [selectedSize, setSelectedSize] = useState('');
    
    const [filteredEmployers, setFilteredEmployers] = useState(MOCK_EMPLOYERS);
    const [loading, setLoading] = useState(false); 

    // Logic lọc dữ liệu mock
    const applyFilters = () => {
        setLoading(true);
        setTimeout(() => {
            const results = MOCK_EMPLOYERS.filter(employer => {
                const matchesSearch = employer.name.toLowerCase().includes(searchTerm.toLowerCase());
                
                // Lọc theo Địa điểm: Nếu selectedLocation rỗng thì luôn đúng
                const matchesLocation = !selectedLocation || employer.location.includes(selectedLocation);
                
                // Lọc theo Quy mô: Nếu selectedSize rỗng thì luôn đúng
                // Ta chỉ mock logic này vì MOCK_EMPLOYERS không có trường size
                const matchesSize = !selectedSize; 

                return matchesSearch && matchesLocation && matchesSize;
            });
            setFilteredEmployers(results);
            setLoading(false);
        }, 300); // Giả lập độ trễ API
    };

    useEffect(() => {
        // Tải ban đầu và khi các bộ lọc thay đổi
        applyFilters(); 
    }, [searchTerm, selectedLocation, selectedSize]);

    // FIX: Hàm xử lý toggle cho Nơi làm việc
    const handleLocationToggle = (locationValue) => {
        setSelectedLocation(prev => (prev === locationValue ? '' : locationValue));
    };

    // FIX: Hàm xử lý toggle cho Quy mô
    const handleSizeToggle = (sizeValue) => {
        setSelectedSize(prev => (prev === sizeValue ? '' : sizeValue));
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
                <h4 className="fw-bold mb-4">Nhà tuyển dụng hàng đầu</h4>
                
                <Row>
                    <Col lg={12}>
                        <Form onSubmit={(e) => { e.preventDefault(); applyFilters(); }}>
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
                                // FIX: Dùng div với onClick để toggle
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
                                onClick={() => setSelectedLocation('')}
                            >
                                Tất cả
                            </div>
                        </Card>

                        <Card className="shadow-sm border-0 mb-4 p-3">
                            <Card.Title className="h6 fw-bold mb-3">Quy mô</Card.Title>
                            {MOCK_SIZES.map((size, index) => (
                                // FIX: Dùng div với onClick để toggle
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
                                onClick={() => setSelectedSize('')}
                            >
                                Tất cả
                            </div>
                        </Card>
                    </Col>

                    {/* --- CỘT KẾT QUẢ TÌM KIẾM --- */}
                    <Col lg={9}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted">
                                {filteredEmployers.length} công ty được tìm thấy
                            </h6>
                            <div className="text-muted small">Sắp xếp theo: <span className="fw-bold text-dark">Nổi bật</span></div>
                        </div>

                        {loading && <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>}
                        
                        {!loading && filteredEmployers.length === 0 && (
                            <Alert variant="warning" className="text-center py-5">
                                <h5>Không tìm thấy nhà tuyển dụng nào.</h5>
                                <p>Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
                            </Alert>
                        )}
                        
                        <Row className="g-3">
                            {!loading && filteredEmployers.map(employer => (
                                <Col md={6} lg={4} key={employer.id}>
                                    <Link to={`/employer/${employer.id}`} style={{ textDecoration: 'none' }}>
                                        <Card className="text-center h-100 p-3 shadow-sm border-0 employer-card-listing transition-shadow">
                                            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                                                <div className="employer-logo-wrapper mb-3 border rounded-circle p-2" style={{ width: '80px', height: '80px' }}>
                                                    <img 
                                                        src={employer.logo} 
                                                        alt={employer.name} 
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
                                                    <GeoAlt size={12} className="me-1"/> {employer.location}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                        
                    </Col>
                </Row>
            </Container>

            <footer className="text-center py-3 bg-light border-top mt-5">
                <small>© 2025 - Việc Làm Sinh Viên | React + Bootstrap</small>
            </footer>
        </div>
    );
}