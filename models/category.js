var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var currytype = ["mutton","chicken","fish"];
var deliveryStatus = [ "Success","Failed" ];
var oderStatus = ["odered","cancel"];

var currySchema = new mongoose.Schema({
  curryType : {type: String,enum:currytype},
  curryName:{type: String}
});
var purchaseSchema = new mongoose.Schema({
  quantity  : {type: Number},
  amount    : {type: Number},
  oderRequestDate :{type: Date},
  oderResponseDate :{type: Date},
  oderedStatus : {type: String, enum: oderStatus},
  delivered : {type: String, enum: deliveryStatus}
});

var categorySchema = new mongoose.Schema({
  customerName : {type: String},
  phone : {type: Number},
  deliveryAddress:
  {
    doorNo  : {type: String},
    street  : {type: String},
    city    : {type: String},
    state   : {type: String},
    pincode : {type: String}
  },
  curry : [currySchema],
  purchase : [purchaseSchema]

},{collection: 'category'});
var Category = mongoose.model('category', categorySchema);
module.exports = Category;
