var mongoose = require('mongoose');

var statustypes = ["Active","Inactive"];


var userSchema = new mongoose.Schema({
  name      : {type: String, required: true},
  email     : {type: String, required: true ,unique: true},
  phone     : {type: String, required: true, unique: true},
  password  : {type: String, required: true},
  address   : {type: String},
  status    : {type:String,enum:statustypes},
  createdAt : {type: Date,default: Date.now},
  updatedAt : {type: Date}
},{collection:'user'});

var User = mongoose.model('user', userSchema);
module.exports = User;
