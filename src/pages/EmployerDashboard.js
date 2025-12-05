// src/components/EmployerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../EmployerDashboard.css";
import logo from "../img/logo.png";

// DỮ LIỆU MẪU ỨNG VIÊN
const CANDIDATES_MOCK = [
  { id: 1, name: "Nguyễn Văn A", position: "Lập trình viên", match: "85%", email: "nguyenvana@gmail.com", phone: "0909123456", education: "ĐH Bách Khoa TP.HCM - CNTT", experience: "2 năm tại FPT Software", skills: "React, Node.js, MySQL, Git", note: "Ứng viên tiềm năng", status: "pending" },
  { id: 2, name: "Trần Thị B", position: "Nhân viên kinh doanh", match: "72%", email: "tranthib@gmail.com", phone: "0918234567", education: "ĐH Cần Thơ - Quản trị kinh doanh", experience: "1 năm tại VinMart", skills: "Giao tiếp, đàm phán, CRM", note: "Năng động, nhiệt tình", status: "pending" },
  { id: 3, name: "Lê Minh Cường", position: "Thiết kế đồ họa", match: "90%", email: "cuonglm.design@gmail.com", phone: "0935123789", education: "ĐH Mỹ thuật TP.HCM", experience: "3 năm freelance", skills: "Photoshop, Illustrator, Figma, UI/UX", note: "Portfolio rất ấn tượng", status: "pending" },
  { id: 4, name: "Phạm Thị Diễm", position: "Kế toán", match: "78%", email: "diempham.kt@gmail.com", phone: "0888123456", education: "ĐH Kinh tế Cần Thơ", experience: "2 năm tại công ty xuất nhập khẩu", skills: "Excel, MISA, hóa đơn điện tử", note: "Cẩn trọng, tỉ mỉ", status: "pending" },
  { id: 5, name: "Huỳnh Văn Em", position: "Lập trình viên", match: "88%", email: "emhv.dev@gmail.com", phone: "0905789456", education: "ĐH Công nghệ Thông tin - ĐHQG TP.HCM", experience: "1 năm thực tập tại VNG", skills: "JavaScript, Vue.js, Docker", note: "Học hỏi nhanh, có tư duy tốt", status: "pending" },
  { id: 6, name: "Võ Ngọc Huyền", position: "Nhân sự (HR)", match: "81%", email: "huyenvn.hr@gmail.com", phone: "0923456781", education: "ĐH Lao động Xã hội", experience: "2 năm tại công ty đa quốc gia", skills: "Tuyển dụng, đào tạo, quản lý nhân sự", note: "Kinh nghiệm tuyển dụng tốt", status: "pending" },
  { id: 7, name: "Đặng Quốc Khánh", position: "Marketing", match: "76%", email: "khanhdq.marketing@gmail.com", phone: "0919123789", education: "ĐH Kinh tế Quốc dân", experience: "1.5 năm tại agency", skills: "Facebook Ads, Google Ads, Content", note: "Sáng tạo, có ý tưởng hay", status: "pending" },
  { id: 8, name: "Bùi Thị Lan", position: "Nhân viên kinh doanh", match: "69%", email: "lanbt.sales@gmail.com", phone: "0938123456", education: "CĐ Kinh tế Cần Thơ", experience: "1 năm bán hàng B2C", skills: "Chăm sóc khách hàng, thuyết phục", note: "Giao tiếp tốt, chịu áp lực", status: "pending" },
  { id: 9, name: "Trương Văn Minh", position: "Quản trị mạng", match: "83%", email: "minhtv.net@gmail.com", phone: "0906123789", education: "ĐH Bách Khoa Đà Nẵng", experience: "2 năm tại ISP", skills: "CCNA, Firewall, Linux, Windows Server", note: "Kỹ thuật vững, xử lý sự cố nhanh", status: "pending" },
  { id: 10, name: "Ngô Thị Kim Ngân", position: "Thiết kế đồ họa", match: "87%", email: "ngankim.design@gmail.com", phone: "0889123789", education: "ĐH Kiến trúc TP.HCM", experience: "2 năm tại studio thiết kế", skills: "After Effects, Premiere, 3D Max", note: "Chuyên animation, sáng tạo cao", status: "pending" }
];

