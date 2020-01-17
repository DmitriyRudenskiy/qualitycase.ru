import Router from 'koa-router'
import IndexController from './controllers/index.controller'
import LessonsController from './controllers/lessons.controller'

const router = Router()

module.exports = router

router.get('test_ping', '/.ping', async (ctx, next) => {
    ctx.body = 'pong'
})

router.get('home', '/', IndexController.index)
router.get('lessons', '/lessons/:alias', LessonsController.index)

router.get('/123', (ctx, next) => {
    return (ctx.body = 'I work!')
})
