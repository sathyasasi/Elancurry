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
var phone = req.body.phone;

   Purchase.find({"phone": phone}, function(err, menu){
    if(menu != null && menu != ""){
       if(err) return next(err);
    res.send("already exists phone number");
    }
else{
  purchase.save(function(err, purchase) {
  console.log("sales details added");
   res.send(purchase);
   console.log(purchase);
  return next();
 });
}
 });
}

//View Individual purchase record
exports.viewuserPurchase = function(req, res, next){
var id = req.params.id;
Purchase.findById(id,function(err,purchase){
  if(purchase !=null && purchase != "")
  {
    if(err) return next(err);
    res.send(purchase);
    return next();
  }
  else{
    res.send('Not exist purchase');
    return next();
  }

});
}


//purchase history
exports.viewdatelist = function(req, res, next){
 var id = req.body.id;
 console.log("got id");
 Purchase.aggregate([
   {
     $match :
     {
     "id" : id
   }
   },
   {
     $limit: 10
   },
   {$sort :{
     'oderRequestdate': 1
    }}],function(err, purchase){
   console.log(purchase);
 if(err) return next(err);
 if(purchase != '' && purchase != null)
 {
   res.send(purchase);
   console.log("purchase detail found");
 }
 else {
   res.send('purchase details not found');
   console.log("purchase details not found");
 }
});
}
