/**
 * Created by liqian on 2017/4/26.
 */
var Log = require('../lib/mongo').Log;

module.exports = {
    /**
     * 添加日志
     * @param log       log对象
     * @returns {log}
     */
    addLog: function (log) {
        return Log
            .create(log);
    },

    /**
     * 获取日志列表
     * @param where     查询条件
     */
    getLogsList: function (where, limit, skip) {
        return Log
            .find(where)
            .skip(skip)
            .limit(limit)
            .sort({ time: -1 });
    },

    /**
     * 获取日志数量
     * @param where     查询条件
     * @returns {*|Query}
     */
    getLogsCounts: function (where) {
        return Log
            .count(where);
    }
}