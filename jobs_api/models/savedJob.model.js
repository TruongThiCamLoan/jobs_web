// src/models/SavedJob.js
module.exports = (sequelize, DataTypes) => {
  const SavedJob = sequelize.define('SavedJob', {
    savedJobId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Khóa ngoại tới Student (người lưu việc)
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Students', 
        key: 'studentId'
      }
    },
    // Khóa ngoại tới Job (công việc được lưu)
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Jobs',
        key: 'jobId'
      }
    },
  }, {
    tableName: 'SavedJobs',
    timestamps: true, // Thêm createdAt và updatedAt
    indexes: [
      {
        unique: true,
        fields: ['studentId', 'jobId'] // Đảm bảo mỗi công việc chỉ được lưu một lần bởi một sinh viên
      }
    ]
  });

  SavedJob.associate = (models) => {
    SavedJob.belongsTo(models.Student, { foreignKey: 'studentId' });
    SavedJob.belongsTo(models.Job, { foreignKey: 'jobId' });
  };

  return SavedJob;
};