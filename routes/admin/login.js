/**
 * Created by liqian on 2017/3/29.
 */

var express = require('express');
var router = express.Router();
var UserModel = require('../../models/user');
var Common = require('../../lib/common');
var LogModel = require('../../models/log');
var xss = require('xss');
var md5 = require('md5');
var ccap = require('ccap');
var Canvas = require('canvas');
var async = require('async');

//登录页面
router.get('/', function (req, res, next) {
    var text = Common.gen_fuc(),
        canvas = new Canvas(100, 30),
        ctx = canvas.getContext('2d');

    ctx.font = '24px Impact';
    ctx.fillStyle = "#5e6b84";
    ctx.fillText(text, 0, 26, ctx.measureText(text).width);
    req.session.captcha = text;

    res.render('admin/login', {
        url: canvas.toDataURL()
    });
});

//登录提交
router.post('/', function (req, res, next) {
    var name = xss(req.body.name)
    var password = xss(req.body.password);
    var captcha = xss(req.body.captcha);
    var _csrf = xss(req.body._csrf);
    var reg = new RegExp(/^\w+$/);

    try {
        if (!(_csrf == req.session._csrf)) {
            throw new Error('Invalid Token1');
        }
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
        if (!(captcha && captcha == req.session.captcha)) {
            throw new Error('验证码不正确');
        }
    } catch(e) {
        req.flash('error', e.message);
        return res.redirect('/admin/login');
    }

    var user = {
        name: name,
        password: md5(password)
    };

    async.waterfall([
        function (cb) {
            UserModel
                .findUser(user)
                .then(function (result) {
                    if (result === null) {
                        var err = {
                            message: '用户名或密码错误'
                        };
                        return cb(err, null);
                    }
                    cb(null, result);
                })
                .catch(function (e) {
                    cb(e, null);
                });
        },
        function (result, cb) {
            var user = {
                _id: result._id,
                lastLogin: new Date()
            };
            UserModel
                .updateUser(user)
                .then(function () {
                    cb(null, result);
                })
                .catch(function (e) {
                    cb(e, null);
                });
        }
    ], function (err, result) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/admin/login');
        }
        //先将document转换成js对象
        result = result.toObject();
        delete result.password;
        req.session.user = result;
        req.session._csrf = null;
        req.flash('success', '登录成功');

        LogModel.addLog({
            nameId: req.session.user._id,
            name: req.session.user.name,
            role: req.session.user.role,
            ip: req.connection.remoteAddress,
            action: 'login',
            time: new Date()
        });
        res.redirect('/admin');
    });
});

//添加测试账号
router.get('/add', function (req, res, next) {
    //测试账号
    var user = {
        name: 'test',
        password: md5('11111111')
    };

    UserModel
        .addUser(user)
        .then(function (result) {
            req.flash('success', '添加成功');
            res.redirect('/admin/login');
        })
        .catch(function (e) {
            if (RegExp('duplicate key error ').test(e.errmsg.toString())) {
                req.flash('error', '账户已存在');
                return res.redirect('/admin/login');
            }
            next(e);
        });
});

//测试
router.post('/add', function (req, res, next) {

    var name = xss(req.body.name);
    var password = xss(req.body.password);

    //测试账号
    var user = {
        name: name,
        password: md5(password)
    };

    UserModel
        .addUser(user)
        .then(function (result) {
            res.send('添加账号成功');
            res.end();
        })
        .catch(next);
});

//测试
router.post('/del', function (req, res, next) {
    var name = xss(req.body.name);
    var password = xss(req.body.password);

    //测试账号
    var user = {
        name: name,
        password: md5(password)
    };

    UserModel
        .deleteUser(user)
        .then(function (result) {
            res.send('删除账号成功');
            res.end();
        })
        .catch(next);

});

//更新验证码
router.get('/captcha', function (req, res, next) {

    /*无法修改背景
    var captcha = ccap();
    var ary = captcha.get();
    var txt = ary[0];
    var buf = ary[1];
    req.session.captcha = txt;
    res.write(buf);
    res.end();*/

    var text = Common.gen_fuc(),
        canvas = new Canvas(100, 30),
        ctx = canvas.getContext('2d');

    ctx.font = '24px Impact';
    ctx.fillStyle = "#5e6b84";
    ctx.fillText(text, 0, 26, ctx.measureText(text).width);
    req.session.captcha = text;
    res.write(canvas.toDataURL());
    res.end();
});

module.exports = router;