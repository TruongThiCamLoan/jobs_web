import React, { useState, useEffect } from "react";
import { 
    Container, 
    Form, 
    Row, 
    Col, 
    Button, 
    Card, 
    Alert,
    Spinner,
    FormCheck 
} from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

export default function CreateResumeStep9() {
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

    const [isSearchable, setIsSearchable] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // TẢI TRẠNG THÁI HIỆN TẠI
    useEffect(() => {
        if (!authToken) {
            setIsFetching(false);
            return;
        }

        const fetchSearchStatus = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/profile", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                // Lấy giá trị isSearchable từ profile
                const currentStatus = res.data.isSearchable;
                if (typeof currentStatus === 'boolean') {
                    setIsSearchable(currentStatus);
                } else {
                    setIsSearchable(true); // Mặc định cho phép tìm kiếm
                }
            } catch (err) {
                console.log("Lỗi tải trạng thái hồ sơ:", err);
            } finally {
                setIsFetching(false);
            }
        };

        fetchSearchStatus();
    }, [authToken]);

    // GỬI DỮ LIỆU LÊN SERVER
    const sendDataToApi = async () => {
        setMessage("");
        setError("");
        setLoading(true);

        if (!authToken) {
            setError("Phiên đăng nhập hết hạn!");
            setLoading(false);
            return;
        }

        // Payload cho Bước 9: Trạng thái hồ sơ
        const payload = {
            isSearchable: isSearchable,
            // Giả định hồ sơ đã hoàn thành ở bước cuối này
            isComplete: true, 
            profileStatus: isSearchable ? 'active' : 'hidden', 
        };

        try {
            await axios.put(
                "http://localhost:8080/api/profile/search-status", // Endpoint chính xác từ router
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setMessage("Lưu trạng thái hồ sơ thành công! Hồ sơ đã hoàn tất.");

            // Điều hướng về trang myjobs sau khi hoàn tất
            setTimeout(() => {
                navigate("/myjobs");
            }, 600);

        } catch (err) {
            console.error("Lỗi lưu trạng thái hồ sơ:", err);
            
            let errorMessage = "Không thể lưu trạng thái hồ sơ do lỗi mạng hoặc server.";

            if (axios.isAxiosError(err)) {
                if (err.response?.status === 404) {
                     errorMessage = "Lỗi 404: Endpoint API '/api/profile/search-status' không tồn tại. Vui lòng kiểm tra lại URL API hoặc trạng thái của Backend.";
                } else if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                }
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendDataToApi();
    };

    const handleBack = () => navigate("/create-resume/step8");

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
                                        index === 8 // Bước 9 (index 8)
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
                <h4 className="text-center fw-bold mb-5">Trạng thái hồ sơ</h4>
                
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row className="g-4 justify-content-center">
                        {/* CHO PHÉP TÌM KIẾM */}
                        <Col lg={8}>
                            <Card
                                className={`cursor-pointer ${isSearchable ? "border-primary shadow-sm" : "border-light"}`}
                                onClick={() => setIsSearchable(true)}
                            >
                                <Card.Body className="d-flex align-items-start">
                                    <Form.Check
                                        type="radio"
                                        id="allow-search"
                                        checked={isSearchable}
                                        onChange={() => setIsSearchable(true)}
                                        className="me-3 mt-1"
                                    />
                                    <div>
                                        <strong className="d-block">Cho phép tìm kiếm (Công khai)</strong>
                                        <p className="text-muted small mb-0">
                                            Nhà tuyển dụng có thể tìm thấy hồ sơ của bạn trong kho hồ sơ. 
                                            Chi tiết liên lạc (ví dụ: email, tên) chỉ hiển thị trong mỗi sơ yếu lý lịch 
                                            và không thể tìm kiếm bởi nhà tuyển dụng.
                                        </p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* KHÔNG CHO PHÉP TÌM KIẾM */}
                        <Col lg={8}>
                            <Card
                                className={`cursor-pointer mt-3 ${!isSearchable ? "border-primary shadow-sm" : "border-light"}`}
                                onClick={() => setIsSearchable(false)}
                            >
                                <Card.Body className="d-flex align-items-start">
                                    <Form.Check
                                        type="radio"
                                        id="deny-search"
                                        checked={!isSearchable}
                                        onChange={() => setIsSearchable(false)}
                                        className="me-3 mt-1"
                                    />
                                    <div>
                                        <strong className="d-block">Không cho phép tìm kiếm (Ẩn danh)</strong>
                                        <p className="text-muted small mb-0">
                                            Sơ yếu lý lịch của bạn sẽ không được hiển thị trong mục tìm kiếm tài năng 
                                            của nhà tuyển dụng.
                                        </p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* NÚT ĐIỀU HƯỚNG */}
                    <div className="text-center mt-5 d-flex justify-content-center gap-3 flex-wrap">
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
                                    Lưu trạng thái và Hoàn tất
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