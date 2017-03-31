/**
 * Created by liqian on 2017/3/13.
 */
var path = require('path');
var express = require('express');
var router = express.Router();
var ueditor = require('ueditor');
var PostModel = require('../../models/post');
var dateformat = require('dateformat');
var config = require('config-lite');
var Common = require('../../lib/Common');
var xss = require('xss');

//文章列表页
router.get('/', function (req, res, next) {

    var page = req.query.page ? (Math.abs(parseInt(req.query.page)) > 0 ? Math.abs(parseInt(req.query.page)) : 1) : 1;
    page = xss(page);
    if (isNaN(page)) {
        return next(new Error('类型错误'));
    }
    var limit = config.page.behindLimit;
    var skip = page ? (page-1)*limit : 0;

    var list = [
        PostModel.getPostsCounts(),
        PostModel.getPostsList(limit, skip)
    ];

    Promise
        .all(list)
        .then(function (data) {
            var counts = data[0];
            var result = data[1];
            var paging = Common.paging(page, counts, limit, '/admin/content/post', '?page', 5);
            result.forEach(function (item) {
                item.date = dateformat(new Date(item.releaseTime).getTime(), 'yyyy-mm-dd HH:MM:ss');
            });

            res.render('admin/post/list', {
                posts: result,
                paging: paging,
                category: 0
            });
        })
        .catch(next);
});

//根据类型获取文章列表
router.get('/category/:category', function (req, res, next) {

    var page = req.query.page ? (Math.abs(parseInt(req.query.page)) > 0 ? Math.abs(parseInt(req.query.page)) : 1) : 1;
    page = xss(page);
    if (isNaN(page)) {
        return next(new Error('类型错误'));
    }
    var limit = config.page.behindLimit;
    var skip = page ? (page-1)*limit : 0;
    var category = xss(req.params.category);

    var list = [
        PostModel.getPostsCountsByCategory(category),
        PostModel.getPostsByCategory(category, limit, skip)
    ];

    Promise
        .all(list)
        .then(function (data) {
            var counts = data[0];
            var result = data[1];
            var paging = Common.paging(page, counts, limit, '/admin/content/post/category/'+category, '?page', 5);
            result.forEach(function (item) {
                item.date = dateformat(new Date(item.releaseTime).getTime(), 'yyyy-mm-dd HH:MM:ss');
            });

            res.render('admin/post/list', {
                posts: result,
                paging: paging,
                category: category
            });
        })
        .catch(next);
});

//添加文章页
router.get('/add', function (req, res, next) {
    res.render('admin/post/add');
});

//发布文章
router.post('/add', function (req, res, next) {

    var post = {
        category: xss(req.body.category),
        title: xss(req.body.title),
        releaseTime: new Date(xss(req.body.releaseTime)).getTime(),
        keywords: xss(req.body.keywords),
        source: xss(req.body.source),
        excerpt: xss(req.body.excerpt),
        content: xss(req.body.content),
        author: xss('Abner'),
    };

    PostModel
        .create(post)
        .then(function () {
            req.flash('success', '发布成功');
            res.redirect('/admin/content/post/add');
        })
        .catch(function (e) {
            req.flash('error', '发布失败');
            res.redirect('/admin/content/post/add');
            next(e);
        });
});

//编辑文章页
router.get('/edit/:_id', function (req, res, next) {

    var _id = req.params._id;
    PostModel
        .getPostById(_id)
        .then(function (result) {
            result.date = dateformat(new Date(result.releaseTime).getTime(), 'yyyy-mm-dd HH:MM:ss');
            //result.content = Common.html_decode(result.content);
            res.render('admin/post/edit',{
                post: result
            });
        })
        .catch(next);
});

//更新文章
router.post('/edit/:_id', function (req, res, next) {

    var post = {
        _id: xss(req.body._id),
        category: xss(req.body.category),
        title: xss(req.body.title),
        releaseTime: xss(req.body.releaseTime),
        source: xss(req.body.source),
        keywords: xss(req.body.keywords),
        excerpt: xss(req.body.excerpt),
        content: xss(req.body.content),
        status: xss(req.body.status),
        author: xss('Abner丶Lee'),
    };

    PostModel
        .updatePostById(post)
        .then(function () {
            req.flash('success', '更新成功');
            res.redirect('/admin/content/post/edit/'+req.body._id);
        })
        .catch(function (e) {
            req.flash('error', '更新失败');
            res.redirect('/admin/content/post');
            next(e);
        });
});

//删除文章
router.get('/del/:_id', function (req, res, next) {

    var _id = xss(req.params._id);
    PostModel
        .deletePostById(_id)
        .then(function () {
            req.flash('success', '删除成功');
            res.redirect('/admin/content/post');
        })
        .catch(function (e) {
            req.flash('error', '删除失败');
            res.redirect('/admin/content/post');
            next(e);
        });
})



//编辑器
router.use("/ueditor/ue", ueditor('public', function(req, res, next) {

    var imgDir = '/uploads/ueditor/img/' //默认上传地址为图片
    var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir;//默认上传地址为图片
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/uploads/ueditor/file/'; //附件保存地址
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/uploads/ueditor/video/'; //视频保存地址
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //客户端发起图片列表请求
    else if (ActionType === 'listimage'){

        res.ue_list(imgDir);  // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/javascripts/ueditor/ueditor.config.json')
    }
}));

module.exports = router;