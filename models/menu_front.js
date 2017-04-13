var FrontMenu = require('../lib/mongo').FrontMenu;

module.exports = {
    /**
     * 新增菜单
     * @param menu          菜单对象
     * @returns {menu}
     */
    create: function (menu) {
        return FrontMenu.create(menu);
    },

    /**
     * 查询所有菜单（不包括隐藏的）
     */
    getMenuList: function() {
        return FrontMenu
            .find({ status: true })
            .sort({ deep: 1, listOrder: 1 });
    },

    /**
     * 查询所有菜单（包括隐藏的）
     */
    getMenuListAll: function() {
        return FrontMenu
            .find()
            .sort({ deep: 1, listOrder: 1 });
    },

    /**
     * 根据Url查找菜单
     * @param url           菜单url
     * @returns {*|Query}
     */
    getMenuByUrl: function (url) {
        return FrontMenu
            .findOne({ url: url });
    },

    /**
     * 根据_id查找指定菜单内容
     * @param _id           菜单 _id
     * @returns {*|Query}
     */
    getMenuById: function(_id) {
        return FrontMenu
            .findOne({ _id: _id });
    },

    /**
     * 根据_id查找子菜单
     * @param _id           菜单 _id
     */
    getSubMenuById: function(_id) {
        return FrontMenu
            .find({ parentId: _id });
    },

    /**
     * 根据指定_id更新菜单内容
     * @param menu          菜单对象
     */
    updateMenuById: function(menu) {
        return FrontMenu
            .update({ _id: menu._id }, {$set: menu});
    },

    /**
     * 根据指定_id删除菜单
     * @param _id           菜单 _id
     */
    deleteMenuById: function(_id) {
        return FrontMenu
            .remove({ _id: _id });
    }
}