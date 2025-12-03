const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const PreferredLocation = sequelize.define('PreferredLocation', {
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
        
        locationName: { // Tên Tỉnh/Thành phố (VD: Hà Nội, TP. Hồ Chí Minh)
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: 'studentLocationConstraint'
        },
    }, {
        tableName: 'PreferredLocations',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['studentId', 'locationName'],
                name: 'studentLocationConstraint'
            }
        ]
    });
    
    // Định nghĩa mối quan hệ (Association)
    PreferredLocation.associate = (models) => {
        // PreferredLocation thuộc về Student
        PreferredLocation.belongsTo(models.Student, {
            foreignKey: 'studentId',
            onDelete: 'CASCADE',
        });
    };

    return PreferredLocation;
};