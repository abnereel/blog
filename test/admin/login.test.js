/**
 * Created by liqian on 2017/4/14.
 */
var should = require('chai').should();
var request = require('supertest');
var express = require('express');
var app = require('../../app');

var session = require('express-session');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('config-lite');

/**
 * 测试Admin模块内的login路由
 */
var url = '';
var _csrf = '';
describe('#Admin', function() {
    describe('#Login', function() {
        app.use(cookieParser());
        app.use(bodyParser.json());

        app.use(session({
            name: config.session.key,
            secret: config.session.secret,
            resave: true,
            saveUninitialized: false,
            cookie: {
                maxAge: config.session.maxAge
            },
            store: new MongoStore({
                url: config.mongodb
            })
        }));
        app.use(flash());

        it('respnose json object or []', function(done) {
            request(app)
                .get('/admin/login')
                .expect(200)
                .end(function (err, res) {
                    console.log(res.locals);
                    console.log(res.body);
                    console.log(res.session);
                    should.not.exist(err);
                    done();
                });
        });
    });
});