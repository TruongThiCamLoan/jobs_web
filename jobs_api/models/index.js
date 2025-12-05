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


// 🎯 ĐÃ THÊM MODEL CATEGORY
db.Category = require('./category.model')(sequelize, DataTypes); 

db.SavedJob = require('./savedJob.model')(sequelize, DataTypes); 

// --- MODELS PHỤ CHO STUDENT PROFILE ---
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

// 🎯 QUAN HỆ CATEGORY/JOB
// Thiết lập mối quan hệ từ bảng Job đến Category cho 3 loại danh mục khác nhau (industry, level, type)
db.Category.hasMany(db.Job, { foreignKey: 'industryId', as: 'jobsInIndustry' });
db.Job.belongsTo(db.Category, { foreignKey: 'industryId', as: 'industryCategory' });

db.Category.hasMany(db.Job, { foreignKey: 'jobLevelId', as: 'jobsInLevel' });
db.Job.belongsTo(db.Category, { foreignKey: 'jobLevelId', as: 'jobLevelCategory' });

db.Category.hasMany(db.Job, { foreignKey: 'jobTypeId', as: 'jobsOfType' });
db.Job.belongsTo(db.Category, { foreignKey: 'jobTypeId', as: 'jobTypeCategory' });

// --- Quan hệ JOB/APPLICATION/STUDENT ---
db.Job.hasMany(db.JobApplication, { foreignKey: 'jobId', as: 'applications' });
db.JobApplication.belongsTo(db.Job, { foreignKey: 'jobId', as: 'job' });

db.Student.hasMany(db.JobApplication, { foreignKey: 'studentId', as: 'applications' });
db.JobApplication.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });

db.User.hasMany(db.Report, { foreignKey: 'userId', as: 'reports' });
db.Report.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });



// --- QUAN HỆ SAVED JOBS ---
db.Student.hasMany(db.SavedJob, { foreignKey: 'studentId', as: 'savedJobs', onDelete: 'CASCADE' });
db.SavedJob.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });

db.Job.hasMany(db.SavedJob, { foreignKey: 'jobId', as: 'savedByStudents', onDelete: 'CASCADE' });
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

// B8: Ngành nghề mong muốn (DesiredIndustry) 
// -> Liên kết DesiredIndustry với Category (Ngành nghề)
db.Category.hasMany(db.DesiredIndustry, { foreignKey: 'categoryId', as: 'desiredByStudents' });
db.DesiredIndustry.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' }); 

db.Student.hasMany(db.DesiredIndustry, { foreignKey: 'studentId', as: 'desiredIndustries', onDelete: 'CASCADE' });
db.DesiredIndustry.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });

// B8: Nơi làm việc ưa thích
db.Student.hasMany(db.PreferredLocation, { foreignKey: 'studentId', as: 'preferredLocations', onDelete: 'CASCADE' });
db.PreferredLocation.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });


module.exports = db;