import React, { useState, useEffect, useCallback } from "react";
import { Button, Table, Alert, Spinner } from "react-bootstrap";
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

// 💡 IMPORT HÀM API THẬT
// Loại bỏ getInteractionLogs vì chức năng này đã bị xóa ở backend
import { getJobPerformanceStats, getMonthlyStatistics } from "../../services/admin/api"; 

export default function ReportPage() {
    const [jobStats, setJobStats] = useState([]);
    // const [interactionStats, setInteractionStats] = useState([]); // ❌ Loại bỏ state không dùng
    const [activeTab, setActiveTab] = useState("jobStats"); 
    const [fromMonth, setFromMonth] = useState(1);
    const [toMonth, setToMonth] = useState(12);
    const [chartData, setChartData] = useState([]);
    
    // Phân trang chung
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- HÀM TẢI DỮ LIỆU CHÍNH (Thống kê Jobs) ---
    const loadData = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);
        setCurrentPage(page);

        const params = {
            page: page,
            limit: itemsPerPage,
        };

        try {
            const response = await getJobPerformanceStats(params);
            setJobStats(response.data.jobStats);
            setTotalItems(response.pagination.totalItems);
            setTotalPages(response.pagination.totalPages);
        } catch (err) {
            console.error("Lỗi tải dữ liệu báo cáo:", err);
            setError(err.response?.data?.message || "Lỗi khi tải dữ liệu báo cáo tin tuyển dụng.");
        } finally {
            setLoading(false);
        }
    }, [itemsPerPage]);

    // --- LOGIC XỬ LÝ THỐNG KÊ BIỂU ĐỒ THEO THÁNG ---
    const handleStatistic = useCallback(async () => {
        setLoading(true);
        setError(null);

        if (fromMonth > toMonth || fromMonth < 1 || toMonth > 12) {
            setError("Phạm vi tháng không hợp lệ (Tháng bắt đầu không thể lớn hơn tháng kết thúc hoặc ngoài phạm vi 1-12).");
            setChartData([]);
            setLoading(false);
            return;
        }

        try {
            const currentYear = new Date().getFullYear();
            const params = { year: currentYear, fromMonth: fromMonth, toMonth: toMonth };
            
            const response = await getMonthlyStatistics(params);
            
            setChartData(response.data.chartData);
        } catch (err) {
            console.error("Lỗi thống kê biểu đồ:", err);
            setError(err.response?.data?.message || "Lỗi khi thống kê dữ liệu theo tháng.");
            setChartData([]);
        } finally {
            setLoading(false);
        }
    }, [fromMonth, toMonth]);
    
    // --- EFFECT: Chạy khi tab hoặc trang thay đổi ---
    useEffect(() => {
        if (activeTab === "jobStats") {
            loadData(currentPage);
        } else if (activeTab === "statistic") {
            // Tự động chạy thống kê khi vào tab "statistic" lần đầu
            handleStatistic();
        } else {
            // Reset phân trang khi chuyển sang tab không phải dạng bảng
            setTotalPages(1);
            setTotalItems(0);
        }
    }, [activeTab, currentPage, loadData, handleStatistic]);

    // ----------------- HÀM RENDER BIỂU ĐỒ -----------------
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
                <Button variant="success" onClick={handleStatistic} disabled={loading || fromMonth > toMonth || fromMonth < 1 || toMonth > 12}>
                    {loading ? <Spinner animation="border" size="sm" className="me-2" /> : '📊'} Thống kê
                </Button>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="jobsPosted" fill="#82ca9d" name="Tin tuyển dụng" />
                    {/* ✅ Đã cập nhật dataKey từ 'interactions' sang 'applicationsTotal' */}
                    <Bar dataKey="applicationsTotal" fill="#8884d8" name="Số lượt ứng tuyển" /> 
                </BarChart>
            </ResponsiveContainer>
            {chartData.length === 0 && !loading && !error && <p className="text-center text-muted mt-3">Không có dữ liệu trong khoảng thời gian này.</p>}
        </div>
    );

    // ----------------- HÀM RENDER XUẤT CSV -----------------
    const renderExportOptions = () => {
        const exportDataToCSV = (data, headers, fileName) => {
            const rows = data.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
            const csvContent =
                "data:text/csv;charset=utf-8," +
                [headers.join(',')].concat(rows).join("\n");
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        
        // Chuẩn bị dữ liệu Jobs (Bỏ views)
        const jobHeaders = ["ID", "Tiêu đề", "Nhà tuyển dụng", "Số lượt ứng tuyển"];
        const jobRows = jobStats.map(j => ({
            id: j.id,
            title: j.title, 
            employer: j.employerName,
            applications: j.applications
        }));

        // Chuẩn bị dữ liệu Statistic (Cập nhật tiêu đề và cột)
        const statisticHeaders = ["Tháng", "Tin tuyển dụng", "Số lượt ứng tuyển"];
        const statisticRows = chartData.map(d => ({
            month: d.month,
            jobsPosted: d.jobsPosted,
            applicationsTotal: d.applicationsTotal, // ✅ Sửa tên cột
        }));


        return (
            <div className="d-flex flex-column gap-3">
                <Button variant="primary" onClick={() => exportDataToCSV(jobRows, jobHeaders, "job_report.csv")} disabled={jobStats.length === 0}>
                    📥 Xuất Thống kê tin tuyển dụng (CSV)
                </Button>
                
                {/* ❌ Đã loại bỏ nút xuất báo cáo Interactions */}
                
                <Button 
                    variant="primary" 
                    onClick={() => exportDataToCSV(statisticRows, statisticHeaders, "monthly_report.csv")}
                    disabled={chartData.length === 0}
                >
                    📥 Xuất Thống kê theo tháng (CSV)
                </Button>
                
                {chartData.length === 0 && <p className="text-muted small mt-2">(* Vui lòng chạy "Thống kê theo tháng" trước khi xuất báo cáo này)</p>}
            </div>
        );
    }
    
    // ----------------- HÀM RENDER BẢNG DỮ LIỆU -----------------
    const renderTableData = () => {
        if (loading) {
            return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
        }

        if (error) {
            return <Alert variant="danger">{error}</Alert>;
        }

        if (activeTab === "jobStats") {
            const currentJobs = jobStats; 

            return (
                <>
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Tiêu đề tin</th>
                                <th>Nhà tuyển dụng</th>
                                {/* ❌ Đã loại bỏ cột Số lượt xem */}
                                <th>Số lượt ứng tuyển</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentJobs.length === 0 ? <tr><td colSpan="4" className="text-center">Không có dữ liệu tin tuyển dụng.</td></tr> : currentJobs.map((job) => (
                                <tr key={job.id}>
                                    <td>{job.id}</td>
                                    <td>{job.title}</td>
                                    <td>{job.employerName}</td>
                                    {/* ❌ Đã loại bỏ dữ liệu views */}
                                    <td>{job.applications}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            );
        }
        
        // ❌ Đã loại bỏ toàn bộ phần render cho "interactionStats"
    };

    return (
        <AdminSidebarLayout>
            <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="fw-bold mb-3">📊 Báo cáo - Thống kê Web Việc Làm</h4>

                <div className="mb-4 d-flex gap-2 flex-wrap">
                    <Button
                        variant={activeTab === "jobStats" ? "dark" : "outline-dark"}
                        onClick={() => { setActiveTab("jobStats"); setCurrentPage(1); }}
                        disabled={loading}
                    >
                        📋 Thống kê tin tuyển dụng
                    </Button>
                    {/* ❌ Đã loại bỏ nút Lượt truy cập & tương tác */}
                    <Button
                        variant={activeTab === "statistic" ? "dark" : "outline-dark"}
                        onClick={() => { setActiveTab("statistic"); }}
                        disabled={loading}
                    >
                        📅 Thống kê theo tháng
                    </Button>
                    <Button
                        variant={activeTab === "export" ? "dark" : "outline-dark"}
                        onClick={() => setActiveTab("export")}
                        disabled={loading}
                    >
                        📥 Xuất báo cáo
                    </Button>
                </div>

                {activeTab === "statistic" 
                    ? renderChart() 
                    : activeTab === "export"
                    ? renderExportOptions()
                    : renderTableData()}
            </div>
        </AdminSidebarLayout>
    );
}