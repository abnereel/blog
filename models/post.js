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
     * @param where 查询条件
     * @param limit 每页数量
     * @param skip  跳过的数量
     */
    getPostsList: function (where, limit, skip) {
        return Post
            .find(where)
            .populate({ path: 'category', model: 'FrontMenu' })
            .skip(skip)
            .limit(limit)
            .sort({ releaseTime: -1 });
    },

    /**
     * 获取文章总数
     * @param where  查询条件
     */
    getPostsCounts: function (where) {
        return Post
            .count(where);
    },

    /**
     * 获取单篇文章
     * @param where  查询条件
     */
    getPost: function (where) {
        return Post
            .findOne(where);
    },

    /**
     * 更新文章内容
     * @param post  要更新的文章内容对象
     */
    updatePost: function (content) {
        return Post
            .update({ _id: content._id }, {$set: content});
    },

    /**
     * 删除文章
     * @param where  查询条件
     */
    deletePost: function (where) {
        return Post
            .remove(where);
    },

    /**
     * 文章阅读次数加1
     * @param where  查询条件
     */
    addPostViewCount: function (where) {
        return Post
            .update(where, {$inc: {
                views: 1
            }})
    },

    /**
     * 根据关键词进行模糊查询（对文章标题和关键词两个字段进行忽略大小的模糊查询）
     * @param keyword   关键词
     */
    getPostByKeyword: function (where) {
        return Post
            .find(where)
            .populate({ path: 'category', model: 'FrontMenu' })
            .sort({ releaseTime: -1 });
    }
};