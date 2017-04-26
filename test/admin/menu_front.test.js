/**
 * Created by liqian on 2017/4/18.
 */

var should = require('chai').should();
var request = require('supertest');
var app = require('../../app');
var md5 = require('md5');
var SessionModel = require('../../models/session');
var FrontMenuModel = require('../../models/menu_front');
var UserModel = require('../../models/user');

/**
 * 测试Admin模块内的post路由
 */
var cookie = '';
var menuId = '';
describe('#Admin', function () {
    describe('#Menu_Front', function () {
        before(function () {
            //新增测试账号
            UserModel
                .addUser({
                    name: 'test999',
                    password: md5('11111111')
                })
                .then(function () {})
                .catch(function (e) {
                    throw new Error(e.message);
                });
        });

        after(function () {
            //删除测试账号
            UserModel
                .deleteUser({
                    name: 'test999',
                    password: md5('11111111')
                })
                .then(function () {})
                .catch(function (e) {
                    throw new Error(e.message);
                });

            //删除测试菜单
            FrontMenuModel
                .deleteMenuById(menuId)
                .then(function () {})
                .catch(function (e) {
                    throw new Error(e.message);
                });
        });

        //测试登录页
        it('Should be able to access the page normally', function(done) {
            request(app)
                .get('/admin/login')
                .expect(200)
                .end(function (err, res) {
                    cookie = res.header['set-cookie'][0];
                    should.not.exist(err);
                    res.text.should.contain('请登录账户');
                    done();
                });
        });

        //测试登录功能 - 登录后才能进行后续操纵
        it('Should login in successfully', function (done) {
            SessionModel
                .findSession()
                .then(function (result) {
                    var session = result.toObject();
                    var _csrf = JSON.parse(session.session)['_csrf'];
                    var captcha = JSON.parse(session.session)['captcha'];

                    request(app)
                        .post('/admin/login')
                        .send({
                            name: 'test999',
                            password: '11111111',
                            captcha: captcha,
                            _csrf: _csrf
                        })
                        .set('Cookie', cookie)
                        .expect(302)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('Found. Redirecting to /admin');
                            done();
                        });
                })
                .catch(function (e) {
                    throw new Error(e.message);
                });
        });

        //测试获取所有菜单
        it('Should be able to access the page normally', function (done) {
            request(app)
                .get('/admin/menu/front')
                .set('Cookie', cookie)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.contain('所有菜单');
                    done();
                });
        });

        //测试添加菜单页
        it('Should be able to access the page normally', function (done) {
            request(app)
                .get('/admin/menu/front/add')
                .set('Cookie', cookie)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.contain('上级菜单');
                    done();
                });
        });

        //测试添加菜单功能
        it('Data should be saved correctly', function (done) {
            SessionModel
                .findSession()
                .then(function (result) {
                    var session = result.toObject();
                    var _csrf = JSON.parse(session.session)['_csrf'];
                    request(app)
                        .post('/admin/menu/front/add')
                        .set('Cookie', cookie)
                        .send({
                            _csrf: _csrf,
                            parentId : '000000000000000000000000',
                            name : '测试菜单',
                            url: '/post/testmenu',
                            icon: 'test',
                            status: 0,
                            deep: 1,
                            listOrder: 1
                        })
                        .expect(302)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('Found. Redirecting to /admin/menu/front/add');
                            done();
                        });
                })
                .catch(function (e) {
                    throw new Error(e.message);
                    //should.Throw(e);
                    done();
                });
        });

        //测试更新菜单页
        it('Should be able to access the page normally', function (done) {

            FrontMenuModel
                .getMenuByUrl('/post/testmenu')
                .then(function (result) {
                    menuId = result._id;
                    request(app)
                        .get('/admin/menu/front/edit/' + menuId)
                        .set('Cookie', cookie)
                        .expect(200)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('编辑菜单');
                            done();
                        });
                })
                .catch(function (e) {
                    throw new Error(e.message);
                });
        });

        //测试更新文章功能
        it('Data should be updated correctly', function (done) {
            SessionModel
                .findSession()
                .then(function (result) {
                    var session = result.toObject();
                    var _csrf = JSON.parse(session.session)['_csrf'];
                    request(app)
                        .post('/admin/menu/front/edit/' + menuId)
                        .set('Cookie', cookie)
                        .send({
                            _id: menuId,
                            _csrf: _csrf,
                            parentId : '000000000000000000000000',
                            name : '测试菜单2',
                            url: '/post/testmenu',
                            icon: '',
                            status: 0,
                            deep: 1,
                            listOrder: 1
                        })
                        .expect(302)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('Found. Redirecting to /admin/menu/front/edit/' + menuId);
                            done();
                        });

                })
                .catch(function (e) {
                    throw new Error(e.message);
                });
        });

        //测试获取某个分类文章 --- 此次访问时为了下次的删除测试做准备
        it('Should be able to access the page normally', function (done) {
            request(app)
                .get('/admin/menu/front')
                .set('Cookie', cookie)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.contain('所有菜单');
                    done();
                });
        });

        //测试删除文章功能
        it('Should be able to delete the menu', function (done) {
            SessionModel
                .findSession()
                .then(function (result) {
                    var session = result.toObject();
                    var _csrf = JSON.parse(session.session)['_csrf'];
                    request(app)
                        .get('/admin/menu/front/del/' + menuId + '?_csrf=' + _csrf)
                        .set('Cookie', cookie)
                        .expect(302)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('Found. Redirecting to /admin/menu/front');
                            done();
                        });
                })
                .catch(function (e) {
                    throw new Error(e.message);
                });
        });
    });
});