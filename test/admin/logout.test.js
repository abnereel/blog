/**
 * Created by liqian on 2017/4/18.
 */

var should = require('chai').should();
var request = require('supertest');
var app = require('../../app');
var SessionModel = require('../../models/session');

/**
 * 测试Admin模块内的logout路由
 */
describe('#Admin', function () {
    describe('#Logout', function () {
        it('Should be able to access the page normally', function (done) {
            request(app)
                .get('/admin/logout')
                .expect(302)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.contain('Found. Redirecting to /admin/login');
                    done();
                });
        });
    });
});