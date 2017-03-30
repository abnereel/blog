/**
 * Created by liqian on 2017/3/29.
 */

module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '请登录用户');
            return res.redirect('/admin/login');
        }
        next();
    },

    checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录');
            return res.redirect('/admin');
        }
        next();
    }
};