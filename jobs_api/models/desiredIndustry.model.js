const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const DesiredIndustry = sequelize.define('DesiredIndustry', {
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
        
        industryName: { // Tên ngành nghề mong muốn
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: 'studentIndustryConstraint' // Đảm bảo mỗi student chỉ có 1 ngành 1 lần
        },
    }, {
        tableName: 'DesiredIndustries',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['studentId', 'industryName'],
                name: 'studentIndustryConstraint'
            }
        ]
    });
    
    // Định nghĩa mối quan hệ (Association)
    DesiredIndustry.associate = (models) => {
        // DesiredIndustry thuộc về Student
        DesiredIndustry.belongsTo(models.Student, {
            foreignKey: 'studentId',
            onDelete: 'CASCADE',
        });
    };

    return DesiredIndustry;
};