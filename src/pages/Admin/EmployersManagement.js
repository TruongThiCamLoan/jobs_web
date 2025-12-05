import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Toast, Spinner, Alert, Badge } from "react-bootstrap";
// Import các icons cần thiết
import { Lock, Unlock, Search, RotateCw, CheckCircle, XCircle, Trash2, Eye } from 'lucide-react';
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
// Import các hàm API
import { 
    getAllEmployers, 
    updateEmployerStatus, 
    reviewEmployerAccount, 
    deleteEmployer 
} from "../../services/admin/api"; 

const ITEMS_PER_PAGE = 8; 

// Ánh xạ trạng thái phê duyệt sang kiểu hiển thị
const VERIFICATION_STATUS_MAP = {
    true: { variant: 'success', text: 'Đã Duyệt' },
    false: { variant: 'danger', text: 'Bị Từ Chối' },
    // Dùng 'pending' cho trạng thái chưa được Admin xét duyệt
    pending: { variant: 'warning', text: 'Chờ Duyệt' }, 
};

export default function EmployersManagement() {
    const [employers, setEmployers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1); 
    const [totalItems, setTotalItems] = useState(0);

    // Filter States
    const [selectedTab, setSelectedTab] = useState("all"); 

    // Modal Khóa
    const [showLockReasonModal, setShowLockReasonModal] = useState(false);
    const [lockReason, setLockReason] = useState("");
    const [lockUntil, setLockUntil] = useState(""); 
    const [lockingEmployer, setLockingEmployer] = useState(null);

    // Modal Từ chối Phê duyệt
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectingEmployer, setRejectingEmployer] = useState(null);
    
    // Modal Xóa
    // const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [deletingEmployer, setDeletingEmployer] = useState(null);

    // Toast & Error
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [errorAlert, setErrorAlert] = useState(null);

    // ----------------------------------------------------
    // 1. LOAD DATA (Cập nhật Logic Lọc)
    // ----------------------------------------------------
    const loadEmployers = useCallback(async () => {
        setLoading(true);
        setErrorAlert(null);
        try {
            let isLockedFilter, isVerifiedFilter;
            let excludeLocked = true; // 💡 Mặc định loại trừ tài khoản bị khóa

            // Xử lý logic tab thành filter params cho API
            switch (selectedTab) {
                case 'verified':
                    isVerifiedFilter = 'true';
                    break;
                case 'pending':
                    isVerifiedFilter = 'false'; 
                    // Giả định backend xử lý pending là isVerified=false và rejectionReason=null
                    break;
                case 'locked':
                    isLockedFilter = 'true';
                    excludeLocked = false; // Khi ở tab 'locked', không loại trừ tài khoản bị khóa
                    isVerifiedFilter = undefined; // Không lọc theo trạng thái duyệt nếu đã lọc theo khóa
                    break;
                default:
                    isLockedFilter = undefined;
                    isVerifiedFilter = undefined;
            }
            
            // Nếu không ở tab 'locked', ta chỉ cần lấy những tài khoản không bị khóa (isLocked: false)
            if (excludeLocked && selectedTab !== 'locked') {
                isLockedFilter = 'false';
            }

            const response = await getAllEmployers({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                search: searchTerm,
                isLocked: isLockedFilter, 
                isVerified: isVerifiedFilter, 
            });
            
            const fetchedEmployers = response.data.data.employers;
            const pagination = response.data.pagination;

            // Làm phẳng dữ liệu User (isLocked, lockReason, lockUntil)
            const flattenedEmployers = fetchedEmployers.map(e => {
                let verificationStatus;
                if (e.isVerified === true) {
                    verificationStatus = 'true';
                } else if (e.rejectionReason) {
                    verificationStatus = 'false';
                } else {
                    verificationStatus = 'pending';
                }
                
                return {
                    ...e,
                    isLocked: e.user ? e.user.isLocked : false,
                    lockReason: e.user ? e.user.lockReason : null,
                    lockUntil: e.user ? e.user.lockUntil : null,
                    verificationStatus: verificationStatus,
                };
            });

            setEmployers(flattenedEmployers);
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
        loadEmployers();
    }, [loadEmployers]);
    
    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        setCurrentPage(1); 
        setSearchTerm("");
    }
    
    // ----------------------------------------------------
    // 2. HÀNH ĐỘNG: KHÓA / MỞ KHÓA (Thêm Quy tắc Nghiệp vụ)
    // ----------------------------------------------------
    const handleToggleLock = async (employer) => {
        if (!employer.isVerified) {
             // 💡 QUY TẮC: CHỈ KHÓA KHI ĐÃ DUYỆT
             setErrorAlert("❌ Chỉ có thể khóa tài khoản Nhà tuyển dụng ĐÃ DUYỆT.");
             return;
        }

        if (employer.isLocked) {
            // --- Mở khóa (Giữ nguyên) ---
            const confirmOpen = window.confirm(`Bạn có chắc chắn muốn mở khóa tài khoản ${employer.companyName}?`);
            if (!confirmOpen) return;
            
            try {
                setLoading(true);
                await updateEmployerStatus(employer.employerId, { 
                    isLocked: false, 
                    lockReason: null,
                    lockUntil: null 
                });
                
                setToastMsg("🔓 Đã mở khóa tài khoản thành công!");
                setToastVariant("success");
                setShowToast(true);
                loadEmployers(); 
            } catch (error) {
                setErrorAlert(`Lỗi khi mở khóa: ${error.response?.data?.message || error.message || 'Lỗi hệ thống'}`);
            } finally {
                setLoading(false);
            }
        } else {
            // Chuẩn bị Khóa (Mở Modal)
            setLockingEmployer(employer);
            setLockReason("");
            setLockUntil(""); 
            setShowLockReasonModal(true);
        }
    };

    const confirmLockEmployer = async () => {
        if (!lockReason.trim()) {
            alert("Vui lòng nhập lý do khóa.");
            return;
        }
        
        try {
            setShowLockReasonModal(false);
            setLoading(true);
            
            const finalLockUntil = lockUntil.trim() || null; 
            
            await updateEmployerStatus(lockingEmployer.employerId, { 
                isLocked: true, 
                lockReason: lockReason.trim(),
                lockUntil: finalLockUntil 
            });
            
            setToastMsg("🔒 Đã khóa tài khoản thành công!");
            setToastVariant("danger");
            setShowToast(true);
            loadEmployers(); 
        } catch (error) {
            setErrorAlert(`Lỗi khi khóa: ${error.response?.data?.message || error.message || 'Lỗi hệ thống'}`);
        } finally {
            setLoading(false);
            setLockReason("");
            setLockUntil("");
            setLockingEmployer(null);
        }
    };
    
    // ----------------------------------------------------
    // 3. HÀNH ĐỘNG: PHÊ DUYỆT / TỪ CHỐI (Thêm Quy tắc Nghiệp vụ)
    // ----------------------------------------------------
    const handleReviewAction = async (employer, isVerified) => {
        if (!isVerified) {
             // 💡 QUY TẮC: CẤM TỪ CHỐI KHI ĐÃ DUYỆT
            if (employer.verificationStatus === 'true') {
                 setErrorAlert("❌ Không thể Từ chối hồ sơ đã được Phê duyệt trước đó.");
                 return;
            }
            
            setRejectingEmployer(employer);
            setRejectReason("");
            setShowRejectModal(true);
            return;
        }

        // --- Phê duyệt ---
        const confirmAction = window.confirm(`Bạn có chắc chắn muốn Phê duyệt hồ sơ của ${employer.companyName}?`);
        if (!confirmAction) return;
        
        try {
            setLoading(true);
            // 💡 QUY TẮC: Khi duyệt, isLocked phải là false (Nhà tuyển dụng đang hoạt động)
            await updateEmployerStatus(employer.employerId, { isLocked: false, lockReason: null, lockUntil: null }); // Mở khóa nếu bị khóa tạm thời
            await reviewEmployerAccount(employer.employerId, { isVerified: true, rejectionReason: null });

            setToastMsg(`✅ Đã phê duyệt hồ sơ của ${employer.companyName} thành công!`);
            setToastVariant("success");
            setShowToast(true);
            loadEmployers(); 
        } catch (error) {
            setErrorAlert(`Lỗi khi phê duyệt: ${error.response?.data?.message || error.message || 'Lỗi hệ thống'}`);
        } finally {
            setLoading(false);
        }
    }
    
    const confirmRejectEmployer = async () => {
        if (!rejectReason.trim()) {
            alert("Vui lòng nhập lý do từ chối.");
            return;
        }
        
        try {
            setShowRejectModal(false);
            setLoading(true);
            
            // 💡 QUY TẮC: Khi Từ chối, isLocked phải là false (Tránh trường hợp bị khóa và bị từ chối cùng lúc)
            await updateEmployerStatus(rejectingEmployer.employerId, { isLocked: false, lockReason: null, lockUntil: null });
            await reviewEmployerAccount(rejectingEmployer.employerId, { 
                isVerified: false, 
                rejectionReason: rejectReason.trim()
            });
            
            setToastMsg("❌ Đã từ chối phê duyệt thành công!");
            setToastVariant("danger");
            setShowToast(true);
            loadEmployers(); 
        } catch (error) {
            setErrorAlert(`Lỗi khi từ chối: ${error.response?.data?.message || error.message || 'Lỗi hệ thống'}`);
        } finally {
            setLoading(false);
            setRejectReason("");
            setRejectingEmployer(null);
        }
    };

    // ----------------------------------------------------
    // 4. HÀNH ĐỘNG: XÓA VĨNH VIỄN (Giữ nguyên)
    // // ----------------------------------------------------
    // const handleOpenDeleteModal = (employer) => {
    //     setDeletingEmployer(employer);
    //     setShowDeleteModal(true);
    // };

    // NOTE: Cần thêm hàm confirmDeleteEmployer nếu chưa có trong code gốc

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <AdminSidebarLayout>
            <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="mb-3">🏢 Quản lý Nhà Tuyển Dụng ({totalItems} công ty)</h3>
                
                {errorAlert && <Alert variant="danger" className="mt-3" onClose={() => setErrorAlert(null)} dismissible>{errorAlert}</Alert>}
                
                {/* Tabs & Reload */}
                <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
                    <div>
                        {["all", "verified", "pending", "locked"].map((tab) => (
                            <Button
                                key={tab}
                                variant={selectedTab === tab ? "dark" : "outline-dark"}
                                className="me-2 mb-2"
                                onClick={() => handleTabChange(tab)}
                                disabled={loading}
                            >
                                {tab === "all" && "Tất cả"}
                                {tab === "pending" && "Chờ Duyệt"}
                                {tab === "verified" && "Đã Duyệt (Hoạt động)"} 
                                {tab === "locked" && "Bị Khóa"}
                            </Button>
                        ))}
                    </div>
                    <Button variant="outline-primary" onClick={loadEmployers} disabled={loading}>
                        <RotateCw size={18} className={loading ? 'spin me-1' : 'me-1'} /> Tải lại
                    </Button>
                </div>

                {/* Search */}
                <div className="mb-3">
                    <Form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); loadEmployers(); }}>
                        <div className="d-flex">
                            <input
                                type="text"
                                placeholder="🔍 Tìm kiếm theo tên công ty hoặc email..."
                                className="form-control w-50"
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
                {loading && employers.length === 0 ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <div className="scrollable-table-wrapper">
                        <Table striped bordered hover responsive>
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Tên Công ty</th>
                                    <th>Email & SĐT</th>
                                    <th>Địa chỉ</th>
                                    <th>Website</th>
                                    <th className="text-center">Phê duyệt</th>
                                    <th className="text-center">Trạng thái TK</th>
                                    <th className="text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employers.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-3">Không tìm thấy nhà tuyển dụng nào.</td>
                                    </tr>
                                ) : (
                                    employers.map((e, i) => {
                                        const verificationInfo = VERIFICATION_STATUS_MAP[e.verificationStatus || 'pending'];
                                        const isDisabled = e.isLocked && selectedTab !== 'locked';
                                        
                                        return (
                                            <tr key={e.employerId} className={isDisabled ? 'table-secondary' : ''}>
                                                <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                                                <td>{e.companyName}</td>
                                                <td>
                                                    {e.contactEmail}
                                                    <div className="text-muted small">{e.phoneNumber}</div>
                                                </td>
                                                <td>{e.city || 'N/A'}</td>
                                                <td>
                                                    {e.website ? (
                                                        <a href={e.website} target="_blank" rel="noopener noreferrer" className="text-truncate d-block" style={{maxWidth: '150px'}}>
                                                            {e.website}
                                                        </a>
                                                    ) : 'N/A'}
                                                </td>
                                                <td className="text-center">
                                                    <Badge bg={verificationInfo.variant}>
                                                        {verificationInfo.text}
                                                    </Badge>
                                                    {(e.verificationStatus === 'false' || e.rejectionReason) && (
                                                        <div className="text-danger small mt-1" title={e.rejectionReason}>
                                                            Lý do: **{e.rejectionReason ? e.rejectionReason.substring(0, 30) + '...' : 'Đã bị từ chối'}**
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <Badge bg={e.isLocked ? "secondary" : "success"}>
                                                        {e.isLocked ? "Bị khóa" : "Hoạt động"}
                                                    </Badge>
                                                    {e.isLocked && e.lockReason && (
                                                        <div className="text-muted small mt-1" title={e.lockReason}>
                                                            Lý do: **{e.lockReason.substring(0, 30)}...**
                                                            {e.lockUntil && (
                                                                <div className="text-info small">
                                                                    (Mở khóa: {new Date(e.lockUntil).toLocaleDateString()})
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        {/* Phê duyệt */}
                                                        {e.verificationStatus !== 'true' && (
                                                            <Button size="sm" variant="outline-success" title="Phê duyệt" onClick={() => handleReviewAction(e, true)} disabled={loading}>
                                                                <CheckCircle size={16} />
                                                            </Button>
                                                        )}
                                                        {/* Từ chối */}
                                                        {e.verificationStatus !== 'false' && e.verificationStatus !== 'true' && ( // Chỉ cho từ chối khi CHỜ DUYỆT
                                                            <Button size="sm" variant="outline-danger" title="Từ chối" onClick={() => handleReviewAction(e, false)} disabled={loading}>
                                                                <XCircle size={16} />
                                                            </Button>
                                                        )}
                                                        
                                                        {/* Khóa/Mở khóa */}
                                                        <Button
                                                            variant={e.isLocked ? "outline-success" : "outline-secondary"}
                                                            size="sm"
                                                            onClick={() => handleToggleLock(e)}
                                                            title={e.isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                                                            // 💡 QUY TẮC: CHỈ KHÓA KHI ĐÃ DUYỆT. LUÔN CHO PHÉP MỞ KHÓA.
                                                            disabled={loading || (!e.isLocked && e.verificationStatus !== 'true')}
                                                        >
                                                            {e.isLocked ? <Unlock size={16} /> : <Lock size={16} />}
                                                        </Button>

                                                        {/* Xóa (Mở Modal)
                                                        <Button size="sm" variant="outline-danger" title="Xóa vĩnh viễn" onClick={() => handleOpenDeleteModal(e)} disabled={loading}>
                                                            <Trash2 size={16} />
                                                        </Button> */}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-3 d-flex justify-content-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
                
                {/* 🔒 Modal lý do khóa */}
                <Modal show={showLockReasonModal} onHide={() => setShowLockReasonModal(false)} centered size="md">
                    <Modal.Header closeButton><Modal.Title>🔒 Khóa Tài Khoản Nhà Tuyển Dụng</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <p>Bạn đang khóa tài khoản của **{lockingEmployer?.companyName}**.</p>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Thời hạn khóa (Không bắt buộc)</Form.Label>
                            <Form.Control
                                type="datetime-local" 
                                value={lockUntil}
                                onChange={(e) => setLockUntil(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)} 
                            />
                            <Form.Text className="text-muted">
                                Nếu để trống, tài khoản sẽ bị khóa vĩnh viễn (cho đến khi Admin mở khóa thủ công).
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Lý do khóa *</Form.Label>
                            <Form.Control as="textarea" rows={5} value={lockReason} onChange={(e) => setLockReason(e.target.value)} placeholder="Nhập lý do khóa tài khoản (Bắt buộc)..."/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowLockReasonModal(false)}>Hủy</Button>
                        <Button variant="danger" onClick={confirmLockEmployer} disabled={!lockReason.trim() || loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Xác nhận khóa'}
                        </Button>
                    </Modal.Footer>
                </Modal>
                
                {/* ❌ Modal Lý do Từ chối Phê duyệt */}
                <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
                    <Modal.Header closeButton><Modal.Title className="text-danger">❌ Từ Chối Phê Duyệt Hồ Sơ</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <p>Bạn đang từ chối phê duyệt hồ sơ của **{rejectingEmployer?.companyName}**.</p>
                        <Form.Label>Lý do từ chối *</Form.Label>
                        <Form.Control as="textarea" rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Nhập lý do từ chối (Bắt buộc)..."/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowRejectModal(false)}>Hủy</Button>
                        <Button variant="danger" onClick={confirmRejectEmployer} disabled={!rejectReason.trim() || loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Xác nhận Từ chối'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* 🗑️ Modal Xóa vĩnh viễn (Bạn cần thêm logic confirmDeleteEmployer và Modal chi tiết nếu muốn dùng) */}

                {/* Toast */}
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