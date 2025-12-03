import React, { useState, useEffect, useCallback } from "react";
import {
    Container,
    Form,
    Row,
    Col,
    Button,
    Alert,
    Spinner,
} from "react-bootstrap";
import { ArrowLeft, ArrowRight, PlusCircle, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

// Tạo options cho tháng/năm
const renderOptions = (start, end, label) => {
    const options = [<option key="default" value="">{label}</option>];
    for (let i = start; i <= end; i++) {
        options.push(
            <option key={i} value={i}>
                {String(i).padStart(2, "0")}
            </option>
        );
    }
    return options;
};

export default function CreateResumeStep3() {
    const { authToken } = useAuth();
    const navigate = useNavigate();

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

    const [educationList, setEducationList] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const activeStep = 2; // Bước 3

    const newEducationEntry = {
        educationLevel: "",
        university: "",
        major: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        description: "",
    };

    // ==================== TẢI DỮ LIỆU CŨ ====================
    const fetchEducationData = useCallback(async () => {
        if (!authToken) {
            setIsFetching(false);
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/api/profile", {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            const educationData = response.data.education || [];

            const formattedList = educationData.map((item) => {
                const startDate = item.startDate ? item.startDate.split("-") : [];
                const endDate = item.endDate ? item.endDate.split("-") : [];

                return {
                    ...item,
                    startMonth:
                        startDate.length > 1 ? parseInt(startDate[1], 10).toString() : "",
                    startYear: startDate.length > 0 ? startDate[0] : "",
                    endMonth:
                        endDate.length > 1 ? parseInt(endDate[1], 10).toString() : "",
                    endYear: endDate.length > 0 ? endDate[0] : "",
                };
            });

            setEducationList(
                formattedList.length > 0 ? formattedList : [newEducationEntry]
            );
        } catch (err) {
            console.error("Lỗi tải học vấn:", err);
            setEducationList([newEducationEntry]);
        } finally {
            setIsFetching(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchEducationData();
    }, [fetchEducationData]);

    // ==================== QUẢN LÝ DANH SÁCH ====================
    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        setEducationList((prev) => {
            const list = [...prev];
            list[index][name] = value;
            return list;
        });
    };

    const handleAddEducation = () => {
        setEducationList((prev) => [...prev, { ...newEducationEntry }]);
    };

    const handleRemoveEducation = (index) => {
        if (educationList.length === 1) {
            setEducationList([{ ...newEducationEntry }]);
        } else {
            setEducationList((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleBack = () => navigate("/create-resume/step2");

    // ==================== LƯU DỮ LIỆU – PHIÊN BẢN AN TOÀN 100% ====================
    const handleSubmit = async (isExiting = false) => {
        setMessage("");
        setError("");
        setLoading(true);

        if (!authToken) {
            setError("Phiên đăng nhập hết hạn!");
            setLoading(false);
            return;
        }

        // Validate
        const validEntries = educationList.filter(
            (e) =>
                e.educationLevel && e.university.trim() && e.major.trim()
        );

        if (validEntries.length === 0) {
            setError("Vui lòng nhập ít nhất một mục học vấn hợp lệ!");
            setLoading(false);
            return;
        }

        const educationEntries = validEntries.map((entry) => ({
            educationLevel: entry.educationLevel,
            university: entry.university,
            major: entry.major,
            startDate:
                entry.startYear && entry.startMonth
                    ? `${entry.startYear}-${String(entry.startMonth).padStart(2, "0")}-01`
                    : null,
            endDate:
                entry.endYear && entry.endMonth
                    ? `${entry.endYear}-${String(entry.endMonth).padStart(2, "0")}-01`
                    : null,
            description: entry.description || "",
        }));

        try {
            // 1. Lấy toàn bộ profile hiện tại
            const { data: currentProfile } = await axios.get(
                "http://localhost:8080/api/profile",
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            // 2. Merge + chỉ cập nhật học vấn
            const fullPayload = {
                ...currentProfile,
                educationEntries,

                // Bảo vệ các mảng sau không bị null
                languageEntries: currentProfile.languageEntries || [],
                experienceEntries: currentProfile.experienceEntries || [],
                referenceEntries: currentProfile.referenceEntries || [],
                skillEntries: currentProfile.skillEntries || [],
            };

            // 3. Gửi lên (dùng endpoint education hoặc endpoint chung đều được)
            await axios.put(
                "http://localhost:8080/api/profile/education",
                fullPayload,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setMessage("Lưu học vấn thành công!");

            setTimeout(() => {
                if (isExiting) {
                    navigate("/myjobs");
                } else {
                    navigate("/create-resume/step4");
                }
            }, 600);
        } catch (err) {
            console.error("Lỗi lưu Step 3:", err);
            setError(
                err.response?.data?.message || "Lỗi lưu dữ liệu. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==================== LOADING ====================
    if (isFetching) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    const currentYear = new Date().getFullYear();
    const years = renderOptions(1950, currentYear + 5, "Năm").reverse();
    const months = renderOptions(1, 12, "Tháng");

    // ==================== RENDER ====================
    return (
        <div className="create-resume-page">
            <AppNavbar />

            {/* THANH TIẾN TRÌNH */}
            <div className="progress-steps-wrapper position-sticky top-64 bg-white shadow-sm" style={{ zIndex: 1020 }}>
                <Container className="py-2">
                    <div className="d-flex overflow-auto text-center">
                        {steps.map((step, index) => (
                            <div key={index} className="flex-shrink-0 mx-1" style={{ minWidth: 100 }}>
                                <div
                                    className={`border rounded px-2 py-1 ${
                                        index === activeStep ? "bg-primary text-white" : "bg-light text-muted"
                                    }`}
                                >
                                    <div className="fw-bold">Bước {index + 1}</div>
                                    <div className="small">{step}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>

            <Container className="my-5 pt-4">
                <h4 className="text-center fw-bold mb-5">Học vấn</h4>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }}>
                    {educationList.map((entry, index) => (
                        <Row key={index} className="g-4 justify-content-center border p-4 mb-4 rounded shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="mb-0 text-primary">Mục học vấn #{index + 1}</h6>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleRemoveEducation(index)}
                                    disabled={loading}
                                >
                                    <Trash /> Xóa
                                </Button>
                            </div>

                            {/* Các field như cũ */}
                            <Col lg={8}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Trình độ học vấn <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        name="educationLevel"
                                        value={entry.educationLevel}
                                        onChange={(e) => handleInputChange(index, e)}
                                        required
                                        disabled={loading}
                                    >
                                        <option value="" disabled>Chọn trình độ</option>
                                        <option>Trung học</option>
                                        <option>Trung cấp</option>
                                        <option>Cao đẳng</option>
                                        <option>Đại học</option>
                                        <option>Thạc sĩ</option>
                                        <option>Tiến sĩ</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col lg={8}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Tên trường <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="university"
                                        value={entry.university}
                                        onChange={(e) => handleInputChange(index, e)}
                                        placeholder="VD: Đại học Bách Khoa Hà Nội"
                                        required
                                        disabled={loading}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={8}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Chuyên ngành <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="major"
                                        value={entry.major}
                                        onChange={(e) => handleInputChange(index, e)}
                                        placeholder="VD: Công nghệ thông tin"
                                        required
                                        disabled={loading}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={8}>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Label className="fw-semibold">
                                            Thời gian bắt đầu <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Row>
                                            <Col xs={6}>
                                                <Form.Select
                                                    name="startMonth"
                                                    value={entry.startMonth}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                    required
                                                    disabled={loading}
                                                >
                                                    {months}
                                                </Form.Select>
                                            </Col>
                                            <Col xs={6}>
                                                <Form.Select
                                                    name="startYear"
                                                    value={entry.startYear}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                    required
                                                    disabled={loading}
                                                >
                                                    {years}
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label className="fw-semibold">
                                            Thời gian kết thúc <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Row>
                                            <Col xs={6}>
                                                <Form.Select
                                                    name="endMonth"
                                                    value={entry.endMonth}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                    required
                                                    disabled={loading}
                                                >
                                                    {months}
                                                </Form.Select>
                                            </Col>
                                            <Col xs={6}>
                                                <Form.Select
                                                    name="endYear"
                                                    value={entry.endYear}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                    required
                                                    disabled={loading}
                                                >
                                                    {years}
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>

                            <Col lg={8}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Mô tả (thành tích, GPA...)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="description"
                                        value={entry.description}
                                        onChange={(e) => handleInputChange(index, e)}
                                        placeholder="VD: GPA 8.5/10, học bổng loại giỏi..."
                                        disabled={loading}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    ))}

                    <div className="text-center mb-5">
                        <Button variant="outline-success" onClick={handleAddEducation} disabled={loading}>
                            <PlusCircle className="me-1" /> Thêm mục học vấn khác
                        </Button>
                    </div>

                    <div className="text-center mt-5 d-flex justify-content-center gap-3 flex-wrap">
                        <Button variant="secondary" onClick={() => handleSubmit(true)} disabled={loading}>
                            Lưu và Thoát
                        </Button>
                        <Button variant="outline-primary" onClick={handleBack} disabled={loading}>
                            <ArrowLeft className="me-1" /> Quay lại
                        </Button>
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? <Spinner size="sm" /> : "Tiếp tục"} <ArrowRight className="ms-1" />
                        </Button>
                    </div>
                </Form>
            </Container>

            {/* ZALO ICON */}
            <div className="position-fixed bottom-0 end-0 p-3 z-3">
                <a
                    href="https://zalo.me/0123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                    style={{ width: 50, height: 50 }}
                >
                    <img src="https://img.icons8.com/color/48/000000/zalo.png" alt="Zalo" width={32} />
                </a>
            </div>
        </div>
    );
}