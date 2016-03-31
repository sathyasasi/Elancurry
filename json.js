var mongoose = require('mongoose');
var Menu = require('../models/menu');

module.exports.getMenuModel = function(data, callback){
  var newUser = new User ({
    name: data.name,
     quantity: data.quantity,
     price: data.price,
     image: data.image,
     imagetype: data.imagetype,
    command : data.command
  });
  callback(newMenu);
}
