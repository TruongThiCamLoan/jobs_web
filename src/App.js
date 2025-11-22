import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import { HomePage, LoginPage, RegisterPage, LoginEmployerPage, MyJobsPage, ResumePage, SavedJobsPage, JobAlertsPage, AppliedJobsPage} from "./pages";
import { CreateResumeStep1, CreateResumeStep2, CreateResumeStep3, CreateResumeStep4, CreateResumeStep5, CreateResumeStep6, CreateResumeStep7, CreateResumeStep8, CreateResumeStep9} from "./pages";
import { AdminDashboard, EmployersManagement, StudentsManagement, CategoryManagement, ComplaintManagement,StatisticsReport } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/employer" element={<LoginEmployerPage />} />
        <Route path="/myjobs" element={<MyJobsPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/saved-jobs" element={<SavedJobsPage />} />
        <Route path="/job-alerts" element={<JobAlertsPage />} />
        <Route path="/applied-jobs" element={<AppliedJobsPage />} />

        <Route path="/create-resume/step1" element={<CreateResumeStep1 />} />
        <Route path="/create-resume/step2" element={<CreateResumeStep2 />} />
        <Route path="/create-resume/step3" element={<CreateResumeStep3 />} />
        <Route path="/create-resume/step4" element={<CreateResumeStep4 />} />
        <Route path="/create-resume/step5" element={<CreateResumeStep5 />} />
        <Route path="/create-resume/step6" element={<CreateResumeStep6 />} />
        <Route path="/create-resume/step7" element={<CreateResumeStep7 />} />
        <Route path="/create-resume/step8" element={<CreateResumeStep8 />} />
        <Route path="/create-resume/step9" element={<CreateResumeStep9 />} />
        
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/employers" element={<EmployersManagement/>} />
        <Route path="/admin/students" element={<StudentsManagement/>} />
        <Route path="/admin/categories" element={<CategoryManagement/>} />
        <Route path="/admin/complaints" element={<ComplaintManagement/>} />
         <Route path="/admin/reports" element={<StatisticsReport/>} />
      </Routes>
    </Router>
  );
}

export default App;
