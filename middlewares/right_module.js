/**
 * Created by liqian on 2017/3/9.
 */
var SlideModel = require('../models/slide');

//首页右侧模块
module.exports = function rightModule(req, res, next) {

    var list = [
        SlideModel.getSlideByCategory('introduce')
    ];

    Promise
        .all(list)
        .then(function (data) {
            var introduce = data[0];
            res.locals.introduce = introduce;
            next();
        })
        .catch(next);
}