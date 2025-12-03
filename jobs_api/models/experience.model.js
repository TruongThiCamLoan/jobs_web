const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Experience = sequelize.define('Experience', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // Khóa ngoại liên kết với bảng Student
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        
        companyName: { // Tên công ty
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        position: { // Chức danh
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        industry: { // Ngành nghề việc làm
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        startDate: { // Ngày Bắt Đầu (Tháng/Năm)
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        endDate: { // Ngày Kết Thúc (Tháng/Năm)
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        isCurrentJob: { // Công việc hiện tại (frontend: isCurrent)
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        description: { // Mô tả công việc và thành tựu
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        tableName: 'Experiences',
        timestamps: true,
    });
    
    // Định nghĩa mối quan hệ (Association)
    Experience.associate = (models) => {
        // Experience thuộc về Student
        Experience.belongsTo(models.Student, {
            foreignKey: 'studentId',
            onDelete: 'CASCADE', // Xóa mục kinh nghiệm khi xóa Student
        });
    };

    return Experience;
};