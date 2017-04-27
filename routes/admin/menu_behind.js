/**
 * Created by liqian on 2017/3/13.
 */


var path = require('path');
var express = require('express');
var router = express.Router();
var Common = require('../../lib/common');
var BehindMenuModel = require('../../models/menu_behind');
var xss = require('xss');

//获取后台菜单页面
router.get('/', function (req, res, next) {
 
    BehindMenuModel
        .getMenuListAll()
        .then(function (result) {
            var menuTree = Common.getMenuTree(result);
            res.render('admin/menu/behind-list', {
                menuTree: menuTree
            });
        })
        .catch(next);
});

//获取"添加后台菜单页面"
router.get('/add', function (req, res, next) {

    BehindMenuModel
        .getMenuList()
        .then(function (result) {
            var menuTree = Common.getMenuTree(result);
            res.render('admin/menu/behind-add', {
                menuTree: menuTree
            });
        }).catch(next);
});

//添加后台菜单
router.post('/add', function (req, res, next) {

    //csrf检查
    var _csrf = xss(req.body._csrf);
    if (!(_csrf == req.session._csrf)) {
        req.flash('error', 'Invalid Token');
        return res.redirect('back');
    }

    var parentId = xss(req.body.parentId);
    var name = xss(req.body.name);
    var url = xss(req.body.url);
    var icon = xss(req.body.icon);
    var status = xss(req.body.status);
    var deep = xss(req.body.deep);
    var listOrder = xss(req.body.listOrder);

    var menu = {
        parentId : parentId,
        name : name,
        url: url,
        icon: icon,
        status: status,
        deep: deep,
        listOrder: listOrder
    };

    BehindMenuModel
        .create(menu)
        .then(function () {
            req.flash('success', '添加成功');
            res.redirect('/admin/menu/behind/add');
        })
        .catch(function (e) {
            req.flash('error', '添加失败，' + e.message);
            res.redirect('back');
            next(e);
        });
});

//获取"编辑后台菜单页面"
router.get('/edit/:_id', function (req, res, next) {
    var _id = xss(req.params._id);

    var plist = [
        BehindMenuModel.getMenuById(_id),
        BehindMenuModel.getMenuListAll()
    ];

    Promise
        .all(plist)
        .then(function (data) {
            var menu = data[0];
            var menuTree = Common.getMenuTree(data[1]);

            res.render('admin/menu/behind-edit', {
                menu: menu,
                menuTree: menuTree
            });
        })
        .catch(next);
});

//更新菜单
router.post('/edit/:_id', function (req, res, next) {

    //csrf检查
    var _csrf = xss(req.body._csrf);
    if (!(_csrf == req.session._csrf)) {
        req.flash('error', 'Invalid Token');
        return res.redirect('back');
    }

    var parentId = xss(req.body.parentId);
    var name = xss(req.body.name);
    var url = xss(req.body.url);
    var icon = xss(req.body.icon);
    var status = xss(req.body.status);
    var deep = xss(req.body.deep);
    var listOrder = xss(req.body.listOrder);
    var _id = xss(req.body._id);

    var menu = {
        _id: _id,
        parentId : parentId,
        name : name,
        url: url,
        icon: icon,
        status: status,
        deep: deep,
        listOrder: listOrder
    };

    BehindMenuModel
        .updateMenuById(menu)
        .then(function (result) {
            req.flash('success', '修改成功');
            res.redirect('/admin/menu/behind/edit/' + _id);
        })
        .catch(function(e){
            req.flash('error', '修改失败，' + e.message);
            res.redirect('back');
        });
});

//删除菜单
router.get('/del/:_id', function (req, res, next) {

    //csrf检查
    var _csrf = xss(req.query._csrf);
    if (!(_csrf == req.session._csrf)) {
        req.flash('error', 'Invalid Token');
        return res.redirect('/admin/menu/behind');
    }

    var _id = xss(req.params._id);

    BehindMenuModel
        .getSubMenuById(_id)
        .then(function (result) {
            if (result.length > 0) {
                req.flash("error", '删除失败，请先删除子菜单再删除父菜单');
                return res.redirect('/admin/menu/behind');
            }
            BehindMenuModel
                .deleteMenuById(_id)
                .then(function () {
                    req.flash('success', '删除成功');
                    res.redirect('/admin/menu/behind');
                })
                .catch(function (e) {
                    req.flash('error', '删除失败，' + e.message);
                    res.redirect('/admin/menu/behind');
                });
        })
        .catch(function (e) {
            req.flash("error", e.message);
            res.redirect('/admin/menu/behind');
        });
})

module.exports = router;