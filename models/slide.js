/**
 * Created by liqian on 2017/4/12.
 */

var Slide = require('../lib/mongo').Slide;

module.exports = {
    /**
     * 添加幻灯片
     * @param slide         幻灯片对象
     * @returns {slide}
     */
    saveSlide: function (slide) {
        return Slide
            .create(slide);
    },

    /**
     * 获取幻灯片列表
     * @param where         查询条件
     * @param limit         每页数量
     * @param skip          跳过的数量
     */
    getSlidesList: function (where, limit, skip) {
        return Slide
            .find(where)
            .skip(skip)
            .limit(limit)
            .sort({ listOrder: 1 })
    },

    /**
     * 获取幻灯片数量
     * @param where         查询条件
     * @returns {*|Query}   总条数
     */
    getSlidesCounts: function (where) {
        return Slide
            .count(where)
    },

    /**
     * 根据 where 获取幻灯片
     * @param where         查询条件
     * @returns {Query|*}
     */
    getSlide: function (where) {
        return Slide
            .findOne(where);
    },

    /**
     * 根据 _id 更新幻灯片
     * @param slide         幻灯片对象
     */
    updateSlide: function (slide) {
        return Slide
            .update({ _id: slide._id }, { $set: slide });
    },

    /**
     * 根据 where 删除幻灯片
     * @param where         查询条件
     */
    deleteSlide: function (where) {
        return Slide
            .deleteOne({
                _id: where._id
            });
    }
}