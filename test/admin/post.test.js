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
var PostModel = require('../../models/post');

/**
 * 测试Admin模块内的post路由
 */
var cookie = '';
var menu = {};
var postId = '';
describe('#Admin', function () {
    describe('#Post', function () {
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

            //新增测试菜单
            FrontMenuModel
                .create({
                    parentId : '000000000000000000000000',
                    name : '测试菜单',
                    url: '/post/testmenu',
                    icon: '',
                    status: 0,
                    deep: 1,
                    listOrder: 1
                })
                .then(function (result) {
                    menu = result;
                })
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
                .deleteMenuById(menu._id)
                .then(function () {})
                .catch(function (e) {
                    throw new Error(e.message);
                });

            //删除测试文章
            PostModel
                .deletePostByCategory(menu._id)
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

        //测试获取所有文章
        it('Should be able to access the page normally', function (done) {
            request(app)
                .get('/admin/content/post')
                .set('Cookie', cookie)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.contain('所有文章');
                    done();
                });
        });

        //测试添加文章页
        it('Should be able to access the page normally', function (done) {
            request(app)
                .get('/admin/content/post/add')
                .set('Cookie', cookie)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.contain('文章标题');
                    done();
                });
        });

        //测试添加文章功能
        it('Data should be saved correctly', function (done) {
            SessionModel
                .findSession()
                .then(function (result) {
                    var session = result.toObject();
                    var _csrf = JSON.parse(session.session)['_csrf'];
                    request(app)
                        .post('/admin/content/post/add')
                        .set('Cookie', cookie)
                        .send({
                            _csrf: _csrf,
                            category: menu._id,
                            title: 'test-999',
                            releaseTime: new Date().getTime(),
                            keywords: 'test-999',
                            source: 'test-999',
                            excerpt: 'test-999',
                            content: 'test-999',
                            author: 'test-999'
                        })
                        .expect(302)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('Found. Redirecting to /admin/content/post/add');
                            done();
                        });
                })
                .catch(function (e) {
                    throw new Error(e.message);
                    //should.Throw(e);
                    done();
                })
        });

        //测试更新文章页
        it('Should be able to access the page normally', function (done) {

            PostModel
                .getPostsByCategory(menu._id)
                .then(function (result) {
                    postId = result[0]._id;
                    request(app)
                        .get('/admin/content/post/edit/' + postId)
                        .set('Cookie', cookie)
                        .expect(200)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('文章标题');
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
                        .post('/admin/content/post/edit/' + postId)
                        .set('Cookie', cookie)
                        .send({
                            _id: postId,
                            _csrf: _csrf,
                            category: menu._id,
                            title: 'test-666',
                            releaseTime: new Date().getTime(),
                            keywords: 'test-666',
                            source: 'test-666',
                            excerpt: 'test-666',
                            content: 'test-666',
                            author: 'test-666'
                        })
                        .expect(302)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('Found. Redirecting to /admin/content/post/edit/' + postId);
                            done();
                        });

                })
                .catch(function (e) {
                    throw new Error(e.message);
                });
        });

        //测试获取某个分类文章 --- 此次访问时为了下次的删除测试做准备（获取_csrf）
        it('Should be able to access the page normally', function (done) {
            if (menu._id) {
                request(app)
                    .get('/admin/content/post/category/' + menu._id)
                    .set('Cookie', cookie)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.text.should.contain('所有文章');
                        done();
                    });
            } else {
                done();
            }
        });

        //测试删除文章功能
        it('Should be able to delete the post', function (done) {
            SessionModel
                .findSession()
                .then(function (result) {
                    var session = result.toObject();
                    var _csrf = JSON.parse(session.session)['_csrf'];
                    request(app)
                        .get('/admin/content/post/del/' + postId + '?_csrf=' + _csrf)
                        .set('Cookie', cookie)
                        .expect(302)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('Found. Redirecting to /admin/content/post');
                            done();
                        });
                })
                .catch(function (e) {
                    throw new Error(e.message);
                });
        });
    });
});