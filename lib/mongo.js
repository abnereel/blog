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
 * imgPath      图片路径
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
    imgPath: { type: String },
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
 * role         角色
 * status       状态（有效、无效）
 * lastLogin    最后登录时间
 */
var userSchema = new Schema({
    name: { type: String, unique: true },
    password: { type: String },
    role: { type: Number, default: 1 },
    status: { type: Boolean, default: 1 },
    lastLogin: { type: Date }
});
var User = mongoose.model('User', userSchema);
exports.User = User;


/**
 * 幻灯片
 * name         标题
 * category     分类标识
 * excerpt      描述
 * url          跳转地址
 * imgPath      图片路径
 * listOrder    顺序（排序用）
 * status       状态（显示、隐藏）
 */
var slideSchema = new Schema({
    name: { type: String },
    category: { type: String },
    excerpt: { type: String },
    url: { type: String },
    imgPath: { type: String },
    listOrder: { type: Number},
    status: { type: Boolean, default: 1 }
});
var Slide = mongoose.model('Slide', slideSchema);
exports.Slide = Slide;


/**
 * session会话
 * session      session对象数据
 * expires      过期时间
 */
var sessionSchema = new Schema({
    session: { type: String },
    expires: { type: Date }
});
var Session = mongoose.model('Session', sessionSchema);
exports.Session = Session;


/**
 * 日志记录
 * nameId       操作用户_id
 * name         操作用户当时名称
 * role         操作用户当时权限
 * ip           操作用户当时IP地址
 * action       操作类型
 * time         操作时间
 */
var logSchema = new Schema({
    nameId: { type: Schema.Types.ObjectId },
    name: { type: String },
    role: { type: Number },
    ip: { type: String },
    action: { type: String },
    time: { type: Date }
});
var Log = mongoose.model('Log', logSchema);
exports.Log = Log;








