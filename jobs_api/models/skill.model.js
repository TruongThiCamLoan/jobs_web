const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Skill = sequelize.define('Skill', {
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
        
        skillName: { // Tên kỹ năng (VD: JavaScript, Tiếng Anh)
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        level: { // Trình độ (0-100%)
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 100,
            }
        },
        description: { // Mô tả chi tiết kỹ năng (Tùy chọn)
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'Skills',
        timestamps: true,
    });
    
    // Định nghĩa mối quan hệ (Association)
    Skill.associate = (models) => {
        // Skill thuộc về Student
        Skill.belongsTo(models.Student, {
            foreignKey: 'studentId',
            onDelete: 'CASCADE', // Xóa mục kỹ năng khi xóa Student
        });
    };

    return Skill;
};