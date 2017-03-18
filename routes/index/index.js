var express = require('express');
var router = express.Router();


router.use(require('../../middlewares/nav'));
router.get('/', function(req, res, next) {res.redirect('/post')});//首页
router.use('/post', require('./post'));//文章页面

module.exports = router;
