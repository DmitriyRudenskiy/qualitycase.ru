'use strict'

require('babel-register')
require('dotenv').config()

const app = require('./app')
// const db = require('./models/db')

const PORT = parseInt(process.env.PORT, 10) || 3005
const HOST = process.env.HOST || '127.0.0.1'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

/*
app.get('/test', (req, res) => {
    db.sequelize
        .authenticate()
        .then(() => {
            res.json({
                type: 'success',
                message: 'MYSQL: Connection has been established successfully.',
            })
        })
        .catch(error => {
            res.status(500).json({ type: 'error', error })
        })
})
*/

const server = app.listen(PORT, HOST, () => {
    console.log(
        'App listening at http://%s:%s',
        server.address().address,
        server.address().port
    )
})
