var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var path = require('path');
var restify = require('restify');
var bunyan = require('bunyan');
var loadash = require('lodash');
var Menu = require('../models/menu.js');

//Add menu
exports.addmenu = function(req, res, next){
var menu = new Menu(req.body);
var name = req.body.name;
Menu.find({'name': name}, function(err, menu){
  if(menu !=null && menu!= ""){
    res.send('menu item is already exist');
  }
  else {
    menu.save(function(err, menu) {
    if(err) return next(err);
    console.log("menu details added");
     res.send(menu);
     console.log(menu);
    return next();
    });
  }
});
}



//update menus
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
      res.send(menu);
      return next();
    })
  })
}


//view menu

exports.viewmenu = function(req, res, next){
var id = req.params.id;
Menu.findById(id,function(err,menu){
  if (err) return next(err);
  res.send(menu);
  return next();
});
}


//delete menu
exports.deletemenu = function(req, res, next){
  var menuid = req.body.menuid;
  Menu.findByIdAndRemove(id, function(err){
    if(err) throw err;
    console.log("menu deleted");
    res.send('menu deleted');
  })

}
