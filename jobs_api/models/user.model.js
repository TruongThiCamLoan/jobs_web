    // jobs-api/models/user.model.js (MÃ ĐÃ CẬP NHẬT)

    module.exports = (sequelize, DataTypes) => {
        const User = sequelize.define('User', {
            id: { 
                type: DataTypes.INTEGER, 
                autoIncrement: true, 
                primaryKey: true, 
            },
            fullName: { 
                type: DataTypes.STRING(100), 
                allowNull: true, 
            },
            email: { 
                type: DataTypes.STRING(100), 
                allowNull: false, 
                unique: true 
            },
            password: { 
                type: DataTypes.STRING(100), 
                allowNull: false, 
            },
            role: { 
                type: DataTypes.ENUM('Student', 'Employer', 'Admin'), 
                allowNull: false, 
                defaultValue: 'Student', 
            },
            // 💡 CỘT MỚI: DÙNG ĐỂ LỌC VÀ CẬP NHẬT TRẠNG THÁI KHÓA
            isLocked: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false // Mặc định là KHÔNG bị khóa
            },
            lockReason: { 
                type: DataTypes.STRING(255), 
                allowNull: true, 
            },
            lockUntil: { 
                type: DataTypes.DATE, 
                allowNull: true, 
            },
        });

        return User;
    };