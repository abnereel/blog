/**
 * Created by liqian on 2017/3/9.
 *
*/


module.exports = {
    /**
     * 返回排序后的菜单列表
     * @param list      需要做处理的菜单列表
     * @returns {Array} 处理后的菜单列表
     */
    getMenuTree: function getMenuTree(list) {
        var counts = list.length;
        var result = [];
        for( var i=0; i<counts; i++ ) {
            if (list[i].parentId == 0) {
                var tmp = [];
                for( var j=0; j<counts; j++ ) {
                    if (list[i]._id.toString() == list[j].parentId.toString()) {
                        tmp.push(list[j]);
                    }
                }
                list[i].sub = tmp;
                result.push(list[i]);
            }
        }
        return result;
    },

    /**
     * 分页
     * @param page          当前页数
     * @param counts        总数
     * @param limit         每页显示的数量
     * @param url           访问路径主要部分
     * @param pageField     分页的字段
     * @param midCounts     中间变化部分的个数（若为偶数，则会减一，考虑居中显示的效果）
     * @returns {string}    包含html标签的字符串
     */
    paging: function paging(page, counts, limit, url, pageField, midCounts) {

        //检查传入进来的参数
        page        = parseInt(page);
        counts      = parseInt(counts);
        limit       = parseInt(limit);
        midCounts   = parseInt(midCounts);
        if (isNaN(page) || isNaN(counts) || isNaN(limit) || isNaN(midCounts)) {
            throw new Error('类型错误');
        }
        midCounts   = midCounts % 2 == 0 ? midCounts - 1 : midCounts;

        //计算出最大页数
        var maxPage = 0;
        if (counts % limit == 0) {
            maxPage = counts / limit;
        } else {
            maxPage = Math.floor(counts / limit) + 1;
        }

        //若当前页超出最大页数，则不显示分页
        if (page > maxPage) {
            return '';
        }

        var firstPageText   = '首页';
        var lastPageText    = '尾页';
        var prePageText     = '上一页';
        var nextPageText    = '下一页';

        var firstPageUrl    = url + pageField + '=1';
        var lastPageUrl     = url + pageField + '=' + maxPage;
        var prePageUrl      = '';
        var nextPageUrl     = '';

        var leftPages       = '';
        var rightPages      = '';
        var currPage        = '';

        var start           = 0;
        var end             = 0;

        //生成prePageUrl
        if (page - 1 > 0) {
            prePageUrl = url + pageField + '=' + (page-1);
        } else {
            prePageUrl = firstPageUrl;
        }

        //生成nextPageUrl
        if (page + 1 > maxPage) {
            nextPageUrl = lastPageUrl;
        } else {
            nextPageUrl = url + pageField + '=' + (page+1);
        }

        //生成中间部分
        if (maxPage <= midCounts) {
            start = 1;
            end = maxPage;
        }
        if (maxPage > midCounts && page <= Math.floor(midCounts/2)+1) {
            start = 1;
            end = page + (midCounts - page);
        }
        if (maxPage > midCounts && page > Math.floor(midCounts/2)+1) {
            end = (page + Math.floor(midCounts/2)) > maxPage ? maxPage : (page + Math.floor(midCounts/2));
            start = end - (midCounts - 1);
        }
        for (var i=start; i<=end; i++) {
            if (i < page) {
                leftPages += `<a href="${url+pageField+'='+i}">${i}</a>`;
            } else if (i == page) {
                currPage = `<span>${i}</span>`
            } else {
                rightPages += `<a href="${url+pageField+'='+i}">${i}</a>`;
            }
        }

        return `<div class="paging">
                    <a href="${firstPageUrl}">${firstPageText}</a>
                    <a href="${prePageUrl}">${prePageText}</a>
                    ${leftPages}
                    ${currPage}
                    ${rightPages}
                    <a href="${nextPageUrl}">${nextPageText}</a>
                    <a href="${lastPageUrl}">${lastPageText}</a>
                </div>`;
    },

    /**
     * html代码转义
     * @param str           需要转义的字符串
     * @returns {string}    转义后的字符串
     */
    html_encode: function html_encode(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br/>");
        return s;
    },

    /**
     * html反转义
     * @param str           需要反转义的字符串
     * @returns {string}    反转义后的字符串
     */
    html_decode: function html_decode(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br\/>/g, "\n");
        return s;
    },


    /**
     * 生成随机数
     * @returns {string}    返回随机生成后的字符串
     */
    gen_fuc : function gen_fuc(){
        var str_ary = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H',
            'I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var str_num = 6,
            r_num = str_ary.length,
            text = '';
        for(var i=0;i<str_num;i++){
            var pos = Math.floor(Math.random()*r_num)
            text += str_ary[pos];//生成随机数
        }
        return text;
    }
}
