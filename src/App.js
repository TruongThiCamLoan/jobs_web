import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 

// Import các Components theo cấu trúc Destructuring của bạn
import { HomePage, LoginPage, RegisterPage, LoginEmployerPage, MyJobsPage, UploadResumePage, AccountPage, RegisterEmployer, EmployerDashboard, EmployersPage  , ResumePage, SavedJobsPage, JobAlertsPage, AppliedJobsPage, JobSearchPage} from "./pages";

// ✅ SỬA: Import JobDetailPage trực tiếp (Vì nó là export default)
import JobDetailPage from './pages/JobDetailPage'; 

import { CreateResumeStep1, CreateResumeStep2, CreateResumeStep3, CreateResumeStep4, CreateResumeStep5, CreateResumeStep6, CreateResumeStep7, CreateResumeStep8, CreateResumeStep9} from "./pages";
import { AdminDashboard, EmployersManagement, StudentsManagement, CategoryManagement, ComplaintManagement,StatisticsReport } from "./pages";


function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					{/* PUBLIC ROUTES */}
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/employer/register" element={<RegisterEmployer />} />
					<Route path="/employer" element={<LoginEmployerPage />} /> {/* Đăng nhập NTD */}
         			 <Route path="/employers" element={<EmployersPage />} /> {/* Đăng nhập NTD */}
					<Route path="/jobs" element={<JobDetailPage />} /> {/* Route danh sách Job */}
					{/* FIX: Thêm route /jobs/search để khớp với chuyển hướng từ HomePage */}
					<Route path="/jobs/search" element={<JobSearchPage />} /> 

					{/* JOB DETAIL ROUTE (ĐÃ KHẮC PHỤC LỖI) */}
					<Route path="/jobs/:id" element={<JobDetailPage />} /> 

					{/* STUDENT ROUTES */}
					<Route path="/myjobs" element={<MyJobsPage />} />
					<Route path="/resume" element={<ResumePage />} />
					<Route path="/saved-jobs" element={<SavedJobsPage />} />
					<Route path="/job-alerts" element={<JobAlertsPage />} />
					<Route path="/applied-jobs" element={<AppliedJobsPage />} />
					<Route path="/upload-resume" element={<UploadResumePage />} />
					<Route path="/account" element={<AccountPage />} />

					{/* RESUME CREATION ROUTES */}
					<Route path="/create-resume/step1" element={<CreateResumeStep1 />} />
					<Route path="/create-resume/step2" element={<CreateResumeStep2 />} />
					<Route path="/create-resume/step3" element={<CreateResumeStep3 />} />
					<Route path="/create-resume/step4" element={<CreateResumeStep4 />} />
					<Route path="/create-resume/step5" element={<CreateResumeStep5 />} />
					<Route path="/create-resume/step6" element={<CreateResumeStep6 />} />
					<Route path="/create-resume/step7" element={<CreateResumeStep7 />} />
					<Route path="/create-resume/step8" element={<CreateResumeStep8 />} />
					<Route path="/create-resume/step9" element={<CreateResumeStep9 />} />

					{/* PROTECTED ROUTES */}
					<Route path="/employer/dashboard" element={<EmployerDashboard />} />
					<Route path="/admin" element={<AdminDashboard />} />
					<Route path="/admin/employers" element={<EmployersManagement/>} />
					<Route path="/admin/students" element={<StudentsManagement/>} />
					<Route path="/admin/categories" element={<CategoryManagement/>} />
					<Route path="/admin/complaints" element={<ComplaintManagement/>} />
					<Route path="/admin/reports" element={<StatisticsReport/>} />
					
					{/* Route 404 (Fallback) */}
					<Route path="*" element={<div>404 - Không tìm thấy trang</div>} />
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;