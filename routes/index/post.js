/**
 * Created by liqian on 2017/3/13.
 */
var express = require('express');
var router = express.Router();
var PostModel = require('../../models/post');
var FrontMenuModel = require('../../models/menu_front');
var dateformat = require('dateformat');
var async = require('async');
var Common = require('../../lib/common');
var xss = require('xss');
var config = require('config-lite');

//首页
router.get('/home', function (req, res, next) {

    var page = xss(req.query.page);
    page = page ? (Math.abs(parseInt(page)) > 0 ? Math.abs(parseInt(page)) : 1) : 1;
    if (isNaN(page)) {
        return next(new Error('类型错误'));
    }
    var limit = config.page.frontLimit;
    var skip = page ? (page-1)*limit : 0;

    var list = [
        PostModel.getPostsCounts(),
        PostModel.getPostsList(limit, skip)
    ];

    Promise
        .all(list)
        .then(function (results) {
            var counts = results[0];
            var result = results[1];
            var paging = Common.paging(page, counts, limit, '/post/home', '?page', 5);
            result.forEach(function (item) {
                item.date = dateformat(new Date(item.releaseTime).getTime(), 'yyyy-mm-dd');
            });
            //过滤博客声明
            for (var i=0; i<result.length; i++) {
                if (result[i].category) {
                    if (result[i].category.url == '/licence') {
                        result.splice(i, 1);
                    }
                }
            }

            res.render('index/post', {
                posts: result,
                paging: paging,
                counts: counts,
                frontLimit: config.page.frontLimit
            });
        })
        .catch(next);
});


//显示文章列表
router.get('/:category', function (req, res, next) {

    var page = xss(req.query.page);
    page = page ? (Math.abs(parseInt(page)) > 0 ? Math.abs(parseInt(page)) : 1) : 1;
    if (isNaN(page)) {
        return next(new Error('类型错误'));
    }
    var limit = config.page.frontLimit;
    var skip = page ? (page-1)*limit : 0;

    var url = '/post/' + xss(req.params.category);
    async.waterfall([
        function (cb) {
            FrontMenuModel
                .getMenuByUrl(url)
                .then(function (result) {
                    cb(null, result._id);
                })
                .catch(function (e) {
                    cb(e, null);
                });
        },
        function (category, cb) {
            PostModel
                .getPostsCountsByCategory(category)
                .then(function (counts) {
                    cb(null, category, counts);
                })
                .catch(function (e) {
                    cb(e, null);
                });
        },
        function (category, counts, cb) {
            PostModel
                .getPostsByCategory(category, limit, skip)
                .then(function (result) {
                    cb(null, result, category, counts);
                })
                .catch(function (e) {
                    cb(e, null);
                });
        }
    ], function (err, result, category, counts) {
        if (err) {
            //参数错误
            if (err.name.toString() == 'TypeError' || err.name.toString() == 'CastError') {
                return res.redirect('/index/404');
            }
            next(err);
        }
        var paging = Common.paging(page, counts, limit, url, '?page', 5);
        result.forEach(function (item) {
            item.date = dateformat(new Date(item.releaseTime).getTime(), 'yyyy-mm-dd');
        });
        res.render('index/post', {
            posts: result,
            paging: paging,
            counts: counts,
            frontLimit: config.page.frontLimit
        });
    });
});


//查看文章
router.get('/:category/:_id', function (req, res, next) {

    var _id = xss(req.params._id);
    //检查参数长度是否正确（ObjectId的长度固定为24位）
    if (_id.length != 24) {
        return res.redirect('/index/404');
    }

    async.parallel([
        function (cb) {
            PostModel
                .getPostById(_id)
                .then(function (result) {
                    cb(null, result);
                })
                .catch(function (e) {
                    cb(e, null);
                });
        },
        function (cb) {
            PostModel
                .addPostViewCount(_id)
                .then(function (result) {
                    cb(null, result);
                })
                .catch(function (e) {
                    cb(e, null);
                });
        }
    ], function (err, results) {
        if (err) {
            //参数错误
            if (err.name.toString() == 'TypeError' || err.name.toString() == 'CastError') {
                return res.redirect('/index/404');
            }
            next(err);
        }
        var result = results[0];
        if (result === null) {
            return res.redirect('/index/404');
        }
        result.date = dateformat(new Date(result.releaseTime).getTime(), 'yyyy-mm-dd HH:MM:ss');
        //result.content = Common.html_decode(result.content);
        res.render('index/post-view', {
            post: result
        });
    });
});

//搜索文章
router.post('/search', function (req, res, next) {

    var keyword = xss(req.body.keyword);
    if (!keyword) {
        return res.redirect('/post/home');
    }
    PostModel
        .getPostByKeyword(keyword)
        .then(function (result) {
            result.forEach(function (item) {
                item.date = dateformat(new Date(item.releaseTime).getTime(), 'yyyy-mm-dd');
            });

            res.render('index/search', {
                posts: result,
                keyword: keyword
            });
        })
        .catch(next);
});

module.exports = router;