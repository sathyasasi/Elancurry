var mongoose = require('mongoose');

var statustypes = ["Active","Inactive"];


var customerSchema = new mongoose.Schema({
  name      : {type: String, required: true},
  email     : {type: String, required: true ,unique: true},
  phone     : {type: String, required: true, unique: true},
  password  : {type: String, required: true},
  address   :
    {
      doorNo  : {type: String},
      street  : {type: String},
      city    : {type: String},
      state   : {type: String},
      pincode : {type: Number},
    },
  status    : {type:String,enum:statustypes},
  createdAt : {type: Date,default: Date.now},
  updatedAt : {type: Date},
  comments  : {type: String}
},{collection:'customer'});

var Customer = mongoose.model('customer', customerSchema);
module.exports = Customer;
