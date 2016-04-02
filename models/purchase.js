var mongoose = require('mongoose');


var category = ["Mutton","Chicken","Fish"];
var deliveryStatus = ["Success","Failed" ];
var oderStatus = ["Odered","Cancel"];

var userpurchaseSchema = new mongoose.Schema({
  curryType : {type: String,enum:category},
  curryName:{type: String},
  Buyquantity  : {type: Number},
  Totalprice    : {type: Number},
  oderRequestdate  : {type: Date, default: Date.now },
  oderResponsedate : {type: Date},
  oderStatus : {type: String,enum:oderStatus},
  deliveredStatus : {type: String,enum:deliveryStatus},
});
var purchaseSchema = new mongoose.Schema({
  customerName : {type: String},
  phone : {type: Number},
  deliveryAddress:
  {
    doorNo  : {type: String},
    street  : {type: String},
    city    : {type: String},
    state   : {type: String},
    pincode : {type: Number}
  },
  userpurchase : [userpurchaseSchema]
//  mongoose.plugin(require('mongoose-list'));
},{collection: 'purchase'});


var Purchase = mongoose.model('purchase', purchaseSchema);
module.exports = Purchase;
