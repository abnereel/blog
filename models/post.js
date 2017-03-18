/**
 * Created by liqian on 2017/3/15.
 */

var Post = require('../lib/mongo').Post;

module.exports = {
    //发布文章
    create: function (content) {
        return Post
            .create(content);
    },

    //获取文章列表
    getPostsList: function () {
        return Post
            .find()
            .populate({ path: 'category', model: 'FrontMenu' })
            .sort({ releaseTime: -1 });
    },

    //通过_id获取单篇文章
    getPostById: function (_id) {
        return Post
            .findOne({ _id: _id });
    },

    //根据指定_id更新文章内容
    updatePostById: function (post) {
        return Post
            .update({ _id: post._id }, {$set: {
                category: post.category,
                title: post.title,
                releaseTime: post.releaseTime,
                source: post.source,
                keywords: post.keywords,
                excerpt: post.excerpt,
                content: post.content,
                status: post.status,
                author: post.author,
            }});
    },

    //根据指定_id删除文章
    deletePostById: function (_id) {
        return Post
            .remove({ _id: _id });
    },

    //根据类型获取文章列表
    getPostsByCategory: function (category) {
        return Post
            .find({ category: category })
            .sort({ releaseTime: -1 });
    }
};