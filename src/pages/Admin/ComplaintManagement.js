import React, { useState } from 'react';
import { Button, Table, Badge, Modal, Form } from 'react-bootstrap';
import AdminSidebarLayout from '../../components/AdminSidebar';
import Pagination from '../../components/Pagination';
import "../../components/AdminSidebar.css";

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([
    {
      id: 'C001',
      user_name: 'Nguyen Van A',
      user_type: 'Student',
      target_type: 'Employer',
      target_name: 'Cty ABC',
      content: 'Thông tin tuyển dụng sai sự thật',
      evidence: ['file1.pdf', 'image1.png'],
      created_at: '2025-11-01',
      status: 'Pending',
      action_history: [],
      violation_result: '',
    },
    {
      id: 'C002',
      user_name: 'Cty XYZ',
      user_type: 'Employer',
      target_type: 'Student',
      target_name: 'Nguyen Van B',
      content: 'Ứng viên gửi CV giả',
      evidence: [],
      created_at: '2025-11-03',
      status: 'Processed',
      action_history: [
        { action: 'Cảnh cáo', reason: 'CV không hợp lệ', by: 'Admin', at: '2025-11-04' }
      ],
      violation_result: 'Cảnh cáo và xóa hồ sơ',
    },
  ]);

  // Mock Notification list
  const [notifications, setNotifications] = useState([]);

  const [selectedTab, setSelectedTab] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [violationResult, setViolationResult] = useState('');
  const [selectedAction, setSelectedAction] = useState('Cảnh cáo');
  const [actionReason, setActionReason] = useState('');

  // Filter complaints
  const filteredByTab = complaints.filter(c => c.status === selectedTab);
  const filteredComplaints = filteredByTab.filter(c =>
    c.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.target_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleOpenModal = (complaint) => {
    setSelectedComplaint(complaint);
    setViolationResult(complaint.violation_result || '');
    setSelectedAction('Cảnh cáo');
    setActionReason('');
    setShowModal(true);
  };

  const handleSaveViolation = () => {
    const now = new Date().toLocaleString('vi-VN');
    // Update complaint
    setComplaints(complaints.map(c =>
      c.id === selectedComplaint.id
        ? {
            ...c,
            status: 'Processed',
            violation_result: violationResult,
            action_history: [
              ...c.action_history,
              { action: selectedAction, reason: actionReason, by: 'Admin', at: now }
            ]
          }
        : c
    ));

    // Gửi notification nếu từ chối khiếu nại
    if (selectedAction === 'Từ chối khiếu nại') {
      setNotifications([...notifications, {
        id: `N${notifications.length + 1}`,
        user: selectedComplaint.user_name,
        title: 'Khiếu nại bị từ chối',
        message: `Khiếu nại của bạn về ${selectedComplaint.target_name} đã bị từ chối. Lý do: ${actionReason}`,
        created_at: now,
        isRead: false
      }]);
    }

    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    return status === 'Pending'
      ? <Badge bg="warning" text="dark">Chờ xử lý</Badge>
      : <Badge bg="success">Đã xử lý</Badge>;
  };

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="mb-4">Quản lý khiếu nại và vi phạm</h3>

        {/* Tabs & Search */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            {['Pending', 'Processed'].map(tab => (
              <Button
                key={tab}
                variant={selectedTab === tab ? 'dark' : 'outline-dark'}
                className="me-2 mb-1"
                size="sm"
                onClick={() => {
                  setSelectedTab(tab);
                  setCurrentPage(1);
                }}
              >
                {tab === 'Pending' ? 'Chờ xử lý' : 'Đã xử lý'}
              </Button>
            ))}
          </div>
          <div>
            <input
              type="text"
              className="form-control form-control-sm w-auto"
              placeholder="🔍 Tìm user, đối tượng hoặc nội dung..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        {currentComplaints.length === 0 ? (
          <div className="alert alert-info">Không có khiếu nại/vi phạm nào trong trạng thái này.</div>
        ) : (
          <>
            <div className="scrollable-table-wrapper">
              <Table striped bordered hover className="table-sm">
                <thead className="table-dark">
                  <tr>
                    <th>STT</th>
                    <th>Người gửi</th>
                    <th>Loại người gửi</th>
                    <th>Đối tượng bị khiếu nại</th>
                    <th>Nội dung</th>
                    <th>Trạng thái</th>
                    <th>Kết quả xử lý</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentComplaints.map((c, idx) => (
                    <tr key={c.id}>
                      <td>{indexOfFirst + idx + 1}</td>
                      <td>{c.user_name}</td>
                      <td>{c.user_type}</td>
                      <td>{c.target_name} ({c.target_type})</td>
                      <td>{c.content}</td>
                      <td>{getStatusBadge(c.status)}</td>
                      <td>{c.violation_result || '—'}</td>
                      <td>{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                      <td>
                        {c.status === 'Pending' && (
                          <Button size="sm" variant="outline-primary" onClick={() => handleOpenModal(c)}>Xử lý</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-3 d-flex justify-content-center">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            )}
          </>
        )}

        {/* Modal xử lý */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Xử lý khiếu nại/vi phạm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Nội dung khiếu nại</Form.Label>
                <Form.Control as="textarea" rows={3} value={selectedComplaint?.content} readOnly />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Đối tượng bị khiếu nại</Form.Label>
                <Form.Control type="text" value={`${selectedComplaint?.target_name} (${selectedComplaint?.target_type})`} readOnly />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Minh chứng</Form.Label>
                <ul>
                  {selectedComplaint?.evidence?.length ? selectedComplaint.evidence.map((f, i) => <li key={i}>{f}</li>) : <li>Không có</li>}
                </ul>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Hình thức xử lý</Form.Label>
                <Form.Select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)}>
                  <option>Cảnh cáo</option>
                  <option>Xóa nội dung</option>
                  <option>Thu hồi quyền đăng</option>
                  <option>Từ chối khiếu nại</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Lý do / phản hồi</Form.Label>
                <Form.Control as="textarea" rows={3} value={actionReason} onChange={(e) => setActionReason(e.target.value)} placeholder="Nhập lý do hoặc phản hồi..." />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Kết quả xử lý hiển thị</Form.Label>
                <Form.Control as="textarea" rows={2} value={violationResult} onChange={(e) => setViolationResult(e.target.value)} placeholder="Ví dụ: Cảnh cáo, xóa hồ sơ..." />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button variant="success" onClick={handleSaveViolation}>Lưu kết quả</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminSidebarLayout>
  );
}
