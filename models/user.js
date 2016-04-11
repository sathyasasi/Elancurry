var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var common = require('../helpers/common.js');

var statustypes = ["Active","Inactive"];


var userSchema = new mongoose.Schema({
  name      : {type: String, required: true},
  email     : {type: String, required: true ,unique: true},
  phone     : {type: String, required: true, unique: true},
  password  : {type: String, required: true},
  accessToken: {type: String},
  address   : {type: String},
  status    : {type:String,enum:statustypes},
  createdAt : {type: Date,default: Date.now},
  updatedAt : {type: Date}
},{collection:'user'});


userSchema.methods.createSession = function (cb) {
  this.updatedAt = new Date();
  this.accessToken = common.rand();
  this.save(cb);
};

var User = mongoose.model('user', userSchema);

module.exports = User;
