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
    // Đồng bộ hóa (Tạo/Cập nhật bảng nếu cần)
    db.sequelize.sync({ force: false }).then(() => { 
      console.log("✅ Database synchronized (Tạo/Cập nhật bảng thành công).");
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
const reportRoutes = require('./routes/report.routes');
const employerRoutes = require('./routes/employer.routes'); 
// THÊM: Import Saved Job Routes
const savedJobRoutes = require('./routes/savedJob.router'); 


// --- ĐỊNH TUYẾN API (API ROUTES) ---
// Route Xác thực: /api/auth/signup, /api/auth/signin
app.use('/api/auth', authRoutes); 

// Route Quản lý Job: /api/jobs
app.use('/api/jobs', jobRoutes); 

// Route Ứng tuyển: /api/applications
app.use('/api/applications', applicationRoutes); 

app.use('/api/profile', profileRoutes);

app.use('/api/reports', reportRoutes);

// Route Nhà tuyển dụng: /api/employers
app.use('/api/employers', employerRoutes); 

// THÊM: Route Lưu việc làm yêu thích
// Route Lưu việc làm: /api/saved-jobs
app.use('/api/saved-jobs', savedJobRoutes);


// Route kiểm tra server
app.get('/', (req, res) => {
  res.send('🎉 Jobs Backend API is running!');
});


// --- KHỞI CHẠY SERVER ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}.`);
});