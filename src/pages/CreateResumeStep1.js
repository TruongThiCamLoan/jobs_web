// src/pages/CreateResumeStep1.js
import React, { useState, useEffect } from "react";
import {
    Container,
    Form,
    Row,
    Col,
    Button,
    Alert,
    Spinner,
} from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

// Placeholder ảnh mặc định
const DEFAULT_AVATAR_URL = "https://placehold.co/80x80/cccccc/333333?text=Avatar";

export default function CreateResumeStep1() {
    const { authToken, currentUser } = useAuth();
    const navigate = useNavigate();

    const steps = [
        "Thông tin cá nhân", "Thông tin liên hệ", "Học vấn", "Ngoại ngữ",
        "Kinh nghiệm làm việc", "Người tham khảo", "Kỹ năng",
        "Mục tiêu nghề nghiệp", "Trạng thái hồ sơ",
    ];

    // Khởi tạo đầy đủ các field (bao gồm cả Step 2 để không bị mất)
    const initialFormData = {
        resumeTitle: "",
        fullName: currentUser?.fullName || "",
        nationality: "",
        day: "", month: "", year: "",
        maritalStatus: "",
        gender: "",
        avatarUrl: "",
        // Các field Step 2 – quan trọng để không bị ghi đè rỗng
        phone: "",
        email: currentUser?.email || "",
        country: "Việt Nam",
        province: "",
        district: "",
        address: "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // TẢI DỮ LIỆU CŨ KHI VÀO/TRỞ LẠI STEP 1
    useEffect(() => {
        if (!authToken) {
            setIsFetching(false);
            return;
        }

        const fetchProfileData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/profile", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                const data = response.data;

                // Xử lý ngày sinh
                let day = "", month = "", year = "";
                if (data.dateOfBirth) {
                    const [y, m, d] = data.dateOfBirth.split("-");
                    year = y || "";
                    month = m ? parseInt(m, 10).toString() : "";
                    day = d ? parseInt(d, 10).toString() : "";
                }

                setFormData(prev => ({
                    ...prev,
                    resumeTitle: data.resumeTitle || "",
                    fullName: data.fullName || prev.fullName,
                    nationality: data.nationality || "",
                    maritalStatus: data.maritalStatus || "",
                    gender: data.gender || "",
                    avatarUrl: data.avatarUrl || "",
                    phone: data.phone || "",
                    email: data.email || prev.email,
                    country: data.country || "Việt Nam",
                    province: data.province || "",
                    district: data.district || "",
                    address: data.address || "",
                    day, month, year,
                }));

            } catch (err) {
                console.log("Chưa có dữ liệu hồ sơ hoặc lỗi tải:", err.response?.status);
            } finally {
                setIsFetching(false);
            }
        };

        fetchProfileData();
    }, [authToken]);

    // XỬ LÝ INPUT
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // XỬ LÝ ẢNH ĐẠI DIỆN
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // GỬI DỮ LIỆU (CHUNG CHO TIẾP TỤC & LƯU THOÁT)
    const sendDataToApi = async (isExiting = false) => {
        setMessage("");
        setError("");
        setLoading(true);

        if (!authToken) {
            setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            setLoading(false);
            return;
        }

        // Validate bắt buộc
        if (!formData.resumeTitle || !formData.fullName || !formData.nationality ||
            !formData.day || !formData.month || !formData.year ||
            !formData.maritalStatus || !formData.gender) {
            setError("Vui lòng điền đầy đủ các trường có dấu (*).");
            setLoading(false);
            return;
        }

        // Tạo ngày sinh
        const dateOfBirth = `${formData.year}-${String(formData.month).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`;

        const payload = {
            resumeTitle: formData.resumeTitle,
            fullName: formData.fullName,
            nationality: formData.nationality,
            dateOfBirth,
            maritalStatus: formData.maritalStatus,
            gender: formData.gender,
            avatarUrl: formData.avatarUrl,
            // QUAN TRỌNG: Không ghi đè rỗng Step 2 – giữ nguyên dữ liệu cũ
            phone: formData.phone || "",
            email: formData.email || currentUser?.email || "",
            country: formData.country || "Việt Nam",
            province: formData.province || "",
            district: formData.district || "",
            address: formData.address || "",
        };

        try {
            await axios.put(
                "http://localhost:8080/api/profile/step1-2",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setMessage("Lưu thông tin cá nhân thành công!");

            setTimeout(() => {
                if (isExiting) {
                    navigate("/myjobs");
                } else {
                    navigate("/create-resume/step2");
                }
            }, 600);

        } catch (err) {
            console.error("Lỗi lưu Step 1:", err);
            setError(err.response?.data?.message || "Lỗi lưu dữ liệu. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendDataToApi(false);
    };

    const handleSaveAndExit = (e) => {
        e.preventDefault();
        sendDataToApi(true);
    };

    const renderOptions = (start, end, label) => {
        const options = [<option key="default" value="" disabled>{label}</option>];
        for (let i = start; i <= end; i++) {
            options.push(<option key={i} value={i}>{i}</option>);
        }
        return options;
    };

    if (isFetching) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <div className="create-resume-page">
            <AppNavbar />

            {/* THANH 9 BƯỚC */}
            <div className="progress-steps-wrapper position-sticky top-64 bg-white shadow-sm" style={{ zIndex: 1020 }}>
                <Container className="py-2">
                    <div className="d-flex overflow-auto text-center">
                        {steps.map((step, index) => (
                            <div key={index} className="flex-shrink-0 mx-1" style={{ minWidth: 100 }}>
                                <div className={`border rounded px-2 py-1 ${index === 0 ? "bg-primary text-white" : "bg-light text-muted"}`}>
                                    <div className="fw-bold">Bước {index + 1}</div>
                                    <div className="small">{step}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>

            <Container className="my-5 pt-4">
                <h4 className="text-center fw-bold mb-5">Thông tin cá nhân</h4>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row className="g-4 justify-content-center">

                        {/* TIÊU ĐỀ HỒ SƠ */}
                        <Col lg={8}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    Tiêu đề hồ sơ <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="resumeTitle"
                                    value={formData.resumeTitle}
                                    onChange={handleChange}
                                    placeholder="VD: Ứng viên IT - Fullstack Developer"
                                    required
                                />
                            </Form.Group>
                        </Col>

                        {/* HỌ TÊN + QUỐC TỊCH */}
                        <Col lg={8}>
                            <Row className="g-3">
                                <Col md={8}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            Họ và tên <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            Quốc tịch <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select name="nationality" value={formData.nationality} onChange={handleChange} required>
                                            <option value="" disabled>-- Chọn --</option>
                                            <option value="Việt Nam">Việt Nam</option>
                                            <option value="Khác">Khác</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>

                        {/* NGÀY SINH + ẢNH */}
                        <Col lg={8}>
                            <Row className="g-4">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            Ngày sinh <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Row>
                                            <Col xs={4}>
                                                <Form.Select name="day" value={formData.day} onChange={handleChange} required>
                                                    {renderOptions(1, 31, "Ngày")}
                                                </Form.Select>
                                            </Col>
                                            <Col xs={4}>
                                                <Form.Select name="month" value={formData.month} onChange={handleChange} required>
                                                    {renderOptions(1, 12, "Tháng")}
                                                </Form.Select>
                                            </Col>
                                            <Col xs={4}>
                                                <Form.Select name="year" value={formData.year} onChange={handleChange} required>
                                                    {renderOptions(1950, 2005, "Năm").reverse()}
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Ảnh đại diện</Form.Label>
                                        <div className="border rounded p-3 text-center bg-light">
                                            <img
                                                src={formData.avatarUrl || DEFAULT_AVATAR_URL}
                                                alt="Avatar"
                                                className="rounded-circle mb-2"
                                                style={{ width: 80, height: 80, objectFit: "cover" }}
                                                onError={(e) => e.target.src = DEFAULT_AVATAR_URL}
                                            />
                                            <br />
                                            <small className="text-muted">(JPEG/PNG/GIF, ≤ 1MB)</small>
                                            <br />
                                            <input type="file" id="avatar-upload" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                                            <label htmlFor="avatar-upload" className="btn btn-outline-primary btn-sm mt-2">
                                                Chọn ảnh
                                            </label>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>

                        {/* TÌNH TRẠNG HÔN NHÂN & GIỚI TÍNH */}
                        <Col lg={8}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            Tình trạng hôn nhân <span className="text-danger">*</span>
                                        </Form.Label>
                                        <div>
                                            <Form.Check inline type="radio" label="Độc thân" name="maritalStatus" value="Độc thân"
                                                checked={formData.maritalStatus === "Độc thân"} onChange={handleChange} required />
                                            <Form.Check inline type="radio" label="Đã kết hôn" name="maritalStatus" value="Đã kết hôn"
                                                checked={formData.maritalStatus === "Đã kết hôn"} onChange={handleChange} required />
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            Giới tính <span className="text-danger">*</span>
                                        </Form.Label>
                                        <div>
                                            <Form.Check inline type="radio" label="Nam" name="gender" value="Nam"
                                                checked={formData.gender === "Nam"} onChange={handleChange} required />
                                            <Form.Check inline type="radio" label="Nữ" name="gender" value="Nữ"
                                                checked={formData.gender === "Nữ"} onChange={handleChange} required />
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* NÚT ĐIỀU HƯỚNG */}
                    <div className="text-center mt-5 d-flex justify-content-center gap-3">
                        <Button type="button" variant="secondary" onClick={handleSaveAndExit} disabled={loading}>
                            Lưu và Thoát
                        </Button>
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : <>Tiếp tục <ArrowRight className="ms-1" /></>}
                        </Button>
                    </div>
                </Form>
            </Container>

            {/* ZALO ICON */}
            <div className="position-fixed bottom-0 end-0 p-3 z-3">
                <a href="https://zalo.me/0123456789" className="btn btn-primary rounded-circle shadow-lg" style={{ width: 50, height: 50 }} target="_blank" rel="noopener noreferrer">
                    <img src="https://img.icons8.com/color/48/000000/zalo.png" alt="Zalo" width={32} />
                </a>
            </div>
        </div>
    );
}