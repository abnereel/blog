/**
 * Created by liqian on 2017/3/13.
 */
var express = require('express');
var router = express.Router();
var PostModule = require('../../models/post');
var dateformat = require('dateformat');

//首页
router.get('/', function (req, res, next) {

    PostModule
        .getPostsList()
        .then(function (result) {
            result.forEach(function (item) {
                item.date = dateformat(new Date(item.releaseTime).getTime(), 'yyyy-mm-dd');
            });
            res.render('index/post', {
                posts: result
            });
        })
        .catch(next);
});

//文章详情页
router.get('/view/:_id', function (req, res, next) {

    var _id = req.params._id;
    PostModule
        .getPostById(_id)
        .then(function (result) {
            console.log(result);
            if (result === null) {
                res.render('index/404');
            }
            result.date = dateformat(new Date(result.releaseTime).getTime(), 'yyyy-mm-dd HH:MM:ss');
            res.render('index/post-view', {
                post: result
            });
        })
        .catch(function (e) {
            res.render('index/404');
            next(e);
        });
});

module.exports = router;