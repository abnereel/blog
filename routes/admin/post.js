/**
 * Created by liqian on 2017/3/13.
 */
var path = require('path');
var express = require('express');
var router = express.Router();
var ueditor = require('ueditor');
var PostModule = require('../../models/post');
var dateformat = require('dateformat');

//文章列表页
router.get('/', function (req, res, next) {

    PostModule
        .getPostsList()
        .then(function (result) {
            result.forEach(function (item) {
                item.date = dateformat(new Date(item.releaseTime).getTime(), 'yyyy-mm-dd HH:MM:ss');
            });
            res.render('admin/post/list', {
                posts: result
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
        category: req.body.category,
        title: req.body.title,
        releaseTime: new Date(req.body.releaseTime).getTime(),
        keywords: req.body.keywords,
        source: req.body.source,
        excerpt: req.body.excerpt,
        content: req.body.content,
        author: 'Abner',
    };
    PostModule
        .create(post)
        .then(function () {
            req.flash('success', '发布成功');
            res.redirect('/admin/post/add');
        })
        .catch(function (e) {
            req.flash('error', '发布失败');
            res.redirect('/admin/post/add');
            next(e);
        });
});

//编辑文章页
router.get('/edit/:_id', function (req, res, next) {

    var _id = req.params._id;
    PostModule
        .getPostById(_id)
        .then(function (result) {
            result.date = dateformat(new Date(result.releaseTime).getTime(), 'yyyy-mm-dd HH:MM:ss');
            res.render('admin/post/edit',{
                post: result
            });
        })
        .catch(next);
});

//更新文章
router.post('/edit/:_id', function (req, res, next) {

    var post = {
        _id: req.body._id,
        category: req.body.category,
        title: req.body.title,
        releaseTime: req.body.releaseTime,
        source: req.body.source,
        keywords: req.body.keywords,
        excerpt: req.body.excerpt,
        content: req.body.content,
        status: req.body.status,
        author: 'Abner丶Lee',
    };

    PostModule
        .updatePostById(post)
        .then(function () {
            req.flash('success', '更新成功');
            res.redirect('/admin/post/edit/'+req.body._id);
        })
        .catch(function (e) {
            req.flash('error', '更新失败');
            res.redirect('/admin/post');
            next(e);
        });
});

//删除文章
router.get('/del/:_id', function (req, res, next) {

    var _id = req.params._id;
    PostModule
        .deletePostById(_id)
        .then(function () {
            req.flash('success', '删除成功');
            res.redirect('/admin/post');
        })
        .catch(function (e) {
            req.flash('error', '删除失败');
            res.redirect('/admin/post');
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