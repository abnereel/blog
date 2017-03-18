/**
 * Created by liqian on 2017/3/9.
 */
var Common = require('../lib/Common');
var BehindMenuModel = require('../models/menu-behind');

//后台左侧导航菜单
module.exports = function leftTree(req, res, next) {
    BehindMenuModel
        .getMenuList()
        .then(function (result) {
            res.locals.leftTree = Common.getMenuTree(result);
            res.locals.curUrl = req.originalUrl;//进行菜单路径匹配
            next();
        })
        .catch(next);
}