import React, { useState, useCallback } from "react";
import { Container, Button, Alert, ProgressBar, Nav } from "react-bootstrap";
// Giữ lại lucide-react cho các icon tiện ích trong trang này
import { Upload, FileText, X, Link as LinkIcon, Briefcase } from 'lucide-react'; 
import { Link } from "react-router-dom";

// PHỤC HỒI IMPORT NAVBAR GỐC
import AppNavbar from "../components/Navbar"; 

// import "./style.css"; // Giả định CSS được quản lý ngoài

const MAX_FILE_SIZE_MB = 3;
// Tên MIME types được hỗ trợ
const ACCEPTED_MIME_TYPES = [
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'application/pdf', 
    'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

export default function UploadResumePage() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("ready"); // ready, error, uploading, success
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState("");

    const handleFileUpload = useCallback(async (uploadedFile) => {
        if (!uploadedFile) return;

        // 1. Kiểm tra kích thước và định dạng
        if (uploadedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setMessage(`Lỗi: Kích thước file vượt quá ${MAX_FILE_SIZE_MB}MB.`);
            setStatus("error");
            setFile(null);
            return;
        }
        
        // Kiểm tra MIME type đơn giản bằng cách kiểm tra đuôi file
        const fileName = uploadedFile.name.toLowerCase();
        const isAccepted = ACCEPTED_MIME_TYPES.includes(uploadedFile.type) || 
                           fileName.endsWith('.doc') || 
                           fileName.endsWith('.docx') || 
                           fileName.endsWith('.xls') || 
                           fileName.endsWith('.xlsx') || 
                           fileName.endsWith('.pdf');

        if (!isAccepted) {
            setMessage("Lỗi: Chỉ chấp nhận các định dạng DOC, DOCX, XLS, XLSX, PDF.");
            setStatus("error");
            setFile(null);
            return;
        }

        // 2. Bắt đầu upload
        setFile(uploadedFile);
        setStatus("uploading");
        setMessage(`Đang tải lên: ${uploadedFile.name}`);
        setUploadProgress(0);

        // --- MOCK LOGIC UPLOAD THỰC TẾ ---
        
        const simulationDuration = 1500; // Giả lập 1.5 giây tải lên
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 10;
            setUploadProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(interval);
                setStatus("success");
                setMessage(`Tải lên hoàn tất! ${uploadedFile.name} đã sẵn sàng.`);
            }
        }, simulationDuration / 10);
        // --- END MOCK LOGIC ---

    }, []);

    // Xử lý sự kiện kéo thả (Drag and Drop)
    const handleDragOver = (e) => {
        e.preventDefault();
        // e.currentTarget.classList.add('drag-over'); 
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        // e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        // e.currentTarget.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    // Xử lý click nút chọn file
    const handleFileSelect = (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    };
    
    // Xóa file đang hiển thị
    const handleRemoveFile = () => {
        setFile(null);
        setStatus("ready");
        setMessage("");
        setUploadProgress(0);
    }

    // CSS style cho Drag and Drop area
    const dropZoneStyle = {
        border: status === 'error' ? '2px dashed #f00' : '2px dashed #ccc',
        borderRadius: '10px',
        padding: '50px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease',
        backgroundColor: '#fff'
    };
    
    // Custom Spinner function (dùng khi React-Bootstrap Spinner không load)
    const CustomSpinner = ({ size = '1em', color = 'currentColor' }) => (
        <svg 
            className="spinner" 
            viewBox="0 0 50 50" 
            style={{ width: size, height: size, color: color, animation: 'spin 1s linear infinite' }}
        >
            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" stroke="currentColor" style={{ opacity: 0.5, strokeDasharray: 80, strokeDashoffset: 60 }}></circle>
        </svg>
    );

    return (
        <div className="upload-resume-page pt-5 mt-5 bg-light min-vh-100">
             <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <AppNavbar />

            <Container className="my-5">
                <div className="mx-auto" style={{ maxWidth: '600px' }}>
                    <h4 className="fw-bold mb-4 text-center">Tải Hồ Sơ Đính Kèm</h4>

                    {/* DROP ZONE */}
                    <div 
                        style={dropZoneStyle} 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {(status === "ready" || status === "error") && (
                            <>
                                <Upload size={48} className={status === 'error' ? "text-danger" : "text-primary"} />
                                <p className="mt-3 mb-4 text-muted">
                                    Kéo và thả CV của bạn để nhanh chóng tạo hồ sơ bằng AI
                                    <br />hoặc
                                </p>
                                <input
                                    type="file"
                                    id="file-upload"
                                    hidden
                                    accept=".doc,.docx,.xls,.xlsx,.pdf"
                                    onChange={handleFileSelect}
                                />
                                <Button 
                                    variant="primary" 
                                    onClick={() => document.getElementById('file-upload').click()}
                                    className="fw-semibold px-4"
                                >
                                    Tải hồ sơ lên
                                </Button>
                                <p className="small text-muted mt-3">
                                    File: doc, docx, xls, pdf (tối đa {MAX_FILE_SIZE_MB}MB)
                                    <br />
                                    Vui lòng không chọn file hình ảnh, bằng cấp
                                </p>
                            </>
                        )}
                        
                        {(status === "uploading" || status === "success") && file && (
                            <div className="d-flex flex-column align-items-center">
                                <FileText size={48} className={status === "success" ? "text-success" : "text-info"} />
                                <h6 className="mt-3">{file.name}</h6>
                                <ProgressBar 
                                    now={uploadProgress} 
                                    variant={status === "success" ? "success" : "primary"}
                                    className="w-75 my-3" 
                                    label={`${uploadProgress}%`}
                                />
                                {status === "uploading" && <CustomSpinner size="20px" color="blue" />}
                                
                                {status === "success" && (
                                    <Button variant="success" size="sm" className="mt-2" as={Link} to="/myjobs">
                                        Xem hồ sơ đã tạo
                                    </Button>
                                )}
                                <Button variant="link" onClick={handleRemoveFile} className="text-muted small mt-2">
                                    <X size={14} className="me-1" /> Xóa
                                </Button>
                            </div>
                        )}
                        
                    </div>
                    
                    {/* MESSAGE ALERT */}
                    {message && (
                        <Alert variant={status === "error" ? "danger" : (status === "success" ? "success" : "info")} className="mt-3 text-center">
                            {message}
                        </Alert>
                    )}

                    {/* Hướng dẫn tạo CV bằng tay */}
                    <div className="text-center mt-5">
                         <p className="text-muted small">
                            Hoặc bạn có thể tạo hồ sơ theo từng bước:
                        </p>
                        <Button 
                            variant="outline-secondary" 
                            as={Link} 
                            to="/create-resume/step1"
                        >
                            <LinkIcon size={14} className="me-2" /> Tạo hồ sơ theo từng bước
                        </Button>
                    </div>

                </div>
            </Container>
        </div>
    );
}