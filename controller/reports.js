var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var restify = require('restify');
var bunyan = require('bunyan');
var loadash = require('lodash');
var Purchase = require('../models/purchase.js');
var async = require('async');


//adding sales details
exports.addpurchase = function(req, res, next){
var purchase = new Purchase(req.body);
 purchase.save(function(err, purchase) {
 if(err) return next(err);
 console.log("sales details added");
  res.send(purchase);
  console.log(purchase);
 return next();
});
}

//View Individual purchase record
exports.viewuserPurchase = function(req, res, next){
var id = req.params.id;
Purchase.findById(id,function(err,purchase){
  if (err) return next(err);
  res.send(purchase);
  return next();
});
}

exports.viewdatelist = function(req,res,next){
var purchaseid = req.body.purchaseid;
var customerid = req.body.customerid;

Purchase.find({
'purchaseid':purchaseid
//'customerid':customerid
 }, 'id customerName phone deliveryAddress doorNo street city state pincode userpurchase id curryType curryName  Buyquantity Totalprice oderRequestdate oderResponsedate oderStatus deliveredStatus',
{
  limit: 3,
  sort:{
        'requestedTime': -1 //Sort by Date Added DESC
    }
}, function(err, purchase){
  if(err){
    console.log("err");
    res.send("error looking up for report history ");
    return next();
  } else if(!purchase){
    console.log("not found");
    res.send("No reports found ");
    return next();
  } else {
    console.log("purchase");
    console.log(purchase);
    res.send(purchase);
    return next();
  }
})
}
