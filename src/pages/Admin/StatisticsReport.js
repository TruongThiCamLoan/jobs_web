import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import "../style.css";

export default function ReportPage() {
  const [allJobs, setAllJobs] = useState([]);
  const [allInteractions, setAllInteractions] = useState([]);
  const [activeTab, setActiveTab] = useState("jobStats"); // jobStats / interactionStats / statistic / export
  const [fromMonth, setFromMonth] = useState(1);
  const [toMonth, setToMonth] = useState(12);
  const [chartData, setChartData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dữ liệu mock
  useEffect(() => {
    const jobsMock = [
      { id: "J001", title: "Dev Frontend", employerName: "Cty ABC", views: 120, applications: 10, monthlyData: {1:5,2:3,3:8,4:4} },
      { id: "J002", title: "Dev Backend", employerName: "Cty XYZ", views: 200, applications: 25, monthlyData: {1:10,2:5,3:12,4:8} },
      { id: "J003", title: "Tester", employerName: "Cty DEF", views: 80, applications: 5, monthlyData: {1:2,2:4,3:3,4:1} },
    ];
    const interactionsMock = [
      { id: "I001", type: "View Job", userName: "Nguyen Van A", date: "2025-11-01", monthlyData: {1:50,2:40,3:60,4:30} },
      { id: "I002", type: "Apply Job", userName: "Tran Thi B", date: "2025-11-02", monthlyData: {1:5,2:8,3:6,4:4} },
    ];
    setAllJobs(jobsMock);
    setAllInteractions(interactionsMock);
  }, []);

  const handleStatistic = () => {
    const data = [];
    for (let month = fromMonth; month <= toMonth; month++) {
      let totalJobs = 0;
      allJobs.forEach((j) => {
        totalJobs += j.monthlyData[month] || 0;
      });
      let totalInteractions = 0;
      allInteractions.forEach((i) => {
        totalInteractions += i.monthlyData[month] || 0;
      });
      data.push({
        month: `Tháng ${month}`,
        jobsPosted: totalJobs,
        interactions: totalInteractions,
      });
    }
    setChartData(data);
  };

  const renderChart = () => (
    <div className="mb-4">
      <div className="d-flex gap-2 mb-3 flex-wrap align-items-end">
        <div>
          <label>Từ tháng</label>
          <input
            type="number"
            className="form-control"
            min={1}
            max={12}
            value={fromMonth}
            onChange={(e) => setFromMonth(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Đến tháng</label>
          <input
            type="number"
            className="form-control"
            min={1}
            max={12}
            value={toMonth}
            onChange={(e) => setToMonth(Number(e.target.value))}
          />
        </div>
        <Button variant="success" onClick={handleStatistic}>
          📊 Thống kê
        </Button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="jobsPosted" fill="#82ca9d" name="Tin tuyển dụng" />
          <Bar dataKey="interactions" fill="#8884d8" name="Lượt truy cập & tương tác" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderTableData = () => {
    if (activeTab === "jobStats") {
      const totalPages = Math.ceil(allJobs.length / itemsPerPage);
      const indexOfLast = currentPage * itemsPerPage;
      const indexOfFirst = indexOfLast - itemsPerPage;
      const currentJobs = allJobs.slice(indexOfFirst, indexOfLast);

      return (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Tiêu đề tin</th>
                <th>Nhà tuyển dụng</th>
                <th>Số lượt xem</th>
                <th>Số lượt ứng tuyển</th>
              </tr>
            </thead>
            <tbody>
              {currentJobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.title}</td>
                  <td>{job.employerName}</td>
                  <td>{job.views}</td>
                  <td>{job.applications}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      );
    }

    if (activeTab === "interactionStats") {
      const totalPages = Math.ceil(allInteractions.length / itemsPerPage);
      const indexOfLast = currentPage * itemsPerPage;
      const indexOfFirst = indexOfLast - itemsPerPage;
      const currentInteractions = allInteractions.slice(indexOfFirst, indexOfLast);

      return (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Loại tương tác</th>
                <th>Người dùng</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {currentInteractions.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.type}</td>
                  <td>{item.userName}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      );
    }

    if (activeTab === "export") {
      return (
        <div>
          <Button
            variant="success"
            onClick={() => {
              const rows = allJobs.map(j => ({
                id: j.id,
                title: j.title,
                employer: j.employerName,
                views: j.views,
                applications: j.applications
              }));
              const csvContent =
                "data:text/csv;charset=utf-8," +
                ["ID,Tiêu đề,Nhà tuyển dụng,Lượt xem,Lượt ứng tuyển"]
                  .concat(rows.map(r => `${r.id},${r.title},${r.employer},${r.views},${r.applications}`))
                  .join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "job_report.csv");
              document.body.appendChild(link);
              link.click();
            }}
          >
            📥 Xuất báo cáo CSV
          </Button>
        </div>
      );
    }
  };

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        <h4 className="fw-bold mb-3">📊 Báo cáo - Thống kê Web Việc Làm</h4>

        <div className="mb-4 d-flex gap-2 flex-wrap">
          <Button
            variant={activeTab === "jobStats" ? "dark" : "outline-dark"}
            onClick={() => { setActiveTab("jobStats"); setCurrentPage(1); }}
          >
            📋 Thống kê tin tuyển dụng
          </Button>
          <Button
            variant={activeTab === "interactionStats" ? "dark" : "outline-dark"}
            onClick={() => { setActiveTab("interactionStats"); setCurrentPage(1); }}
          >
            👀 Lượt truy cập & tương tác
          </Button>
          <Button
            variant={activeTab === "statistic" ? "dark" : "outline-dark"}
            onClick={() => { setActiveTab("statistic"); handleStatistic(); }}
          >
            📅 Thống kê theo tháng
          </Button>
          <Button
            variant={activeTab === "export" ? "dark" : "outline-dark"}
            onClick={() => setActiveTab("export")}
          >
            📥 Xuất báo cáo
          </Button>
        </div>

        {activeTab === "statistic" ? renderChart() : renderTableData()}
      </div>
    </AdminSidebarLayout>
  );
}
