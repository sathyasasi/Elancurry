var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var restify = require('restify');
var bunyan = require('bunyan');
var loadash = require('lodash');
var express = require('express');
var Menu = require('../models/menu.js');
var Response = require('../helpers/response.js');
var error = require('../helpers/errors.js');
var common = require('../helpers/common.js');
var mail = require('../helpers/mail.js');

//Add menu
exports.addmenu = function(req, res, next){
   var name = req.body.name;
   Menu.find({"name": name}, function(err, menu){
    if(menu != null && menu != ""){
    res.send(400,{menu:'already exists this menu item'});
    }
    else {
      jsonHelper.getMenuModel(req.body, function(newMenu){
        newMenu.save(function(err, menu){
         if(err) return next(err);
          res.send(200,{menu: menu});
          return next();
        });
      });
    }
  });
}

//update menu details
exports.updatemenu = function(req, res, next){
  var id = req.body.id;
  var name = req.body.name;
  var quantity = req.body.quantity;
  var price = req.body.price;
  var command = req.body.command;
  var image = req.body.image;
  Menu.findById(id, function(err, menu){
    if(err) return next(err);
    menu.name = name;
    menu.quantity = quantity;
    menu.price = price;
    menu.command = command;
    menu.image = image;
    menu.save(function(err, menu){
      if(err) next(err);
      res.send(200, {menu: menu});
      return next();
    });
  });
}


//view menu
exports.viewmenu = function(req, res, next){
var id = req.params.id;
Menu.findById(id,function(err,menu){
  if(menu != null && menu != ""){
    if (err) return next(err);
    res.send(200,{menu: menu});
    return next();
  }
else{
  res.send(400,{menu:'Not exist menu item'});
  return next();
}
});
}


//delete menu
exports.deletemenu = function(req, res, next){
  var id = req.params.id;
  Menu.findByIdAndRemove(id, function(err,menu){
    if(menu != null && menu != ""){
      if(err) throw err;
      console.log("menu deleted");
      res.send(200,{menu:'menu deleted'});
      return next();
    }
    else{
      res.send(400,{menu:'Not exist menu item'});
    }

  });

}
