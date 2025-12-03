// src/models/jobApplication.model.js (Nội dung cần có)

module.exports = (sequelize, DataTypes) => {
    const JobApplication = sequelize.define('JobApplication', {
        applicationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        jobId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // Trạng thái ứng tuyển: Pending, Reviewed, Interview, Rejected, Hired
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Pending',
        },
        // Khóa ngoại tới Resume ID nếu bạn có nhiều Resume
        resumeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'JobApplications',
        timestamps: true,
        indexes: [
            {
                // Đảm bảo một sinh viên chỉ ứng tuyển 1 lần cho 1 công việc
                unique: true,
                fields: ['jobId', 'studentId'] 
            }
        ]
    });

    JobApplication.associate = (models) => {
        JobApplication.belongsTo(models.Job, { foreignKey: 'jobId', as: 'job' });
        JobApplication.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    };

    return JobApplication;
};