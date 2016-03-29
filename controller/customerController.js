var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var restify = require('restify');
var bunyan = require('bunyan');
var loadash = require('lodash');
var Customer = require('../models/customer.js');
var error = require('../errors.js');
var common = require('../common.js').response;
var mail = require('../mail.js');

exports.signupcustomer = function(req, res, next){
  var registeringCustomer = req.body.customer;
  if(typeof registeringCustomer.phone == 'undefined' || registeringCustomer.phone == ''){
  res.send('phone is missing');
  return next();
} else {
  var phone = registeringCustomer.phone;
  if(phone.substr(0, 3) != '+91' && phone.split(phone.substr(0, 3))[1].length != 10) {
    res.send('Phone number should belong to India.');
    return next();
  }
}

if(typeof registeringCustomer.email == 'undefined' || registeringCustomer.email == ''){
    res.send('email is missing');
    return next();
  }

  Customer.findOne({'phone': registeringCustomer.phone}, function(err, customer){
    if(err){
    res.send('error lookingup phone');
    return next(); }
    if(customer){
     res.send('phone already exists');
      return next();
    } else if(!customer){

      Customer.findOne({'email': registeringCustomer.email}, function(err, customer){
        if(err){
        res.send('error lookingup email');
        return next(); }
        if(customer){
          res.send('email already exists');
          return next();
        } else if(!customer){
          registeringCustomer.status = 'Active';
          Customer.create(registeringCustomer, function(err, loggedInCustomer){
            if(err) error.processError(err, req, res);
            if(!loggedInCustomer){
              res.send('error saving in user');
              return next();
            }
            if(loggedInCustomer){
              loggedInCustomer.save(function(err, customer){
                if(err){
                  console.log("err");
                  res.send('error logging in user');
                  return next();
                } else if(customer){
                  customer.password = '';
                  JSON.stringify(customer);
                  console.log(customer);
                  res.send(customer);
                  return next();
                }
              });
            }
          });
        }
      });
    }
  });
}

exports.logincustomer = function(req, res, next){
  var customer = req.body.customer;
  var password = customer.password;

  if((typeof customer.email == 'undefined' && customer.email == '') || (typeof customer.phone == 'undefined' && customer.phone == '') || (typeof customer.password == 'undefined' && customer.password == '')){
      res.send('login Id is missing');
      return next();
    }

  Customer.findOne({ $or:[{'phone': customer.phone},{'email': customer.email},{'customerId': customer.password}]}, function(err, customer){
    if(err){
      res.send('error lookingup user');
      return next();
    } else if(!customer) {
      res.send('No customer exists');
      return next();
    } else if(customer){
        if (password !== customer.password) {
          res.send('Password is wrong');
          return next();
        } else {
        customer.save(function(err, customer){
          if(err){
            res.send('error logging in customer');
            return next();
          } else if(customer){
            res.send(customer);
            return next();
          }
        });
      }
    }
  });
}

//Forgot password
exports.forgotPassword = function(req, res, next){
var email = req.params.email;
console.log(email);
Customer.findOne({'email':email}, function(err, customer){
  if(err){
    res.send('Error looking up for email');
    return next();
  } else if(customer) {
    mail.sendMail(customer.email, 0, customer.name, customer._id, function(result){
        if(result == 1){
          res.send('Error sending mail');
          return next();
        } else {
        res.send('Mail Sent');
        return next();
      }
      });
  } else {
    res.send('No user found');
    return next();
  }
})

}

//sending the password file
exports.sendPasswordFile = function(req, res, next) {
  var id = req.params.id;
  var link = "http://127.0.0.1:27017/api/customer/forgotpassword/"+id;
  Customer.findById(id,function(err, customer){
    if(customer != null && customer != ""){
    console.log(link);
    res.sendfile(path.resolve(__dirname, '../views', 'index.html'));
    console.log("sendfile");
    return next();
  }
  else {
    res.send("Sorry ,You are not an authorised user");
    return next();
  }
});
}

//Resetting Password
exports.changePassword = function(req,res,next){
 var id = req.body.id;
 var password = req.body.password;
 Customer.findById(id,function(err, customer){
 if(err) return next(err);
 customer.password = password;
 customer.save(function(err, customer)
   {
    if(err) throw err;
     console.log(customer.name);
     res.send("Password Successfully resetted"+ customer._password);
     console.log(customer.password);
     return next();
   });
 });
}


exports.logout = function(req,res,next){
  var id = req.params.id;
  Customer.findById(id,function(err,customer){
    if(customer!= null && customer!= ""){
       res.send("Logged out Successfully");
       return next();
     }
     else {
       res.send("Invalid User");
       return next();
     }
  });
}
