import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Toast, Spinner } from "react-bootstrap";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import "../../components/AdminSidebar.css";

export default function StudentsManagement() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Modal lý do khóa
  const [showLockReasonModal, setShowLockReasonModal] = useState(false);
  const [lockReason, setLockReason] = useState("");
  const [lockingStudent, setLockingStudent] = useState(null);

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [selectedTab, setSelectedTab] = useState("active");
  const itemsPerPage = 8;

  // ⚙️ Giả lập dữ liệu
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStudents([
        {
          studentId: "STU001",
          fullName: "Nguyễn Thị X",
          email: "x@student.com",
          major: "Công nghệ thông tin",
          university: "Đại học Bách Khoa TP.HCM",
          phoneNumber: "0901234567",
          status: "active",
          lockReason: "",
        },
        {
          studentId: "STU002",
          fullName: "Trần Văn Y",
          email: "y@student.com",
          major: "Kinh tế",
          university: "Đại học Kinh tế TP.HCM",
          phoneNumber: "0911222333",
          status: "locked",
          lockReason: "Thông tin không hợp lệ",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // 🔍 Lọc & phân trang
  const filteredStudents = students.filter((s) =>
    (s.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedStudents = filteredStudents.filter((s) =>
    selectedTab === "active" ? s.status === "active" : s.status === "locked"
  );
  const totalPages = Math.ceil(displayedStudents.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentStudents = displayedStudents.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  // 🔒 Khóa / Mở khóa
  const handleToggleLock = (student) => {
    if (student.status === "locked") {
      setStudents((prev) =>
        prev.map((s) =>
          s.studentId === student.studentId
            ? { ...s, status: "active", lockReason: "" }
            : s
        )
      );
      setToastMsg("🔓 Đã mở khóa sinh viên!");
      setShowToast(true);
    } else {
      setLockingStudent(student);
      setShowLockReasonModal(true);
    }
  };

  const confirmLockStudent = () => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === lockingStudent.studentId
          ? { ...s, status: "locked", lockReason }
          : s
      )
    );
    setToastMsg("🔒 Đã khóa sinh viên!");
    setShowToast(true);
    setShowLockReasonModal(false);
    setLockReason("");
    setLockingStudent(null);
  };

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        {/* Tabs */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            {["active", "locked"].map((tab) => (
              <Button
                key={tab}
                variant={selectedTab === tab ? "dark" : "outline-dark"}
                className="me-2"
                onClick={() => {
                  setSelectedTab(tab);
                  setCurrentPage(1);
                }}
              >
                {tab === "active"
                  ? "Sinh viên hoạt động"
                  : "Sinh viên bị khóa"}
              </Button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên..."
            className="form-control w-25"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="scrollable-table-wrapper">
            <Table striped bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Mã sinh viên</th>
                  <th>Ngành học</th>
                  <th>Trường</th>
                  <th>Số điện thoại</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((s, i) => (
                  <tr key={s.studentId}>
                    <td>{indexOfFirst + i + 1}</td>
                    <td>{s.fullName}</td>
                    <td>{s.email}</td>
                    <td>{s.studentId}</td>
                    <td>{s.major}</td>
                    <td>{s.university}</td>
                    <td>{s.phoneNumber}</td>
                    <td>
                      <span
                        className={`badge ${
                          s.status === "locked" ? "bg-secondary" : "bg-success"
                        }`}
                      >
                        {s.status === "locked" ? "Bị khóa" : "Hoạt động"}
                      </span>
                      {s.status === "locked" && s.lockReason && (
                        <div className="text-muted small mt-1">
                          Lý do: {s.lockReason}
                        </div>
                      )}
                    </td>
                    <td>
                      <Button
                        variant={
                          s.status === "locked"
                            ? "outline-success"
                            : "outline-danger"
                        }
                        size="sm"
                        onClick={() => handleToggleLock(s)}
                      >
                        {s.status === "locked" ? "Mở khóa" : "Khóa"}
                      </Button>
                    </td>
                  </tr>
                ))}
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

        {/* Modal lý do khóa */}
        <Modal
          show={showLockReasonModal}
          onHide={() => setShowLockReasonModal(false)}
          centered
          size="xl"
          dialogClassName="modal-lock-reason"
        >
          <Modal.Header closeButton>
            <Modal.Title>🔒 Nhập lý do khóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              as="textarea"
              rows={6}
              value={lockReason}
              onChange={(e) => setLockReason(e.target.value)}
              placeholder="Nhập lý do khóa tài khoản..."
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowLockReasonModal(false)}
            >
              Hủy
            </Button>
            <Button variant="danger" onClick={confirmLockStudent}>
              Xác nhận khóa
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast */}
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2500}
          autohide
          style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
        >
          <Toast.Header>
            <strong className="me-auto">Thông báo</strong>
          </Toast.Header>
          <Toast.Body>{toastMsg}</Toast.Body>
        </Toast>
      </div>
    </AdminSidebarLayout>
  );
}
