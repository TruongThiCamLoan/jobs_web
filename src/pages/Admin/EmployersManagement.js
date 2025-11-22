import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Toast, Spinner } from "react-bootstrap";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import "../../components/AdminSidebar.css";

export default function EmployersManagement() {
  const [employers, setEmployers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Modal lý do khóa
  const [showLockReasonModal, setShowLockReasonModal] = useState(false);
  const [lockReason, setLockReason] = useState("");
  const [lockingEmployer, setLockingEmployer] = useState(null);

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [selectedTab, setSelectedTab] = useState("active");
  const itemsPerPage = 8;

  // ⚙️ Giả lập dữ liệu
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setEmployers([
        {
          employerId: "EMP001",
          fullName: "Nguyễn Văn A",
          email: "a@company.com",
          companyName: "Công ty TNHH ABC",
          companyAddress: "123 Lê Lợi, Q1, TP.HCM",
          phoneNumber: "0901234567",
          website: "abc.vn",
          status: "active",
          lockReason: "",
        },
        {
          employerId: "EMP002",
          fullName: "Trần Thị B",
          email: "b@enterprise.com",
          companyName: "Enterprise Việt Nam",
          companyAddress: "56 Nguyễn Huệ, Q1, TP.HCM",
          phoneNumber: "0911222333",
          website: "enterprise.vn",
          status: "locked",
          lockReason: "Đăng tin sai sự thật",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // 🔍 Lọc & phân trang
  const filteredEmployers = employers.filter((e) =>
    (e.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedEmployers = filteredEmployers.filter((e) =>
    selectedTab === "active" ? e.status === "active" : e.status === "locked"
  );
  const totalPages = Math.ceil(displayedEmployers.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEmployers = displayedEmployers.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  // 🔒 Khóa / Mở khóa
  const handleToggleLock = (employer) => {
    if (employer.status === "locked") {
      setEmployers((prev) =>
        prev.map((e) =>
          e.employerId === employer.employerId
            ? { ...e, status: "active", lockReason: "" }
            : e
        )
      );
      setToastMsg("🔓 Đã mở khóa nhà tuyển dụng!");
      setShowToast(true);
    } else {
      setLockingEmployer(employer);
      setShowLockReasonModal(true);
    }
  };

  const confirmLockEmployer = () => {
    setEmployers((prev) =>
      prev.map((e) =>
        e.employerId === lockingEmployer.employerId
          ? { ...e, status: "locked", lockReason }
          : e
      )
    );
    setToastMsg("🔒 Đã khóa nhà tuyển dụng!");
    setShowToast(true);
    setShowLockReasonModal(false);
    setLockReason("");
    setLockingEmployer(null);
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
                  ? "Nhà tuyển dụng hoạt động"
                  : "Nhà tuyển dụng bị khóa"}
              </Button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên hoặc công ty..."
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
                  <th>Tên công ty</th>
                  <th>Địa chỉ</th>
                  <th>Số điện thoại</th>
                  <th>Website</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployers.map((e, i) => (
                  <tr key={e.employerId}>
                    <td>{indexOfFirst + i + 1}</td>
                    <td>{e.fullName}</td>
                    <td>{e.email}</td>
                    <td>{e.companyName}</td>
                    <td>{e.companyAddress}</td>
                    <td>{e.phoneNumber}</td>
                    <td>{e.website}</td>
                    <td>
                      <span
                        className={`badge ${
                          e.status === "locked" ? "bg-secondary" : "bg-success"
                        }`}
                      >
                        {e.status === "locked" ? "Bị khóa" : "Hoạt động"}
                      </span>
                      {e.status === "locked" && e.lockReason && (
                        <div className="text-muted small mt-1">
                          Lý do: {e.lockReason}
                        </div>
                      )}
                    </td>
                    <td>
                      <Button
                        variant={
                          e.status === "locked"
                            ? "outline-success"
                            : "outline-danger"
                        }
                        size="sm"
                        onClick={() => handleToggleLock(e)}
                      >
                        {e.status === "locked" ? "Mở khóa" : "Khóa"}
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
            <Button variant="danger" onClick={confirmLockEmployer}>
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
