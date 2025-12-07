import API from "./api";

// ⭐ CẬP NHẬT: Hàm Helper chấp nhận tham số params
const fetchCategoriesByType = (type, params = {}) => {
    // SỬ DỤNG ĐƯỜNG DẪN PUBLIC MỚI
    // Giả định bạn dùng tiền tố API là /api/v1
    // Tham số type được đưa vào URL, các tham số khác được đưa vào Axios params
    return API.get(`/v1/categories?type=${type}`, { params: params }); 
};

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

    // ⭐ CẬP NHẬT: Hàm chấp nhận tham số params và áp dụng cho các cuộc gọi API
    async getDynamicFilters(params = {}) {
        try {
            // Gọi song song 5 API để tối ưu thời gian tải
            const [
                careerRes, 
                levelRes, 
                jobTypeRes, 
                salaryRes, 
                experienceRes
            ] = await Promise.all([
                // ⭐ TRUYỀN PARAMS CHO CÁC API CẦN THỐNG KÊ (VD: INDUSTRY)
                fetchCategoriesByType('INDUSTRY', params), 
                fetchCategoriesByType('JOB_LEVEL'),
                fetchCategoriesByType('JOB_TYPE'),
                fetchCategoriesByType('SALARY'), 
                fetchCategoriesByType('EXPERIENCE'),
            ]);

            // Hàm helper để chuẩn hóa dữ liệu từ response
            const normalizeData = (response) => {
                // Dựa trên response backend của bạn: { data: { categories: [...] } }
                const categories = response.data?.data?.categories || []; 
                return categories.map(item => ({
                    // 'name' là nhãn hiển thị, 'id' là giá trị lọc
                    label: item.name, 
                    value: item.id.toString(),
                    // ⭐ TRÍCH XUẤT jobCount (nếu có)
                    jobCount: item.jobCount ? parseInt(item.jobCount) : undefined
                }));
            };

            return {
                career: normalizeData(careerRes),
                level: normalizeData(levelRes),
                jobType: normalizeData(jobTypeRes),
                salary: normalizeData(salaryRes), 
                experience: normalizeData(experienceRes)
            };
        } catch (error) {
            console.error("Lỗi khi tải bộ lọc động:", error);
            // Trả về dữ liệu trống để tránh lỗi runtime trong component
            return { career: [], level: [], jobType: [], salary: [], experience: [] };
        }
    }

}

export default new JobService();