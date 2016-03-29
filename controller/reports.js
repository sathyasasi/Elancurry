var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var restify = require('restify');
var bunyan = require('bunyan');
var loadash = require('lodash');
var Catagory = require('../models/category.js');

//adding sales details
exports.addpurchase = function(req, res, next){
 var catagory = new Catagory(req.body);
 catagory.save(function(err,catagory) {
 if(err) return next(err);
 console.log("sales details added");
  res.send(catagory);
  console.log(catagory);
 return next();
});
}



exports.viewdatelist = function(req,res,next){
  var purchasedate = req.body.purchasedate;
Catagory.find({
  'purchasedate':purchasedate
}, 'id customerName deliveryAddress doorNo street city state pincode curryType curryName quantity amount purchasedate ',
{
  limit: 10,
  sort:{
        'requestedTime': -1 //Sort by Date Added DESC
    }
}, function(err, catagory){
  if(err){
    res.send("error looking up for report history ");
    return next();
  } else if(!catagory){
    res.send("No reports found ");
    return next();
  } else {
    res.send(catagory);
    return next();
  }
})
}
