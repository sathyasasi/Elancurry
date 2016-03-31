var mongoose = require('mongoose');

var category = ["Mutton","Chicken","Fish"];

var menuSchema = new mongoose.Schema({
  curryType : {type: String,enum:category},
  name      : {type: String},
  quantity  : {type: Number},
  price     : {type: Number},
  command   : {type: String},
  image     : {type: String},
  createdAt : {type: Date,default: Date.now}

},{collection:'menu'});

var Menu = mongoose.model('menu', menuSchema);
module.exports = Menu;
