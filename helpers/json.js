var mongoose = require('mongoose');
var Menu = require('../models/menu');

module.exports.getMenuModel = function(data, callback){
  var newMenu = new Menu ({
    curryType: data.curryType,
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    image: data.image,
    command : data.command,
    createdAt: data.createdAt
  });
  callback(newMenu);
}
