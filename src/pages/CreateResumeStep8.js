import React, { useState, useEffect } from "react";
import { 
    Container, 
    Form, 
    Row, 
    Col, 
    Button, 
    FormCheck, 
    Alert,
    Spinner,
    InputGroup
} from "react-bootstrap";
import { ArrowLeft, ArrowRight, Plus, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/Navbar";
import "./style1-9.css";

// Khởi tạo giá trị ban đầu là chuỗi rỗng cho các mảng
const createEmptyIndustry = () => "";
const createEmptyLocation = () => "";

// Helper: Định dạng số sang chuỗi VND (ví dụ: 15000000 -> 15.000.000)
const formatCurrency = (value) => {
    if (!value) return "";
    // Loại bỏ tất cả ký tự không phải số hoặc dấu chấm/phẩy (để tránh lỗi format trước)
    const numericValue = String(value).replace(/[^0-9]/g, ''); 
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Helper: Loại bỏ định dạng (unformat) để chuyển sang số float khi gửi API
const unformatCurrency = (formattedValue) => {
    if (!formattedValue) return "";
    // Thay thế dấu chấm thành rỗng (vì dấu chấm là dấu phân cách hàng nghìn ở VN)
    return formattedValue.replace(/\./g, '');
};


export default function CreateResumeStep8() {
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

    const [formData, setFormData] = useState({
        desiredPosition: "",
        recentSalary: "",
        recentCurrency: "VND",
        desiredSalaryFrom: "",
        desiredSalaryTo: "",
        desiredCurrency: "VND",
        jobType: "",
        jobLevel: "",
        industries: [createEmptyIndustry()],
        preferredLocations: [createEmptyLocation()],
        careerGoal: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // TẢI DỮ LIỆU MỤC TIÊU NGHỀ NGHIỆP CŨ
    useEffect(() => {
        if (!authToken) {
            setIsFetching(false);
            return;
        }

        const fetchCareerGoal = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/profile", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                const profile = res.data;
                
                const desiredIndustries = profile.desiredIndustries || [];
                const preferredLocations = profile.preferredLocations || [];
                
                const initialData = {
                    desiredPosition: profile.desiredPosition || "",
                    // FIX TẢI: Định dạng lại số tiền khi tải về
                    recentSalary: formatCurrency(profile.recentSalary) || "", 
                    recentCurrency: "VND",
                    desiredSalaryFrom: formatCurrency(profile.desiredSalaryFrom) || "",
                    desiredSalaryTo: formatCurrency(profile.desiredSalaryTo) || "",
                    desiredCurrency: "VND",
                    jobType: profile.jobType || "",
                    jobLevel: profile.jobLevel || "",
                    industries: desiredIndustries.length > 0 ? desiredIndustries : [createEmptyIndustry()],
                    preferredLocations: preferredLocations.length > 0 ? preferredLocations : [createEmptyLocation()],
                    careerGoal: profile.careerGoal || "",
                };
                
                setFormData(initialData);

            } catch (err) {
                console.log("Chưa có dữ liệu mục tiêu nghề nghiệp hoặc lỗi tải:", err);
            } finally {
                setIsFetching(false);
            }
        };

        fetchCareerGoal();
    }, [authToken]);


    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };
    
    // Helper: Cập nhật trường số tiền với định dạng VND
    const updateCurrencyField = (field, value) => {
        // Loại bỏ ký tự không phải số để có giá trị thô, sau đó định dạng lại
        const unformatted = unformatCurrency(value);
        const formatted = formatCurrency(unformatted);
        updateField(field, formatted);
    };

    const addIndustry = () => {
        setFormData({ ...formData, industries: [...formData.industries, createEmptyIndustry()] });
    };

    const removeIndustry = (index) => {
        const newIndustries = formData.industries.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            industries: newIndustries.length > 0 ? newIndustries : [createEmptyIndustry()],
        });
    };

    const updateIndustry = (index, value) => {
        const newIndustries = [...formData.industries];
        newIndustries[index] = value;
        setFormData({ ...formData, industries: newIndustries });
    };

    const addLocation = () => {
        setFormData({ ...formData, preferredLocations: [...formData.preferredLocations, createEmptyLocation()] });
    };

    const removeLocation = (index) => {
        const newLocations = formData.preferredLocations.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            preferredLocations: newLocations.length > 0 ? newLocations : [createEmptyLocation()],
        });
    };

    const updateLocation = (index, value) => {
        const newLocations = [...formData.preferredLocations];
        newLocations[index] = value;
        setFormData({ ...formData, preferredLocations: newLocations });
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

        const finalIndustries = formData.industries.filter(i => i.trim() !== "");
        const finalLocations = formData.preferredLocations.filter(l => l.trim() !== "");

        // FIX GỬI API: unformat giá trị tiền tệ trước khi gửi
        const rawRecentSalary = unformatCurrency(formData.recentSalary);
        const rawDesiredFrom = unformatCurrency(formData.desiredSalaryFrom);
        const rawDesiredTo = unformatCurrency(formData.desiredSalaryTo);

        const payload = {
            desiredPosition: formData.desiredPosition,
            // FIX: ParseFloat giá trị đã unformat
            recentSalary: rawRecentSalary ? parseFloat(rawRecentSalary) : null,
            recentCurrency: "VND", 
            desiredSalaryFrom: rawDesiredFrom ? parseFloat(rawDesiredFrom) : null,
            desiredSalaryTo: rawDesiredTo ? parseFloat(rawDesiredTo) : null,
            desiredCurrency: "VND", 
            jobType: formData.jobType,
            jobLevel: formData.jobLevel,
            desiredIndustries: finalIndustries,
            preferredLocations: finalLocations,
            careerGoal: formData.careerGoal,
        };

        try {
            await axios.put(
                "http://localhost:8080/api/profile/career-goal", 
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // FIX: KHÔI PHỤC THÔNG BÁO LƯU THÀNH CÔNG
            setMessage("Lưu mục tiêu nghề nghiệp thành công!");

            setTimeout(() => {
                if (isExiting) {
                    navigate("/myjobs");
                } else {
                    navigate("/create-resume/step9");
                }
            }, 600);

        } catch (err) {
            console.error("Lỗi lưu mục tiêu nghề nghiệp:", err);
            
            let errorMessage = "Không thể lưu dữ liệu do lỗi mạng hoặc server.";

            if (axios.isAxiosError(err)) {
                if (err.response?.status === 404) {
                     errorMessage = "Lỗi 404: Endpoint API '/api/profile/career-goal' không tồn tại. Vui lòng kiểm tra lại URL API hoặc trạng thái của Backend.";
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
        sendDataToApi(false);
    };

    const handleSaveAndExit = (e) => {
        e.preventDefault();
        sendDataToApi(true);
    };

    const handleBack = () => navigate("/create-resume/step7");

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
                                        index === 7 // Bước 8 (index 7)
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
                <h4 className="text-center fw-bold mb-5">Mục tiêu nghề nghiệp</h4>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row className="g-4 justify-content-center">
                        {/* VỊ TRÍ MONG MUỐN */}
                        <Col lg={8}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    Vị trí mong muốn <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ví dụ: Lập trình viên Backend"
                                    value={formData.desiredPosition}
                                    onChange={(e) => updateField("desiredPosition", e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        {/* MỨC LƯƠNG GẦN ĐÂY NHẤT */}
                        <Col lg={8}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Mức lương gần đây nhất (VND)</Form.Label>
                                <InputGroup> 
                                    <Form.Control
                                        // FIX: Chuyển sang type="text" để dùng format VND
                                        type="text"
                                        placeholder="Nhập mức lương (ví dụ: 15.000.000)"
                                        value={formData.recentSalary}
                                        onChange={(e) => updateCurrencyField("recentSalary", e.target.value)}
                                    />
                                    <InputGroup.Text>VND</InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        {/* MỨC LƯƠNG MONG MUỐN */}
                        <Col lg={8}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    Mức lương mong muốn <span className="text-danger">*</span>
                                </Form.Label>
                                <Row className="g-3 align-items-center">
                                    <Col xs={6}>
                                        <InputGroup>
                                            <Form.Control
                                                // FIX: Chuyển sang type="text" để dùng format VND
                                                type="text"
                                                placeholder="Từ"
                                                value={formData.desiredSalaryFrom}
                                                onChange={(e) => updateCurrencyField("desiredSalaryFrom", e.target.value)}
                                            />
                                            <InputGroup.Text>VND</InputGroup.Text>
                                        </InputGroup>
                                    </Col>
                                    <Col xs={6}>
                                        <InputGroup>
                                            <Form.Control
                                                // FIX: Chuyển sang type="text" để dùng format VND
                                                type="text"
                                                placeholder="Đến"
                                                value={formData.desiredSalaryTo}
                                                onChange={(e) => updateCurrencyField("desiredSalaryTo", e.target.value)}
                                            />
                                            <InputGroup.Text>VND</InputGroup.Text>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>

                        {/* LOẠI CÔNG VIỆC */}
                        <Col lg={8}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    Loại công việc <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Select
                                    value={formData.jobType}
                                    onChange={(e) => updateField("jobType", e.target.value)}
                                >
                                    <option value="">Vui lòng chọn</option>
                                    <option>Toàn thời gian</option>
                                    <option>Bán thời gian</option>
                                    <option>Làm việc từ xa</option>
                                    <option>Thực tập</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        {/* CẤP BẬC MONG MUỐN */}
                        <Col lg={8}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    Cấp bậc mong muốn <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Select
                                    value={formData.jobLevel}
                                    onChange={(e) => updateField("jobLevel", e.target.value)}
                                >
                                    <option value="">Vui lòng chọn</option>
                                    <option>Nhân viên</option>
                                    <option>Trưởng nhóm</option>
                                    <option>Quản lý</option>
                                    <option>Giám đốc</option>
                                    <option>Chuyên gia</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        {/* NGÀNH NGHỀ MONG MUỐN */}
                        <Col lg={8}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    Ngành nghề mong muốn <span className="text-danger">*</span>
                                </Form.Label>
                                {formData.industries.map((industry, index) => (
                                    <Row key={index} className="g-2 mb-2 align-items-center">
                                        <Col>
                                            <Form.Select
                                                value={industry}
                                                onChange={(e) => updateIndustry(index, e.target.value)}
                                            >
                                                <option value="">Vui lòng chọn</option>
                                                <option>IT - Phần mềm</option>
                                                <option>Marketing</option>
                                                <option>Kinh doanh</option>
                                                <option>Tài chính</option>
                                                <option>Nhân sự</option>
                                                <option>Khác</option>
                                            </Form.Select>
                                        </Col>
                                        {formData.industries.length > 1 && (
                                            <Col xs="auto">
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => removeIndustry(index)}
                                                >
                                                    <Trash />
                                                </Button>
                                            </Col>
                                        )}
                                    </Row>
                                ))}
                                <Button
                                    type="button"
                                    variant="link"
                                    className="text-primary p-0 d-flex align-items-center"
                                    onClick={addIndustry}
                                >
                                    <Plus size={20} className="me-1" /> Thêm ngành nghề
                                </Button>
                            </Form.Group>
                        </Col>

                        {/* NƠI LÀM VIỆC ƯA THÍCH */}
                        <Col lg={8}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    Nơi làm việc ưa thích <span className="text-danger">*</span>
                                </Form.Label>
                                {formData.preferredLocations.map((location, index) => (
                                    <Row key={index} className="g-2 mb-2 align-items-center">
                                        <Col md={6}>
                                            <Form.Select
                                                value={location}
                                                onChange={(e) => updateLocation(index, e.target.value)}
                                            >
                                                <option value="">Vui lòng chọn</option>
                                                <option>Hà Nội</option>
                                                <option>TP. Hồ Chí Minh</option>
                                                <option>Đà Nẵng</option>
                                                <option>Làm việc từ xa</option>
                                                <option>Khác</option>
                                            </Form.Select>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Select disabled>
                                                <option>Tất cả quận/huyện</option>
                                            </Form.Select>
                                        </Col>
                                        {formData.preferredLocations.length > 1 && (
                                            <Col xs="auto">
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => removeLocation(index)}
                                                >
                                                    <Trash />
                                                </Button>
                                            </Col>
                                        )}
                                    </Row>
                                ))}
                                <Button
                                    type="button"
                                    variant="link"
                                    className="text-primary p-0 d-flex align-items-center"
                                    onClick={addLocation}
                                >
                                    <Plus size={20} className="me-1" /> Thêm nơi làm việc
                                </Button>
                            </Form.Group>
                        </Col>

                        {/* MỤC TIÊU NGHỀ NGHIỆP */}
                        <Col lg={8}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    Mục tiêu nghề nghiệp <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder="Viết mục tiêu nghề nghiệp của bạn (Ví dụ: Trở thành chuyên gia trong lĩnh vực X sau 5 năm)."
                                    value={formData.careerGoal}
                                    onChange={(e) => updateField("careerGoal", e.target.value)}
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