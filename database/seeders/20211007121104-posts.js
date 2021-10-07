'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('posts', [
            {
                slug: 'design-patterns-in-php'
            },
            {
                slug: 'download-image-php'
            },
            {
                slug: 'history-php'
            },
            {
                slug: 'monitorim-sql-zaprosyi-v-realnom-vremeni'
            },
            {
                slug: 'mvc-php-best-practices'
            },
            {
                slug: 'php-best-practices'
            },
            {
                slug: 'oop-php'
            },
            {
                slug: 'type-hint-vh php'
            },
            {
                slug: 'firstornew-firstorcreate-firstor-updateorcreate',
                title: 'Методы firstOrNew, firstOrCreate, firstOr и updateOrCreate'
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


