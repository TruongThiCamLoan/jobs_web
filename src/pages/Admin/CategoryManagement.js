import React, { useState, useEffect, useCallback } from "react";
// Thay thế react-bootstrap-icons bằng các icon Lucide-React
import { Trash2, Edit } from 'lucide-react'; 
import { Table, Button, Modal, Form, Toast, Spinner } from "react-bootstrap";
// Giả định các components này là hợp lệ trong cấu trúc của bạn
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";

// 🎯 IMPORT CÁC HÀM API ĐÃ TẠO từ file services/admin/api.js
import { 
    createCategory, 
    getAllCategories, 
    updateCategory, 
    deleteCategory 
} from '../../services/admin/api'; 

// Hàm ánh xạ loại ENUM sang tên hiển thị (ĐÃ CẬP NHẬT)
const mapCategoryTypeToLabel = (type) => {
    switch (type) {
        case 'INDUSTRY': return 'Ngành nghề';
        case 'JOB_LEVEL': return 'Cấp bậc';
        case 'JOB_TYPE': return 'Loại công việc';
        case 'SALARY': return 'Mức lương';     // <-- ĐÃ THÊM
        case 'EXPERIENCE': return 'Kinh nghiệm'; // <-- ĐÃ THÊM
        default: return type;
    }
};

