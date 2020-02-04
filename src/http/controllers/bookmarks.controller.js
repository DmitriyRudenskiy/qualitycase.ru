const BookmarksController = {}
module.exports = BookmarksController

BookmarksController.index = async ctx => {
    ctx.body = await ctx.render('bookmarks/index')
}
