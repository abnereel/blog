var BehindMenu = require('../lib/mongo').BehindMenu;

module.exports = {
    /**
     * 新增菜单
     * @param menu          菜单对象
     * @returns {menu}
     */
    create: function (menu) {
        return BehindMenu.create(menu);
    },

    /**
     * 查询所有菜单（不包括隐藏的）
     */
    getMenuList: function() {
        return BehindMenu
            .find({ status: true })
            .sort({ deep: 1, listOrder: 1 });
    },

    /**
     * 查询所有菜单（包括隐藏的）
     */
    getMenuListAll: function() {
        return BehindMenu
            .find()
            .sort({ deep: 1, listOrder: 1 });
    },

    /**
     * 根据_id查找指定菜单内容
     * @param _id           菜单 _id
     * @returns {*|Query}
     */
    getMenuById: function(_id) {
        return BehindMenu
            .findOne({ _id: _id });
    },

    /**
     * 根据_id查找子菜单
     * @param _id           菜单 _id
     */
    getSubMenuById: function(_id) {
        return BehindMenu
            .find({ parentId: _id });
    },

    /**
     * 根据指定_id更新菜单内容
     * @param menu          菜单对象
     */
    updateMenuById: function(menu) {
        return BehindMenu
            .update({ _id: menu._id }, {$set: {
                parentId: menu.parentId,
                name: menu.name,
                icon: menu.icon,
                url: menu.url,
                status: menu.status,
                deep: menu.deep,
                listOrder: menu.listOrder
            }});
    },

    /**
     * 根据指定_id删除菜单
     * @param _id           菜单 _id
     */
    deleteMenuById: function(_id) {
        return BehindMenu
            .remove({ _id: _id });
    }
}