const ReviewController = {}
module.exports = ReviewController

ReviewController.index = async (ctx) => {
    ctx.body = await ctx.render('review/index')
}