export default function JobCategoryManagement() {
    // ----------------- TRẠNG THÁI -----------------
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [editingCategory, setEditingCategory] = useState(null);
    // Bổ sung trường 'type' vì backend yêu cầu
    const [newCategory, setNewCategory] = useState({ name: "", description: "", type: "INDUSTRY" });
    const [deletingCategoryId, setDeletingCategoryId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const itemsPerPage = 10;

const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
        const response = await getAllCategories(); 
        const rawData = response.data;

        // ⭐ KHẮC PHỤC LỖI: Tìm kiếm mảng danh mục tại các vị trí khả thi
        let dataCategories = rawData?.data?.categories; // Vị trí 1: Cấu trúc { data: { categories: [...] } } (Backend controller ban đầu)
        
        if (!Array.isArray(dataCategories)) {
             // Vị trí 2: Thử tìm kiếm trực tiếp trong response.data (Cấu trúc { categories: [...] })
             dataCategories = rawData?.categories;
        }

        // Tối ưu lần cuối: Kiểm tra nếu dataCategories đã là mảng
        if (Array.isArray(dataCategories)) {
            setCategories(dataCategories); 
        } else {
            setCategories([]);
            console.warn("API categories trả về dữ liệu không đúng cấu trúc (thiếu mảng categories).");
        }

    } catch (error) {
        // ...
    } finally {
        setIsLoading(false);
    }
}, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]); // Tải dữ liệu khi component mount

    // ----------------- LOGIC PHÂN TRANG & LỌC (Không đổi) -----------------
    // Khắc phục lỗi categories.filter is not a function
    const filteredCategories = (categories || []).filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);

    const handlePageChange = (page) => setCurrentPage(page);

    // ----------------- VALIDATION VÀ LƯU (API) (Không đổi) -----------------

    const validateCategory = () => {
        if (!newCategory.name.trim()) {
            setToastMessage("⚠️ Vui lòng nhập tên danh mục!");
            setToastType("danger");
            setShowToast(true);
            return false;
        }
        if (!newCategory.type.trim()) {
            setToastMessage("⚠️ Vui lòng chọn loại danh mục!");
            setToastType("danger");
            setShowToast(true);
            return false;
        }
        return true;
    };

    const handleSaveCategory = async () => {
        if (!validateCategory()) return;
        
        setIsSaving(true);

        try {
            if (editingCategory) {
                // GỌI API CẬP NHẬT
                await updateCategory(editingCategory.id, newCategory); 
                setToastMessage("✅ Cập nhật danh mục thành công!");
                
            } else {
                // GỌI API TẠO MỚI
                await createCategory(newCategory); 
                setToastMessage("✅ Thêm danh mục thành công!");
            }
            
            // Tải lại dữ liệu sau khi thành công để cập nhật bảng
            await fetchCategories(); 

            setToastType("success");
            setShowToast(true);
            setShowModal(false);
            setEditingCategory(null);
            setNewCategory({ name: "", description: "", type: "INDUSTRY" });
            
        } catch (error) {
            console.error("Lỗi khi lưu danh mục:", error);
            // FIX: Truy xuất thông báo lỗi chi tiết từ server (error.response?.data?.message)
            const errorMessage = error.response?.data?.message || error.message || 'Không thể lưu danh mục.';
            setToastMessage(`❌ Lỗi: ${errorMessage}`);
            setToastType("danger");
            setShowToast(true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setNewCategory({ 
            name: category.name, 
            description: category.description,
            // Đảm bảo lấy trường 'type' từ dữ liệu API
            type: category.type || "INDUSTRY" 
        }); 
        setShowModal(true);
    };

    const handleDeleteCategory = async () => {
        try {
            // GỌI API XÓA
            await deleteCategory(deletingCategoryId); 
            
            // Tải lại dữ liệu sau khi xóa thành công
            await fetchCategories();

            setToastMessage("✅ Xóa danh mục thành công!");
            setToastType("success");
            setShowToast(true);
            
        } catch (error) {
            console.error("Lỗi khi xóa danh mục:", error);
            // FIX: Truy xuất thông báo lỗi chi tiết từ server
            const errorMessage = error.response?.data?.message || error.message || 'Không thể xóa danh mục.';
            setToastMessage(`❌ Lỗi xóa: ${errorMessage}`);
            setToastType("danger");
            setShowToast(true);
        } finally {
            setDeletingCategoryId(null);
        }
    };

    // ----------------- HIỂN THỊ UI -----------------

    if (isLoading) {
        return (
            <AdminSidebarLayout>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spinner animation="border" role="status" className="me-2" />
                    <span className="fw-bold">Đang tải dữ liệu danh mục...</span>
                </div>
            </AdminSidebarLayout>
        );
    }

    return (
        <AdminSidebarLayout>
            <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="fw-bold mb-3">📂 Quản lý danh mục công việc</h4>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                        type="text"
                        placeholder="🔍 Tìm theo tên danh mục..."
                        className="form-control w-25"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Button
                        variant="primary"
                        onClick={() => {
                            setEditingCategory(null);
                            setNewCategory({ name: "", description: "", type: "INDUSTRY" });
                            setShowModal(true);
                        }}
                    >
                        + Thêm danh mục
                    </Button>
                </div>

                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Loại</th>
                            <th>Tên danh mục</th>
                            <th>Mô tả</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategories.length > 0 ? (
                            currentCategories.map(cat => (
                                <tr key={cat.id}>
                                    <td>{cat.id}</td>
                                    <td>
                                        {/* ⭐ ĐÃ CẬP NHẬT: Sử dụng hàm dịch thuật mới */}
                                        {mapCategoryTypeToLabel(cat.type)}
                                    </td>
                                    <td>{cat.name}</td>
                                    <td>{cat.description}</td>
                                    <td>
                                        {/* Sử dụng icon Edit (Lucide) */}
                                        <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => handleEditClick(cat)}>
                                            <Edit size={16} /> 
                                        </Button>
                                        {/* Sử dụng icon Trash2 (Lucide) */}
                                        <Button variant="outline-danger" size="sm" onClick={() => setDeletingCategoryId(cat.id)}>
                                            <Trash2 size={16} /> 
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Không tìm thấy danh mục nào.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                )}

                {/* Modal thêm/sửa */}
<Modal show={showModal} onHide={() => setShowModal(false)} centered>
    <Modal.Header closeButton>
        <Modal.Title>{editingCategory ? "✏️ Sửa danh mục" : "📁 Thêm danh mục"}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
            <Form.Group className="mb-2">
    <Form.Label>Loại Danh mục <span className="text-danger">*</span></Form.Label>
                {/* ⭐ ĐÃ CẬP NHẬT: Thêm SALARY và EXPERIENCE vào Select Options */}
                <Form.Select
                    value={newCategory.type}
                    onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                    disabled={!!editingCategory} // Vẫn khóa khi chỉnh sửa
                >
                    <option value="INDUSTRY">Ngành nghề (INDUSTRY)</option>
                    <option value="JOB_LEVEL">Cấp bậc (JOB_LEVEL)</option>
                    <option value="JOB_TYPE">Loại công việc (JOB_TYPE)</option>
                    <option value="SALARY">Mức lương (SALARY)</option>      {/* <-- THÊM */}
                    <option value="EXPERIENCE">Kinh nghiệm (EXPERIENCE)</option>{/* <-- THÊM */}
                </Form.Select>
                <Form.Text className="text-muted">
                    Loại danh mục này không thể thay đổi sau khi tạo.
                </Form.Text>
            </Form.Group>

            {/* <-- INPUT TÊN DANH MỤC  --> (Không đổi) */}
            <Form.Group className="mb-2">
                <Form.Label>Tên danh mục <span className="text-danger">*</span></Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Nhập tên danh mục (ví dụ: Công nghệ thông tin)"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    autoFocus
                />
            </Form.Group>

            <Form.Group className="mb-2">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
            </Form.Group>
        </Form>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)} disabled={isSaving}>Hủy</Button>
        <Button variant="success" onClick={handleSaveCategory} disabled={isSaving}>
            {isSaving ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" /> : null}
            {editingCategory ? "Lưu thay đổi" : "Thêm"}
        </Button>
    </Modal.Footer>
</Modal>

                {/* Modal xác nhận xóa (Không đổi) */}
                <Modal show={!!deletingCategoryId} onHide={() => setDeletingCategoryId(null)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Xác nhận xóa danh mục</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có chắc chắn muốn xóa danh mục ID **{deletingCategoryId}** này không?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setDeletingCategoryId(null)}>Hủy</Button>
                        <Button variant="danger" onClick={handleDeleteCategory}>Xóa</Button>
                    </Modal.Footer>
                </Modal>

                {/* Toast (Không đổi) */}
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                    bg={toastType}
                    style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
                >
                    <Toast.Header closeButton={false}>
                        <strong className={`me-auto text-${toastType === "danger" ? "danger" : "white"}`}>{toastType === "danger" ? "Lỗi" : "Thông báo"}</strong>
                        <button type="button" className={`btn-close ms-auto ${toastType === "danger" ? "btn-close-dark" : "btn-close-white"}`} onClick={() => setShowToast(false)}></button>
                    </Toast.Header>
                    <Toast.Body className={`text-${toastType === "danger" ? "dark" : "white"}`}>{toastMessage}</Toast.Body>
                </Toast>
            </div>
        </AdminSidebarLayout>
    );
}