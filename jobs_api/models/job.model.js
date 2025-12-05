module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    jobId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    employerId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    industryId: { 
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    jobLevelId: { 
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    jobTypeId: { 
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    requirements: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
    },
    experience: {
        type: DataTypes.STRING(50), 
        allowNull: true,
    },
    academicLevel: {
        type: DataTypes.STRING(50), 
        allowNull: true,
    },
    workingHours: {
        type: DataTypes.STRING(50), 
        allowNull: true,
    },
    benefits: {
        type: DataTypes.TEXT, 
        allowNull: true,
    },
    tags: {
        type: DataTypes.STRING(255), 
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING(20), 
        allowNull: true,
    },

    deadline: {
        type: DataTypes.DATE,
        allowNull: true, 
    },
    salary: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    postDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    status: { 
        type: DataTypes.STRING(20),
        allowNull: true,
    }
  });

  // ================= ASSOCIATIONS ==================
  Job.associate = function(models) {

    // ✔ Job → Employer (1 - n)
    Job.belongsTo(models.Employer, {
        foreignKey: 'employerId',
        as: 'employer'
    });

    // ✔ Job → Category (industry)
    Job.belongsTo(models.Category, {
        foreignKey: 'industryId',
        as: 'industryCategory'
    });

    // ✔ Job → Category (job level)
    Job.belongsTo(models.Category, {
        foreignKey: 'jobLevelId',
        as: 'jobLevelCategory'
    });

    // ✔ Job → Category (job type)
    Job.belongsTo(models.Category, {
        foreignKey: 'jobTypeId',
        as: 'jobTypeCategory'
    });
  };

  return Job;
};
