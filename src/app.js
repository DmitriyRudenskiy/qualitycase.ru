const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();

/*
app.use(ctx => {
    return ctx.body = "hello Koa"
});
*/

// error handling
app.use(async function(ctx, next) {
    try {
        await next();
    } catch (err) {
        // some errors will have .status
        // however this is not a guarantee
        ctx.status = err.status || 500;
        ctx.type = 'html';
        ctx.body = '<p>Something <em>exploded</em>, please contact Maru.</p>';

        // since we handled this manually we'll
        // want to delegate to the regular app
        // level error handling as well so that
        // centralized still functions correctly.
        ctx.app.emit('error', err, ctx);
    }
});
// response
/*
app.use(async ctx => {
    ctx.body = 'Hello World';
});
*/

router.get('/', function(ctx) {
    //return ctx.body = "hello Koa";

    ctx.send('123');
});

// 404
app.use(async function pageNotFound(ctx) {
    // we need to explicitly set 404 here
    // so that koa doesn't assign 200 on body=
    ctx.status = 404;

    switch (ctx.accepts('html', 'json')) {
        case 'html':
            ctx.type = 'html';
            ctx.body = '<p>Page Not Found</p>';
            break;
        case 'json':
            ctx.body = {
                message: 'Page Not Found'
            };
            break;
        default:
            ctx.type = 'text';
            ctx.body = 'Page Not Found';
    }
});

module.exports.default = app;
