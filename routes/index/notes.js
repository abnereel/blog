/**
 * Created by liqian on 2017/4/24.
 */
var express = require('express');
var router = express.Router();
var PostModel = require('../../models/post');
var FrontMenuModel = require('../../models/menu_front');
var dateformat = require('dateformat');
var async = require('async');
var Common = require('../../lib/common');
var xss = require('xss');
var config = require('config-lite');


//首页
router.get('/', function (req, res, next) {

    var page = xss(req.query.page);
    page = page ? (Math.abs(parseInt(page)) > 0 ? Math.abs(parseInt(page)) : 1) : 1;
    if (isNaN(page)) {
        return next(new Error('类型错误'));
    }
    var limit = config.page.frontLimit;
    var skip = page ? (page-1)*limit : 0;

    var where = {
        status: 1
    };

    var url = '/notes';
    async.waterfall([
        function (cb) {
            FrontMenuModel
                .getMenuByUrl(url)
                .then(function (result) {
                    cb(null, result._id);
                })
                .catch(function (e) {
                    cb(e, null);
                });
        },
        function (category, cb) {
            where.category = category;
            PostModel
                .getPostsCounts(where)
                .then(function (counts) {
                    cb(null, category, counts);
                })
                .catch(function (e) {
                    cb(e, null);
                });
        },
        function (category, counts, cb) {
            PostModel
                .getPostsList(where, limit, skip)
                .then(function (result) {
                    cb(null, result, category, counts);
                })
                .catch(function (e) {
                    cb(e, null);
                });
        }
    ], function (err, result, category, counts) {
        if (err) {
            //参数错误
            if (err.name.toString() == 'TypeError' || err.name.toString() == 'CastError') {
                return res.redirect('/index/404');
            }
            next(err);
        }
        var paging = Common.paging(page, counts, limit, url, '?page', 5);
        result.forEach(function (item) {
            item.date = dateformat(item.releaseTime, 'yyyy-mm-dd HH:MM:ss');
        });
        res.render('index/notes', {
            posts: result,
            paging: paging,
            counts: counts,
            frontLimit: config.page.frontLimit
        });
    });
});


module.exports = router;