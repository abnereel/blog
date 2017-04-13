/**
 * Created by liqian on 2017/3/13.
 */

var Common = require('../lib/common');
var FrontMenuModel = require('../models/menu_front');

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