var express = require('express');
var router = express.Router();


router.use(require('../../middlewares/nav'));
router.use(require('../../middlewares/right_module'));
router.get('/', function(req, res, next) {res.redirect('/post/home')});//首页
router.use('/post', require('./post'));//文章页面
router.use('/licence', require('./licence'))//博客声明

module.exports = router;
