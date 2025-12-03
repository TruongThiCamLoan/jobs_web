const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Reference = sequelize.define('Reference', {
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
        
        relationship: { // Mối quan hệ (VD: Quản lý cũ, Giảng viên)
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        name: { // Tên người tham khảo
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        position: { // Chức danh người tham khảo
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        phone: { // Số điện thoại
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        email: { // Email
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: {
                isEmail: true,
            }
        },
        notes: { // Thông tin liên quan
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'References',
        timestamps: true,
    });
    
    // Định nghĩa mối quan hệ (Association)
    Reference.associate = (models) => {
        // Reference thuộc về Student
        Reference.belongsTo(models.Student, {
            foreignKey: 'studentId',
            onDelete: 'CASCADE', // Xóa mục người tham khảo khi xóa Student
        });
    };

    return Reference;
};  