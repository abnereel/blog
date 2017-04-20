/**
 * Created by liqian on 2017/3/29.
 */
var User = require('../lib/mongo').User;

module.exports = {
    /**
     * 根据账号和密码查找用户
     * @param user          查找的用户信息条件
     * @returns {Query|*}
     */
    findUser: function (user) {
        return User
            .findOne({
                name: user.name,
                password: user.password
            });
    },

    /**
     * 新增用户
     * @param user          需要创建的用户信息
     * @returns {user}
     */
    addUser: function (user) {
        return User
            .create(user);
    },

    /**
     * 删除用户
     * @param user          需要删除的用户信息
     */
    deleteUser: function (user) {
        return User
            .remove({
                name : user.name,
                password: user.password
            });
    }
};