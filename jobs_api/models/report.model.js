// jobs-api/models/report.model.js
module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define("Report", {
        reportId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: { // Người gửi báo cáo
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reportType: { // Loại báo cáo: 'Job', 'User', 'Comment', etc.
            type: DataTypes.STRING,
            allowNull: false
        },
        entityId: { // ID của đối tượng bị báo cáo
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        reportDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        status: { // Trạng thái: 'Pending', 'Resolved', 'Ignored'
            type: DataTypes.ENUM('Pending', 'Resolved', 'Ignored'),
            defaultValue: 'Pending'
        }
    }, {
        tableName: 'Reports'
    });
    
    // Đã thiết lập quan hệ trong index.js (Report belongsTo User)

    return Report;
};