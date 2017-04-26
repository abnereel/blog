/**
 * Created by liqian on 2017/3/7.
 */
var express = require('express');
var router = express.Router();
var session = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
var config = require('config-lite');
var check = require('../../middlewares/check');
var Tokens = require('csrf');

router.use(session({
    name: config.session.key,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: config.session.maxAge
    },
    store: new MongoStore({
        url: config.mongodb
    })
}));
router.use(flash());

//模板必须的变量，connect-flash模块的通知消息
router.use(function (req, res, next) {
    if (!req.session._csrf) {
        var tokens = new Tokens();
        var secret = tokens.secretSync()
        var token = tokens.create(secret);
        req.session._csrf = token;
        //tokens.verify(secret, token);
    }
    res.locals._csrf = req.session._csrf;
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

router.use(require('../../middlewares/left_tree'));//后台左侧导航菜单
router.get('/', check.checkLogin, function (req, res, next) {res.render('admin/index');});//Dashboard
router.use('/login', check.checkNotLogin, require('./login'));//登录页
router.use('/logout', check.checkLogin, require('./logout'));//登出页
router.use('/menu/behind', check.checkLogin, require('./menu_behind'));//后台菜单页
router.use('/menu/front', check.checkLogin, require('./menu_front'));//前台菜单页
router.use('/content/post', check.checkLogin, require('./post'));//文章管理页
router.use('/content/slide', check.checkLogin, require('./slide'));//文章管理页
router.use('/content/log', check.checkLogin, require('./log'));//日志管理
router.use('/user', check.checkLogin, require('./user'));//用户管理
router.use(function (req, res) {
    res.render('admin/404');
});

module.exports = router;