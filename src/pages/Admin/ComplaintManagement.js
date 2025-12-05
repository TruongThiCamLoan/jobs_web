import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Badge, Modal, Form, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FileText, Clock, XCircle, CheckCircle, AlertTriangle, Search, Loader2, XOctagon } from 'lucide-react'; // Thêm XOctagon
import AdminSidebarLayout from '../../components/AdminSidebar';
import Pagination from '../../components/Pagination';
import "../../components/AdminSidebar.css"; 

// Giả định URL gốc của API backend
const API_BASE_URL = 'http://localhost:8080/api/v1/admin/reports'; 

// ⭐️ CẬP NHẬT: THÊM TRẠNG THÁI 'Ignored'
const STATUS_OPTIONS = ['Pending', 'Resolved', 'Ignored']; 

export default function ComplaintManagement() {
    // State cho dữ liệu API
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // State cho lọc và phân trang
    const [selectedTab, setSelectedTab] = useState('Pending'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 7; 

    // State cho Modal, xử lý...
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [violationResult, setViolationResult] = useState('');
    const [selectedAction, setSelectedAction] = useState('Cảnh cáo');
    const [actionReason, setActionReason] = useState('');

    const ADMIN_TOKEN = 'YOUR_ADMIN_AUTH_TOKEN'; 

    // --- LOGIC GỌI API LẤY DANH SÁCH (Không đổi) ---
    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        const url = new URL(API_BASE_URL);
        url.searchParams.append('status', selectedTab);
        url.searchParams.append('search', searchTerm);
        url.searchParams.append('page', currentPage);
        url.searchParams.append('limit', itemsPerPage);
        
        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ADMIN_TOKEN}` 
                }
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                     throw new Error("Phiên làm việc hết hạn. Vui lòng đăng nhập lại.");
                }
                throw new Error(data.message || `Lỗi khi tải dữ liệu: ${response.status}`);
            }

            setComplaints(data.data || []);
            setTotalPages(data.pagination?.totalPages || 1);

        } catch (err) {
            console.error("Fetch Error:", err);
            setError(`Không thể tải dữ liệu: ${err.message}`);
            setComplaints([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [selectedTab, searchTerm, currentPage, itemsPerPage, ADMIN_TOKEN]); 

    // --- useEffect để gọi API khi các tham số lọc/phân trang thay đổi ---
    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);


    // --- Hàm xử lý chuyển trang, tìm kiếm, mở Modal (Giữ nguyên) ---
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); 
    };
    
    const handleOpenProcessModal = (complaint) => {
        setSelectedComplaint(complaint);
        setViolationResult(complaint.violation_result || '');
        setSelectedAction('Cảnh cáo');
        setActionReason('');
        setShowProcessModal(true);
    };

    const handleOpenDetailModal = (complaint) => {
        setSelectedComplaint(complaint);
        setShowDetailModal(true);
    };

    // --- Logic Lưu kết quả xử lý (GỌI API PUT) ---
    const handleSaveViolation = async () => {
        if (!selectedAction || !actionReason.trim()) {
            alert("Vui lòng chọn Hình thức xử lý và nhập Lý do/Phản hồi.");
            return;
        }
        if (!selectedComplaint) return;
        
        setIsProcessing(true);
        setError(null);
        const reportId = selectedComplaint.id || selectedComplaint.reportId; 

        try {
            const response = await fetch(`${API_BASE_URL}/${reportId}/process`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ADMIN_TOKEN}` 
                },
                body: JSON.stringify({
                    action: selectedAction,
                    reason: actionReason,
                    violation_result: violationResult,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Lỗi xử lý: ${response.status}`);
            }
            
            // ⭐️ CẬP NHẬT: Chuyển sang tab 'Resolved'
            setSearchTerm('');
            setCurrentPage(1); 
            setSelectedTab('Resolved'); 
            setShowProcessModal(false);
            alert(`Xử lý khiếu nại ID ${reportId} thành công!`);

        } catch (err) {
            console.error("Processing Error:", err);
            setError(`Lỗi khi xử lý khiếu nại: ${err.message}`);
            alert(`Lỗi khi xử lý: ${err.message}`); 
        } finally {
            setIsProcessing(false);
        }
    };

    // ⭐️ HÀM MỚI: XỬ LÝ BỎ QUA (IGNORE)
    const handleIgnoreReport = async () => {
        if (!selectedComplaint || !window.confirm(`Bạn có chắc chắn muốn đánh dấu báo cáo ID ${selectedComplaint.id || selectedComplaint.reportId} là Bỏ qua (Ignored) không?`)) {
            return;
        }

        setIsProcessing(true);
        setError(null);
        const reportId = selectedComplaint.id || selectedComplaint.reportId; 

        try {
            // GỌI API MỚI: PUT /api/v1/admin/reports/:reportId/ignore
            const response = await fetch(`${API_BASE_URL}/${reportId}/ignore`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${ADMIN_TOKEN}` 
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Lỗi khi bỏ qua: ${response.status}`);
            }

            // ⭐️ CẬP NHẬT: Chuyển sang tab 'Ignored'
            setShowProcessModal(false);
            setSearchTerm('');
            setCurrentPage(1);
            setSelectedTab('Ignored'); 

            alert(`Báo cáo ID ${reportId} đã được BỎ QUA thành công!`);
        } catch (err) {
            console.error("Ignore Error:", err);
            setError(`Lỗi khi bỏ qua báo cáo: ${err.message}`);
            alert(`Lỗi khi bỏ qua: ${err.message}`);
        } finally {
            setIsProcessing(false);
        }
    }


    // --- Helper functions ---
    const getStatusBadge = (status) => {
        if (status === 'Pending') {
            return <Badge bg="warning" text="dark" className="d-flex align-items-center"><Clock size={12} className="me-1"/> Chờ xử lý</Badge>;
        }
        if (status === 'Resolved') {
            return <Badge bg="success" className="d-flex align-items-center"><CheckCircle size={12} className="me-1"/> Đã xử lý</Badge>;
        }
        // ⭐️ THÊM TRẠNG THÁI 'Ignored'
        return <Badge bg="danger" className="d-flex align-items-center"><XCircle size={12} className="me-1"/> Đã bỏ qua</Badge>;
    };

    const getUserTypeBadge = (type) => {
        return type === 'Student'
            ? <Badge bg="info">Ứng viên</Badge>
            : <Badge bg="primary">NTD</Badge>;
    };

    // ... (DetailModal giữ nguyên, sử dụng getStatusBadge mới)

    const DetailModal = () => {
        if (!selectedComplaint) return null;
        
        const isPending = selectedComplaint.status === 'Pending';
        const targetType = selectedComplaint.target_type === 'Student' ? 'Ứng viên' : 'Nhà tuyển dụng';
        
        return (
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="lg">
                <Modal.Header closeButton className={`bg-${isPending ? 'warning' : 'success'} text-white`}>
                    <Modal.Title>
                        {isPending ? <AlertTriangle size={24} className="me-2"/> : <CheckCircle size={24} className="me-2"/>}
                        {isPending ? "Chi tiết Khiếu nại/Vi phạm" : "Lịch sử Xử lý"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Row className="mb-3">
                        <Col md={6}>
                            <Card className="shadow-sm border-0 h-100">
                                <Card.Body>
                                    <h6 className="fw-bold text-dark mb-3">Thông tin Chung</h6>
                                    <p className="mb-1 small"><strong>ID:</strong> {selectedComplaint.id || selectedComplaint.reportId}</p>
                                    <p className="mb-1 small"><strong>Người gửi:</strong> {selectedComplaint.user_name} ({getUserTypeBadge(selectedComplaint.user_type)})</p>
                                    <p className="mb-1 small"><strong>Đối tượng:</strong> {selectedComplaint.target_name} ({targetType})</p>
                                    <p className="mb-1 small"><strong>Ngày tạo:</strong> {new Date(selectedComplaint.createdAt || selectedComplaint.reportDate || '').toLocaleDateString('vi-VN')}</p>
                                    <p className="mb-1 small"><strong>Trạng thái:</strong> {getStatusBadge(selectedComplaint.status)}</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="shadow-sm border-0 h-100">
                                <Card.Body>
                                    <h6 className="fw-bold text-dark mb-3">Nội dung & Minh chứng</h6>
                                    <p className="small text-muted fst-italic">{selectedComplaint.description || selectedComplaint.content}</p> 
                                    <hr className="my-2" />
                                    <p className="small fw-semibold mb-1">Minh chứng đính kèm (0):</p>
                                    <ul className="list-unstyled small">
                                        <li className="text-muted fst-italic">Không có minh chứng</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    
                    <h6 className="fw-bold text-dark mt-4 mb-2">Lịch sử Xử lý</h6>
                    <div className="alert alert-secondary small text-center">
                        <p className='fw-bold mb-1'>Kết quả xử lý:</p>
                        {selectedComplaint.violation_result || "Chưa có hành động xử lý nào được ghi nhận."}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {isPending && (
                        <Button variant="primary" onClick={() => { setShowDetailModal(false); handleOpenProcessModal(selectedComplaint); }}>
                            Chuyển sang Xử lý
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Đóng</Button>
                </Modal.Footer>
            </Modal>
        );
    };


    // --- Render Component Chính ---
    return (
        <AdminSidebarLayout>
            <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="mb-4">⚖️ Quản lý khiếu nại và vi phạm ({loading ? '...' : complaints.length} mục trên trang)</h3>
                
                {/* Tabs & Search */}
                <div className="d-flex justify-content-start mb-2 gap-2 flex-wrap">
                    {STATUS_OPTIONS.map(tab => ( 
                        <Button
                            key={tab}
                            variant={selectedTab === tab ? 'dark' : 'outline-dark'}
                            className="me-2 mb-1"
                            size="sm"
                            onClick={() => {
                                if (selectedTab !== tab) {
                                    setCurrentPage(1); 
                                    setSearchTerm(''); 
                                }
                                setSelectedTab(tab);
                            }}
                            disabled={loading}
                        >
                            {tab === 'Pending' ? 'Chờ xử lý' : (tab === 'Resolved' ? 'Đã xử lý' : 'Đã bỏ qua')} ({tab === selectedTab ? complaints.length : '...'})
                        </Button>
                    ))}
                </div>

                {/* Search Bar (Giữ nguyên) */}
                <form onSubmit={handleSearch} className="mb-4">
                    <div className="d-flex">
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm đơn khiếu nại..."
                            className="form-control w-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={loading}
                        />
                        <Button type="submit" variant="primary" className="ms-2" disabled={loading}>
                            <Search size={18} />
                        </Button>
                    </div>
                </form>

                {/* Hiển thị lỗi & Loading (Giữ nguyên) */}
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                {loading ? (
                    <div className="text-center p-5">
                        <Spinner animation="border" variant="primary" className="me-2"/> Đang tải dữ liệu...
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        {complaints.length === 0 ? (
                            <div className="alert alert-info">Không có khiếu nại/vi phạm nào trong trạng thái này.</div>
                        ) : (
                            <>
                                <div className="scrollable-table-wrapper">
                                    <Table striped bordered hover responsive className="table-sm">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Người gửi </th>
                                                <th>Đối tượng bị khiếu nại </th>
                                                <th>Nội dung Tóm tắt</th>
                                                <th>Ngày tạo</th>
                                                <th>Trạng thái</th>
                                                <th>Kết quả xử lý</th>
                                                <th className="text-center">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {complaints.map((c) => (
                                                <tr key={c.id || c.reportId}>
                                                    <td>{c.id || c.reportId}</td>
                                                    <td>{c.user_name || c.userId} ({getUserTypeBadge(c.user_type)})</td>
                                                    <td>{c.target_name || c.entityId} ({getUserTypeBadge(c.target_type)})</td>
                                                    <td>{(c.description || c.content)?.substring(0, 50)}...</td>
                                                    <td>{new Date(c.createdAt || c.reportDate).toLocaleDateString('vi-VN')}</td>
                                                    <td>{getStatusBadge(c.status)}</td>
                                                    <td>{c.violation_result || '—'}</td>
                                                    <td className="text-center">
                                                        <Button size="sm" variant="outline-info" className="me-2" onClick={() => handleOpenDetailModal(c)} title="Xem chi tiết">
                                                            Chi tiết
                                                        </Button>
                                                        {c.status === 'Pending' && (
                                                            <Button size="sm" variant="primary" onClick={() => handleOpenProcessModal(c)} title="Xử lý khiếu nại">
                                                                Xử lý
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>

                                {/* Pagination (Giữ nguyên) */}
                                {totalPages > 1 && (
                                    <div className="mt-3 d-flex justify-content-center">
                                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}


                {/* Modal Chi tiết (Giữ nguyên) */}
                <DetailModal />

                {/* Modal xử lý (THÊM NÚT BỎ QUA) */}
                <Modal show={showProcessModal} onHide={() => setShowProcessModal(false)} centered size="lg">
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title>Xử lý Vi phạm/Khiếu nại ID: {selectedComplaint?.id || selectedComplaint?.reportId}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Thông tin Vi phạm & Form (Giữ nguyên) */}
                        <Card className="mb-3">
                            <Card.Header className="fw-bold bg-light">Thông tin Vi phạm</Card.Header>
                            <Card.Body className="small">
                                <p className="mb-1">**Nội dung:** {selectedComplaint?.description || selectedComplaint?.content}</p>
                                <p className="mb-1">**Đối tượng:** {selectedComplaint?.target_name || selectedComplaint?.entityId} ({selectedComplaint?.target_type})</p>
                                <p className="mb-0">
                                    **Minh chứng (0):**
                                    <span className="fst-italic text-muted ms-2">Không có</span>
                                </p>
                            </Card.Body>
                        </Card>
                        
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Hình thức xử lý <span className="text-danger">*</span></Form.Label>
                                <Form.Select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)}>
                                    <option value="Cảnh cáo">Cảnh cáo</option>
                                    <option value="Xóa nội dung">Xóa nội dung/Tin tuyển dụng</option>
                                    <option value="Thu hồi quyền đăng">Thu hồi quyền đăng (Khóa tài khoản tạm thời)</option>
                                    <option value="Từ chối khiếu nại">Từ chối khiếu nại</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Lý do / Phản hồi chi tiết <span className="text-danger">*</span></Form.Label>
                                <Form.Control as="textarea" rows={3} value={actionReason} onChange={(e) => setActionReason(e.target.value)} placeholder="Nhập lý do hoặc phản hồi chi tiết cho người dùng..." required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Kết quả xử lý (Hiển thị công khai)</Form.Label>
                                <Form.Control as="textarea" rows={2} value={violationResult} onChange={(e) => setViolationResult(e.target.value)} placeholder="Ví dụ: Cảnh cáo, xóa hồ sơ/tin đăng..." />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        {/* NÚT BỎ QUA */}
                        <Button 
                            variant="danger" 
                            onClick={handleIgnoreReport} 
                            disabled={isProcessing}
                            className='me-auto'
                        >
                            <XOctagon size={18} className='me-1'/> Bỏ qua (Ignored)
                        </Button>

                        <Button variant="secondary" onClick={() => setShowProcessModal(false)} disabled={isProcessing}>Hủy</Button>
                        <Button variant="success" onClick={handleSaveViolation} disabled={!actionReason.trim() || isProcessing}>
                            {isProcessing ? <><Loader2 size={18} className='animate-spin me-2'/> Đang Lưu...</> : 'Lưu kết quả & Chuyển trạng thái'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </AdminSidebarLayout>
    );
}