var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var restify = require('restify');
var bunyan = require('bunyan');
var loadash = require('lodash');
var Purchase = require('../models/purchase.js');

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


//View Induv purchase
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
    var oderRequestdate = req.body.oderRequestdate;
Purchase.find({
'purchaseid' : purchaseid
}, 'id customerName deliveryAddress doorNo street city state pincode curry curryType curryName  purchase quantity amount oderRequestdate oderResponsedate oderStatus deliveryStatus',
{
  limit: 10,
  sort:{
        'requestedTime': -1 //Sort by Date Added DESC
    }
}, function(err, purchase){
  if(err){
    res.send("error looking up for report history ");
    return next();
  } else if(!purchase){
    res.send("No reports found ");
    return next();
  } else {
    res.send(purchase);
    return next();
  }
})
}



exports.viewitemlist = function(req,res,next){
  var categoryid = req.body.categoryid;
  var curryName = req.body.curryName;
Category.find({
'categoryid' : categoryid
}, 'curry  curryType curryName',
{
  limit: 10,
  sort:{
        'requestedTime': -1 //Sort by Date Added DESC
    }
}, function(err, category){
  category.curryName = curryName;
  if(err){
    res.send("error looking up for report history ");
    return next();
  } else if(!category){
    res.send("No reports found ");
    return next();
  } else {
    res.send(curry);
    console.log(curry);
    return next();
  }
})
}
