const IndexController = {}
module.exports = IndexController

IndexController.index = async (ctx, next) => {
    //const model = await carModel.findById(ctx.params.id)

    let alias = ctx.params.alias || 'first'

    alias = alias.split('-').shift()

    console.log(alias)

    ctx.body = await ctx.render('lessons/' + alias)
}
