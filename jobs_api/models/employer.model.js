// File: jobs-api/models/employer.model.js (PHIÊN BẢN HOÀN CHỈNH)

module.exports = (sequelize, DataTypes) => {
  const Employer = sequelize.define('Employer', {
    employerId: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        unique: true, 
        references: { model: 'Users', key: 'id' }, 
        onDelete: 'CASCADE', 
    }, 
    companyName: { 
        type: DataTypes.STRING(255), 
        allowNull: false, 
    },
    companyDescription: { 
        type: DataTypes.TEXT, 
        allowNull: true,
    },
    companyAddress: { 
        type: DataTypes.STRING(255), 
        allowNull: true,
    },
    
    // --- CÁC TRƯỜNG BỔ SUNG CHO CHỨC NĂNG ADMIN ---
    contactEmail: { 
        type: DataTypes.STRING(255), 
        allowNull: false, 
        unique: true,
    }, 
     logoUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    city: { 
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    isVerified: { // Trạng thái Phê duyệt/Từ chối
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    rejectionReason: { // Lý do từ chối phê duyệt
        type: DataTypes.TEXT,
        allowNull: true,
    },
    // --------------------------------------------------------
    
    phoneNumber: { 
        type: DataTypes.STRING(255), 
        allowNull: true,
    },
    website: { 
        type: DataTypes.STRING(100), 
        allowNull: true,
    },
  });

  Employer.associate = function(models) {
    // Association 1-1 với User
    Employer.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

  Employer.hasMany(models.Job, {
    foreignKey: 'employerId',
    as: 'jobs',
    onDelete: 'CASCADE'
});
  };
  
  return Employer;
};