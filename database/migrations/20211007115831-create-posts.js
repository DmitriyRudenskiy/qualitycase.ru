'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Posts', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                categoryId: {
                    type: Sequelize.INTEGER,
                    default: 10
                },
                title: {
                    type: Sequelize.STRING
                },
                slug: {
                    type: Sequelize.STRING
                },
                body: {
                    type: Sequelize.TEXT
                },
                position: {
                    type: Sequelize.INTEGER,
                    default: 10
                },
                visible: {
                    type: Sequelize.BOOLEAN,
                    default: false
                }
            },
            {
              underscored: true
            }
        );
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Posts');
    }
};