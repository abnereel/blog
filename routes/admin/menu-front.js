/**
 * Created by liqian on 2017/3/13.
 */


var path = require('path');
var express = require('express');
var router = express.Router();
var Common = require('../../lib/Common');
var FrontMenuModel = require('../../models/menu-front');

//获取后台菜单页面
router.get('/', function (req, res, next) {

    FrontMenuModel
        .getMenuListAll()
        .then(function (result) {
            var menuTree = Common.getMenuTree(result);
            res.render('admin/menu/front-list', { menuTree: menuTree });
        })
        .catch(next);
});

//获取"添加后台菜单页面"
router.get('/add', function (req, res, next) {

    FrontMenuModel
        .getMenuList()
        .then(function (result) {
            var menuTree = Common.getMenuTree(result);
            res.render('admin/menu/front-add', { menuTree: menuTree });
        }).catch(next);
});

//添加后台菜单
router.post('/add', function (req, res, next) {
    var parentId = req.body.parentId;
    var name = req.body.name;
    var url = req.body.url;
    var icon = req.body.icon;
    var status = req.body.status;
    var deep = req.body.deep;
    var listOrder = req.body.listOrder;

    var menu = {
        parentId : parentId,
        name : name,
        url: url,
        icon: icon,
        status: status,
        deep: deep,
        listOrder: listOrder
    };

    FrontMenuModel
        .create(menu)
        .then(function () {
            req.flash('success', '添加成功');
            res.redirect('/admin/menu/front/add');
        })
        .catch(function (e) {
            req.flash('error', '添加失败');
            res.redirect('/admin/menu/front/add');
            next(e);
        });
});

//获取"编辑后台菜单页面"
router.get('/edit/:_id', function (req, res, next) {
    var _id = req.params._id;

    var plist = [
        FrontMenuModel.getMenuById(_id),
        FrontMenuModel.getMenuListAll()
    ];

    Promise
        .all(plist)
        .then(function (data) {
            var menu = data[0];
            var menuTree = Common.getMenuTree(data[1]);

            res.render('admin/menu/front-edit', {
                menu: menu,
                menuTree: menuTree
            });
        })
        .catch(next);
});

//更新菜单
router.post('/edit/:_id', function (req, res, next) {
    var parentId = req.body.parentId;
    var name = req.body.name;
    var url = req.body.url;
    var icon = req.body.icon;
    var status = req.body.status;
    var deep = req.body.deep;
    var listOrder = req.body.listOrder;
    var _id = req.body._id;

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

    FrontMenuModel
        .updateMenuById(menu)
        .then(function (result) {
            req.flash('success', '修改成功');
            res.redirect('/admin/menu/front/edit/'+req.body._id);
        })
        .catch(function(e){
            req.flash('error', '修改失败');
            res.redirect('/admin/menu/front');
        });
});

//删除菜单
router.get('/del/:_id', function (req, res, next) {
    var _id = req.params._id;

    FrontMenuModel
        .getSubMenuById(_id)
        .then(function (result) {
            if (result.length > 0) {
                throw new Error("删除失败，请先删除子菜单再删除父菜单");
            }
            FrontMenuModel
                .deleteMenuById(_id)
                .then(function () {
                    req.flash('success', '删除成功');
                    res.redirect('/admin/menu/front');
                })
                .catch(function (e) {
                    req.flash('error', '删除失败');
                    res.redirect('/admin/menu/front');
                });
        })
        .catch(function (e) {
            req.flash("error", e.message);
            res.redirect('/admin/menu/front');
            next(e);
        });
})

module.exports = router;