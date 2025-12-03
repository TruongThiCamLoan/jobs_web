// jobs-api/models/complaint.model.js
module.exports = (sequelize, DataTypes) => {
    const Complaint = sequelize.define("Complaint", {
        complaintId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: { // Người gửi khiếu nại
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        details: {
            type: DataTypes.TEXT
        },
        complaintDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        status: { // Trạng thái: 'Pending', 'Processing', 'Closed'
            type: DataTypes.ENUM('Pending', 'Processing', 'Closed'),
            defaultValue: 'Pending'
        }
    }, {
        tableName: 'Complaints'
    });
    
    // Đã thiết lập quan hệ trong index.js (Complaint belongsTo User)

    return Complaint;
};