/**
 * Created by liqian on 2017/3/13.
 */
var express = require('express');
var router = express.Router();
var PostModel = require('../../models/post');
var FrontMenuModel = require('../../models/menu_front');
var dateformat = require('dateformat');
var async = require('async');


//首页
router.get('/', function (req, res, next) {

    var url = req.originalUrl;
    async.waterfall([
        function (cb) {
            FrontMenuModel
                .getMenuByUrl(url)
                .then(function (result) {
                    cb(null, result._id);
                })
                .catch(next);
        },
        function (category, cb) {
            PostModel
                .getPostsByCategory(category)
                .then(function (result) {
                    cb(null, result);
                })
                .catch(next);
        }
    ], function (err, result) {
        if (err) next(err);
        if (result.length > 0) {
            result.forEach(function (item) {
                item.date = dateformat(new Date(item.releaseTime).getTime(), 'yyyy-mm-dd');
            });
            var licence = result[0];//只取最新数据
        } else {
            var licence = result;
        }

        res.render('index/licence', {
            post: licence
        });
    });
});



module.exports = router;