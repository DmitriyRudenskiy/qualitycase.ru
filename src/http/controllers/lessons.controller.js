const IndexController = {}
module.exports = IndexController

IndexController.index = async (ctx, next) => {
    let alias = ctx.params.alias || 'first'

    alias = alias.split('-').shift()

    ctx.body = await ctx.render('lessons/' + alias)
}
