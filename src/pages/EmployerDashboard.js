import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; 
import "../EmployerDashboard.css"; // Đảm bảo file CSS này tồn tại
import logo from "../img/logo.png"; // Đảm bảo logo này tồn tại

// KHỞI TẠO DỮ LIỆU MẪU (SẼ THAY THẾ BẰNG API)
const CANDIDATES_MOCK = [
    { id: 1, name: "Nguyễn Văn A", position: "Lập trình viên", match: "85%", email: "nguyenvana@gmail.com", phone: "0909123456", education: "ĐH Bách Khoa TP.HCM - CNTT", experience: "2 năm tại FPT Software", skills: "React, Node.js, MySQL, Git", note: "Ứng viên tiềm năng", status: "pending" },
    { id: 2, name: "Trần Thị B", position: "Nhân viên kinh doanh", match: "72%", email: "tranthib@gmail.com", phone: "0918234567", education: "ĐH Cần Thơ - QTKD", experience: "1 năm tại VinMart", skills: "Giao tiếp, đàm phán, CRM", note: "Năng động, nhiệt tình", status: "pending" },
];

const EmployerDashboard = () => {
  const { login, logout, register, currentUser, isEmployer } = useAuth();
  const navigate = useNavigate();
  
  // === STATES VÀ KHAI BÁO CẦN THIẾT ===
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userLoginData, setUserLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  
  // Dữ liệu ứng dụng
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState(CANDIDATES_MOCK);
  const [draft, setDraft] = useState(null);

  // Form Đăng tin
  const [jobForm, setJobForm] = useState({
    title: "", position: "", salary: "", location: "", desc: "", req: "", contact: ""
  });
  
  // Quản lý Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", position: "", salary: "", location: "", desc: "", req: "", contact: "" });
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // Hồ sơ công ty
  const [companyInfo, setCompanyInfo] = useState({
    name: "Công ty TNHH ABC", address: "123 Đường ABC", phone: "0909123456", email: "hr@abc.com", description: "Công ty công nghệ hàng đầu."
  });
  const [companyLogo, setCompanyLogo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  // === LOGIC XÁC THỰC VÀ BẢO VỆ TRANG ===

  useEffect(() => {
    // Nếu chưa đăng nhập HOẶC không phải là Employer, chuyển hướng về trang Login
    if (!currentUser || !isEmployer) {
      // alert("Bạn cần đăng nhập với vai trò Nhà tuyển dụng để truy cập."); // Có thể bỏ nếu đã xử lý bằng Router Guard
      navigate("/login"); 
    }
    // TODO: Gọi API tải dữ liệu Job và Profile khi Component mount
  }, [currentUser, isEmployer, navigate]);


  // === ĐĂNG NHẬP API ===
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    const { email, password } = userLoginData;
    const result = await login(email, password); 

    if (!result.success) {
      setLoginError(result.message);
      return;
    }

    if (result.user.role !== 'Employer') {
      logout();
      setLoginError("Tài khoản này không phải tài khoản Nhà tuyển dụng.");
      return;
    }

    setActiveTab("dashboard");
    alert("Đăng nhập Nhà tuyển dụng thành công!");
  };


  // === ĐĂNG KÝ API ===
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    const form = e.target;
    const company = form[0].value;
    const email = form[1].value;
    const password = form[2].value;
    const confirm = form[3].value;

    if (password !== confirm) {
        setRegisterError("Mật khẩu xác nhận không khớp!");
        return;
    }

    const result = await register(company, email, password, "Employer"); 
    
    if (!result.success) {
        setRegisterError(result.message);
        return;
    }

    alert("Đăng ký thành công! Vui lòng đăng nhập.");
    setActiveTab("login");
  };


  // === ĐĂNG XUẤT ===
  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        logout(); 
        navigate("/");
    }
  };


  // === CÁC HÀM XỬ LÝ JOB VÀ PROFILE (SỬ DỤNG MOCK/API) ===

  const handleJobChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const saveDraft = () => {
    // TODO: GỌI API DRAFT
    localStorage.setItem("jobDraft", JSON.stringify(jobForm));
    alert("Đã lưu bản nháp!");
  };

  const postJob = () => {
    // TODO: GỌI API POST /api/jobs
    const newJob = { ...jobForm, id: Date.now(), status: "Đang tuyển" };
    setJobs(prev => [...prev, newJob]);
    alert("Tin đã được đăng!");
    setJobForm({ title: "", position: "", salary: "", location: "", desc: "", req: "", contact: "" });
  };

  const deleteJob = (id) => {
    // TODO: GỌI API DELETE /api/jobs/:id
    if (window.confirm("Bạn có chắc muốn xóa tin này?")) {
      setJobs(prev => prev.filter(j => j.id !== id));
    }
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setEditForm({ ...job });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEditedJob = () => {
    // TODO: GỌI API PUT /api/jobs/:id
    setJobs(prev => prev.map(job => job.id === editingJob.id ? { ...job, ...editForm } : job));
    setShowEditModal(false);
    alert("Cập nhật tin thành công!");
  };

  const openCVModal = (candidate) => {
    // TODO: GỌI API LẤY CHI TIẾT CV NẾU CẦN
    setSelectedCandidate(candidate);
    setShowCVModal(true);
  };

  const approveCandidate = (id) => {
    // TODO: GỌI API PUT /api/applications/:id {status: "Approved"}
    if (window.confirm("Xác nhận duyệt hồ sơ này?")) {
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: "approved" } : c));
      alert("Đã duyệt hồ sơ!");
    }
  };
  
  const rejectCandidate = (id) => {
    // TODO: GỌI API PUT /api/applications/:id {status: "Rejected"}
    if (window.confirm("Từ chối hồ sơ này?")) {
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: "rejected" } : c));
      alert("Đã từ chối hồ sơ!");
    }
  };

  const sendInterview = (id) => {
    const candidate = candidates.find(c => c.id === id);
    if (candidate && candidate.status === "approved") {
      alert(`Đã gửi lời mời phỏng vấn đến ${candidate.name}!`);
    } else {
      alert("Chỉ có thể gửi lời mời cho ứng viên đã được duyệt!");
    }
  };

  const handleLogoChange = (e) => {
    // TODO: GỌI API UPLOAD FILE
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setCompanyLogo(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (e) => {
    // TODO: GỌI API PUT /api/profile
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Cập nhật hồ sơ công ty thành công!");
    }, 1000);
  };

  const resetProfileForm = () => {
    // Tải lại dữ liệu profile từ state/API
    // Giữ nguyên logic mẫu của bạn
  };


  // --- UI BẢO VỆ (Ngăn chặn hiển thị nội dung trang nếu chưa có quyền) ---
  if (!currentUser || !isEmployer) {
    
    // Hiển thị form Đăng nhập Nhà tuyển dụng
    if (activeTab === "login" || activeTab === "dashboard") {
        return (
             <div className="auth-wrapper">
               <div className="auth-card">
                 <div className="auth-header-blue"><h2>Đăng nhập</h2><p>Quản lý tuyển dụng hiệu quả</p></div>
                 <form onSubmit={handleLogin} className="auth-form">
                     <input type="email" placeholder="Email doanh nghiệp" value={userLoginData.email} onChange={(e) => setUserLoginData({ ...userLoginData, email: e.target.value })} required />
                     <input type="password" placeholder="Mật khẩu" value={userLoginData.password} onChange={(e) => setUserLoginData({ ...userLoginData, password: e.target.value })} required />
                     {loginError && <p className="error-text">{loginError}</p>}
                     <button type="submit" className="auth-btn">Đăng nhập</button>
                 </form>
                 <div className="auth-footer"><p>Chưa có tài khoản? <span onClick={() => setActiveTab("register")} className="link-blue">Đăng ký</span></p></div>
               </div>
             </div>
        );
    }

    // Hiển thị form Đăng ký Nhà tuyển dụng
    if (activeTab === "register") {
        return (
            <div className="auth-wrapper">
              <div className="auth-card-register">
                <div className="auth-header-blue"><h2>Đăng ký tài khoản</h2><p>Trở thành đối tác tuyển dụng</p></div>
                <form onSubmit={handleRegister} className="auth-form-register">
                  <input type="text" placeholder="Tên công ty" required />
                  <input type="email" placeholder="Email doanh nghiệp" required />
                  <input type="password" placeholder="Mật khẩu (tối thiểu 6 ký tự)" required />
                  <input type="password" placeholder="Xác nhận mật khẩu" required />
                  {registerError && <p className="error-text">{registerError}</p>}
                  <button type="submit" className="btn-register">Tạo tài khoản</button>
                </form>
                <div className="auth-footer-register"><p>Đã có tài khoản? <span onClick={() => setActiveTab("login")} className="link-blue">Đăng nhập</span></p></div>
              </div>
            </div>
        );
    }
    
    return <div>Đang kiểm tra quyền truy cập...</div>; // Tránh lỗi khi đang chờ redirect
  }

  // --- TRANG CHỦ SAU ĐĂNG NHẬP (UI chính) ---
  return (
    <div className="home-container">
      <header className="main-header">
        <div className="logo-section">
          <img src={logo} alt="Logo" height="60" />
          <div className="site-title">NHÀ TUYỂN DỤNG</div>
        </div>
        <nav className="main-nav">
          <a href="/" className="nav-link home-btn">Trang chủ</a>
          <a onClick={() => setActiveTab("dashboard")} className={`nav-link ${activeTab === "dashboard" ? "active" : ""}`}>Tổng quan</a>
          <a onClick={() => setActiveTab("post")} className={`nav-link ${activeTab === "post" ? "active" : ""}`}>Đăng tin</a>
          <a onClick={() => setActiveTab("jobs")} className={`nav-link ${activeTab === "jobs" ? "active" : ""}`}>Quản lý tin</a>
          <a onClick={() => setActiveTab("profile")} className={`nav-link ${activeTab === "profile" ? "active" : ""}`}>Hồ sơ công ty</a>
          <a onClick={() => setActiveTab("candidates")} className={`nav-link ${activeTab === "candidates" ? "active" : ""}`}>Ứng viên</a>
          <a onClick={handleLogout} className="nav-link">Đăng xuất</a>
        </nav>
      </header>

      <div className="employer-content">
        {/* TỔNG QUAN */}
        {activeTab === "dashboard" && (
          <div className="dashboard-grid">
            <div className="card">
              <strong>{jobs.filter(j => j.status === "Đang tuyển").length}</strong>
              <span>Tin đang tuyển</span>
            </div>
            <div className="card">
              <strong>{candidates.length}</strong>
              <span>Ứng viên mới</span>
            </div>
          </div>
        )}

        {/* ĐĂNG TIN */}
        {activeTab === "post" && (
          <div className="form-section">
            <h2>Đăng tin tuyển dụng</h2>
            {draft && <p className="draft-notice">Có bản nháp đã lưu!</p>}
            <form onSubmit={(e) => { e.preventDefault(); postJob(); }} className="job-form">
              <input name="title" placeholder="Tiêu đề" value={jobForm.title} onChange={handleJobChange} required />
              <input name="position" placeholder="Vị trí" value={jobForm.position} onChange={handleJobChange} required />
              <input name="salary" placeholder="Mức lương" value={jobForm.salary} onChange={handleJobChange} />
              <input name="location" placeholder="Địa điểm" value={jobForm.location} onChange={handleJobChange} required />
              <textarea name="desc" placeholder="Mô tả công việc" value={jobForm.desc} onChange={handleJobChange} />
              <textarea name="req" placeholder="Yêu cầu" value={jobForm.req} onChange={handleJobChange} />
              <input name="contact" placeholder="Liên hệ" value={jobForm.contact} onChange={handleJobChange} />
              <div className="btn-group">
                <button type="button" onClick={saveDraft}>Lưu bản nháp</button>
                <button type="submit">Đăng tin</button>
              </div>
            </form>
          </div>
        )}

        {/* QUẢN LÝ TIN */}
        {activeTab === "jobs" && (
          <div className="table-section">
            <h2>Quản lý tin tuyển dụng</h2>
            {jobs.length === 0 ? (
              <p>Chưa có tin nào.</p>
            ) : (
              <table className="job-table">
                <thead>
                  <tr>
                    <th>Tiêu đề</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id}>
                      <td>{job.title}</td>
                      <td>{job.status}</td>
                      <td>
                        <button onClick={() => openEditModal(job)} className="btn-edit">Sửa</button>
                        <button onClick={() => deleteJob(job.id)} className="btn-delete">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* HỒ SƠ CÔNG TY */}
        {activeTab === "profile" && (
          <div className="profile-section">
            <h2>Hồ sơ công ty</h2>
            <div className="profile-card">
              <div className="logo-preview">
                {companyLogo ? (
                  <img src={companyLogo} alt="Logo công ty" className="company-logo" />
                ) : (
                  <div className="logo-placeholder">
                    <span>Briefcase</span>
                    <p>Chưa có logo</p>
                  </div>
                )}
                <label htmlFor="logo-upload" className="upload-btn">Chọn logo</label>
                <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} style={{ display: "none" }} />
              </div>

              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Tên công ty *</label>
                    <input type="text" value={companyInfo.name} onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Địa chỉ *</label>
                    <input type="text" value={companyInfo.address} onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input type="tel" value={companyInfo.phone} onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Email liên hệ</label>
                    <input type="email" value={companyInfo.email} onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })} />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Giới thiệu công ty</label>
                  <textarea value={companyInfo.description} onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })} rows="4" />
                </div>

                <div className="profile-actions">
                  <button type="button" className="btn-cancel" onClick={resetProfileForm}>Hủy</button>
                  <button type="submit" className="btn-save" disabled={saving}>
                    {saving ? "Đang lưu..." : "Cập nhật hồ sơ"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ỨNG VIÊN – CÓ TÌM KIẾM */}
        {activeTab === "candidates" && (
          <div className="table-section">
            <h2>Tìm kiếm & Xem hồ sơ ứng viên</h2>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, vị trí, email..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table className="candidate-table">
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Vị trí</th>
                  <th>Độ phù hợp</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {candidates
                  .filter(c => {
                    const term = searchTerm.toLowerCase();
                    return (
                      c.name.toLowerCase().includes(term) ||
                      c.position.toLowerCase().includes(term) ||
                      (c.email && c.email.toLowerCase().includes(term))
                    );
                  })
                  .map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.position}</td>
                      <td>{c.match}</td>
                      <td>
                        <button onClick={() => openCVModal(c)} className="btn-view-cv">Xem CV</button>

                        {c.status === "pending" && (
                          <>
                            <button onClick={() => approveCandidate(c.id)} className="btn-approve">Duyệt</button>
                            <button onClick={() => rejectCandidate(c.id)} className="btn-reject">Từ chối</button>
                          </>
                        )}

                        {c.status === "approved" && (
                          <button onClick={() => sendInterview(c.id)} className="btn-invite">Gửi lời mời PV</button>
                        )}

                        {c.status === "rejected" && (
                          <span className="status-rejected">Đã từ chối</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="main-footer">
        <p>© 2025 Việc Làm Cần Thơ - Nhà tuyển dụng</p>
      </footer>

      {/* MODAL SỬA TIN */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Sửa tin tuyển dụng</h3>
            <form onSubmit={(e) => { e.preventDefault(); saveEditedJob(); }} className="job-form">
              <input name="title" placeholder="Tiêu đề" value={editForm.title} onChange={handleEditChange} required />
              <input name="position" placeholder="Vị trí" value={editForm.position} onChange={handleEditChange} required />
              <input name="salary" placeholder="Mức lương" value={editForm.salary} onChange={handleEditChange} />
              <input name="location" placeholder="Địa điểm" value={editForm.location} onChange={handleEditChange} required />
              <textarea name="desc" placeholder="Mô tả công việc" value={editForm.desc} onChange={handleEditChange} />
              <textarea name="req" placeholder="Yêu cầu" value={editForm.req} onChange={handleEditChange} />
              <input name="contact" placeholder="Liên hệ" value={editForm.contact} onChange={handleEditChange} />
              <div className="btn-group">
                <button type="button" onClick={() => setShowEditModal(false)}>Hủy</button>
                <button type="submit">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XEM CV */}
      {showCVModal && selectedCandidate && (
        <div className="modal-overlay" onClick={() => setShowCVModal(false)}>
          <div className="modal-content cv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cv-header">
              <h3>Hồ sơ ứng viên</h3>
              <button className="close-btn" onClick={() => setShowCVModal(false)}>×</button>
            </div>
            <div className="cv-body">
              <div className="cv-info">
                <h4>{selectedCandidate.name}</h4>
                <p><strong>Vị trí ứng tuyển:</strong> {selectedCandidate.position}</p>
                <p><strong>Email:</strong> {selectedCandidate.email}</p>
                <p><strong>SĐT:</strong> {selectedCandidate.phone}</p>
                <p><strong>Học vấn:</strong> {selectedCandidate.education}</p>
                <p><strong>Kinh nghiệm:</strong> {selectedCandidate.experience}</p>
                <p><strong>Kỹ năng:</strong> {selectedCandidate.skills}</p>
                <p><strong>Ghi chú:</strong> {selectedCandidate.note}</p>
              </div>
              <div className="cv-actions">
                {selectedCandidate.status === "approved" && (
                  <button onClick={() => sendInterview(selectedCandidate.id)} className="btn-invite-cv">Gửi lời mời phỏng vấn</button>
                )}
                <button onClick={() => alert(`Đang tải CV của ${selectedCandidate.name}...`)} className="btn-download-cv">Tải CV (PDF)</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;