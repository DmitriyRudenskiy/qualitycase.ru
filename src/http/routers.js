import Router from 'koa-router'
import IndexController from './controllers/index.controller'
import LessonsController from './controllers/lessons.controller'
import ReviewController from './controllers/review.controller'

const router = Router()

module.exports = router

router.get('test_ping', '/.ping', async (ctx, next) => {
    ctx.body = 'pong'
})

router.get('home', '/', IndexController.index)
router.get('lessons', '/lessons/:alias', LessonsController.index)
router.get('review_index', '/review', ReviewController.index)
