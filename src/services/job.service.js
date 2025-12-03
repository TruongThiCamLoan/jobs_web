import API from "./api";

class JobService {
    // 1. Lấy danh sách việc làm (Public)
    async getJobList(filters) {
        // API GET /api/jobs
        // filters có thể bao gồm { search: 'React', location: 'HCM' }
        try {
            const response = await API.get("/jobs", { params: filters });
            return response.data;
        } catch (error) {
            console.error("Error fetching job list:", error);
            throw error;
        }
    }

    // 2. Lấy chi tiết việc làm (Public)
    async getJobDetail(jobId) {
        // API GET /api/jobs/:id
        try {
            const response = await API.get(`/jobs/${jobId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching job ${jobId} detail:`, error);
            throw error;
        }
    }

    // 3. Tạo việc làm mới (Protected - Employer)
    async createJob(jobData) {
        // API POST /api/jobs (Token được Interceptor thêm vào)
        try {
            const response = await API.post("/jobs", jobData);
            return response.data;
        } catch (error) {
            console.error("Error creating job:", error);
            throw error;
        }
    }

    // 4. Cập nhật việc làm (Protected - Employer)
    async updateJob(jobId, jobData) {
        // API PUT /api/jobs/:id
        try {
            const response = await API.put(`/jobs/${jobId}`, jobData);
            return response.data;
        } catch (error) {
            console.error(`Error updating job ${jobId}:`, error);
            throw error;
        }
    }
    
    // 5. Xóa việc làm (Protected - Employer)
    async deleteJob(jobId) {
        // API DELETE /api/jobs/:id
        try {
            const response = await API.delete(`/jobs/${jobId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting job ${jobId}:`, error);
            throw error;
        }
    }

    // 6. Lấy danh sách Nhà tuyển dụng hàng đầu (Top Employers) - MỚI
    async getTopEmployers() {
        // API GET /api/employers
        try {
            const response = await API.get("/employers"); 
            return response.data;
        } catch (error) {
            console.error("Error fetching top employers:", error);
            // Ném lỗi để HomePage.js có thể bắt và sử dụng fallback/hiển thị lỗi
            throw error; 
        }
    }

    // TÍNH NĂNG BỔ SUNG: Lấy Job của riêng Employer này
    async getEmployerJobs() {
        // API GET /api/jobs (sẽ được lọc theo EmployerID)
        return this.getJobList(); 
    }
}

export default new JobService();