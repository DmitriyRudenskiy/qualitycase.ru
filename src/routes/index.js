const Router = require('koa-router');
const router = new Router();

router.get('/', (ctx, next) => {
    return ctx.render('home/index');
});

router.get('/123', (ctx, next) => {
    return ctx.body = "I work!";
});

module.exports = router;