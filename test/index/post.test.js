/**
 * Created by liqian on 2017/4/14.
 */
var should = require('chai').should();
var request = require('supertest');
var express = require('express');
var app = require('../../app');

/**
 * 测试Index模块内的post路由
 */
describe('#Index', function() {
    describe('#Post', function() {
        it('GET /, respnose json object or []', function(done) {
            request(app)
                .get('/')
                .expect(302)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });

        it('GET /post, respnose json object or []', function(done) {
            request(app)
                .get('/post')
                .expect(302)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });

        it('GET /post/home, respnose json object or []', function(done) {
            request(app)
                .get('/post/home')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });

        it('GET /post/node, respnose json object or []', function(done) {
            request(app)
                .get('/post/node')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });
    });
});