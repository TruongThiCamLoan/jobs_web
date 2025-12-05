const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Education = sequelize.define('Education', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // Khóa ngoại liên kết với bảng Student (hoặc trực tiếp với User)
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // Sẽ thiết lập mối quan hệ trong file index.js của models
        },
        
        educationLevel: { // Trình độ học vấn (VD: Đại học, Thạc sĩ)
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        university: { // Tên trường
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        major: { // Chuyên môn
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        startDate: { // Ngày Bắt Đầu (Chỉ cần lưu tháng và năm, nhưng sử dụng DATEONLY cho tiện)
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        endDate: { // Ngày Kết Thúc
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        description: { // Quá trình học vấn
            type: DataTypes.TEXT,
            allowNull: true, // Tùy chọn
        },
    }, {
        tableName: 'Education',
        timestamps: true,
    });
    
    // Định nghĩa mối quan hệ (Association)
    Education.associate = (models) => {
        // Education thuộc về Student
        Education.belongsTo(models.Student, {
            foreignKey: 'studentId',
            as: 'education',
            onDelete: 'CASCADE', // Xóa mục học vấn khi xóa Student
        });
    };

    return Education;
};