/**
 * Created by liqian on 2017/3/29.
 */

var express = require('express');
var router = express.Router();
var UserModel = require('../../models/user');
var Common = require('../../lib/Common');
var xss = require('xss');
var md5 = require('md5');


router.get('/', function (req, res, next) {
    res.render('admin/login');
});

router.post('/', function (req, res, next) {
    var name = xss(req.body.name)
    var password = xss(req.body.password);
    var reg = new RegExp(/^\w+$/);

    try {
        console.log('try');
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
    } catch(e) {
        req.flash('error', e.message);
        return res.redirect('/admin/login');
    }

    var user = {
        name: name,
        password: md5(password)
    };

    UserModel
        .findUser(user)
        .then(function (result) {
            if (result === null) {
                req.flash('error', '用户名或密码错误');
                return res.redirect('/admin/login');
            }
            delete result.password;
            req.session.user = result;
            req.flash('success', '登录成功');
            res.redirect('/admin');
        })
        .catch(next);
});

router.get('/add', function (req, res, next) {
    var user = {
        name: 'abner',
        password: md5('11111111')
    };

    UserModel
        .addUser(user)
        .then(function (result) {
            req.flash('error', '添加成功');
            res.redirect('/admin/login');
        })
        .catch(function (e) {
            if (RegExp('duplicate key error ').test(e.errmsg.toString())) {
                req.flash('error', '账户已存在');
                return res.redirect('/admin/login');
            }
            next(e);
        });
})





























module.exports = router;