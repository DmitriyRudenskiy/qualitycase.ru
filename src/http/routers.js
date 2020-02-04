import Router from 'koa-router'
import BookmarksController from './controllers/bookmarks.controller'
import HandbookController from './controllers/handbook.controller'
import IndexController from './controllers/index.controller'
import LessonsController from './controllers/lessons.controller'
import ReviewController from './controllers/review.controller'
import TipsController from './controllers/tips.controller'

const router = Router()

module.exports = router

router.get('test_ping', '/.ping', async (ctx, next) => {
    ctx.body = 'pong'
})

router.get('home', '/', IndexController.index)
router.get('lessons', '/lessons/:alias', LessonsController.index)
router.get('review_index', '/review', ReviewController.index)
router.get('bookmarks_index', '/bookmarks', BookmarksController.index)
router.get('handbook_index', '/handbook', HandbookController.index)
router.get('tips_index', '/tips', TipsController.index)
