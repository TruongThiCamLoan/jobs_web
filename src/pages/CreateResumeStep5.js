import React, { useState, useEffect, useCallback } from "react";
import {
    Container,
    Form,
    Row,
    Col,
    Button,
    FormCheck,
    Alert,
    Spinner,
} from "react-bootstrap";
import { ArrowLeft, ArrowRight, Plus, Trash } from "react-bootstrap-icons";
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
    // Đảo ngược để năm gần nhất lên đầu (chỉ áp dụng cho Năm)
    if (label === "Năm") {
        return options.reverse();
    }
    return options;
};

// Hàm tiện ích: So sánh hai khoảng thời gian (năm-tháng)
// Thời gian bắt đầu phải nhỏ hơn hoặc bằng thời gian kết thúc
const isStartDateBeforeEndDate = (startYear, startMonth, endYear, endMonth) => {
    // Chuyển về dạng số để so sánh (quy đổi về tổng số tháng)
    // Month 01 = 1, Year 2024 = 2024*12 + 1 = 24289
    const startValue = parseInt(startYear) * 12 + parseInt(startMonth);
    const endValue = parseInt(endYear) * 12 + parseInt(endMonth);

    // Bắt đầu phải nhỏ hơn hoặc bằng Kết thúc
    return startValue <= endValue;
};


// Hàm tiện ích để tạo entry rỗng mặc định
const createEmptyExperience = () => ({
    id: Date.now() + Math.random(),
    totalYears: "",
    company: "",
    position: "",
    industry: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    isCurrent: false,
    description: "",
});

