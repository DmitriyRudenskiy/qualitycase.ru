const HandbookController = {}
module.exports = HandbookController

HandbookController.index = async ctx => {
    ctx.body = await ctx.render('handbook/index')
}
