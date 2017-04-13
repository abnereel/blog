/**
 * Created by liqian on 2017/3/13.
 */
var express = require('express');
var router = express.Router();
var ueditor = require('ueditor');
var PostModel = require('../../models/post');
var dateformat = require('dateformat');
var config = require('config-lite');
var Common = require('../../lib/common');
var xss = require('xss');
var multer = require('multer');


//文件上传配置（指定目录、文件名称、上传文件大小限制）
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null,  Date.now() + file.originalname);
    }
});
var limits = {
    fileSize: 10485760,
    files: 1
};


//文章列表页
router.get('/', function (req, res, next) {

    var page = xss(req.query.page);
    page = page ? (Math.abs(parseInt(page)) > 0 ? Math.abs(parseInt(page)) : 1) : 1;
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
                category: 0,
                _csrf: req.session._csrf
            });
        })
        .catch(next);
});

//根据类型获取文章列表
router.get('/category/:category', function (req, res, next) {

    var page = xss(req.query.page);
    page = page ? (Math.abs(parseInt(page)) > 0 ? Math.abs(parseInt(page)) : 1) : 1;
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
    res.render('admin/post/add',{
        _csrf: req.session._csrf
    });
});

//发布文章
router.post('/add', function (req, res, next) {

    var upload = multer({ storage: storage, limits: limits }).single('imgPath');
    upload(req, res, function (err) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        } else {
            //csrf检查
            var _csrf = xss(req.body._csrf);
            if (!(_csrf == req.session._csrf)) {
                req.flash('error', 'Invalid Token');
                return res.redirect('back');
            }

            var option = xss.getDefaultWhiteList();
            for(var o in option) {
                option[o].push('style')
            }
            var myxss = new xss.FilterXSS({
                whiteList: option
            });

            var category = xss(req.body.category);
            var title = xss(req.body.title);
            var releaseTime = xss(req.body.releaseTime);
            var keywords = xss(req.body.keywords);
            var source = xss(req.body.source);
            var excerpt = xss(req.body.excerpt);
            var content = myxss.process(req.body.content);
            var author = xss(req.session.user.name);

            try {
                if (!title) {
                    throw new Error('发布失败，标题为必填选项');
                }
                if (!excerpt) {
                    throw new Error('发布失败，描述为必填选项');
                }
                if (!content) {
                    throw new Error('发布失败，内容为必填选项');
                }
                if (!releaseTime) {
                    throw new Error('发布失败，发布时间为必填选项');
                }
            } catch (e) {
                req.flash('error', e.message);
                return res.redirect('back');
            }

            var post = {
                category: category,
                title: title,
                releaseTime: releaseTime,
                keywords: keywords,
                source: source,
                excerpt: excerpt,
                content: content,
                author: author,
            };

            if (req.file) {
                post.imgPath = xss(req.file.path).substr(6);//去掉public，否则前端显示会有问题
            }

            PostModel
                .create(post)
                .then(function () {
                    req.flash('success', '发布成功');
                    res.redirect('/admin/content/post/add');
                })
                .catch(function (e) {
                    req.flash('error', '发布失败，' + e.message);
                    res.redirect('back');
                });
        }
    });
});

//编辑文章页
router.get('/edit/:_id', function (req, res, next) {

    var _id = xss(req.params._id);
    PostModel
        .getPostById(_id)
        .then(function (result) {
            result.date = dateformat(new Date(result.releaseTime).getTime(), 'yyyy-mm-dd HH:MM:ss');
            res.render('admin/post/edit',{
                post: result,
                _csrf: req.session._csrf
            });
        })
        .catch(next);
});

//更新文章
router.post('/edit/:_id', function (req, res, next) {

    var upload = multer({ storage: storage, limits: limits }).single('imgPath');
    upload(req, res, function (err) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        } else {
            //csrf检查
            var _csrf = xss(req.body._csrf);
            if (!(_csrf == req.session._csrf)) {
                req.flash('error', 'Invalid Token');
                return res.redirect('back');
            }

            var option = xss.getDefaultWhiteList();
            for(var o in option) {
                option[o].push('style')
            }
            var myxss = new xss.FilterXSS({
                whiteList: option
            });

            var _id = xss(req.body._id);
            var category = xss(req.body.category);
            var title = xss(req.body.title);
            var releaseTime = xss(req.body.releaseTime);
            var keywords = xss(req.body.keywords);
            var source = xss(req.body.source);
            var excerpt = xss(req.body.excerpt);
            var content = myxss.process(req.body.content);
            var status = xss(req.body.status);
            var author = xss(req.session.user.name);

            try {
                if (!title) {
                    throw new Error('修改失败，标题为必填选项');
                }
                if (!excerpt) {
                    throw new Error('修改失败，描述为必填选项');
                }
                if (!content) {
                    throw new Error('修改失败，内容为必填选项');
                }
                if (!releaseTime) {
                    throw new Error('修改失败，发布时间为必填选项');
                }
            } catch (e) {
                req.flash('error', e.message);
                return res.redirect('back');
            }

            var post = {
                _id: _id,
                category: category,
                title: title,
                releaseTime: releaseTime,
                keywords: keywords,
                source: source,
                excerpt: excerpt,
                content: content,
                status: status,
                author: author,
            };

            if (req.file) {
                post.imgPath = xss(req.file.path).substr(6);//去掉public，否则前端显示会有问题
            }

            PostModel
                .updatePostById(post)
                .then(function () {
                    req.flash('success', '更新成功');
                    res.redirect('/admin/content/post/edit/'+req.body._id);
                })
                .catch(function (e) {
                    req.flash('error', '更新失败，' + e.message);
                    res.redirect('back');
                });
        }
    });
});

//删除文章
router.get('/del/:_id', function (req, res, next) {

    //csrf检查
    var _csrf = xss(req.query._csrf);
    console.log(_csrf);
    console.log(req.session._csrf);
    if (_csrf != req.session._csrf) {
        req.flash('error', 'Invalid Token');
        return res.redirect('back');
    }

    var _id = xss(req.params._id);

    PostModel
        .deletePostById(_id)
        .then(function () {
            req.flash('success', '删除成功');
            res.redirect('/admin/content/post');
        })
        .catch(function (e) {
            req.flash('error', '删除失败，' + e.message);
            res.redirect('/admin/content/post');
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