const DRAFTS_KEY = "job_drafts";
const ACTIVITIES_KEY = "activity_log";

const EmployerDashboard = () => {
  const { login, logout, register, currentUser, isEmployer } = useAuth();
  const navigate = useNavigate();

  // === STATES ===
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userLoginData, setUserLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // === KHÔI PHỤC TỪ LOCALSTORAGE ===
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem("employerJobs");
    return saved ? JSON.parse(saved) : [];
  });

  const [candidates, setCandidates] = useState(CANDIDATES_MOCK);

  // Form đăng tin (KHÔNG tự load bản nháp)
  const [jobForm, setJobForm] = useState({ title: "", position: "", salary: "", location: "", desc: "", req: "", contact: "" });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", position: "", salary: "", location: "", desc: "", req: "", contact: "" });

  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Hồ sơ công ty - lưu vĩnh viễn
  const [companyInfo, setCompanyInfo] = useState(() => {
    const saved = localStorage.getItem("companyInfo");
    return saved ? JSON.parse(saved) : { name: "Công ty TNHH ABC", address: "123 Đường ABC", phone: "0909123456", email: "hr@abc.com", description: "Công ty công nghệ hàng đầu." };
  });

  // Logo - lưu vĩnh viễn
  const [companyLogo, setCompanyLogo] = useState(() => {
    return localStorage.getItem("companyLogo") || null;
  });

  const [saving, setSaving] = useState(false);

  // Activities (recent activity) lưu vào localStorage
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem(ACTIVITIES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Draft modal & loaded drafts list (loaded only when opening modal)
  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [drafts, setDrafts] = useState([]); // list of drafts, load on demand

  // === TỰ ĐỘNG LƯU KHÁC ===
  useEffect(() => {
    localStorage.setItem("companyInfo", JSON.stringify(companyInfo));
  }, [companyInfo]);

  useEffect(() => {
    if (companyLogo) localStorage.setItem("companyLogo", companyLogo);
    else localStorage.removeItem("companyLogo");
  }, [companyLogo]);

  useEffect(() => {
    localStorage.setItem("employerJobs", JSON.stringify(jobs));
  }, [jobs]);

  // lưu activity khi activities thay đổi
  useEffect(() => {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  }, [activities]);

  // === AUTH PROTECTION ===
  useEffect(() => {
    if (!currentUser || !isEmployer) navigate("/login");
  }, [currentUser, isEmployer, navigate]);

  // ----- Helpers -----
  const addActivity = (action) => {
    const entry = { id: Date.now(), action, time: new Date().toISOString() };
    setActivities(prev => {
      const next = [entry, ...prev].slice(0, 50); // giữ tối đa 50 mục
      return next;
    });
  };

  // load drafts from localStorage (call when opening modal)
  const loadDraftsFromStorage = () => {
    const saved = localStorage.getItem(DRAFTS_KEY);
    const list = saved ? JSON.parse(saved) : [];
    setDrafts(list);
  };

  // LƯU bản nháp (thủ công) - thêm vào array "job_drafts"
  const handleSaveDraft = () => {
    const draft = {
      id: Date.now(),
      title: jobForm.title,
      position: jobForm.position,
      salary: jobForm.salary,
      location: jobForm.location,
      desc: jobForm.desc,
      req: jobForm.req,
      contact: jobForm.contact,
      savedAt: new Date().toISOString()
    };

    const saved = localStorage.getItem(DRAFTS_KEY);
    const arr = saved ? JSON.parse(saved) : [];
    arr.unshift(draft);
    // giữ tối đa 20 bản nháp
    const limited = arr.slice(0, 20);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(limited));
    addActivity(`Lưu bản nháp: ${draft.title || "(Không tiêu đề)"}`);
    alert("Đã lưu bản nháp!");
  };

  // Mở modal xem bản nháp
  const openDraftsModal = () => {
    loadDraftsFromStorage();
    setShowDraftsModal(true);
  };

  // Load 1 bản nháp vào form (khi người dùng chọn)
  const loadDraftToForm = (id) => {
    const saved = localStorage.getItem(DRAFTS_KEY);
    const arr = saved ? JSON.parse(saved) : [];
    const d = arr.find(x => x.id === id);
    if (!d) { alert("Không tìm thấy bản nháp."); return; }
    setJobForm({
      title: d.title || "",
      position: d.position || "",
      salary: d.salary || "",
      location: d.location || "",
      desc: d.desc || "",
      req: d.req || "",
      contact: d.contact || ""
    });
    setShowDraftsModal(false);
    addActivity(`Nạp bản nháp: ${d.title || "(Không tiêu đề)"}`);
  };

  // Xoá 1 bản nháp
  const deleteDraft = (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá bản nháp này?")) return;
    const saved = localStorage.getItem(DRAFTS_KEY);
    const arr = saved ? JSON.parse(saved) : [];
    const next = arr.filter(x => x.id !== id);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(next));
    setDrafts(next);
    addActivity("Xoá bản nháp");
  };

  // Clear all drafts (tuỳ chọn, không gọi tự động)
  const clearAllDrafts = () => {
    if (!window.confirm("Xoá tất cả bản nháp?")) return;
    localStorage.removeItem(DRAFTS_KEY);
    setDrafts([]);
    addActivity("Xoá tất cả bản nháp");
  };

  // format thời gian ngắn gọn (vi)
  const timeAgo = (isoString) => {
    const then = new Date(isoString).getTime();
    const now = Date.now();
    const diff = Math.floor((now - then) / 1000); // seconds

    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
    return new Date(isoString).toLocaleString("vi-VN");
  };

  // === XỬ LÝ ĐĂNG NHẬP / ĐĂNG KÝ / ĐĂNG XUẤT ===
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
    addActivity("Đăng nhập vào hệ thống");
  };

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
    addActivity(`Đăng ký tài khoản: ${company}`);
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      logout();
      navigate("/");
      addActivity("Đăng xuất khỏi hệ thống");
    }
  };

  // === XỬ LÝ LOGO ===
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setCompanyLogo(base64String);
        addActivity("Cập nhật logo công ty");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    if (window.confirm("Bạn có chắc muốn xóa logo công ty?")) {
      setCompanyLogo(null);
      addActivity("Xóa logo công ty");
    }
  };

  // === XỬ LÝ TIN TUYỂN DỤNG ===
  const handleJobChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const postJob = () => {
    if (!jobForm.title || !jobForm.position || !jobForm.location) {
      alert("Vui lòng nhập đầy đủ tiêu đề, vị trí và địa điểm!");
      return;
    }
    const newJob = { ...jobForm, id: Date.now(), status: "Đang tuyển", postedAt: new Date().toLocaleDateString("vi-VN") };
    setJobs(prev => [...prev, newJob]);
    addActivity(`Đã đăng tin tuyển dụng: ${newJob.title}`);
    setJobForm({ title: "", position: "", salary: "", location: "", desc: "", req: "", contact: "" });
    alert("Tin tuyển dụng đã được đăng thành công!");
  };

  const deleteJob = (id) => {
    const jobToDelete = jobs.find(j => j.id === id);
    if (window.confirm("Bạn có chắc muốn xóa tin này?")) {
      setJobs(prev => prev.filter(j => j.id !== id));
      addActivity(`Xóa tin tuyển dụng: ${jobToDelete ? jobToDelete.title : id}`);
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
    setJobs(prev => prev.map(job => job.id === editingJob.id ? { ...editForm } : job));
    setShowEditModal(false);
    addActivity(`Cập nhật tin tuyển dụng: ${editForm.title}`);
    alert("Cập nhật tin thành công!");
  };

  // === XỬ LÝ ỨNG VIÊN ===
  const openCVModal = (candidate) => {
    setSelectedCandidate(candidate);
    setShowCVModal(true);
    addActivity(`Xem hồ sơ ứng viên: ${candidate.name}`);
  };

  const approveCandidate = (id) => {
    if (window.confirm("Xác nhận duyệt hồ sơ này?")) {
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: "approved" } : c));
      const cand = candidates.find(c => c.id === id);
      addActivity(`Duyệt hồ sơ: ${cand ? cand.name : id}`);
      alert("Đã duyệt hồ sơ!");
    }
  };

  const rejectCandidate = (id) => {
    if (window.confirm("Từ chối hồ sơ này?")) {
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: "rejected" } : c));
      const cand = candidates.find(c => c.id === id);
      addActivity(`Từ chối hồ sơ: ${cand ? cand.name : id}`);
      alert("Đã từ chối hồ sơ!");
    }
  };

  const sendInterview = (id) => {
    const candidate = candidates.find(c => c.id === id);
    if (candidate && candidate.status === "approved") {
      alert(`Đã gửi lời mời phỏng vấn đến ${candidate.name}!`);
      addActivity(`Gửi lời mời phỏng vấn: ${candidate.name}`);
    } else {
      alert("Chỉ có thể gửi lời mời cho ứng viên đã được duyệt!");
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Cập nhật hồ sơ công ty thành công!");
      addActivity("Cập nhật hồ sơ công ty");
    }, 1000);
  };

  // === RENDER GIAO DIỆN KHI CHƯA ĐĂNG NHẬP ===
  if (!currentUser || !isEmployer) {
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

    return <div>Đang kiểm tra quyền truy cập...</div>;
  }

  // === GIAO DIỆN CHÍNH SAU KHI ĐĂNG NHẬP ===
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
        {/* TỔNG QUAN - ĐƯỢC ĐẶT VÀO KHUNG */}
        {activeTab === "dashboard" && (
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <h2>Xin chào, {companyInfo.name}!</h2>
                <p className="muted">Chào mừng quay lại hệ thống quản trị tuyển dụng</p>
              </div>
              <div className="dashboard-actions">
                <button onClick={() => setActiveTab("post")} className="action-btn primary small">+ Đăng tin mới</button>
                <button onClick={() => setActiveTab("candidates")} className="action-btn secondary small">Xem ứng viên</button>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-value">{jobs.length}</div>
                <div className="stat-label">Tin đang tuyển</div>
              </div>
              <div className="stat-card green">
                <div className="stat-value">{candidates.length}</div>
                <div className="stat-label">Ứng viên mới</div>
              </div>
              <div className="stat-card purple">
                <div className="stat-value">{candidates.filter(c => parseInt(c.match) >= 80).length}</div>
                <div className="stat-label">Ứng viên xuất sắc (≥80%)</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-value">{jobs.reduce((sum, j) => sum + (Math.floor(Math.random() * 30) + 10), 0)}</div>
                <div className="stat-label">Lượt xem tổng</div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Hoạt động gần đây</h3>
              <ul>
                {activities.length === 0 && (
                  <li>Chưa có hoạt động nào. Mọi thao tác (đăng tin, sửa, duyệt hồ sơ...) sẽ được lưu tại đây.</li>
                )}
                {activities.map((act) => (
                  <li key={act.id}>
                    {act.action} <small>– {timeAgo(act.time)}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ĐĂNG TIN */}
        {activeTab === "post" && (
          <div className="form-section">
            <h2>Đăng tin tuyển dụng</h2>
            <form onSubmit={(e) => { e.preventDefault(); postJob(); }} className="job-form">
              <input name="title" placeholder="Tiêu đề" value={jobForm.title} onChange={handleJobChange} />
              <input name="position" placeholder="Vị trí" value={jobForm.position} onChange={handleJobChange} />
              <input name="salary" placeholder="Mức lương" value={jobForm.salary} onChange={handleJobChange} />
              <input name="location" placeholder="Địa điểm" value={jobForm.location} onChange={handleJobChange} />
              <textarea name="desc" placeholder="Mô tả công việc" value={jobForm.desc} onChange={handleJobChange} />
              <textarea name="req" placeholder="Yêu cầu" value={jobForm.req} onChange={handleJobChange} />
              <input name="contact" placeholder="Liên hệ" value={jobForm.contact} onChange={handleJobChange} />
              <div className="btn-group">
                <button type="button" onClick={handleSaveDraft} className="btn-save-draft">Lưu bản nháp</button>
                <button type="button" onClick={openDraftsModal} className="btn-view-drafts">Xem bản nháp</button>
                <button type="submit" className="btn-post">Đăng tin ngay</button>
              </div>
            </form>
          </div>
        )}

        {/* QUẢN LÝ TIN */}
        {activeTab === "jobs" && (
          <div className="table-section">
            <h2>Quản lý tin tuyển dụng ({jobs.length} tin)</h2>
            {jobs.length === 0 ? (
              <p className="empty-note">Bạn chưa đăng tin tuyển dụng nào.</p>
            ) : (
              <table className="job-table">
                <thead>
                  <tr>
                    <th>Tiêu đề</th>
                    <th>Vị trí</th>
                    <th>Ngày đăng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id}>
                      <td><strong>{job.title}</strong></td>
                      <td>{job.position}</td>
                      <td>{job.postedAt || "Mới đây"}</td>
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
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img src={companyLogo} alt="Logo công ty" className="company-logo" />
                    <button onClick={removeLogo} className="logo-remove" title="Xóa logo">×</button>
                  </div>
                ) : (
                  <div className="logo-placeholder"><span>Briefcase</span><p>Chưa có logo</p></div>
                )}
                <label htmlFor="logo-upload" className="upload-btn">{companyLogo ? "Thay đổi logo" : "Chọn logo"}</label>
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
                  <button type="submit" className="btn-save" disabled={saving}>{saving ? "Đang lưu..." : "Cập nhật hồ sơ"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ỨNG VIÊN */}
        {activeTab === "candidates" && (
          <div className="table-section">
            <h2>Tìm kiếm & Xem hồ sơ ứng viên</h2>
            <input type="text" placeholder="Tìm kiếm theo tên, vị trí, email..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

            <div className="candidate-table-wrapper">
              <table className="candidate-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Vị trí</th>
                    <th>Độ phù hợp</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.filter(c => {
                    const term = searchTerm.toLowerCase();
                    return c.name.toLowerCase().includes(term) || c.position.toLowerCase().includes(term) || (c.email && c.email.toLowerCase().includes(term));
                  }).map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.position}</td>
                      <td>{c.match}</td>
                      <td>
                        {c.status === "pending" && <span className="status pending">Chờ duyệt</span>}
                        {c.status === "approved" && <span className="status approved">Đã duyệt</span>}
                        {c.status === "rejected" && <span className="status rejected">Từ chối</span>}
                      </td>
                      <td>
                        <button onClick={() => openCVModal(c)} className="btn-view-cv">Xem CV</button>
                        {c.status === "pending" && (<><button onClick={() => approveCandidate(c.id)} className="btn-approve">Duyệt</button><button onClick={() => rejectCandidate(c.id)} className="btn-reject">Từ chối</button></>)}
                        {c.status === "approved" && (<button onClick={() => sendInterview(c.id)} className="btn-invite">Gửi lời mời PV</button>)}
                        {c.status === "rejected" && (<span className="status-rejected">Đã từ chối</span>)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

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
                {selectedCandidate.status === "approved" && (<button onClick={() => sendInterview(selectedCandidate.id)} className="btn-invite-cv">Gửi lời mời phỏng vấn</button>)}
                <button onClick={() => alert(`Đang tải CV của ${selectedCandidate.name}...`)} className="btn-download-cv">Tải CV (PDF)</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XEM BẢN NHÁP */}
      {showDraftsModal && (
        <div className="modal-overlay" onClick={() => setShowDraftsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Bản nháp đã lưu</h3>
            {drafts.length === 0 ? (
              <p>Chưa có bản nháp nào.</p>
            ) : (
              <div className="drafts-list">
                <table className="drafts-table">
                  <thead>
                    <tr>
                      <th>Tiêu đề</th>
                      <th>Vị trí</th>
                      <th>Ngày lưu</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drafts.map(d => (
                      <tr key={d.id}>
                        <td>{d.title || "(Không tiêu đề)"}</td>
                        <td>{d.position || "-"}</td>
                        <td>{new Date(d.savedAt).toLocaleString("vi-VN")}</td>
                        <td>
                          <button onClick={() => loadDraftToForm(d.id)} className="btn-load-draft">Load</button>
                          <button onClick={() => deleteDraft(d.id)} className="btn-delete-draft">Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: 12 }}>
                  <button onClick={clearAllDrafts} className="btn-clear-drafts">Xóa tất cả bản nháp</button>
                </div>
              </div>
            )}
            <div style={{ marginTop: 12 }}>
              <button onClick={() => setShowDraftsModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
