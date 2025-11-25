// src/pages/EmployerDashboard.js
import React, { useState, useEffect } from "react";
import "../EmployerDashboard.css";
import logo from "../img/logo.png";

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [jobs, setJobs] = useState([]);
  const [draft, setDraft] = useState(null);

  // === TÌM KIẾM ỨNG VIÊN ===
  const [searchTerm, setSearchTerm] = useState("");

  // ỨNG VIÊN MẪU – 10 NGƯỜI
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      position: "Lập trình viên",
      match: "85%",
      email: "nguyenvana@gmail.com",
      phone: "0909123456",
      education: "ĐH Bách Khoa TP.HCM - CNTT",
      experience: "2 năm tại FPT Software",
      skills: "React, Node.js, MySQL, Git",
      note: "Ứng viên tiềm năng",
      status: "pending"
    },
    {
      id: 2,
      name: "Trần Thị B",
      position: "Nhân viên kinh doanh",
      match: "72%",
      email: "tranthib@gmail.com",
      phone: "0918234567",
      education: "ĐH Cần Thơ - Quản trị kinh doanh",
      experience: "1 năm tại VinMart",
      skills: "Giao tiếp, đàm phán, CRM",
      note: "Năng động, nhiệt tình",
      status: "pending"
    },
    {
      id: 3,
      name: "Lê Minh Cường",
      position: "Thiết kế đồ họa",
      match: "90%",
      email: "cuonglm.design@gmail.com",
      phone: "0935123789",
      education: "ĐH Mỹ thuật TP.HCM",
      experience: "3 năm freelance",
      skills: "Photoshop, Illustrator, Figma, UI/UX",
      note: "Portfolio rất ấn tượng",
      status: "pending"
    },
    {
      id: 4,
      name: "Phạm Thị Diễm",
      position: "Kế toán",
      match: "78%",
      email: "diempham.kt@gmail.com",
      phone: "0888123456",
      education: "ĐH Kinh tế Cần Thơ",
      experience: "2 năm tại công ty xuất nhập khẩu",
      skills: "Excel, MISA, hóa đơn điện tử",
      note: "Cẩn trọng, tỉ mỉ",
      status: "pending"
    },
    {
      id: 5,
      name: "Huỳnh Văn Em",
      position: "Lập trình viên",
      match: "88%",
      email: "emhv.dev@gmail.com",
      phone: "0905789456",
      education: "ĐH Công nghệ Thông tin - ĐHQG TP.HCM",
      experience: "1 năm thực tập tại VNG",
      skills: "JavaScript, Vue.js, Docker",
      note: "Học hỏi nhanh, có tư duy tốt",
      status: "pending"
    },
    {
      id: 6,
      name: "Võ Ngọc Huyền",
      position: "Nhân sự (HR)",
      match: "81%",
      email: "huyenvn.hr@gmail.com",
      phone: "0923456781",
      education: "ĐH Lao động Xã hội",
      experience: "2 năm tại công ty đa quốc gia",
      skills: "Tuyển dụng, đào tạo, quản lý nhân sự",
      note: "Kinh nghiệm tuyển dụng tốt",
      status: "pending"
    },
    {
      id: 7,
      name: "Đặng Quốc Khánh",
      position: "Marketing",
      match: "76%",
      email: "khanhdq.marketing@gmail.com",
      phone: "0919123789",
      education: "ĐH Kinh tế Quốc dân",
      experience: "1.5 năm tại agency",
      skills: "Facebook Ads, Google Ads, Content",
      note: "Sáng tạo, có ý tưởng hay",
      status: "pending"
    },
    {
      id: 8,
      name: "Bùi Thị Lan",
      position: "Nhân viên kinh doanh",
      match: "69%",
      email: "lanbt.sales@gmail.com",
      phone: "0938123456",
      education: "CĐ Kinh tế Cần Thơ",
      experience: "1 năm bán hàng B2C",
      skills: "Chăm sóc khách hàng, thuyết phục",
      note: "Giao tiếp tốt, chịu áp lực",
      status: "pending"
    },
    {
      id: 9,
      name: "Trương Văn Minh",
      position: "Quản trị mạng",
      match: "83%",
      email: "minhtv.net@gmail.com",
      phone: "0906123789",
      education: "ĐH Bách Khoa Đà Nẵng",
      experience: "2 năm tại ISP",
      skills: "CCNA, Firewall, Linux, Windows Server",
      note: "Kỹ thuật vững, xử lý sự cố nhanh",
      status: "pending"
    },
    {
      id: 10,
      name: "Ngô Thị Kim Ngân",
      position: "Thiết kế đồ họa",
      match: "87%",
      email: "ngankim.design@gmail.com",
      phone: "0889123789",
      education: "ĐH Kiến trúc TP.HCM",
      experience: "2 năm tại studio thiết kế",
      skills: "After Effects, Premiere, 3D Max",
      note: "Chuyên animation, sáng tạo cao",
      status: "pending"
    }
  ]);

  // === DUYỆT HỒ SƠ ===
  const approveCandidate = (id) => {
    if (window.confirm("Xác nhận duyệt hồ sơ này?")) {
      setCandidates(prev => prev.map(c => 
        c.id === id ? { ...c, status: "approved" } : c
      ));
      alert("Đã duyệt hồ sơ!");
    }
  };

  // === TỪ CHỐI HỒ SƠ ===
  const rejectCandidate = (id) => {
    if (window.confirm("Từ chối hồ sơ này?")) {
      setCandidates(prev => prev.map(c => 
        c.id === id ? { ...c, status: "rejected" } : c
      ));
      alert("Đã từ chối hồ sơ!");
    }
  };

  // === GỬI LỜI MỜI PV ===
  const sendInterview = (id) => {
    const candidate = candidates.find(c => c.id === id);
    if (candidate && candidate.status === "approved") {
      alert(`Đã gửi lời mời phỏng vấn đến ${candidate.name}!`);
    } else {
      alert("Chỉ có thể gửi lời mời cho ứng viên đã được duyệt!");
    }
  };

  // FORM ĐĂNG TIN
  const [jobForm, setJobForm] = useState({
    title: "", position: "", salary: "", location: "", desc: "", req: "", contact: ""
  });

  // MODAL SỬA TIN
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", position: "", salary: "", location: "", desc: "", req: "", contact: "" });

  // MODAL XEM CV
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // HỒ SƠ CÔNG TY
  const [companyInfo, setCompanyInfo] = useState({
    name: "Công ty TNHH ABC",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    phone: "0909123456",
    email: "hr@abc.com",
    description: "Chúng tôi là công ty công nghệ hàng đầu tại Việt Nam, chuyên cung cấp giải pháp phần mềm cho doanh nghiệp."
  });
  const [companyLogo, setCompanyLogo] = useState(null);
  const [saving, setSaving] = useState(false);

  // === ĐĂNG NHẬP ===
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    const { email, password } = user;
    const savedUser = localStorage.getItem("employerUser");

    if (!savedUser) {
      setLoginError("Tài khoản chưa được đăng ký!");
      return;
    }

    const parsed = JSON.parse(savedUser);
    if (parsed.email !== email) {
      setLoginError("Email không tồn tại!");
    } else if (parsed.password !== password) {
      setLoginError("Mật khẩu sai!");
    } else {
      setIsLoggedIn(true);
      alert("Đăng nhập thành công!");
    }
  };

  // === ĐĂNG KÝ ===
  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterError("");
    const form = e.target;
    const company = form[0].value;
    const email = form[1].value;
    const password = form[2].value;
    const confirm = form[3].value;

    if (!company || !email || !password || !confirm) {
      setRegisterError("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (password.length < 6) {
      setRegisterError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    if (password !== confirm) {
      setRegisterError("Mật khẩu xác nhận không khớp!");
      return;
    }

    const newUser = { company, email, password };
    localStorage.setItem("employerUser", JSON.stringify(newUser));
    alert("Đăng ký thành công! Vui lòng đăng nhập.");
    setActiveTab("login");
  };

  // === ĐĂNG XUẤT ===
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ email: "", password: "" });
  };

  // ĐĂNG TIN
  const handleJobChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const saveDraft = () => {
    localStorage.setItem("jobDraft", JSON.stringify(jobForm));
    alert("Đã lưu bản nháp!");
  };

  const postJob = () => {
    const newJob = { ...jobForm, id: Date.now(), status: "Đang tuyển" };
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    alert("Tin đã được đăng!");
    setJobForm({ title: "", position: "", salary: "", location: "", desc: "", req: "", contact: "" });
    localStorage.removeItem("jobDraft");
  };

  const deleteJob = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tin này?")) {
      const updatedJobs = jobs.filter(j => j.id !== id);
      setJobs(updatedJobs);
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    }
  };

  // SỬA TIN
  const openEditModal = (job) => {
    setEditingJob(job);
    setEditForm({ ...job });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEditedJob = () => {
    const updatedJobs = jobs.map(job =>
      job.id === editingJob.id ? { ...job, ...editForm } : job
    );
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setShowEditModal(false);
    alert("Cập nhật tin thành công!");
  };

  // XEM CV
  const openCVModal = (candidate) => {
    setSelectedCandidate(candidate);
    setShowCVModal(true);
  };

  const downloadCV = () => {
    alert(`Đang tải CV của ${selectedCandidate.name}...`);
  };

  // HỒ SƠ CÔNG TY
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setCompanyLogo(result);
        localStorage.setItem("companyLogo", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem("companyInfo", JSON.stringify(companyInfo));
      setSaving(false);
      alert("Cập nhật hồ sơ công ty thành công!");
    }, 1000);
  };

  const resetProfileForm = () => {
    const saved = localStorage.getItem("companyInfo");
    if (saved) setCompanyInfo(JSON.parse(saved));
    setCompanyLogo(localStorage.getItem("companyLogo"));
  };

  // LOAD DỮ LIỆU
  useEffect(() => {
    const savedDraft = localStorage.getItem("jobDraft");
    const savedJobs = localStorage.getItem("jobs");
    const savedInfo = localStorage.getItem("companyInfo");
    const savedLogo = localStorage.getItem("companyLogo");
    const savedUser = localStorage.getItem("employerUser");

    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      setDraft(parsed);
      setJobForm(parsed);
    }
    if (savedJobs) setJobs(JSON.parse(savedJobs));
    if (savedInfo) setCompanyInfo(JSON.parse(savedInfo));
    if (savedLogo) setCompanyLogo(savedLogo);
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser({ email: parsed.email, password: "" });
      setIsLoggedIn(true);
    }
  }, []);

  // TRANG ĐĂNG NHẬP
  if (!isLoggedIn && activeTab !== "register") {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header-blue">
            <h2>Đăng nhập</h2>
            <p>Quản lý tuyển dụng hiệu quả</p>
          </div>
          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="email"
              placeholder="Email doanh nghiệp"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
            {loginError && <p className="error-text">{loginError}</p>}
            <button type="submit" className="auth-btn">Đăng nhập</button>
          </form>
          <div className="auth-footer">
            <p>Chưa có tài khoản? <span onClick={() => setActiveTab("register")} className="link-blue">Đăng ký</span></p>
          </div>
        </div>
      </div>
    );
  }

  // TRANG ĐĂNG KÝ
  if (activeTab === "register") {
    return (
      <div className="auth-wrapper">
        <div className="auth-card-register">
          <div className="auth-header-blue">
            <h2>Đăng ký tài khoản</h2>
            <p>Trở thành đối tác tuyển dụng</p>
          </div>
          <form onSubmit={handleRegister} className="auth-form-register">
            <input type="text" placeholder="Tên công ty" required />
            <input type="email" placeholder="Email doanh nghiệp" required />
            <input type="password" placeholder="Mật khẩu (tối thiểu 6 ký tự)" required />
            <input type="password" placeholder="Xác nhận mật khẩu" required />
            {registerError && <p className="error-text">{registerError}</p>}
            <button type="submit" className="btn-register">Tạo tài khoản</button>
          </form>
          <div className="auth-footer-register">
            <p>Đã có tài khoản? <span onClick={() => setActiveTab("login")} className="link-blue">Đăng nhập</span></p>
          </div>
        </div>
      </div>
    );
  }

  // TRANG CHỦ SAU ĐĂNG NHẬP
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
                <button onClick={downloadCV} className="btn-download-cv">Tải CV (PDF)</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;