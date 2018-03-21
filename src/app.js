const Koa = require('koa');
const app = new Koa();
const path = require('path');
const render = require('koa2-swig');
const serve = require("koa-static");

// static files
app.use(serve( "../public"));

// render
app.context.render = render({
    root: path.join(__dirname, 'views'),
    autoescape: true,
    cache: false,
    ext: 'twig'
});

// response
const router = require('./routes/index');
app.use(router.routes());
app.use(router.allowedMethods());

module.exports.default = app;
