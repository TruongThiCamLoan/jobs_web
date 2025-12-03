import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container, Button, Form } from "react-bootstrap"; // FIX: Đã thêm Form
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Search,
    Building,
    FileText,
    PersonCircle,
    ChevronDown,
    Briefcase,
    Heart,
    BriefcaseFill,
    Bell,
    BoxArrowRight,
} from "react-bootstrap-icons";

import logo from "../img/logo.png";
import "./style.css";
import { useAuth } from "../context/AuthContext";

export default function AppNavbar() {
    const location = useLocation();
    const navigate = useNavigate();

    // State cho thanh tìm kiếm trên Navbar
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    
    // Lấy currentUser và logout từ Context
    const { currentUser, logout, isStudent, isEmployer, isAdmin } = useAuth();
    
    const isLoggedIn = !!currentUser;
    const userName = currentUser?.fullName || "Người dùng";

    // Logic kiểm tra đường dẫn để hiển thị thanh tìm kiếm
    const isMyJobs = location.pathname === "/myjobs";
    const isResume = location.pathname === "/resume";
    const isAccount = location.pathname === "/account";
    const isSavedJobs = location.pathname === "/saved-jobs";
    const isJobAlerts = location.pathname === "/job-alerts";
    const isAppliedJobs = location.pathname === "/applied-jobs";
    const isJobSearchPage = location.pathname === "/jobs/search";
    const isJobDetailPage = location.pathname === "//jobs/:id";
    const isCreateResume = location.pathname.startsWith("/create-resume");
    
    const isMyCareerLinkSection =
        isMyJobs || isResume || isSavedJobs || isJobAlerts || isAppliedJobs || isCreateResume || isJobSearchPage || isJobDetailPage || isAccount;

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        logout();
        navigate("/"); // Chuyển hướng về Trang chủ sau khi đăng xuất
    };

    // Hàm xử lý tìm kiếm từ Navbar
    const handleNavbarSearch = (e) => {
        e.preventDefault();
        
        const query = new URLSearchParams();
        if (searchTerm) query.append('search', searchTerm);
        if (locationFilter) query.append('location', locationFilter);
        
        // Chuyển hướng sang trang tìm kiếm với tham số mới
        navigate(`/jobs/search?${query.toString()}`);
    };
    
    // Khi người dùng chuyển trang (ví dụ: từ /jobs/search về /myjobs), reset state tìm kiếm
    useEffect(() => {
        if (!isMyCareerLinkSection) {
            setSearchTerm('');
            setLocationFilter('');
        }
    }, [location.pathname, isMyCareerLinkSection]);


    return (
        <Navbar
            bg="white"
            expand="lg"
            className="py-1 fixed-top border-bottom"
            style={{ height: "64px" }}
        >
            <Container className="d-flex justify-content-between align-items-center">

                {/* LOGO */}
                <Navbar.Brand as={Link} to="/" className="p-0">
                    <img src={logo} alt="CareerLink" height="40" />
                </Navbar.Brand>

                {/* SEARCH BAR (Chỉ hiện ở My CareerLink) */}
                {isMyCareerLinkSection && (
                    <Form onSubmit={handleNavbarSearch}
                        className="d-flex align-items-center flex-grow-1 mx-lg-4 flex-nowrap"
                        style={{ maxWidth: "600px" }}
                    >
                        <input
                            type="text"
                            placeholder="Nhập tên vị trí, công ty..."
                            className="form-control form-control-sm me-1"
                            style={{ width: "45%" }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Tỉnh/Thành phố"
                            className="form-control form-control-sm me-1"
                            style={{ width: "35%" }}
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        />
                        <Button type="submit" variant="primary" size="sm" style={{ width: "20%" }}>
                            <Search className="me-1" /> Tìm kiếm
                        </Button>
                    </Form>
                )}

                {/* MENU TRANG CHỦ (Ẩn khi ở My CareerLink) */}
                {!isMyCareerLinkSection && (
                    <Nav className="d-none d-lg-flex align-items-center flex-grow-1 justify-content-center mx-auto">
                        <Nav.Link as={Link} to="/jobs/search" className="d-flex align-items-center text-secondary small mx-2">
                            <Search className="me-1" size={16} /> Ngành nghề/Địa điểm
                        </Nav.Link>

                        <Nav.Link className="d-flex align-items-center text-secondary small mx-2">
                            <Building className="me-1" size={16} /> Công ty
                        </Nav.Link>

                        <Nav.Link className="d-flex align-items-center text-secondary small mx-2">
                            <FileText className="me-1" size={16} /> Cẩm nang việc làm
                        </Nav.Link>

                        <Nav.Link className="d-flex align-items-center text-secondary small mx-2">
                            <FileText className="me-1" size={16} /> Mẫu CV xin việc
                        </Nav.Link>
                    </Nav>
                )}

                {/* PHẦN USER / ĐĂNG NHẬP */}
                <Nav className="align-items-center ms-auto">
                    {isLoggedIn ? (
                        <NavDropdown
                            title={
                                // DÙNG SPAN THAY VÌ DIV ĐỂ TRÁNH LỖI CLICK
                                <span className="d-flex align-items-center text-primary fw-semibold small pointer-event-none">
                                    <div className="avatar-circle me-1" style={{ width: '24px', height: '24px' }}>
                                        {currentUser?.avatar ? (
                                            <img
                                                src={currentUser.avatar}
                                                alt="avatar"
                                                className="rounded-circle w-100 h-100"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <PersonCircle size={24} />
                                        )}
                                    </div>
                                    <span className="me-1">{userName}</span>
                                    <ChevronDown size={12} />
                                </span>
                            }
                            id="user-dropdown"
                            align="end"
                            className="user-dropdown"
                        >
                            {/* HEADER CỦA DROPDOWN */}
                            <div className="text-center py-3 border-bottom" style={{ minWidth: '200px' }}>
                                <div className="avatar-circle mx-auto mb-2" style={{ width: "48px", height: "48px" }}>
                                    {currentUser?.avatar ? (
                                        <img
                                            src={currentUser.avatar}
                                            alt="avatar"
                                            className="rounded-circle w-100 h-100"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <PersonCircle size={48} className="text-muted" />
                                    )}
                                </div>
                                <div className="fw-bold text-dark">{userName}</div>
                                <small className="text-muted">Tài khoản ứng viên</small>
                            </div>

                            {/* --- MENU CHO ADMIN --- */}
                            {isAdmin && (
                                <NavDropdown.Item as={Link} to="/admin" className="py-2">
                                    <Briefcase className="me-2" /> Quản lý WEBSITE
                                </NavDropdown.Item>
                            )}
                            
                            {/* --- MENU CHO EMPLOYER --- */}
                            {isEmployer && (
                                <NavDropdown.Item as={Link} to="/employer/dashboard" className="py-2">
                                    <Briefcase className="me-2" /> Quản lý TUYỂN DỤNG
                                </NavDropdown.Item>
                            )}

                            {/* --- MENU CHO STUDENT (Đầy đủ menu) --- */}
                            {isStudent && (
                                <>
                                    <NavDropdown.Item as={Link} to="/myjobs" className="py-2">
                                        <Briefcase className="me-2" /> My CareerLink
                                    </NavDropdown.Item>

                                    <NavDropdown.Item as={Link} to="/resume" className="py-2">
                                        <FileText className="me-2" /> Hồ sơ xin việc
                                    </NavDropdown.Item>

                                    <NavDropdown.Item as={Link} to="/saved-jobs" className="py-2">
                                        <Heart className="me-2" /> Việc đã lưu
                                    </NavDropdown.Item>

                                    <NavDropdown.Item as={Link} to="/applied-jobs" className="py-2">
                                        <BriefcaseFill className="me-2" /> Việc đã ứng tuyển
                                    </NavDropdown.Item>

                                    <NavDropdown.Item as={Link} to="/job-alerts" className="py-2">
                                        <Bell className="me-2" /> Thông báo việc làm
                                    </NavDropdown.Item>
                                </>
                            )}

                            <NavDropdown.Divider />

                            {/* NÚT ĐĂNG XUẤT */}
                            <NavDropdown.Item onClick={handleLogout} className="text-danger py-2">
                                <BoxArrowRight className="me-2" /> Đăng xuất
                            </NavDropdown.Item>
                        </NavDropdown>
                    ) : (
                        <>
                            {/* NÚT KHI CHƯA ĐĂNG NHẬP */}
                            <Button
                                as={Link}
                                to="/login"
                                variant="primary"
                                size="sm"
                                className="me-2 rounded-pill px-3"
                            >
                                Đăng nhập
                            </Button>

                            <Button
                                as={Link}
                                to="/register"
                                variant="outline-primary"
                                size="sm"
                                className="rounded-pill px-3"
                            >
                                Đăng ký
                            </Button>
                            
                            <Button
                                as={Link}
                                to="/employer/register/"
                                variant="dark"
                                size="sm"
                                className="ms-2 rounded-pill px-3 fw-semibold"
                            >
                                Nhà Tuyển Dụng
                            </Button>
                        </>
                    )}
                </Nav>
                
                <Navbar.Toggle aria-controls="main-navbar" className="ms-2" />
            </Container>
        </Navbar>
    );
}