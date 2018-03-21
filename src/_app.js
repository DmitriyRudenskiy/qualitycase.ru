import Koa from 'koa';
import api from './api';
import config from './config';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';

const session = require('koa-session');
const CSRF = require('koa-csrf');

const app = new Koa()
    .use(cors())
    .use(async (ctx, next) => {
    ctx.state.collections = config.collections;
ctx.state.authorizationHeader = `Key ${config.key}`;
await next();
})
.use(bodyParser())
    .use(api.routes())
    .use(api.allowedMethods());


var helmet = require('helmet');
app.use(helmet());

// look ma, error propagation!

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

app.use(async function() {
    throw new Error('boom boom');
});

// error handler

app.on('error', function(err) {
    if (process.env.NODE_ENV != 'test') {
        console.log('sent error %s to the cloud', err.message);
        console.log(err);
    }
});


// bodyparser

// csrf middleware
app.use(new CSRF());

// route
app.use(router.routes());