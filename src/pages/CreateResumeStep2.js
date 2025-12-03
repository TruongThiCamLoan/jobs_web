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
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";


// Danh sách tỉnh/thành và quận/huyện (có thể mở rộng sau)
const VIETNAM_LOCATIONS = {
    "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Đống Đa", "Hai Bà Trưng", "Tây Hồ", "Cầu Giấy", "Nam Từ Liêm", "Thanh Xuân", "Bắc Từ Liêm", "Hoàn Kiếm"],
    "TP. Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 10", "Tân Bình", "Bình Thạnh", "Gò Vấp", "Thủ Đức", "Bình Chánh", "Quận 7", "Phú Nhuận"],
    "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Cẩm Lệ", "Liên Chiểu"],
    "Cần Thơ": ["Ninh Kiều", "Cái Răng", "Bình Thủy", "Ô Môn", "Thốt Nốt", "Cờ Đỏ", "Phong Điền"],
    "Hải Phòng": ["Hồng Bàng", "Lê Chân", "Ngô Quyền", "Kiến An", "Đồ Sơn", "An Dương"],
    "Thừa Thiên Huế": ["Huế", "Phong Điền", "Quảng Điền", "Phú Lộc", "Hương Trà"],
    // Thêm tỉnh khác nếu cần
};
const VIETNAM_PROVINCES = Object.keys(VIETNAM_LOCATIONS);

const steps = [
    "Thông tin cá nhân",
    "Thông tin liên hệ",
    "Học vấn",
    "Ngoại ngữ",
    "Kinh nghiệm làm việc",
    "Người tham khảo",
    "Kỹ năng",
    "Mục tiêu nghề nghiệp",
    "Trạng thái hồ sơ",
];

export default function CreateResumeStep2() {
    const { authToken } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        phone: "",
        email: "",
        country: "Việt Nam",
        province: "",
        district: "",
        address: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    

    // ==================== TẢI DỮ LIỆU CŨ KHI VÀO/TRỞ LẠI STEP 2 ====================
    useEffect(() => {
        if (!authToken) {
            setIsFetching(false);
            return;
        }

        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/profile", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                const data = res.data;

                setFormData({
                    phone: data.phone || "",
                    email: data.email || "",
                    country: data.country || "Việt Nam",
                    province: data.province || "",
                    district: data.district || "",
                    address: data.address || "",
                });
            } catch (err) {
                console.error("Lỗi tải dữ liệu Step 2:", err);
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [authToken]);

    // ==================== XỬ LÝ INPUT ====================
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "province") {
            setFormData((prev) => ({
                ...prev,
                province: value,
                district: "", // reset quận khi đổi tỉnh
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // ==================== GỬI DỮ LIỆU (CHUNG CHO TIẾP TỤC & LƯU THOÁT) ====================
    const sendDataToApi = async (isExiting = false) => {
        setMessage("");
        setError("");
        setLoading(true);

        if (!authToken) {
            setError("Phiên đăng nhập hết hạn!");
            setLoading(false);
            return;
        }

        if (!formData.email || !formData.province || !formData.district) {
            setError("Vui lòng điền đầy đủ các trường có dấu (*).");
            setLoading(false);
            return;
        }

        const payload = {
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            country: formData.country,
            province: formData.province,
            district: formData.district,
            address: formData.address.trim(),
        };

        try {
            await axios.put(
                "http://localhost:8080/api/profile/step1-2", // hoặc /contact nếu bạn tạo riêng
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setMessage("Đã lưu thông tin liên hệ!");

            setTimeout(() => {
                if (isExiting) {
                    navigate("/myjobs");
                } else {
                    navigate("/create-resume/step3");
                }
            }, 600);
        } catch (err) {
            console.error(err);
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

    const handleBack = () => navigate("/create-resume/step1");

    // ==================== LOADING ====================
    if (isFetching) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    // ==================== RENDER ====================
    return (
        <div className="create-resume-page">
            <AppNavbar />

            {/* THANH 9 BƯỚC */}
            <div className="progress-steps-wrapper position-sticky top-64 bg-white shadow-sm" style={{ zIndex: 1020 }}>
                <Container className="py-2">
                    <div className="d-flex overflow-auto text-center">
                        {steps.map((step, index) => (
                            <div key={index} className="flex-shrink-0 mx-1" style={{ minWidth: 100 }}>
                                <div className={`border rounded px-2 py-1 ${index === 1 ? "bg-primary text-white" : "bg-light text-muted"}`}>
                                    <div className="fw-bold">Bước {index + 1}</div>
                                    <div className="small">{step}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>

            <Container className="my-5 pt-4">
                <h4 className="text-center fw-bold mb-5">Thông tin liên hệ</h4>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row className="g-4 justify-content-center">

                        {/* ĐIỆN THOẠI */}
                        <Col lg={8}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Điện thoại</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: 0983503448"
                                />
                            </Form.Group>
                        </Col>

                        {/* EMAIL */}
                        <Col lg={8}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    E-mail <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@gmail.com"
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Email này sẽ được nhà tuyển dụng dùng để liên hệ với bạn.
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        {/* QUỐC GIA */}
                        <Col lg={8}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    Quốc gia <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Select name="country" value={formData.country} onChange={handleChange} required>
                                    <option value="Việt Nam">Việt Nam</option>
                                    <option value="Khác">Khác</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        {/* TỈNH + QUẬN/HUYỆN */}
                        <Col lg={8}>
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            Tỉnh/Thành phố <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>Chọn Tỉnh/Thành</option>
                                            {VIETNAM_PROVINCES.map((p) => (
                                                <option key={p} value={p}>
                                                    {p}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            Quận/Huyện <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            disabled={!formData.province}
                                            required
                                        >
                                            <option value="" disabled>Chọn Quận/Huyện</option>
                                            {formData.province &&
                                                VIETNAM_LOCATIONS[formData.province]?.map((d) => (
                                                    <option key={d} value={d}>
                                                        {d}
                                                    </option>
                                                ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>

                        {/* ĐỊA CHỈ CHI TIẾT */}
                        <Col lg={8}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Địa chỉ đường (số nhà, tên đường...)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: 275 Nguyễn Đệ, Ninh Kiều"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* NÚT ĐIỀU HƯỚNG */}
                    <div className="text-center mt-5 d-flex justify-content-center gap-3 flex-wrap">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleSaveAndExit}
                            disabled={loading}
                        >
                            Lưu và Thoát
                        </Button>

                        <Button
                            type="button"
                            variant="outline-primary"
                            onClick={handleBack}
                            disabled={loading}
                        >
                            Quay lại
                        </Button>

                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                <>
                                    Tiếp tục <ArrowRight className="ms-1" />
                                </>
                            )}
                        </Button>
                    </div>
                </Form>
            </Container>

            {/* ZALO ICON */}
            <div className="position-fixed bottom-0 end-0 p-3 z-3">
                <a
                    href="https://zalo.me/0123456789"
                    className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                    style={{ width: 50, height: 50 }}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src="https://img.icons8.com/color/48/000000/zalo.png" alt="Zalo" width={32} />
                </a>
            </div>
        </div>
    );
}