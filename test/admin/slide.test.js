/**
 * Created by liqian on 2017/4/18.
 */

var should = require('chai').should();
var request = require('supertest');
var app = require('../../app');
var md5 = require('md5');
var SessionModel = require('../../models/session');
var UserModel = require('../../models/user');
var SlideModel = require('../../models/slide');

/**
 * 测试Admin模块内的slide路由
 */
var cookie = '';
var slideId = '';
describe('#Admin', function () {
    describe('#Slide', function () {
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

            //删除测试幻灯片
            SlideModel
                .deleteSlide({ _id: slideId })
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

        //测试登录功能 - 登录后才能继续后续操作
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
                    done();
                });
        });

        //测试获取所有幻灯片
        it('Should be able to access the page normally', function (done) {
            request(app)
                .get('/admin/content/slide')
                .set('Cookie', cookie)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.contain('所有幻灯片');
                    done();
                });
        });

        //测试添加幻灯片页
        it('Should be able to access the page normally', function (done) {
            request(app)
                .get('/admin/content/slide/add')
                .set('Cookie', cookie)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.contain('分类标识');
                    done();
                });
        });

        //测试添加幻灯片功能
        it('Data should be saved correctly', function (done) {
            SessionModel
                .findSession()
                .then(function (result) {
                    var session = result.toObject();
                    var _csrf = JSON.parse(session.session)['_csrf'];
                    request(app)
                        .post('/admin/content/slide/add')
                        .set('Cookie', cookie)
                        .send({
                            _csrf: _csrf,
                            name: 'test-999',
                            category: 'test-999',
                            url: '#',
                            excerpt: 'test-999',
                            status: 0,
                            listOrder: 1
                        })
                        .expect(302)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('Found. Redirecting to /admin/content/slide/add');
                            done();
                        });
                })
                .catch(function (e) {
                    throw new Error(e.message);
                    //should.Throw(e);
                    done();
                })
        });

        //测试更新幻灯片页
        it('Should be able to access the page normally', function (done) {

            SlideModel
                .getSlidesList({ category: 'test-999' })
                .then(function (result) {
                    slideId = result[0]._id;
                    request(app)
                        .get('/admin/content/slide/edit/' + slideId)
                        .set('Cookie', cookie)
                        .expect(200)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('分类标识');
                            done();
                        });
                })
                .catch(function (e) {
                    throw new Error(e.message);
                    done();
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
                        .post('/admin/content/slide/edit/' + slideId)
                        .set('Cookie', cookie)
                        .send({
                            _id: slideId,
                            _csrf: _csrf,
                            name: 'test-999',
                            category: 'test-999',
                            url: '#',
                            excerpt: 'test-999',
                            status: 0,
                            listOrder: 1
                        })
                        .expect(302)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('Found. Redirecting to /admin/content/slide/edit/' + slideId);
                            done();
                        });

                })
                .catch(function (e) {
                    throw new Error(e.message);
                    done();
                });
        });

        //测试获取所有幻灯片 --- 此次访问时为了下次的删除测试做准备
        it('Should be able to access the page normally', function (done) {
            request(app)
                .get('/admin/content/slide')
                .set('Cookie', cookie)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.contain('所有幻灯片');
                    done();
                });
        });

        //测试删除幻灯片功能
        it('Should be able to delete the slide', function (done) {
            SessionModel
                .findSession()
                .then(function (result) {
                    var session = result.toObject();
                    var _csrf = JSON.parse(session.session)['_csrf'];
                    request(app)
                        .get('/admin/content/slide/del/' + slideId + '?_csrf=' + _csrf)
                        .set('Cookie', cookie)
                        .expect(302)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('Found. Redirecting to /admin/content/slide');
                            done();
                        });
                })
                .catch(function (e) {
                    throw new Error(e.message);
                    done();
                });
        });
    });
});