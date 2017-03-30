var config = require('config-lite');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb);
var Schema = mongoose.Schema;


/**
 * 前台菜单
 * parentId     父级 _id
 * name         名称
 * url          路径
 * icon         图标
 * deep         深度
 * listOrder    顺序（排序用）
 * sub          子菜单（缺省无，排序处理用的）
 * status       状态（显示、隐藏）
 */
var frontMenuSchema = new Schema({
    parentId: { type: Schema.Types.ObjectId },
    name: { type: String, unique: true },
    url: { type: String },
    icon: { type: String },
    deep: { type: Number },
    listOrder: { type: Number, default: 1 },
    sub: { type: Array, default: [] },
    status: { type: Boolean, default: 1 }
});
var FrontMenu = mongoose.model('FrontMenu', frontMenuSchema);
exports.FrontMenu = FrontMenu;


/**
 * 后台菜单
 * parentId     父级 _id
 * name         名称
 * url          路径
 * icon         图标
 * deep         深度
 * listOrder    顺序（排序用）
 * sub          子菜单（缺省无，排序处理用的）
 * status       状态（显示、隐藏）
 */
var behindMenuSchema = new Schema({
    parentId: { type: Schema.Types.ObjectId },
    name: { type: String, unique: true },
    url: { type: String },
    icon: { type: String },
    deep: { type: Number },
    listOrder: { type: Number, default: 1 },
    sub: { type: Array, default: [] },
    status: { type: Boolean, default: 1 }
});
var BehindMenu = mongoose.model('BehindMenu', behindMenuSchema);
exports.BehindMenu = BehindMenu;


/**
 * 文章
 * title        标题
 * author       作者
 * category     分类
 * keywords     关键词
 * source       来源
 * excerpt      描述
 * content      内容
 * views        查看次数
 * releaseTime  发布时间
 * status       状态（显示、隐藏）
 */
var postSchema = new Schema({
    title: { type: String },
    author: { type: String },
    category: { type: Schema.Types.ObjectId },
    keywords: { type: String },
    source: { type: String },
    excerpt: { type: String },
    content: { type: String },
    views: { type: Number, default: 0 },
    releaseTime: { type: Date },
    status: { type: Boolean, default: 1 }
});
var Post = mongoose.model('Post', postSchema);
exports.Post = Post;


/**
 * 评论
 * postId       文章 _id
 * name         评论者昵称
 * email        评论者Email
 * comment      评论内容
 */
var commentSchema = new Schema({
    postId: { type: Schema.Types.ObjectId },
    name: { type: String },
    email: { type: String },
    comment: { type: String }
});
var Comment = mongoose.model('Comment', commentSchema);
exports.Comment = Comment;


/**
 * 用户
 * name         用户名
 * password     用户密码（md5加密）
 */
var userSchema = new Schema({
    name: { type: String, unique: true },
    password: { type: String }
});
var User = mongoose.model('User', userSchema);
exports.User = User;











