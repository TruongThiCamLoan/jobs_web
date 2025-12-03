// jobs-api/models/employer.model.js
module.exports = (sequelize, DataTypes) => {
  const Employer = sequelize.define('Employer', {
    employerId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true }, // Khóa ngoại tới User
    companyName: { type: DataTypes.STRING(255), allowNull: false, },
    companyDescription: { type: DataTypes.TEXT, },
    companyAddress: { type: DataTypes.STRING(255), },
    phoneNumber: { type: DataTypes.STRING(255), },
    website: { type: DataTypes.STRING(100), },
  });
  return Employer;
};