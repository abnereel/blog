/**
 * Created by liqian on 2017/4/13.
 */
var assert = require('assert');
var indexPost = require('../routes/index/post');
describe('Post', function() {
    describe('create', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1,2,3].indexOf(4));  
        });
    });
});