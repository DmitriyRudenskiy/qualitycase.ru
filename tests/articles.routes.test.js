// Configure the environment and require Knex
const env = process.env.NODE_ENV || 'test'
const config = require('../knexfile')[env]
const server = require('../server/index')
const knex = require('knex')(config)
const PATH = '/api/v1/articles'
// Require and configure the assertion library
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
// Rollback, commit and populate the test database before each test
describe('routes: articles', () => {
    beforeEach(() => {
        return knex.migrate
            .rollback()
            .then(() => {
                return knex.migrate.latest()
            })
            .then(() => {
                return knex.seed.run()
            })
    })
    // Rollback the migration after each test
    afterEach(() => {
        return knex.migrate.rollback()
    })
    // Here comes the first test
    describe(`GET ${PATH}`, () => {
        it('should return all the resources', done => {
            chai.request(server)
                .get(`${PATH}`)
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')
                    res.body.data.length.should.eql(2)
                    res.body.data[0].should.include.keys(
                        'id',
                        'title',
                        'body',
                        'tags'
                    )
                    done()
                })
        })
    })
    /** every subsequent test must be added here !! **/
})
