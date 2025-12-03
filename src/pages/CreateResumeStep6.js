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
import { ArrowLeft, ArrowRight, Plus, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

// Hàm tiện ích để tạo entry rỗng mặc định
const createEmptyReference = () => ({
    id: Date.now() + Math.random(),
    relationship: "",
    name: "", // Tên người tham khảo
    position: "",
    phone: "",
    email: "",
    notes: "",
});

export default function CreateResumeStep6() {
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

    const [references, setReferences] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // TẢI DỮ LIỆU NGƯỜI THAM KHẢO CŨ
    useEffect(() => {
        if (!authToken) {
            setIsFetching(false);
            return;
        }

        const fetchReferences = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/profile", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                const data = res.data;
                if (data.references && data.references.length > 0) {
                    setReferences(
                        data.references.map((ref) => ({
                            id: Date.now() + Math.random(),
                            relationship: ref.relationship || "",
                            name: ref.refereeName || ref.name || "", // Đọc từ refereeName hoặc name
                            position: ref.position || "",
                            phone: ref.phone || "",
                            email: ref.email || "",
                            notes: ref.notes || "",
                        }))
                    );
                } else {
                    // Nếu chưa có dữ liệu → để trống 1 dòng để bắt đầu điền
                    setReferences([createEmptyReference()]);
                }
            } catch (err) {
                console.log("Chưa có dữ liệu người tham khảo hoặc lỗi tải:", err);
                setReferences([createEmptyReference()]);
            } finally {
                setIsFetching(false);
            }
        };

        fetchReferences();
    }, [authToken]);


    const addReference = () => {
        setReferences([...references, createEmptyReference()]);
    };

    const removeReference = (id) => {
        if (references.length === 1) {
            setMessage("Phải giữ ít nhất 1 dòng. Bạn có thể để trống các trường.");
            setTimeout(() => setMessage(""), 3000);
            return;
        }
        setReferences(references.filter((ref) => ref.id !== id));
    };

    const updateReference = (id, field, value) => {
        setReferences(
            references.map((ref) =>
                ref.id === id ? { ...ref, [field]: value } : ref
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

        // Lọc bỏ các dòng trống hoàn toàn (quan hệ, tên, chức danh đều trống)
        const validReferences = references.filter(
            (ref) =>
                ref.relationship.trim() !== "" ||
                ref.name.trim() !== "" ||
                ref.position.trim() !== ""
        );

        // Chuẩn bị payload
        const payload = {
            referenceEntries: validReferences.map((ref) => ({
                relationship: ref.relationship,
                refereeName: ref.name, // Giả định backend dùng refereeName
                position: ref.position,
                phone: ref.phone,
                email: ref.email,
                notes: ref.notes,
            })),
        };

        try {
            await axios.put(
                "http://localhost:8080/api/profile/references", // Endpoint giả định
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setMessage("Lưu thông tin người tham khảo thành công!");

            // Điều hướng sau khi lưu thành công
            setTimeout(() => {
                if (isExiting) {
                    navigate("/myjobs");
                } else {
                    navigate("/create-resume/step7");
                }
            }, 600);

        } catch (err) {
            console.error("Lỗi lưu người tham khảo:", err);
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

    const handleBack = () => navigate("/create-resume/step5");


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
                            <div
                                key={index}
                                className="flex-shrink-0 mx-1"
                                style={{ minWidth: 100 }}
                            >
                                <div
                                    className={`border rounded px-2 py-1 ${
                                        index === 5 // Bước 6 (index 5)
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
                <h4 className="text-center fw-bold mb-2">Người tham khảo</h4>
                <p className="text-center text-muted small mb-5">(Không bắt buộc – có thể bỏ qua)</p>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {references.map((ref, idx) => (
                        <div key={ref.id} className="mb-5">
                            <Row className="g-4 justify-content-center">
                                {/* MỐI QUAN HỆ */}
                                <Col lg={8}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            Mối quan hệ <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            className="highlight-select"
                                            value={ref.relationship}
                                            onChange={(e) =>
                                                updateReference(ref.id, "relationship", e.target.value)
                                            }
                                        >
                                            <option value="" disabled>
                                                Vui lòng chọn
                                            </option>
                                            <option>Quản lý cũ</option>
                                            <option>Đồng nghiệp</option>
                                            <option>Giảng viên</option>
                                            <option>Khách hàng</option>
                                            <option>Đối tác</option>
                                            <option>Khác</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {/* TÊN + CHỨC DANH */}
                                <Col lg={8}>
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="fw-semibold">
                                                    Tên <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder=""
                                                    value={ref.name}
                                                    onChange={(e) =>
                                                        updateReference(ref.id, "name", e.target.value)
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="fw-semibold">
                                                    Chức danh <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder=""
                                                    value={ref.position}
                                                    onChange={(e) =>
                                                        updateReference(ref.id, "position", e.target.value)
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>

                                {/* ĐIỆN THOẠI + EMAIL */}
                                <Col lg={8}>
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="fw-semibold">Điện thoại</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder=""
                                                    value={ref.phone}
                                                    onChange={(e) =>
                                                        updateReference(ref.id, "phone", e.target.value)
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="fw-semibold">E-mail</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder=""
                                                    value={ref.email}
                                                    onChange={(e) =>
                                                        updateReference(ref.id, "email", e.target.value)
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>

                                {/* THÔNG TIN LIÊN QUAN (NOTES) */}
                                <Col lg={8}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            Thông tin liên quan (Ghi chú)
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Ví dụ: Công ty cũ, lý do tham khảo, mức độ thân thiết..."
                                            value={ref.notes}
                                            onChange={(e) =>
                                                updateReference(ref.id, "notes", e.target.value)
                                            }
                                        />
                                    </Form.Group>
                                </Col>

                                {/* NÚT XÓA */}
                                <Col lg={8} className="text-end">
                                    {references.length > 1 && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => removeReference(ref.id)}
                                        >
                                            <Trash className="me-1" /> Xóa người tham khảo này
                                        </Button>
                                    )}
                                </Col>
                            </Row>

                            {/* PHÂN CÁCH */}
                            {idx < references.length - 1 && (
                                <hr className="my-5" style={{ borderTop: "2px dashed #dee2e6" }} />
                            )}
                        </div>
                    ))}

                    {/* NÚT THÊM NGƯỜI THAM KHẢO */}
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Button
                                type="button"
                                variant="link"
                                className="text-primary p-0 d-flex align-items-center"
                                onClick={addReference}
                            >
                                <Plus size={20} className="me-1" /> Thêm người tham khảo
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