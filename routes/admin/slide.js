/**
 * Created by liqian on 2017/4/12.
 */
var express = require('express');
var router = express.Router();
var Common = require('../../lib/Common');
var xss = require('xss');
var config = require('config-lite');
var SlideModel = require('../../models/slide');
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


//幻灯片列表页
router.get('/', function (req, res, next) {

    var page = xss(req.query.page);
    page = page ? (Math.abs(parseInt(page)) > 0 ? Math.abs(parseInt(page)) : 1) : 1;
    if (isNaN(page)) {
        return next(new Error('类型错误'));
    }
    var limit = config.page.behindLimit;
    var skip = page ? (page-1)*limit : 0;

    var list = [
        SlideModel.getSlideCounts(),
        SlideModel.getSlidesList(limit, skip)
    ];

    Promise
        .all(list)
        .then(function (data) {
            var counts = data[0];
            var result = data[1];
            var paging = Common.paging(page, counts, limit, '/admin/content/slide', '?page', 5);

            res.render('admin/slide/list', {
                slides: result,
                paging: paging,
                _csrf: req.session._csrf
            });
        })
        .catch(next);
})

//添加幻灯片页
router.get('/add', function (req, res, next) {
    res.render('admin/slide/add', {
        _csrf: req.session._csrf
    });
});

//添加幻灯片
router.post('/add', function (req, res, next) {

    var upload = multer({ storage: storage, limits: limits }).single('imgPath');
    upload(req, res, function (err) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        } else {
            //csrf检查
            var _csrf = xss(req.body._csrf);
            if (_csrf != req.session._csrf) {
                req.flash('error', 'Invalid Token');
                return res.redirect('back');
            }
            //xss过滤
            var name = xss(req.body.name);
            var category = xss(req.body.category);
            var url = xss(req.body.url);
            var excerpt = xss(req.body.excerpt);
            var status = xss(req.body.status);
            var listOrder = xss(req.body.listOrder);

            //服务端检测数据
            try {
                if (!name) {
                    throw new Error('添加失败，标题为必填选项');
                }
                if (!category) {
                    throw new Error('添加失败，分类标识为必填选项');
                }
            } catch(e) {
                req.flash('error', e.message);
                return res.redirect('back');
            }

            var slide = {
                name: name,
                category: category,
                url: url,
                excerpt: excerpt,
                status: status,
                listOrder: listOrder
            };

            //判断是否上传图片
            if (req.file) {
                slide.imgPath = req.file.path.substr(6);//去掉public，否则前端显示会有问题
            }

            SlideModel
                .saveSlide(slide)
                .then(function (result) {
                    req.flash('success', '添加成功');
                    res.redirect('/admin/content/slide/add');
                })
                .catch(function (e) {
                    req.flash('error', '添加失败，' + e.message);
                    res.redirect('back');
                });
        }
    });
});

//编辑幻灯片
router.get('/edit/:_id', function (req, res, next) {

    var _id = xss(req.params._id);

    SlideModel
        .getSlideById(_id)
        .then(function (result) {
            if (!result) {
                req.flash('error', '参数不正确，数据不存在！');
                res.redirect('back');
            }

            res.render('admin/slide/edit', {
                slide: result,
                _csrf: req.session._csrf
            });
        })
        .catch(next);
});

//更新幻灯片
router.post('/edit/:_id', function (req, res, next) {

    var upload = multer({ storage: storage, limits: limits }).single('imgPath');
    upload(req, res, function (err) {
        if (err) {
            req.flash('error', '修改失败，' + err.message);
            res.redirect('back');
        } else {
            //csrf检查
            var _csrf = xss(req.body._csrf);
            if (!(_csrf == req.session._csrf)) {
                req.flash('error', 'Invalid Token');
                return res.redirect('back');
            }

            //xss过滤
            var _id = xss(req.body._id);
            var name = xss(req.body.name);
            var category = xss(req.body.category);
            var url = xss(req.body.url);
            var excerpt = xss(req.body.excerpt);
            var status = xss(req.body.status);
            var listOrder = xss(req.body.listOrder);

            //服务端检测数据
            try {
                if (!name) {
                    throw new Error('修改失败，标题为必填选项');
                }
                if (!category) {
                    throw new Error('修改失败，分类标识为必填选项');
                }
            } catch(e) {
                req.flash('error', e.message);
                return res.redirect('back');
            }

            var slide = {
                _id: _id,
                name: name,
                category: category,
                url: url,
                excerpt: excerpt,
                status: status,
                listOrder: listOrder
            };

            //判断是否上传图片
            if (req.file) {
                slide.imgPath = req.file.path.substr(6);//去掉public，否则前端显示会有问题
            }

            SlideModel
                .updateSlideById(slide)
                .then(function (result) {
                    req.flash('success', '修改成功');
                    res.redirect('/admin/content/slide/edit/' + _id);
                })
                .catch(function (e) {
                    req.flash('error', '修改失败，' + e.message);
                    res.redirect('back');
                });
        }
    });
});

//删除幻灯片
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

    SlideModel
        .deleteSlideById(_id)
        .then(function (result) {
            req.flash('success', '删除成功');
            res.redirect('/admin/content/slide');
        })
        .catch(function (e) {
            req.flash('error', '删除失败，' + e.message);
            res.redirect('/admin/content/slide');
        });
})

module.exports = router;