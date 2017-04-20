/**
 * Created by liqian on 2017/3/15.
 */

var Post = require('../lib/mongo').Post;

module.exports = {
    /**
     * 发布文章
     * @param content   文章数据对象
     */
    create: function (content) {
        return Post
            .create(content);
    },

    /**
     * 查询文章列表——分页
     * @param limit 每页数量
     * @param skip  跳过的数量
     */
    getPostsList: function (limit, skip) {
        return Post
            .find({ status: 1 })
            .populate({ path: 'category', model: 'FrontMenu' })
            .skip(skip)
            .limit(limit)
            .sort({ releaseTime: -1 });
    },
    /**
     * 查询文章列表——分页（包含隐藏）
     * @param limit 每页数量
     * @param skip  跳过的数量
     */
    getPostsListAll: function (limit, skip) {
        return Post
            .find()
            .populate({ path: 'category', model: 'FrontMenu' })
            .skip(skip)
            .limit(limit)
            .sort({ releaseTime: -1 });
    },

    /**
     * 根据类型id获取文章列表——分页
     * @param category  分类类型
     * @param limit     每页数量
     * @param skip      跳过的数量
     */
    getPostsByCategory: function (category, limit, skip) {
        return Post
            .find({ category: category, status: 1 })
            .populate({ path: 'category', model: 'FrontMenu' })
            .skip(skip)
            .limit(limit)
            .sort({ releaseTime: -1 });
    },

    /**
     * 根据类型id获取文章列表——分页（包含隐藏）
     * @param category  分类类型
     * @param limit     每页数量
     * @param skip      跳过的数量
     */
    getPostsByCategoryAll: function (category, limit, skip) {
        return Post
            .find({ category: category })
            .populate({ path: 'category', model: 'FrontMenu' })
            .skip(skip)
            .limit(limit)
            .sort({ releaseTime: -1 });
    },

    /**
     * 获取文章总数
     * @returns 总条数
     */
    getPostsCounts: function () {
        return Post
            .count({ status: 1 });
    },

    /**
     * 获取文章总数（包含隐藏）
     * @returns 总条数
     */
    getPostsCountsAll: function () {
        return Post
            .count();
    },

    /**
     * 根据分类获取文章总数
     * @param category      分类类型
     * @returns             总条数
     */
    getPostsCountsByCategory: function (category) {
        return Post
            .count({ category:  category, status: 1 })
    },

    /**
     * 根据分类获取文章总数（包含隐藏）
     * @param category      分类类型
     * @returns             总条数
     */
    getPostsCountsByCategoryAll: function (category) {
        return Post
            .count({ category:  category })
    },

    /**
     * 通过_id获取单篇文章
     * @param _id   文章_id
     * @returns     查找到的单条数据
     */
    getPostById: function (_id) {
        return Post
            .findOne({ _id: _id, status: 1 });
    },

    /**
     * 通过_id获取单篇文章（包含隐藏）
     * @param _id   文章_id
     * @returns     查找到的单条数据
     */
    getPostByIdAll: function (_id) {
        return Post
            .findOne({ _id: _id });
    },

    /**
     * 根据指定_id更新文章内容
     * @param post  要更新的文章内容对象
     */
    updatePostById: function (content) {
        return Post
            .update({ _id: content._id }, {$set: content});
    },

    /**
     * 根据指定_id删除文章
     * @param _id   文章_id
     */
    deletePostById: function (_id) {
        return Post
            .remove({ _id: _id });
    },

    /**
     * 根据指定文章类型删除文章
     * @param category  文章类型
     */
    deletePostByCategory: function (category) {
        return Post
            .remove({ category: category });
    },

    /**
     * 文章阅读次数加1
     * @param _id   文章 _id
     */
    addPostViewCount: function (_id) {
        return Post
            .update({ _id: _id }, {$inc: {
                views: 1
            }})
    },

    /**
     * 根据关键词进行模糊查询（对文章标题和关键词两个字段进行忽略大小的模糊查询）
     * @param keyword   关键词
     * @returns {Query}
     */
    getPostByKeyword: function (keyword) {
        var query = new RegExp("^.*" + keyword + ".*$", "i");
        return Post
            .find({ $or: [{ title: query }, { keywords: query }] })
            .populate({ path: 'category', model: 'FrontMenu' })
            .sort({ releaseTime: -1 });
    }
};