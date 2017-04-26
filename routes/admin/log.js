/**
 * Created by liqian on 2017/4/26.
 */
var express = require('express');
var router = express.Router();
var LogModel = require('../../models/log');
var xss = require('xss');
var config = require('config-lite');
var Common = require('../../lib/common');
var dateformat = require('dateformat');

router.get('/', function (req, res, next) {

    var page = xss(req.query.page);
    page = page ? (Math.abs(parseInt(page)) > 0 ? Math.abs(parseInt(page)) : 1) : 1;
    if (isNaN(page)) {
        return next(new Error('类型错误'));
    }
    var limit = config.page.behindLimit;
    var skip = page ? (page-1)*limit : 0;

    var list = [
        LogModel.getLogsCounts(),
        LogModel.getLogsList(null, limit, skip)
    ];

    Promise
        .all(list)
        .then(function (data) {
            var counts = data[0];
            var result = data[1];
            var paging = Common.paging(page, counts, limit, '/admin/content/log', '?page', 5);
            result.forEach(function (item) {
                switch(item.role) {
                    case 1:
                        item.roleName = '测试账号';
                        break;
                    case 9:
                        item.roleName = '管理员账号';
                        break;
                    default:
                        item.roleName = '异常账号';
                }
                item.date = dateformat(item.time, 'yyyy-mm-dd HH:MM:ss');
            });
            res.render('admin/log/list', {
                logs: result,
                paging: paging,
                action: 0
            });
        })
        .catch(next);
});

//分操作类型获取日志列表
router.get('/action/:action', function (req, res, next) {

    var page = xss(req.query.page);
    page = page ? (Math.abs(parseInt(page)) > 0 ? Math.abs(parseInt(page)) : 1) : 1;
    if (isNaN(page)) {
        return next(new Error('类型错误'));
    }
    var limit = config.page.behindLimit;
    var skip = page ? (page-1)*limit : 0;

    var action = xss(req.params.action);
    var where = {
        action: action
    };

    var list = [
        LogModel.getLogsCounts(where),
        LogModel.getLogsList(where, limit, skip)
    ];

    Promise
        .all(list)
        .then(function (data) {
            var counts = data[0];
            var result = data[1];
            var paging = Common.paging(page, counts, limit, '/admin/content/log', '?page', 5);
            result.forEach(function (item) {
                switch(item.role) {
                    case 1:
                        item.roleName = '测试账号';
                        break;
                    case 9:
                        item.roleName = '管理员账号';
                        break;
                    default:
                        item.roleName = '异常账号';
                }
                item.date = dateformat(item.time, 'yyyy-mm-dd HH:MM:ss');
            });
            res.render('admin/log/list', {
                logs: result,
                paging: paging,
                action: action
            });
        })
        .catch(next);
});



module.exports = router;