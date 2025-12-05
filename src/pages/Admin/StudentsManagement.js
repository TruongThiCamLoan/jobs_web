import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Toast, Spinner, Alert } from "react-bootstrap";
import { Lock, Unlock, Search, RotateCw, Trash2, Eye } from 'lucide-react';
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination"; 
import { 
    getAllStudents, 
    updateStudentStatus, 
    deleteStudent 
} from "../../services/admin/api"; 

// Số lượng mục trên mỗi trang (Cần khớp với API limit)
const ITEMS_PER_PAGE = 8; 

export default function StudentsManagement() {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1); 
    const [totalItems, setTotalItems] = useState(0);

    // Modal Khóa
    const [showLockReasonModal, setShowLockReasonModal] = useState(false);
    const [lockReason, setLockReason] = useState("");
    // 💡 MỚI: State cho thời hạn khóa (Giá trị mặc định là NULL hoặc thời hạn vĩnh viễn)
    const [lockUntil, setLockUntil] = useState(""); 
    const [lockingStudent, setLockingStudent] = useState(null);

    // Modal Xóa (Giữ nguyên)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingStudent, setDeletingStudent] = useState(null);

    // Toast
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [errorAlert, setErrorAlert] = useState(null);

    // Lọc theo tab
    const [selectedTab, setSelectedTab] = useState("active"); 

    // 🔄 Hàm tải dữ liệu chính từ API
    const loadStudents = useCallback(async () => {
        setLoading(true);
        setErrorAlert(null);
        try {
            const isLockedFilter = selectedTab === 'locked'; 
            
            const response = await getAllStudents({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                search: searchTerm,
                isLocked: isLockedFilter ? 'true' : 'false'
            });
            
            const fetchedStudents = response.data.data.students;
            const pagination = response.data.pagination;

            const flattenedStudents = fetchedStudents.map(student => ({
                ...student,
                isLocked: student.user ? student.user.isLocked : false,
                lockReason: student.user ? student.user.lockReason : null,
                // 💡 HIỂN THỊ lockUntil
                lockUntil: student.user ? student.user.lockUntil : null,
                email: student.user ? student.user.email : 'N/A',
            }));

            setStudents(flattenedStudents);
            setTotalPages(pagination.totalPages);
            setTotalItems(pagination.totalItems);
            
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error.response?.data || error);
            setErrorAlert(`Lỗi khi tải dữ liệu: ${error.response?.data?.message || error.message || 'Lỗi hệ thống'}`);
        } finally {
            setLoading(false);
        }
    }, [currentPage, selectedTab, searchTerm]);

    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    // --- Hành động: Khóa / Mở khóa ---
    const handleToggleLock = async (student) => {
        if (student.isLocked) {
            // ... (Logic Mở khóa giữ nguyên)
            const confirmOpen = window.confirm(`Bạn có chắc chắn muốn mở khóa tài khoản ${student.fullName}?`);
            if (!confirmOpen) return;
            
            try {
                setLoading(true);
                // Gửi lockReason rỗng và isLocked: false
                await updateStudentStatus(student.studentId, { 
                    isLocked: false, 
                    lockReason: "", 
                    lockUntil: null // Đảm bảo xóa cả thời hạn khóa cũ
                });
                
                setToastMsg("🔓 Đã mở khóa sinh viên thành công!");
                setToastVariant("success");
                setShowToast(true);
                loadStudents(); 
            } catch (error) {
                console.error("Lỗi mở khóa:", error.response?.data);
                setErrorAlert(`Lỗi khi mở khóa: ${error.response?.data?.message || error.message || 'Lỗi hệ thống'}`);
            } finally {
                setLoading(false);
            }
        } else {
            // Chuẩn bị Khóa (Mở Modal)
            setLockingStudent(student);
            // 💡 Đặt mặc định khóa vĩnh viễn (hoặc một ngày xa) khi mở Modal
            setLockReason("");
            setLockUntil(""); 
            setShowLockReasonModal(true);
        }
    };

    // --- Hành động: Xác nhận Khóa sinh viên ---
    const confirmLockStudent = async () => {
        if (!lockReason.trim()) {
            alert("Vui lòng nhập lý do khóa.");
            return;
        }
        
        try {
            setShowLockReasonModal(false);
            setLoading(true);
            
            // 💡 GỬI lockUntil LÊN API
            const finalLockUntil = lockUntil || null; // Gửi null nếu Admin không chọn
            
            await updateStudentStatus(lockingStudent.studentId, { 
                isLocked: true, 
                lockReason: lockReason.trim(),
                lockUntil: finalLockUntil // Gửi thời hạn khóa
            });
            
            setToastMsg("🔒 Đã khóa sinh viên thành công!");
            setToastVariant("danger");
            setShowToast(true);
            loadStudents(); 
        } catch (error) {
            console.error("Lỗi khóa:", error.response?.data);
            setErrorAlert(`Lỗi khi khóa: ${error.response?.data?.message || error.message || 'Lỗi hệ thống'}`);
        } finally {
            setLoading(false);
            setLockReason("");
            setLockUntil("");
            setLockingStudent(null);
        }
    };
    
    // --- Hành động: Xóa vĩnh viễn (Giữ nguyên) ---
    const handleOpenDeleteModal = (student) => {
        setDeletingStudent(student);
        setShowDeleteModal(true);
    };

    // NOTE: Cần thêm hàm confirmDeleteStudent nếu chưa có trong code gốc

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <AdminSidebarLayout>
            <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="mb-3">🧑‍🎓 Quản lý Ứng viên ({totalItems} sinh viên)</h3>
                
                {errorAlert && <Alert variant="danger" className="mt-3">{errorAlert}</Alert>}
                
                {/* ... (Phần Tabs và Search giữ nguyên) ... */}
                <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
                    <div>
                        {["active", "locked"].map((tab) => (
                            <Button
                                key={tab}
                                variant={selectedTab === tab ? "dark" : "outline-dark"}
                                className="me-2"
                                onClick={() => {
                                    setSelectedTab(tab);
                                    setCurrentPage(1); 
                                    setSearchTerm(""); 
                                }}
                                disabled={loading}
                            >
                                {tab === "active" ? "Sinh viên hoạt động" : "Sinh viên bị khóa"}
                            </Button>
                        ))}
                    </div>
                    <Button variant="outline-primary" onClick={() => loadStudents()} disabled={loading}>
                        <RotateCw size={18} className={loading ? 'spin me-1' : 'me-1'} /> Tải lại
                    </Button>
                </div>

                <div className="mb-3">
                    <Form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); loadStudents(); }}>
                        <div className="d-flex">
                            <input
                                type="text"
                                placeholder="🔍 Tìm kiếm theo tên hoặc email..."
                                className="form-control w-25"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button type="submit" variant="primary" className="ms-2">
                                <Search size={18} />
                            </Button>
                        </div>
                    </Form>
                </div>

                {/* Table */}
                {loading && students.length === 0 ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <div className="scrollable-table-wrapper">
                        <Table striped bordered hover responsive>
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>Mã SV</th>
                                    <th>T.Gian KN</th> 
                                    <th>Tình trạng HS</th>
                                    <th>Trạng thái TK</th>
                                    <th className="text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-3">Không tìm thấy ứng viên nào.</td>
                                    </tr>
                                ) : (
                                    students.map((s, i) => (
                                    <tr key={s.studentId}>
                                        <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                                        <td>{s.fullName}</td>
                                        <td>{s.user?.email || 'N/A'}</td> {/* Giả định bạn đã sửa lỗi mapping email */}
                                        <td>{s.studentId}</td>
                                        <td>{s.totalYearsExperience || 0} năm</td> 
                                        <td>{s.profileStatus || 'Chưa cập nhật'}</td>
                                        <td>
                                            <span
                                                className={`badge ${s.isLocked ? "bg-secondary" : "bg-success"}`}
                                            >
                                                {s.isLocked ? "Bị khóa" : "Hoạt động"}
                                            </span>
                                            {/* Hiển thị Lý do khóa và Thời hạn */}
                                            {s.isLocked && (
                                                <div className="text-muted small mt-1">
                                                    Lý do: **{s.lockReason}**
                                                    {s.lockUntil && (
                                                        <div className="text-danger">
                                                            (Mở khóa lúc: {new Date(s.lockUntil).toLocaleString()})
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="text-center d-flex gap-2 justify-content-center">
                                            <Button variant="outline-info" size="sm" title="Xem chi tiết">
                                                <Eye size={16} />
                                            </Button>
                                            <Button
                                                variant={s.isLocked ? "outline-success" : "outline-danger"}
                                                size="sm"
                                                onClick={() => handleToggleLock(s)}
                                                disabled={loading}
                                                title={s.isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                                            >
                                                {s.isLocked ? <Unlock size={16} /> : <Lock size={16} />}
                                            </Button>
                                        </td>
                                    </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}

                {/* Pagination (Giữ nguyên) */}
                {totalPages > 1 && (
                    <div className="mt-3 d-flex justify-content-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}

                {/* Modal lý do khóa (ĐÃ THÊM TRƯỜNG THỜI GIAN) */}
                <Modal
                    show={showLockReasonModal}
                    onHide={() => setShowLockReasonModal(false)}
                    centered
                    size="lg" 
                >
                    <Modal.Header closeButton>
                        <Modal.Title>🔒 Khóa Tài Khoản Ứng Viên</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Bạn đang khóa tài khoản của **{lockingStudent?.fullName}**.</p>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Thời hạn khóa (Không bắt buộc)</Form.Label>
                            <Form.Control
                                type="datetime-local" // 💡 SỬ DỤNG DATETIME-LOCAL
                                value={lockUntil}
                                onChange={(e) => setLockUntil(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)} // Giới hạn không được chọn quá khứ
                            />
                            <Form.Text className="text-muted">
                                Nếu để trống, tài khoản sẽ bị khóa vĩnh viễn (cho đến khi Admin mở khóa thủ công).
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Lý do khóa *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5} 
                                value={lockReason}
                                onChange={(e) => setLockReason(e.target.value)}
                                placeholder="Nhập lý do khóa tài khoản (Bắt buộc)..."
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setShowLockReasonModal(false)}
                        >
                            Hủy
                        </Button>
                        <Button variant="danger" onClick={confirmLockStudent} disabled={!lockReason.trim() || loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Xác nhận khóa'}
                        </Button>
                    </Modal.Footer>
                </Modal>


                {/* Toast (Giữ nguyên) */}
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={2500}
                    autohide
                    bg={toastVariant === 'success' ? 'success' : 'danger'}
                    style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
                >
                    <Toast.Header closeButton={false} className="text-white">
                        <strong className="me-auto">Thông báo</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toastMsg}</Toast.Body>
                </Toast>
            </div>
        </AdminSidebarLayout>
    );
}