import Sequelize from 'sequelize'

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_CONNECTION,
        operatorsAliases: false,
        insecureAuth: true,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
            underscored: true,
            freezeTableName: false,
            charset: 'utf8',
            dialectOptions: {
                collate: 'utf8_general_ci'
            },
            timestamps: true
        }
    }
)

module.exports = {sequelize}
