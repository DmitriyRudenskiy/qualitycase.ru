const IndexController = {}
module.exports = IndexController

IndexController.index = async (ctx, next) => {
    ctx.body = await ctx.render('home/index')
}
