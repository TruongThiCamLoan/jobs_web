// jobs-api/models/category.model.js

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },

        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "INDUSTRY"   // ✔️ Tự động gán INDUSTRY khi tạo mới
        },

        name: { 
            type: DataTypes.STRING(100), 
            allowNull: false,
            unique: 'unique_category_per_type'
        },

        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    });

    Category.associate = function(models) {
        // associations nếu cần
    };

    return Category;
};
