/**
 * Created by liqian on 2017/3/9.
 *
*/


module.exports = {
    //返回排序后的菜单列表
    getMenuTree: function getMenuTree(list) {
        var counts = list.length;
        var result = [];
        for( var i=0; i<counts; i++ ) {
            if (list[i].parentId == 0) {
                var tmp = [];
                for( var j=0; j<counts; j++ ) {
                    if (list[i]._id == list[j].parentId) {
                        tmp.push(list[j]);
                    }
                }
                list[i].sub = tmp;
                result.push(list[i]);
            }
        }
        return result;
    }
}
