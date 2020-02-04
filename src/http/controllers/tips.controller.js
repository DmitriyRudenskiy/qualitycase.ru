const TipsController = {}
module.exports = TipsController

TipsController.index = async ctx => {
    ctx.body = await ctx.render('tips/index')
}
