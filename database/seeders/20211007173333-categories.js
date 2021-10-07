'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('categories', [
            {
                parent: null,
                position: 10,
                title: 'Отзывы',
                slug: 'review',
                visible: true
            },
            {
                parent: null,
                position: 20,
                title: 'Справочник',
                slug: 'handbook',
                visible: true
            },
            {
                parent: null,
                position: 30,
                title: 'Подсказки',
                slug: 'tips',
                visible: true
            },
            {
                parent: null,
                position: 40,
                title: 'Закладки',
                slug: 'bookmarks',
                visible: true
            },
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};





