import React, { useState } from "react";
import { Table, Button, Modal, Form, Toast } from "react-bootstrap";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import "../../components/AdminSidebar.css";

export default function JobCategoryManagement() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Công nghệ thông tin", description: "Ngành IT" },
    { id: 2, name: "Marketing", description: "Ngành Marketing" },
    { id: 3, name: "Kinh doanh", description: "Ngành Sales & Business" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  const itemsPerPage = 5;

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  const validateCategory = () => {
    if (!newCategory.name.trim()) {
      setToastMessage("⚠️ Vui lòng nhập tên danh mục!");
      setToastType("danger");
      setShowToast(true);
      return false;
    }
    return true;
  };

  const handleSaveCategory = () => {
    if (!validateCategory()) return;

    if (editingCategory) {
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id ? { ...cat, ...newCategory } : cat
      ));
      setToastMessage("✅ Cập nhật danh mục thành công!");
    } else {
      const newId = categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1;
      setCategories([...categories, { id: newId, ...newCategory }]);
      setToastMessage("✅ Thêm danh mục thành công!");
    }

    setToastType("success");
    setShowToast(true);
    setShowModal(false);
    setEditingCategory(null);
    setNewCategory({ name: "", description: "" });
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name, description: category.description });
    setShowModal(true);
  };

  const handleDeleteCategory = () => {
    setCategories(categories.filter(cat => cat.id !== deletingCategoryId));
    setToastMessage("✅ Xóa danh mục thành công!");
    setToastType("success");
    setShowToast(true);
    setDeletingCategoryId(null);
  };

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
              setNewCategory({ name: "", description: "" });
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
              <th>Tên danh mục</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => handleEditClick(cat)}>
                    <PencilFill />
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => setDeletingCategoryId(cat.id)}>
                    <TrashFill />
                  </Button>
                </td>
              </tr>
            ))}
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
                <Form.Label>Tên danh mục</Form.Label>
                <Form.Control
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
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
            <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button variant="success" onClick={handleSaveCategory}>{editingCategory ? "Lưu thay đổi" : "Thêm"}</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal xác nhận xóa */}
        <Modal show={!!deletingCategoryId} onHide={() => setDeletingCategoryId(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa danh mục</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc chắn muốn xóa danh mục này không?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeletingCategoryId(null)}>Hủy</Button>
            <Button variant="danger" onClick={handleDeleteCategory}>Xóa</Button>
          </Modal.Footer>
        </Modal>

        {/* Toast */}
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastType}
          style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto text-white">{toastType === "danger" ? "Lỗi" : "Thông báo"}</strong>
            <button type="button" className="btn-close btn-close-white ms-auto" onClick={() => setShowToast(false)}></button>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </div>
    </AdminSidebarLayout>
  );
}
