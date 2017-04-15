/**
 * Created by liqian on 2017/4/14.
 */
var should = require('chai').should();
var request = require('supertest');
var express = require('express');
var app = require('../../app');

/**
 * 测试Index模块内的license路由
 */
describe('#Index', function() {
    describe('#Licence', function() {
        it('respnose json object or []', function(done) {
            request(app)
                .get('/licence')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });
    });
});