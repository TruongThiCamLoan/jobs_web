import React, { useState, useEffect } from "react";
import {
    Container,
    Form,
    Row,
    Col,
    Button,
    ProgressBar,
    Alert,
    Spinner,
} from "react-bootstrap";
import { ArrowLeft, ArrowRight, Plus, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

// Hàm tiện ích để tạo entry rỗng mặc định
const createEmptySkill = () => ({
    id: Date.now() + Math.random(),
    name: "",
    level: 0, // 0-100%
    description: "",
    isActive: false, // đánh dấu kỹ năng đang chọn
});

export default function CreateResumeStep7() {
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

    const [skills, setSkills] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // TẢI DỮ LIỆU KỸ NĂNG CŨ
    useEffect(() => {
        if (!authToken) {
            setIsFetching(false);
            return;
        }

        const fetchSkills = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/profile", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                const data = res.data;
                if (data.skills && data.skills.length > 0) {
                    setSkills(
                        data.skills.map((skill) => ({
                            id: Date.now() + Math.random(),
                            name: skill.skillName || skill.name || "",
                            level: skill.level || 0,
                            description: skill.description || "",
                            isActive: false,
                        }))
                    );
                } else {
                    // Nếu chưa có dữ liệu → để trống 1 dòng
                    setSkills([createEmptySkill()]);
                }
            } catch (err) {
                console.log("Chưa có dữ liệu kỹ năng hoặc lỗi tải:", err);
                setSkills([createEmptySkill()]);
            } finally {
                setIsFetching(false);
            }
        };

        fetchSkills();
    }, [authToken]);


    const addSkill = () => {
        setSkills([...skills, createEmptySkill()]);
    };

    const removeSkill = (id) => {
        if (skills.length === 1) {
            setMessage("Phải giữ ít nhất 1 dòng. Bạn có thể để trống các trường.");
            setTimeout(() => setMessage(""), 3000);
            return;
        }
        setSkills(skills.filter((skill) => skill.id !== id));
    };

    const updateSkill = (id, field, value) => {
        setSkills(
            skills.map((skill) =>
                skill.id === id ? { ...skill, [field]: value } : skill
            )
        );
    };

    const setActiveSkill = (id) => {
        setSkills(
            skills.map((skill) => ({
                ...skill,
                isActive: skill.id === id,
            }))
        );
    };

    // Chuyển % thành màu thanh tiến độ
    const getProgressVariant = (level) => {
        if (level <= 33) return "danger";
        if (level <= 66) return "warning";
        return "success";
    };

    // GỬI DỮ LIỆU LÊN SERVER
    const sendDataToApi = async (isExiting = false) => {
        setMessage("");
        setError("");
        setLoading(true);

        if (!authToken) {
            setError("Phiên đăng nhập hết hạn!");
            setLoading(false);
            return;
        }

        // Lọc bỏ các dòng trống hoàn toàn (tên kỹ năng trống)
        const validSkills = skills.filter(
            (skill) => skill.name.trim() !== ""
        );

        // Chuẩn bị payload
        const payload = {
            skillEntries: validSkills.map((skill) => ({
                skillName: skill.name,
                level: skill.level,
                description: skill.description,
            })),
        };

        try {
            await axios.put(
                "http://localhost:8080/api/profile/skills", // Endpoint giả định
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setMessage("Lưu thông tin kỹ năng thành công!");

            // Điều hướng sau khi lưu thành công
            setTimeout(() => {
                if (isExiting) {
                    navigate("/myjobs");
                } else {
                    navigate("/create-resume/step8");
                }
            }, 600);

        } catch (err) {
            console.error("Lỗi lưu kỹ năng:", err);
            setError(err.response?.data?.message || "Không thể lưu dữ liệu.");
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

    const handleBack = () => navigate("/create-resume/step6");


    if (isFetching) {
        return (
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "100vh" }}
            >
                <Spinner animation="border" />
            </Container>
        );
    }


    return (
        <div className="create-resume-page">
            <AppNavbar />

            {/* THANH 9 BƯỚC – DÍNH ĐẦU */}
            <div
                className="progress-steps-wrapper position-sticky top-64 bg-white shadow-sm"
                style={{ zIndex: 1020 }}
            >
                <Container className="py-2">
                    <div className="d-flex overflow-auto text-center">
                        {steps.map((step, index) => (
                            <div key={index} className="flex-shrink-0 mx-1" style={{ minWidth: 100 }}>
                                <div
                                    className={`border rounded px-2 py-1 ${
                                        index === 6 // Bước 7 (index 6)
                                            ? "bg-primary text-white"
                                            : "bg-light text-muted"
                                    }`}
                                >
                                    <div className="fw-bold">{`Bước ${index + 1}`}</div>
                                    <div className="small">{step}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>

            {/* NỘI DUNG CHÍNH */}
            <Container className="my-5 pt-4">
                <h4 className="text-center fw-bold mb-2">Kỹ năng</h4>
                <p className="text-center text-muted small mb-5">(Không bắt buộc – có thể bỏ qua)</p>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {skills.map((skill, idx) => (
                        <div
                            key={skill.id}
                            className={`mb-5 p-3 rounded border ${
                                skill.isActive ? "border-primary bg-light" : "border-light"
                            }`}
                            // Không dùng onClick trên toàn bộ div nếu nó chứa các input/select tương tác
                        >
                            <Row className="g-4 justify-content-center">
                                {/* KỸ NĂNG + TRÌNH ĐỘ */}
                                <Col lg={8}>
                                    <Row className="g-3 align-items-center">
                                        <Col md={5}>
                                            <Form.Group>
                                                <Form.Label className="fw-semibold">
                                                    Kỹ năng <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Ex: Microsoft Word"
                                                    value={skill.name}
                                                    onFocus={() => setActiveSkill(skill.id)}
                                                    onChange={(e) =>
                                                        updateSkill(skill.id, "name", e.target.value)
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={5}>
                                            <Form.Group>
                                                <Form.Label className="fw-semibold">Trình độ</Form.Label>
                                                <Form.Range
                                                    min="0"
                                                    max="100"
                                                    step="1"
                                                    value={skill.level}
                                                    onInput={() => setActiveSkill(skill.id)} // Đánh dấu active khi kéo
                                                    onChange={(e) =>
                                                        updateSkill(skill.id, "level", parseInt(e.target.value))
                                                    }
                                                    className="skill-range"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={2}>
                                            <div className="text-center">
                                                <Form.Label className="fw-semibold d-block">Số cấp</Form.Label>
                                                <span className="badge bg-primary fs-6">
                                                    {skill.level}%
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>

                                {/* THANH TRÌNH ĐỘ */}
                                <Col lg={8}>
                                    <ProgressBar
                                        now={skill.level}
                                        variant={getProgressVariant(skill.level)}
                                        className="skill-progress"
                                        style={{ height: "12px" }}
                                    />
                                </Col>

                                {/* MÔ TẢ KỸ NĂNG */}
                                <Col lg={8}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Mô tả kỹ năng</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="(Tùy chọn) Mô tả chi tiết kỹ năng"
                                            value={skill.description}
                                            onFocus={() => setActiveSkill(skill.id)}
                                            onChange={(e) =>
                                                updateSkill(skill.id, "description", e.target.value)
                                            }
                                        />
                                    </Form.Group>
                                </Col>

                                {/* NÚT XÓA (từ kỹ năng thứ 2) */}
                                <Col lg={8} className="text-end">
                                    {skills.length > 1 && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => removeSkill(skill.id)}
                                        >
                                            <Trash className="me-1" /> Xóa kỹ năng này
                                        </Button>
                                    )}
                                </Col>
                            </Row>

                            {/* PHÂN CÁCH */}
                            {idx < skills.length - 1 && (
                                <hr className="my-5" style={{ borderTop: "2px dashed #dee2e6" }} />
                            )}
                        </div>
                    ))}

                    {/* NÚT THÊM KỸ NĂNG */}
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Button
                                type="button"
                                variant="primary"
                                className="d-inline-flex align-items-center"
                                onClick={addSkill}
                                disabled={loading}
                            >
                                <Plus size={20} className="me-1" /> Thêm kỹ năng
                            </Button>
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
                            <ArrowLeft className="me-1" /> Quay lại
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

            {/* ZALO GÓC DƯỚI */}
            <div className="position-fixed bottom-0 end-0 p-3 z-3">
                <a
                    href="https://zalo.me/0123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                    style={{ width: 50, height: 50 }}
                >
                    <img
                        src="https://img.icons8.com/color/48/000000/zalo.png"
                        alt="Zalo"
                        width={32}
                    />
                </a>
            </div>
        </div>
    );
}