import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import AdminSidebar from "../../components/AdminSidebar";
// import ApiService from "../../services/admin/api"; // khi có API thì bật lại

export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    jobs: 0,
    employers: 0,
    students: 0,
    applications: 0,
  });
  const [newJobs, setNewJobs] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập dữ liệu giao diện (mock)
    const fakeSummary = {
      jobs: 128,
      employers: 45,
      students: 320,
      applications: 280,
    };
    const fakeJobs = [
      {
        id: 1,
        title: "Frontend Developer",
        company: "TechZone",
        category: "Công nghệ thông tin",
      },
      {
        id: 2,
        title: "Nhân viên kinh doanh",
        company: "VietCom",
        category: "Kinh doanh",
      },
      {
        id: 3,
        title: "Thiết kế UI/UX",
        company: "DesignPro",
        category: "Thiết kế",
      },
    ];
    const fakeUsers = [
      { id: 1, name: "Nguyễn Văn A", email: "vana@example.com" },
      { id: 2, name: "Trần Thị B", email: "thib@example.com" },
      { id: 3, name: "Lê Minh C", email: "minhc@example.com" },
    ];

    // Giả lập chờ API
    setTimeout(() => {
      setSummary(fakeSummary);
      setNewJobs(fakeJobs);
      setNewUsers(fakeUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const Content = () => (
    <Container fluid className="py-3">
      {/* Thống kê tổng quan */}
      <Row className="mb-4 g-3">
        <Col xs={12} md={3}>
          <Card className="h-100 text-center p-3 shadow-sm">
            <Card.Body>
              <h5>💼 {summary.jobs} Việc làm</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="h-100 text-center p-3 shadow-sm">
            <Card.Body>
              <h5>🏢 {summary.employers} Nhà tuyển dụng</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="h-100 text-center p-3 shadow-sm">
            <Card.Body>
              <h5>🎓 {summary.students} Ứng viên</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="h-100 text-center p-3 shadow-sm">
            <Card.Body>
              <h5>📝 {summary.applications} Hồ sơ ứng tuyển</h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bảng dữ liệu */}
      <Row className="g-4">
        <Col xs={12} lg={8}>
          <Card className="h-100 shadow-sm">
            <Card.Header>💼 Việc làm mới đăng</Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table striped hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Tiêu đề</th>
                      <th>Công ty</th>
                      <th>Ngành nghề</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newJobs.map((job) => (
                      <tr key={job.id}>
                        <td>{job.title}</td>
                        <td>{job.company}</td>
                        <td>{job.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Header>🧑‍💼 Người dùng mới</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {newUsers.map((user) => (
                  <ListGroup.Item key={user.id}>
                    👤 {user.name} <br />
                    📧 <small>{user.email}</small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );

  return loading ? (
    <AdminSidebar>
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    </AdminSidebar>
  ) : (
    <AdminSidebar>
      <Content />
    </AdminSidebar>
  );
}
