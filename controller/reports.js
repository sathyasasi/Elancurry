var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require("body-parser");
var restify = require('restify');
var bunyan = require('bunyan');
var loadash = require('lodash');
var Purchase = require('../models/purchase.js');
var User = require('../models/user.js');
var Response = require('../helpers/response.js');
var error = require('../helpers/errors.js');
var common = require('../helpers/common.js');
var mail = require('../helpers/mail.js');


//adding sales details
exports.addpurchase = function(req, res, next){
var purchase = new Purchase(req.body);
  purchase.save(function(err, purchase) {
  console.log("sales details added");
   res.send(200,{purchase: purchase});
   console.log(purchase);
  return next();
 });

}



//View Individual purchase record
exports.viewuserPurchase = function(req, res, next){
var id = req.params.id;
Purchase.findById(id,function(err,purchase){
  if(purchase !=null && purchase != "")
  {
    if(err) return next(err);
    res.send(200,{purchase: purchase});
    return next();
  }
  else{
    res.send(400,{purchase:'Not exist purchase'});
    return next();
  }

});
}


//purchase history
exports.purchaselist = function(req, res, next){
  var purchaseid = req.body.purchaseid;
  var customerId = req.body.customerId;


  Purchase.aggregate([
  {
      $unwind:"$userpurchase"
    }

  ], function(err, purchase){
    if(err){
      res.send(400,{purchase: 'error looking up purchase'});
    }
else
{
  res.send(200,{purchase: purchase});
}


});

}
