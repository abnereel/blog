/**
 * Created by liqian on 2017/3/29.
 */

var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    console.log('logout')
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/admin/login');
});

module.exports = router;