/**
 * Created by liqian on 2017/4/27.
 */

var should = require('chai').should();
var request = require('supertest');
var app = require('../../app');
var md5 = require('md5');
var SessionModel = require('../../models/session');
var UserModel = require('../../models/user');
var LogModel = require('../../models/log');

/**
 * 测试Admin模块内的log路由
 */
var cookie = '';
describe('#Admin', function () {
    describe('#Log', function () {
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

        //测试获取所有日志
        it('Should be able to access the page normally', function (done) {
            request(app)
                .get('/admin/content/log')
                .set('Cookie', cookie)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.contain('所有日志');
                    done();
                });
        });
    });
});