/**
 * Created by liqian on 2017/4/25.
 */
var express = require('express');
var router = express.Router();
var UserModel = require('../../models/user');
var LogModel = require('../../models/log');
var xss = require('xss');
var config = require('config-lite');
var Common = require('../../lib/common');
var dateformat = require('dateformat');
var md5 = require('md5');
var async = require('async');


//用户列表
router.get('/', function (req, res, next) {

    var page = xss(req.query.page);
    page = page ? (Math.abs(parseInt(page)) > 0 ? Math.abs(parseInt(page)) : 1) : 1;
    if (isNaN(page)) {
        return next(new Error('类型错误'));
    }
    var limit = config.page.behindLimit;
    var skip = page ? (page-1)*limit : 0;

    var list = [
        UserModel.getUsersCounts(),
        UserModel.getUsersList(null, limit, skip)
    ];

    Promise
        .all(list)
        .then(function (data) {
            var counts = data[0];
            var result = data[1];
            var paging = Common.paging(page, counts, limit, '/admin/user', '?page', 5);
            result.forEach(function (item) {
                switch(item.role) {
                    case 1:
                        item.roleName = '测试账号';
                        break;
                    case 9:
                        item.roleName = '管理员账号';
                        break;
                    default:
                        item.roleName = '异常账号';
                }
                if (item.lastLogin) {
                    item.lastLoginTime = dateformat(item.lastLogin, 'yyyy-mm-dd HH:MM:ss');
                }
            });

            res.render('admin/user/list', {
                users: result,
                paging: paging
            });
        })
        .catch(next);
});

//添加用户页
router.get('/add', function (req, res, next) {
    res.render('admin/user/add');
});


//添加用户
router.post('/add', function (req, res, next) {

    //csrf检查
    var _csrf = xss(req.body._csrf);
    if( _csrf != req.session._csrf ) {
        req.flash('error', 'Invalid Token');
        return res.redirect('back');
    }

    //xss过滤数据
    var name = xss(req.body.name);
    var password = xss(req.body.password);
    var confirmPassword = xss(req.body.confirmPassword);
    var role = xss(req.body.role);
    var status = xss(req.body.status);
    var reg = new RegExp(/^\w+$/);

    try {
        if (!(name.length >= 1 && name.length <= 10)) {
            throw new Error('用户名限制在1-10个字符');
        }
        if (!(password.length >= 6 && password.length <= 18)) {
            throw new Error('密码限制在6-18个字符');
        }
        if (!reg.test(name)) {
            throw new Error('用户名只能由英文、数字、下划线组成');
        }
        if (!reg.test(password)) {
            throw new Error('密码只能由英文、数字、下划线组成');
        }
        if (!(password === confirmPassword)) {
            throw new Error('密码和确认密码必须一致');
        }
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('back');
    }

    var user = {
        name: name,
        password: md5(password),
        role: role,
        status: status
    };

    UserModel
        .addUser(user)
        .then(function () {
            req.flash('success', '添加用户成功');
            res.redirect('/admin/user/add');
        })
        .catch(next);
});

//编辑用户页
router.get('/edit/:_id', function (req, res, next) {

    var _id = xss(req.params._id);
    var where = {
        _id: _id
    };

    UserModel
        .findUser(where)
        .then(function (result) {
            if (result === null) {
                req.flash('error', '此用户不存在');
                res.redirect('back');
            }
            res.render('admin/user/edit',{
                user: result
            });
        })
        .catch(next);


});

//更新用户信息
router.post('/edit/:id', function (req, res, next) {

    //csrf检查
    var _csrf = xss(req.body._csrf);
    if( _csrf != req.session._csrf ) {
        req.flash('error', 'Invalid Token');
        return res.redirect('back');
    }

    //xss过滤数据
    var _id = xss(req.body._id);
    var name = xss(req.body.name);
    var password = xss(req.body.password);
    var confirmPassword = xss(req.body.confirmPassword);
    var role = xss(req.body.role);
    var status = xss(req.body.status);
    var reg = new RegExp(/^\w+$/);

    try {
        if (!(name.length >= 1 && name.length <= 10)) {
            throw new Error('用户名限制在1-10个字符');
        }
        if (!(password.length >= 6 && password.length <= 18)) {
            throw new Error('密码限制在6-18个字符');
        }
        if (!reg.test(name)) {
            throw new Error('用户名只能由英文、数字、下划线组成');
        }
        if (!reg.test(password)) {
            throw new Error('密码只能由英文、数字、下划线组成');
        }
        if (!(password === confirmPassword)) {
            throw new Error('密码和确认密码必须一致');
        }
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('back');
    }

    var user = {
        _id: _id,
        name: name,
        password: md5(password),
        role: role,
        status: status
    };

    UserModel
        .updateUser(user)
        .then(function () {
            //若更新的用户与当前登录的用户是同一个用户，则需退出重新登录
            if (user._id === req.session.user._id) {
                req.session.user = null;
                req.flash('success', '更新用户信息成功，请重新登录');
                res.redirect('/admin/login');
            } else {
                req.flash('success', '更新用户信息成功');
                res.redirect('/admin/user/edit/' + _id);
            }
        })
        .catch(next);
})

//删除用户
router.get('/del/:_id', function (req, res, next) {

    //csrf检查
    var _csrf = xss(req.query._csrf);
    if( _csrf != req.session._csrf ) {
        req.flash('error', 'Invalid Token');
        return res.redirect('back');
    }

    //xss过滤数据
    var _id = xss(req.params._id);
    var where = {
        _id: _id
    };


    async.waterfall([
        function (cb) {
            UserModel
                .findUser(where)
                .then(function (result) {
                    if (result === null) {
                        var err = {
                            message: '删除失败，此用户不存在'
                        };
                        return cb(err, null);
                    }
                    if (result.name == 'admin') {
                        var err = {
                            message: 'admin用户不允许删除'
                        };
                        return cb(err, null);
                    }
                    cb(null, result);
                })
                .catch(function (e) {
                    cb(e, null);
                })
        },
        function (result, cb) {
            UserModel
                .deleteUser(result)
                .then(function (result) {
                    cb(null, result);
                })
                .catch(function (e) {
                    cb(e, null);
                })
        }
    ], function (err, result) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/admin/user');
        }
        if (result._id === req.session.user._id) {
            req.session.user = null;
            req.flash('success', '删除用户成功，请重新登录');
            return res.redirect('/admin/login');
        }
        if (result.result.ok > 0 && result.result.n > 0) {
            req.flash('success', '删除用户成功');
            res.redirect('/admin/user');
        } else {
            req.flash('error', '未删除任何用户');
            res.redirect('/admin/user');
        }
    });
});


module.exports = router;