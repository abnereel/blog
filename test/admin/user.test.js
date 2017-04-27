/**
 * Created by liqian on 2017/4/27.
 */

var should = require('chai').should();
var request = require('supertest');
var app = require('../../app');
var md5 = require('md5');
var SessionModel = require('../../models/session');
var UserModel = require('../../models/user');

/**
 * 测试Admin模块内的user路由
 */
var cookie = '';
var nameId = '';
describe('#Admin', function () {
    describe('#User', function () {
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

        //测试获取所有用户页面
        it('Should be able to access the page normally', function (done) {
            request(app)
                .get('/admin/user')
                .set('Cookie', cookie)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.contain('所有用户');
                    done();
                });
        });

        //测试添加用户页面
        it('Should be able to access the page normally', function (done) {
            request(app)
                .get('/admin/user/add')
                .set('Cookie', cookie)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.contain('用户密码');
                    done();
                });
        });

        //测试添加用户
        it('Data should be saved correctly', function (done) {
            SessionModel
                .findSession()
                .then(function (result) {
                    var session = result.toObject();
                    var _csrf = JSON.parse(session.session)['_csrf'];
                    request(app)
                        .post('/admin/user/add')
                        .set('Cookie', cookie)
                        .send({
                            _csrf: _csrf,
                            name: 'test888',
                            password: '11111111',
                            confirmPassword: '11111111',
                            role: 1,
                            status: 0
                        })
                        .expect(302)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('Found. Redirecting to /admin/user/add');
                            done();
                        });
                })
                .catch(function (e) {
                    throw new Error(e.message);
                    done();
                });
        });

        //测试更新用户页面
        it('Should be able to access the page normally', function (done) {

            UserModel
                .findUser({ name: 'test888' })
                .then(function (result) {
                    nameId = result._id;
                    request(app)
                        .get('/admin/user/edit/' + nameId)
                        .set('Cookie', cookie)
                        .expect(200)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('用户密码');
                            done();
                        });
                })
                .catch(function (e) {
                    throw new Error(e.message);
                    done();
                });
        });

        //测试更新用户
        it('Data should be updated correctly', function (done) {
            SessionModel
                .findSession()
                .then(function (result) {
                    var session = result.toObject();
                    var _csrf = JSON.parse(session.session)['_csrf'];
                    request(app)
                        .post('/admin/user/edit/' + nameId)
                        .set('Cookie', cookie)
                        .send({
                            _csrf: _csrf,
                            _id: nameId,
                            name: 'test888',
                            password: '11111111',
                            confirmPassword: '11111111',
                            role: 1,
                            status: 0
                        })
                        .expect(302)
                        .end(function (err, res) {
                            console.log(res.text);
                            should.not.exist(err);
                            res.text.should.contain('Found. Redirecting to /admin/user/edit/' + nameId);
                            done();
                        });
                })
                .catch(function (e) {
                    throw new Error(e.message);
                    done();
                });
        });

        //测试获取所有用户页面 --- 此次访问时为了下次的删除测试做准备
        it('Should be able to access the page normally', function (done) {
            request(app)
                .get('/admin/user')
                .set('Cookie', cookie)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.contain('所有用户');
                    done();
                });
        });

        //测试删除用户功能
        it('Should be able to delete the slide', function (done) {
            SessionModel
                .findSession()
                .then(function (result) {
                    var session = result.toObject();
                    var _csrf = JSON.parse(session.session)['_csrf'];
                    request(app)
                        .get('/admin/user/del/' + nameId + '?_csrf=' + _csrf)
                        .set('Cookie', cookie)
                        .expect(302)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.contain('Found. Redirecting to /admin/user');
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