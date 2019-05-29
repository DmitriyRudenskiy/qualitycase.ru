import path from 'path'
import Koa from 'koa'
import koaBody from 'koa-body'
import helmet from 'koa-helmet'
import serve from 'koa-static'
import render from 'koa-swig'
import co from 'co'
import router from './http/routers'

const app = new Koa()
    .use(serve(path.join(__dirname, '/../public')))
    .use(helmet())
    .use(koaBody()
    .use(router.routes())
    .use(router.allowedMethods())

app.context.router = router

app.context.render = co.wrap(
    render({
        root: path.join(__dirname, './views'),
        autoescape: true,
        cache: false, // 'memory', // disable, set to false
        ext: 'twig',
        writeBody: false,
        locals: {
            route: function(name, params) {
                return router.url(name, params)
            }
        }
    })
)

// error
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.status = err.status || 500
        ctx.message = err.message || 'Sorry, an error has occurred.'
    }
})

module.exports = app
