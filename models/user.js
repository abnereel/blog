/**
 * Created by liqian on 2017/3/29.
 */
var User = require('../lib/mongo').User;

module.exports = {
    /**
     * 根据账号和密码查找用户
     * @param where          查找条件
     * @returns {Query|*}
     */
    findUser: function (where) {
        return User
            .findOne(where);
    },

    /**
     * 新增用户
     * @param user          用户对象
     * @returns {user}
     */
    addUser: function (user) {
        return User
            .create(user);
    },

    /**
     * 删除用户
     * @param user          用户对象
     */
    deleteUser: function (user) {
        return User
            .deleteOne({
                name: user.name,
                password: user.password
            });
    },

    /**
     * 更新用户
     * @param user          用户对象
     */
    updateUser: function (user) {
        return User
            .update({ _id: user._id }, {$set: user});
    },

    /**
     * 获取用户列表
     * @param where         查找条件
     */
    getUsersList: function (where, limit, skip) {
        return User
            .find(where)
            .skip(skip)
            .limit(limit)
            .sort({ lastLogin: -1 });
    },

    /**
     * 获取用户数量
     * @param where         查找条件
     */
    getUsersCounts: function (where) {
        return User
            .count(where);
    }
};