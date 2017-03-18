var config = require('config-lite');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb);
var Schema = mongoose.Schema;


//前台菜单
var frontMenuSchema = new Schema({
    parentId: { type: String },
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


//后台菜单
var behindMenuSchema = new Schema({
    parentId: { type: String },
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


//文章
var postSchema = new Schema({
    title: { type: String },
    author: { type: String },
    category: { type: Schema.Types.ObjectId },
    keywords: { type: String },
    source: { type: String },
    excerpt: { type: String },
    content: { type: String },
    releaseTime: { type: Date },
    status: { type: Boolean, default: 1 }
});
var Post = mongoose.model('Post', postSchema);
exports.Post = Post;
