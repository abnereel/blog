/**
 * Created by liqian on 2017/4/17.
 */
var Session = require('../lib/mongo').Session;

module.exports = {
    findSession: function () {
        return Session
            .findOne()
            .sort({ expires: -1 });
    }
};