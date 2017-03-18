/**
 * Created by liqian on 2017/3/13.
 */

var Common = require('../lib/Common');
var FrontMenuModel = require('../models/menu-front');

module.exports = function (req, res, next) {
    FrontMenuModel
        .getMenuList()
        .then(function (result) {
            res.locals.nav = Common.getMenuTree(result);
            res.locals.curUrl = req.originalUrl;//进行菜单路径匹配
            next();
        })
        .catch(next);
}