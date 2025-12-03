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
import { ArrowLeft, ArrowRight, Plus } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

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

export default function CreateResumeStep4() {
    const { authToken } = useAuth();
    const navigate = useNavigate();

    const [languages, setLanguages] = useState([
        { id: Date.now(), name: "", level: "" },
    ]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // TẢI DỮ LIỆU NGOẠI NGỮ CŨ KHI VÀO/TRỞ LẠI STEP 4
    useEffect(() => {
        if (!authToken) {
            setIsFetching(false);
            return;
        }

        const fetchLanguages = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/profile", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                const data = res.data;
                if (data.languages && data.languages.length > 0) {
                    setLanguages(
                        data.languages.map((lang) => ({
                            id: Date.now() + Math.random(), // tạo ID tạm
                            // Sửa: Ưu tiên đọc languageName, sau đó là language hoặc name
                            name: lang.languageName || lang.language || lang.name || "", 
                            level: lang.level || "",
                        }))
                    );
                } else {
                    // Nếu chưa có dữ liệu → để trống 1 dòng
                    setLanguages([{ id: Date.now(), name: "", level: "" }]);
                }
            } catch (err) {
                console.log("Chưa có dữ liệu ngoại ngữ hoặc lỗi tải:", err);
                setLanguages([{ id: Date.now(), name: "", level: "" }]);
            } finally {
                setIsFetching(false);
            }
        };

        fetchLanguages();
    }, [authToken]);

    const addLanguage = () => {
        setLanguages([...languages, { id: Date.now(), name: "", level: "" }]);
    };

    const removeLanguage = (id) => {
        if (languages.length === 1) {
            setMessage("Phải giữ ít nhất 1 dòng!");
            setTimeout(() => setMessage(""), 2000);
            return;
        }
        setLanguages(languages.filter((lang) => lang.id !== id));
    };

    const updateLanguage = (id, field, value) => {
        setLanguages(
            languages.map((lang) =>
                lang.id === id ? { ...lang, [field]: value } : lang
            )
        );
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

        // Lọc bỏ các dòng trống hoàn toàn
        const validLanguages = languages.filter(
            (lang) => lang.name.trim() !== "" || lang.level.trim() !== ""
        );

        const payload = {
            languageEntries: validLanguages.map((lang) => ({
                // SỬA LỖI: Gửi tên ngôn ngữ dưới trường 'languageName' thay vì 'language'
                languageName: lang.name, 
                level: lang.level,
            })),
        };

        try {
            await axios.put(
                "http://localhost:8080/api/profile/languages",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setMessage("Lưu ngoại ngữ thành công!");

            setTimeout(() => {
                if (isExiting) {
                    navigate("/myjobs");
                } else {
                    navigate("/create-resume/step5");
                }
            }, 600);
        } catch (err) {
            console.error("Lỗi lưu ngoại ngữ:", err);
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

    const handleBack = () => navigate("/create-resume/step3");

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
                                <div className={`border rounded px-2 py-1 ${index === 3 ? "bg-primary text-white" : "bg-light text-muted"}`}>
                                    <div className="fw-bold">Bước {index + 1}</div>
                                    <div className="small">{step}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>

            <Container className="my-5 pt-4">
                <h4 className="text-center fw-bold mb-2">Ngoại ngữ</h4>
                <p className="text-center text-muted small mb-5">(Không bắt buộc – có thể bỏ qua)</p>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row className="g-4 justify-content-center">
                        {languages.map((lang, idx) => (
                            <Col lg={8} key={lang.id}>
                                <Row className="g-3 align-items-end">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">
                                                Ngoại ngữ {idx > 0 && idx + 1}
                                            </Form.Label>
                                            <Form.Select
                                                value={lang.name}
                                                onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                                            >
                                                <option value="" disabled>Chọn ngoại ngữ</option>
                                                <option>Tiếng Anh</option>
                                                <option>Tiếng Nhật</option>
                                                <option>Tiếng Hàn</option>
                                                <option>Tiếng Trung</option>
                                                <option>Tiếng Pháp</option>
                                                <option>Tiếng Đức</option>
                                                <option>Tiếng Tây Ban Nha</option>
                                                <option>Tiếng Nga</option>
                                                <option>Khác</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={5}>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">Trình độ</Form.Label>
                                            <Form.Select
                                                value={lang.level}
                                                onChange={(e) => updateLanguage(lang.id, "level", e.target.value)}
                                            >
                                                <option value="" disabled>Chọn trình độ</option>
                                                <option>Sơ cấp (A1-A2)</option>
                                                <option>Trung cấp (B1-B2)</option>
                                                <option>Khá (C1)</option>
                                                <option>Xuất sắc (C2)</option>
                                                <option>Bản ngữ / Thông thạo</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={1}>
                                        {languages.length > 1 && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="mb-3"
                                                onClick={() => removeLanguage(lang.id)}
                                            >
                                                Xóa
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                                {idx < languages.length - 1 && <hr className="my-4" />}
                            </Col>
                        ))}

                        {/* NÚT THÊM */}
                        <Col lg={8}>
                            <Button
                                type="button"
                                variant="link"
                                className="text-primary p-0 d-flex align-items-center"
                                onClick={addLanguage}
                            >
                                <Plus size={24} className="me-1" />
                                Thêm ngôn ngữ khác
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