export default function CreateResumeStep5() {
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

    const [experiences, setExperiences] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    
    // Lấy năm hiện tại để giới hạn lựa chọn năm
    const currentYear = new Date().getFullYear();

    // Hàm tiện ích để parse chuỗi ngày (YYYY-MM-DD) thành month/year
    const parseDate = (dateString) => {
        if (dateString && dateString !== '0000-00-00') {
            const parts = dateString.split('-');
            if (parts.length >= 2) {
                // Month is parts[1], Year is parts[0]
                // Chuyển về số nguyên để loại bỏ số 0 đầu, sau đó về chuỗi
                return {
                    month: parts[1] ? String(parseInt(parts[1], 10)) : "",
                    year: parts[0] || "",
                };
            }
        }
        return { month: "", year: "" };
    };

    // TẢI DỮ LIỆU KINH NGHIỆM LÀM VIỆC CŨ
    useEffect(() => {
        if (!authToken) {
            setIsFetching(false);
            return;
        }

        const fetchExperiences = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/profile", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                const data = res.data;
                if (data.experiences && data.experiences.length > 0) {
                    setExperiences(
                        data.experiences.map((exp) => {
                            const start = parseDate(exp.startDate);
                            const end = parseDate(exp.endDate);

                            return {
                                id: Date.now() + Math.random(),
                                totalYears: exp.totalYears || "",
                                company: exp.companyName || exp.company || "", // Fix: Ưu tiên đọc companyName
                                position: exp.position || "",
                                industry: exp.industry || "",
                                // Fix: Sử dụng ngày parse được từ startDate/endDate nếu có
                                startMonth: start.month || exp.startMonth || "",
                                startYear: start.year || exp.startYear || "",
                                endMonth: end.month || exp.endMonth || "",
                                endYear: end.year || exp.endYear || "",
                                isCurrent: exp.isCurrent || false,
                                description: exp.description || "",
                            };
                        })
                    );
                } else {
                    // Nếu chưa có dữ liệu → để trống 1 dòng để bắt đầu điền
                    setExperiences([createEmptyExperience()]);
                }
            } catch (err) {
                console.log("Chưa có dữ liệu kinh nghiệm hoặc lỗi tải:", err);
                setExperiences([createEmptyExperience()]);
            } finally {
                setIsFetching(false);
            }
        };

        fetchExperiences();
    }, [authToken]);

    const addExperience = () => {
        setExperiences([...experiences, createEmptyExperience()]);
    };

    const removeExperience = (id) => {
        if (experiences.length === 1) {
            setMessage("Phải giữ ít nhất 1 dòng. Bạn có thể để trống các trường.");
            setTimeout(() => setMessage(""), 3000);
            return;
        }
        setExperiences(experiences.filter((exp) => exp.id !== id));
    };

    const updateExperience = (id, field, value) => {
        setExperiences(
            experiences.map((exp) =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        );
    };

    const toggleCurrentJob = (id) => {
        setExperiences(
            experiences.map((exp) =>
                exp.id === id ? { 
                    ...exp, 
                    isCurrent: !exp.isCurrent,
                    // Xóa ngày kết thúc nếu là công việc hiện tại
                    endMonth: !exp.isCurrent ? "" : exp.endMonth,
                    endYear: !exp.isCurrent ? "" : exp.endYear,
                } : exp
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

        // Hàm tiện ích để tạo chuỗi ngày YYYY-MM-DD (cho API) từ month/year
        const formatDateForApi = (year, month) => {
            if (!year || !month) return null;
            const y = String(year);
            const m = String(month).padStart(2, '0');
            // Mặc định ngày là 01 vì frontend chỉ thu thập tháng và năm
            return `${y}-${m}-01`;
        };

        // Lọc bỏ các dòng trống hoàn toàn
        const validExperiences = experiences.filter(
            (exp) =>
                exp.company.trim() !== "" ||
                exp.position.trim() !== "" ||
                exp.description.trim() !== ""
        );

        if (validExperiences.length === 0) {
            setError("Vui lòng nhập ít nhất một mục kinh nghiệm hợp lệ!");
            setLoading(false);
            return;
        }

        // ==================== LOGIC MỚI: KIỂM TRA THỜI GIAN ====================
        for (const exp of validExperiences) {
            if (!exp.isCurrent) {
                // Yêu cầu bắt buộc phải có ngày bắt đầu và ngày kết thúc cho công việc đã nghỉ
                if (!exp.startYear || !exp.startMonth || !exp.endYear || !exp.endMonth) {
                    setError(`Kinh nghiệm tại ${exp.company} bị thiếu ngày Bắt đầu hoặc Kết thúc. Vui lòng nhập đủ 4 trường tháng/năm.`);
                    setLoading(false);
                    return;
                }
                
                // Kiểm tra logic Bắt đầu <= Kết thúc
                if (!isStartDateBeforeEndDate(exp.startYear, exp.startMonth, exp.endYear, exp.endMonth)) {
                    setError(`Kinh nghiệm tại ${exp.company} bị lỗi: Thời gian Bắt đầu (${exp.startMonth}/${exp.startYear}) phải NHỎ HƠN hoặc BẰNG thời gian Kết thúc (${exp.endMonth}/${exp.endYear})!`);
                    setLoading(false);
                    return;
                }
            } else {
                // Yêu cầu bắt buộc phải có ngày bắt đầu cho công việc hiện tại
                if (!exp.startYear || !exp.startMonth) {
                    setError(`Kinh nghiệm hiện tại tại ${exp.company} bị thiếu ngày Bắt đầu.`);
                    setLoading(false);
                    return;
                }
            }
        }
        // ==================== KẾT THÚC LOGIC KIỂM TRA ====================


        // Chuẩn bị payload
        const payload = {
            experienceEntries: validExperiences.map((exp) => ({
                // Dùng parseFloat để đảm bảo totalYears là number hoặc null/undefined nếu không phải số
                totalYears: exp.totalYears ? parseFloat(exp.totalYears) : null,
                companyName: exp.company, 
                position: exp.position,
                industry: exp.industry,
                
                startDate: formatDateForApi(exp.startYear, exp.startMonth),
                endDate: exp.isCurrent ? null : formatDateForApi(exp.endYear, exp.endMonth),
                
                isCurrent: exp.isCurrent,
                description: exp.description,
            })),
        };

        try {
            const res = await axios.put(
                "http://localhost:8080/api/profile/experiences", // Endpoint giả định
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Thêm thông báo đã lưu
            setMessage("Lưu kinh nghiệm làm việc thành công!");

            // Điều hướng sau khi lưu thành công và hiển thị thông báo trong thời gian ngắn
            setTimeout(() => {
                if (isExiting) {
                    navigate("/myjobs");
                } else {
                    navigate("/create-resume/step6");
                }
            }, 600); // 0.6 giây đủ để người dùng thấy thông báo

        } catch (err) {
            console.error("Lỗi lưu kinh nghiệm:", err);
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

    const handleBack = () => navigate("/create-resume/step4");

    // ==================== KHAI BÁO OPTIONS CHO DROP-DOWN NĂM ====================
    // Năm bắt đầu: Giới hạn từ 1950 đến NĂM HIỆN TẠI (Không cho phép năm bắt đầu trong tương lai)
    const startYears = renderOptions(1950, currentYear, "Năm");

    // Năm kết thúc: Có thể chọn đến NĂM HIỆN TẠI + 5 (Cho phép các chương trình đang học/tương lai gần)
    const endYears = renderOptions(1950, currentYear + 5, "Năm");
    const months = renderOptions(1, 12, "Tháng");

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
                                        index === 4
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
                <h4 className="text-center fw-bold mb-2">Kinh nghiệm làm việc</h4>
                <p className="text-center text-muted small mb-5">
                    (Không bắt buộc – có thể bỏ qua)
                </p>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {experiences.map((exp, idx) => (
                        <div key={exp.id} className="mb-5">
                            <Row className="g-4 justify-content-center">
                                {/* TỔNG SỐ NĂM KINH NGHIỆM (Chỉ hiện thị cho dòng đầu tiên) */}
                                {idx === 0 && (
                                    <Col lg={8}>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">
                                                Tổng số năm kinh nghiệm làm việc{" "}
                                                <span className="text-danger">*</span>
                                            </Form.Label>
                                            <div className="d-flex align-items-center">
                                                {/* Input để người dùng tự nhập số năm */}
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    step="0.1"
                                                    placeholder="Ví dụ: 2.5"
                                                    style={{ width: "auto", maxWidth: "100px" }}
                                                    value={exp.totalYears}
                                                    onChange={(e) =>
                                                        updateExperience(
                                                            exp.id,
                                                            "totalYears",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <span className="ms-2">năm</span>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                )}

                                {/* TÊN CÔNG TY + CHỨC DANH */}
                                <Col lg={8}>
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="fw-semibold">
                                                    Tên công ty <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={exp.company}
                                                    onChange={(e) =>
                                                        updateExperience(
                                                            exp.id,
                                                            "company",
                                                            e.target.value
                                                        )
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
                                                    value={exp.position}
                                                    onChange={(e) =>
                                                        updateExperience(
                                                            exp.id,
                                                            "position",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>

                                {/* NGÀNH NGHỀ */}
                                <Col lg={8}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            Ngành nghề việc làm <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            value={exp.industry}
                                            onChange={(e) =>
                                                updateExperience(
                                                    exp.id,
                                                    "industry",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="" disabled>
                                                Vui lòng chọn
                                            </option>
                                            <option>IT - Phần mềm</option>
                                            <option>Marketing</option>
                                            <option>Kinh doanh</option>
                                            <option>Tài chính</option>
                                            <option>Nhân sự</option>
                                            <option>Khác</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {/* NGÀY BẮT ĐẦU */}
                                <Col lg={8}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            Ngày Bắt Đầu <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Row className="g-3">
                                            <Col xs={6}>
                                                <Form.Select
                                                    value={exp.startMonth}
                                                    onChange={(e) =>
                                                        updateExperience(
                                                            exp.id,
                                                            "startMonth",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">-- Tháng --</option>
                                                    {months}
                                                </Form.Select>
                                            </Col>
                                            <Col xs={6}>
                                                <Form.Select
                                                    value={exp.startYear}
                                                    onChange={(e) =>
                                                        updateExperience(
                                                            exp.id,
                                                            "startYear",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">-- Năm --</option>
                                                    {startYears} {/* Giới hạn không quá năm hiện tại */}
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>

                                {/* NGÀY KẾT THÚC + CÔNG VIỆC HIỆN TẠI */}
                                <Col lg={8}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            Ngày Kết Thúc <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Row className="g-3 align-items-center">
                                            <Col xs={5}>
                                                <Form.Select
                                                    value={exp.endMonth}
                                                    onChange={(e) =>
                                                        updateExperience(
                                                            exp.id,
                                                            "endMonth",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={exp.isCurrent}
                                                >
                                                    <option value="">-- Tháng --</option>
                                                    {months}
                                                </Form.Select>
                                            </Col>

                                            <Col xs={5}>
                                                <Form.Select
                                                    value={exp.endYear}
                                                    onChange={(e) =>
                                                        updateExperience(
                                                            exp.id,
                                                            "endYear",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={exp.isCurrent}
                                                >
                                                    <option value="">-- Năm --</option>
                                                    {endYears} {/* Cho phép năm tương lai nếu đang làm */}
                                                </Form.Select>
                                            </Col>

                                            <Col xs={2}>
                                                <FormCheck
                                                    type="checkbox"
                                                    label="Hiện tại"
                                                    checked={exp.isCurrent}
                                                    onChange={() => toggleCurrentJob(exp.id)}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>

                                {/* MÔ TẢ */}
                                <Col lg={8}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            Mô tả <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            value={exp.description}
                                            onChange={(e) =>
                                                updateExperience(
                                                    exp.id,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </Col>

                                {/* NÚT XÓA */}
                                <Col lg={8} className="text-end">
                                    {experiences.length > 1 && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => removeExperience(exp.id)}
                                        >
                                            <Trash className="me-1" /> Xóa kinh nghiệm này
                                        </Button>
                                    )}
                                </Col>
                            </Row>

                            {idx < experiences.length - 1 && (
                                <hr className="my-5" style={{ borderTop: "2px dashed #dee2e6" }} />
                            )}
                        </div>
                    ))}

                    {/* NÚT THÊM */}
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Button
                                type="button"
                                variant="link"
                                className="text-primary p-0 d-flex align-items-center"
                                onClick={addExperience}
                            >
                                <Plus size={20} className="me-1" /> Thêm kinh nghiệm làm việc
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

            {/* ZALO */}
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