'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Posts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Posts.init({
        title: DataTypes.STRING,
        slug: DataTypes.STRING,
        body: DataTypes.TEXT,
        position: DataTypes.INTEGER,
        visible: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'Posts',
    });
    return Posts;
};