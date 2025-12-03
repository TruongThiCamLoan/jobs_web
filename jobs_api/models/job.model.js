// jobs-api/models/job.model.js

module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    jobId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    employerId: { // Khóa ngoại tới Employer
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    requirements: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    salary: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    postDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    status: { // Ví dụ: Active, Closed, Pending...
        type: DataTypes.STRING(20),
        allowNull: true,
    }
  });

  return Job;
};