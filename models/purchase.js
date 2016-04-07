var mongoose = require('mongoose');

var deliveryStatus = ["Success","Failed" ];
var oderStatus = ["Odered","Cancel"];

var userpurchaseSchema = new mongoose.Schema({

  itemName:{type: String},
  quantity: {type: Number},
  cost: {type: Number},
  Total: {type: Number},
  oderRequestdate  : {type: Date, default: Date.now },
  oderResponsedate : {type: Date},
  oderStatus : {type: String,enum:oderStatus},
  deliveredStatus : {type: String,enum:deliveryStatus},
});
var purchaseSchema = new mongoose.Schema({
  customerName : {type: String},
  phone : {type: Number},
  deliveryAddress: {type: String},
  userpurchase : [userpurchaseSchema]
},{collection: 'purchase'});


var Purchase = mongoose.model('purchase', purchaseSchema);
module.exports = Purchase;
