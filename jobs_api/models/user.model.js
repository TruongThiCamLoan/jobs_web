// jobs-api/models/user.model.js (CẬP NHẬT theo ERD của bạn)

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    fullName: { type: DataTypes.STRING(100), allowNull: true, },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(100), allowNull: false, },
    role: { 
        // Sử dụng ENUM để chỉ chấp nhận 3 giá trị chuỗi này
        type: DataTypes.ENUM('Student', 'Employer', 'Admin'), 
        allowNull: false, 
        // Thiết lập giá trị mặc định cho người dùng mới đăng ký
        defaultValue: 'Student', 
    },
    lockReason: { type: DataTypes.STRING(255), allowNull: true, },
    lockUntil: { type: DataTypes.DATE, allowNull: true, },
  });

  return User;
};