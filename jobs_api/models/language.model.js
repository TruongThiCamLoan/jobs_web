const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Language = sequelize.define('Language', {
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
        
        languageName: { // Tên ngoại ngữ
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        level: { // Trình độ (Sơ cấp, Trung cấp, Khá, Tốt, Xuất sắc, Bản ngữ)
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }, {
        tableName: 'Languages',
        timestamps: true,
    });
    
    // Định nghĩa mối quan hệ (Association)
    Language.associate = (models) => {
        // Language thuộc về Student
        Language.belongsTo(models.Student, {
            foreignKey: 'studentId',
            onDelete: 'CASCADE', // Xóa mục ngoại ngữ khi xóa Student
        });
    };

    return Language;
};