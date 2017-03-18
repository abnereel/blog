/**
 * Created by liqian on 2017/3/7.
 */
var express = require('express');
var router = express.Router();


router.use(require('../../middlewares/LeftTree'));//后台左侧导航菜单
router.get('/', function (req, res, next) {res.render('admin/index');});//Dashboard
router.use('/menu/behind', require('./menu-behind'));//后台菜单页
router.use('/menu/front', require('./menu-front'));//前台菜单页
router.use('/post', require('./post'));//文章管理页


module.exports = router;