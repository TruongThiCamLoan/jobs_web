const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const db = require('./models'); // Import đối tượng db

// --- MIDDLEWARE ---
app.use(cors());

// ✨ KHẮC PHỤC LỖI PayloadTooLargeError: Tăng giới hạn kích thước body lên 50MB
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


// --- KIỂM TRA KẾT NỐI DATABASE VÀ ĐỒNG BỘ HÓA ---
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Kết nối MySQL thành công.');
    
    // 💡 SỬ DỤNG { alter: true } ĐỂ THÊM CỘT MỚI VÀO BẢNG ĐÃ CÓ (Job) VÀ TẠO BẢNG MỚI (Category)
    db.sequelize.sync().then(() => { 
      console.log("✅ Database synchronized (Cột mới và bảng mới đã được thêm).");
    });
  })
  .catch(err => {
    console.log('❌ LỖI: Không thể kết nối MySQL:', err);
  });


// --- IMPORT ROUTES ---
const authRoutes = require('./routes/auth.routes'); 
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes'); 
const profileRoutes = require('./routes/profile.routes');
const employerRoutes = require('./routes/employer.routes'); 
const savedJobRoutes = require('./routes/savedJob.router'); 
const publicRoutes = require('./routes/public.routes');
const reportRoutes = require('./routes/report.routes');

// admin
const adminStudentRoutes = require('./routes/adminStudent.routes');
const adminEmployerRoutes = require('./routes/adminEmployer.routes');
// 🎯 IMPORT ROUTE QUẢN LÝ DANH MỤC MỚI
const adminCategoryRoutes = require('./routes/adminCategory.routes'); 
const adminRepostRoutes = require('./routes/adminRepost.routes');
const adminReportRoutes = require('./routes/adminReport.routes');


// --- ĐỊNH TUYẾN API (API ROUTES) ---
// Route Xác thực: /api/auth/signup, /api/auth/signin
app.use('/api/auth', authRoutes); 

// Route Quản lý Job: /api/jobs
app.use('/api/jobs', jobRoutes); 

// Route Ứng tuyển: /api/applications
app.use('/api/applications', applicationRoutes); 

app.use('/api/profile', profileRoutes);

app.use('/api/v1', publicRoutes);

// Route Nhà tuyển dụng: /api/employers
app.use('/api/employers', employerRoutes); 

// THÊM: Route Lưu việc làm yêu thích
// Route Lưu việc làm: /api/saved-jobs
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/reports', reportRoutes);

// admin
app.use('/api/v1/admin/students', adminStudentRoutes);
app.use('/api/v1/admin/employers', adminEmployerRoutes);
// 🎯 ĐỊNH TUYẾN CHO QUẢN LÝ DANH MỤC: /api/v1/admin/categories
app.use('/api/v1/admin/categories', adminCategoryRoutes); 

app.use('/api/v1/admin/reposts', adminRepostRoutes);
app.use('/api/v1/admin/reports', adminReportRoutes);




// Route kiểm tra server
app.get('/', (req, res) => {
  res.send('🎉 Jobs Backend API is running!');
});


// --- KHỞI CHẠY SERVER ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}.`);
});