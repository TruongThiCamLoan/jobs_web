const dbConfig = require('../config/db.config.js');
const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// =================================================================
// 1. IMPORT TẤT CẢ MODELS
// =================================================================
db.User = require('./user.model')(sequelize, DataTypes);
db.Student = require('./student.model')(sequelize, DataTypes);
db.Employer = require('./employer.model')(sequelize, DataTypes);
db.Job = require('./job.model')(sequelize, DataTypes); 
db.JobApplication = require('./jobApplication.model')(sequelize, DataTypes); 
db.Report = require('./report.model')(sequelize, DataTypes);
db.Complaint = require('./complaint.model')(sequelize, DataTypes);

// 🎯 THÊM MODEL SAVED JOB
db.SavedJob = require('./savedJob.model')(sequelize, DataTypes); 

// --- MODELS PHỤ CHO STUDENT PROFILE (9 BƯỚC) ---
db.Education = require('./education.model')(sequelize, DataTypes); 
db.Language = require('./language.model')(sequelize, DataTypes);
db.Experience = require('./experience.model')(sequelize, DataTypes);
db.Reference = require('./reference.model')(sequelize, DataTypes);
db.Skill = require('./skill.model')(sequelize, DataTypes);
db.DesiredIndustry = require('./desiredIndustry.model')(sequelize, DataTypes);
db.PreferredLocation = require('./preferredLocation.model')(sequelize, DataTypes);


// =================================================================
// 2. THIẾT LẬP TẤT CẢ QUAN HỆ (ASSOCIATIONS)
// =================================================================

// --- Quan hệ AUTH/User ---
db.User.hasOne(db.Student, { foreignKey: 'userId', as: 'studentProfile', onDelete: 'CASCADE' });
db.Student.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.User.hasOne(db.Employer, { foreignKey: 'userId', as: 'employerProfile', onDelete: 'CASCADE' });
db.Employer.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

// --- Quan hệ JOB/EMPLOYER ---
db.Employer.hasMany(db.Job, { foreignKey: 'employerId', as: 'jobs' });
db.Job.belongsTo(db.Employer, { foreignKey: 'employerId', as: 'employer' });

// --- Quan hệ JOB/APPLICATION/STUDENT ---
db.Job.hasMany(db.JobApplication, { foreignKey: 'jobId', as: 'applications' });
db.JobApplication.belongsTo(db.Job, { foreignKey: 'jobId', as: 'job' });

db.Student.hasMany(db.JobApplication, { foreignKey: 'studentId', as: 'applications' });
db.JobApplication.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });

// --- Quan hệ REPORT/COMPLAINT/USER ---
db.User.hasMany(db.Report, { foreignKey: 'userId', as: 'reports' });
db.Report.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.User.hasMany(db.Complaint, { foreignKey: 'userId', as: 'complaints' });
db.Complaint.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

// --- QUAN HỆ SAVED JOBS (MỚI) ---
db.Student.hasMany(db.SavedJob, { foreignKey: 'studentId', as: 'savedJobs', onDelete: 'CASCADE' });
db.SavedJob.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });

// Job có thể được lưu nhiều lần
db.Job.hasMany(db.SavedJob, { foreignKey: 'jobId', as: 'savedByStudents', onDelete: 'CASCADE' });
// 🎯 DÙNG ALIAS 'Job' để khớp với Controller
db.SavedJob.belongsTo(db.Job, { foreignKey: 'jobId', as: 'Job' }); 


// --- QUAN HỆ STUDENT PROFILE ---
// B3: Học vấn
db.Student.hasMany(db.Education, { foreignKey: 'studentId', as: 'education', onDelete: 'CASCADE' });
db.Education.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });

// B4: Ngoại ngữ
db.Student.hasMany(db.Language, { foreignKey: 'studentId', as: 'languages', onDelete: 'CASCADE' });
db.Language.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });

// B5: Kinh nghiệm làm việc
db.Student.hasMany(db.Experience, { foreignKey: 'studentId', as: 'experiences', onDelete: 'CASCADE' });
db.Experience.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });

// B6: Người tham khảo
db.Student.hasMany(db.Reference, { foreignKey: 'studentId', as: 'references', onDelete: 'CASCADE' });
db.Reference.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });

// B7: Kỹ năng
db.Student.hasMany(db.Skill, { foreignKey: 'studentId', as: 'skills', onDelete: 'CASCADE' });
db.Skill.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });

// B8: Ngành nghề mong muốn
db.Student.hasMany(db.DesiredIndustry, { foreignKey: 'studentId', as: 'desiredIndustries', onDelete: 'CASCADE' });
db.DesiredIndustry.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });

// B8: Nơi làm việc ưa thích
db.Student.hasMany(db.PreferredLocation, { foreignKey: 'studentId', as: 'preferredLocations', onDelete: 'CASCADE' });
db.PreferredLocation.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });


module.exports = db;