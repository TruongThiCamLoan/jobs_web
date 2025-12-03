const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    // Định nghĩa bảng Student (Hồ sơ ứng viên)
    const Student = sequelize.define('Student', {
        studentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // Khóa ngoại liên kết với bảng User
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true, // Mỗi User chỉ có 1 hồ sơ Student
        },

        // ---------- Các trường từ Bước 1: Thông tin cá nhân ----------
        resumeTitle: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        fullName: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        nationality: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY, // Chỉ lưu ngày tháng năm
            allowNull: true,
        },
        gender: {
            type: DataTypes.STRING(10), // Ví dụ: 'Nam', 'Nữ'
            allowNull: true,
        },
        maritalStatus: {
            type: DataTypes.STRING(20), // Ví dụ: 'Độc thân', 'Đã kết hôn'
            allowNull: true,
        },
        avatarUrl: {
            type: DataTypes.TEXT, // URL ảnh đại diện
            allowNull: true,
        },
        
        // ---------- Các trường từ BƯỚC 2: Thông tin liên hệ ----------
        phone: { 
            type: DataTypes.STRING(20), 
            allowNull: true 
        },
        email: { 
            type: DataTypes.STRING(100), 
            allowNull: true,
            validate: {
                isEmail: true,
            }
        },
        country: { 
            type: DataTypes.STRING(50), 
            allowNull: true 
        },
        province: { 
            type: DataTypes.STRING(100), 
            allowNull: true 
        },
        district: { 
            type: DataTypes.STRING(100), 
            allowNull: true 
        },
        address: {
            type: DataTypes.STRING(255), // Địa chỉ đường
            allowNull: true,
        },
        
        // ---------- Các trường từ BƯỚC 5: Tổng quan Kinh nghiệm ----------
        totalYearsExperience: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: 0 
        },

        // ---------- Các trường từ BƯỚC 8: Mục tiêu nghề nghiệp ----------
        desiredPosition: { 
            type: DataTypes.STRING(255), 
            allowNull: true 
        },
        recentSalary: { 
            type: DataTypes.FLOAT, 
            allowNull: true 
        },
        recentCurrency: { 
            type: DataTypes.STRING(10), 
            allowNull: true, 
            defaultValue: 'VND' 
        },
        desiredSalaryFrom: { 
            type: DataTypes.FLOAT, 
            allowNull: true 
        },
        desiredSalaryTo: { 
            type: DataTypes.FLOAT, 
            allowNull: true 
        },
        desiredCurrency: { 
            type: DataTypes.STRING(10), 
            allowNull: true, 
            defaultValue: 'VND' 
        },
        jobType: { 
            type: DataTypes.STRING(50), 
            allowNull: true 
        }, // Toàn thời gian, Bán thời gian...
        jobLevel: { 
            type: DataTypes.STRING(50), 
            allowNull: true 
        }, // Nhân viên, Quản lý...
        careerGoal: { 
            type: DataTypes.TEXT, 
            allowNull: true 
        }, // Mục tiêu nghề nghiệp
        
        // ---------- Các trường từ BƯỚC 9: Trạng thái hồ sơ ----------
        isSearchable: { 
            type: DataTypes.BOOLEAN, 
            allowNull: false, 
            defaultValue: true 
        }, // Cho phép N.T.D tìm kiếm
        
        // ---------- TRƯỜNG KHÔNG CẦN THIẾT HOẶC ĐÃ CHUYỂN BẢNG ----------
        // cvUrl: { type: DataTypes.TEXT, allowNull: true }, // Nên được lưu riêng
        // major: { type: DataTypes.STRING(100), allowNull: true, }, // Đã chuyển sang bảng Education
        // university: { type: DataTypes.STRING(100), allowNull: true, }, // Đã chuyển sang bảng Education
        // profileStatus và isComplete là các trường trạng thái, giữ nguyên nếu cần
        profileStatus: {
            type: DataTypes.STRING(20), 
            defaultValue: 'Nháp',
        },
        isComplete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        
    }, {
        tableName: 'Students', // Tên bảng trong database
        timestamps: true,
    });
    
    // ĐỊNH NGHĨA CÁC MỐI QUAN HỆ (ASSOCIATIONS)
    Student.associate = (models) => {
        // Mối quan hệ One-to-Many với các bảng phụ
        Student.hasMany(models.Education, { foreignKey: 'studentId', as: 'education' }); // BƯỚC 3
        Student.hasMany(models.Language, { foreignKey: 'studentId', as: 'languages' }); // BƯỚC 4
        Student.hasMany(models.Experience, { foreignKey: 'studentId', as: 'experiences' }); // BƯỚC 5
        Student.hasMany(models.Reference, { foreignKey: 'studentId', as: 'references' }); // BƯỚC 6
        Student.hasMany(models.Skill, { foreignKey: 'studentId', as: 'skills' }); // BƯỚC 7
        Student.hasMany(models.DesiredIndustry, { foreignKey: 'studentId', as: 'desiredIndustries' }); // BƯỚC 8 (Ngành nghề mong muốn)
        Student.hasMany(models.PreferredLocation, { foreignKey: 'studentId', as: 'preferredLocations' }); // BƯỚC 8 (Nơi làm việc)
    };

    return Student;
};