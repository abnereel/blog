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
     * @param limit         每页数量
     * @param skip          跳过的数量
     */
    getSlidesList: function (limit, skip) {
        return Slide
            .find({ status: 1 })
            .skip(skip)
            .limit(limit)
            .sort({ listOrder: 1 })
    },

    /**
     * 获取幻灯片数量
     * @returns {*|Query}   总条数
     */
    getSlideCounts: function () {
        return Slide
            .count({ status: 1 })
    },

    /**
     * 根据 _id 获取幻灯片
     * @param _id           幻灯片 _id
     * @returns {Query|*}
     */
    getSlideById: function (_id) {
        return Slide
            .findOne({ _id: _id });
    },

    /**
     * 根据 category 获取幻灯片
     * @param category      幻灯片 分类标识category
     * @returns {Query|*}
     */
    getSlideByCategory: function (category) {
        return Slide
            .findOne({ category: category });
    },

    /**
     * 根据 _id 更新幻灯片
     * @param slide         幻灯片对象
     */
    updateSlideById: function (slide) {
        return Slide
            .update({ _id: slide._id }, { $set: slide });
    },

    /**
     * 根据 _id 删除幻灯片
     * @param _id           幻灯片 _id
     */
    deleteSlideById: function (_id) {
        return Slide
            .remove({ _id: _id });
    }
}