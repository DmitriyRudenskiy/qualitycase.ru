import Model from './db'

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Category.init({
        parent: DataTypes.INTEGER,
        position: DataTypes.INTEGER,
        title: DataTypes.STRING,
        slug: DataTypes.STRING,
        visible: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'Category',
    });
    return Category;
};