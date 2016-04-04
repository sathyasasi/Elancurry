var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var restify = require('restify');
var bunyan = require('bunyan');
var loadash = require('lodash');
var express = require('express');
var User = require('../models/user.js');
var error = require('../errors.js');
var common = require('../common.js').response;
var mail = require('../mail.js');

//Register user
exports.signupuser = function(req, res, next){
  var registeringUser = req.body.user;
  if(typeof registeringUser.phone == 'undefined' || registeringUser.phone == ''){
  res.status(200).send('phone is missing');
  return next();
} else {
  var phone = registeringUser.phone;
  if(phone.substr(0, 3) != '+91' && phone.split(phone.substr(0, 3))[1].length != 10) {
    res.status(200).send('Phone number should belong to India.');
    return next();
  }
}
if(typeof registeringUser.email == 'undefined' || registeringUser.email == ''){
    res.status(200).send('email is missing');
    return next();
  }

  User.findOne({'phone': registeringUser.phone}, function(err, user){
    if(err){
    res.status(200).send('error lookingup phone');
    return next(); }
    if(user){
     res.status(200).send('phone already exists');
      return next();
    } else if(!user){

      User.findOne({'email': registeringUser.email}, function(err, user){
        if(err){
        res.status(200).send('error lookingup email');
        return next(); }
        if(user){
          res.status(200).send('email already exists');
          return next();
        } else if(!user){
          registeringUser.status = 'Active';
          User.create(registeringUser, function(err, loggedInUser){
            if(err) error.processError(err, req, res);
            if(!loggedInUser){
              res.status(200).send('error saving in user');
              return next();
            }
            if(loggedInUser){
              loggedInUser.save(function(err, user){
                if(err){
                  console.log("err");
                  res.status(200).send('error logging in user');
                  return next();
                } else if(user){
                  user.password = '';
                  JSON.stringify(user);
                  console.log(user);
                   res.status(200).send(user);
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

//Login user
exports.loginuser = function(req, res, next){
  var user = req.body.user;
  var password = user.password;

  if((typeof user.email == 'undefined' && user.email == '') || (typeof user.phone == 'undefined' && user.phone == '') || (typeof user.password == 'undefined' && user.password == '')){
      res.status(200).send('login Id is missing');
      return next();
    }

  User.findOne({ $or:[{'phone': user.phone},{'customerId': user.password}]}, function(err, user){
    if(err){
      res.status(200).send('error lookingup user');
      return next();
    } else if(!user) {
      res.status(200).send('No customer exists');
      return next();
    } else if(user){
        if (password !== user.password) {
          res.status(200).send('Password is wrong');
          return next();
        } else {
        user.save(function(err, customer){
          if(err){
            res.status(200).send('error logging in customer');
            return next();
          } else if(user){
            res.status(200).send(user);
            return next();
          }
        });
      }
    }
  });
}

  //View Profile
exports.viewProfile = function(req, res, next){
  var id = req.params.id;
  User.findById(id,function(err,user){
    if(user != null && user != ""){
      res.status(200).send(user);
      return next();
    }
    else{
      res.status(200).send('invalid user');
      return next();
    }

  });
}

//update user details
exports.updateuser = function(req, res, next){
  var id = req.body.id;
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var address = req.body.address;
  var doorNo = req.body.doorNo;
  var street = req.body.street;
  var city = req.body.city;
  var state = req.body.state;
  var pincode = req.body.pincode;

  User.findById(id, function(err, user){
   if(err) return next(err);
   user.name = name;
   user.email = email;
   user.phone = phone;
   user.address = address;
   user.doorNo = doorNo;
   user.street = street;
   user.city = city;
   user.state = state;
   user.pincode = pincode;

   user.save(function(err, user){
     if(err) next(err);
       res.status(200).send(user);
       return next();
     });
   });
}

//Forgot password
exports.forgotPassword = function(req, res, next){
var email = req.params.email;
console.log(email);
User.findOne({'email':email}, function(err, user){
  if(err){
    res.status(200).send('Error looking up for email');
    return next();
  } else if(user) {
    mail.sendMail(user.email, 0, user.name, user._id, function(result){
        if(result == 1){
          res.status(200).send('Error sending mail');
          return next();
        } else {
        res.status(200).send('Mail Sent');
        return next();
      }
      });
  } else {
    res.status(200).send('No user found');
    return next();
  }
})

}

//sending the password file
exports.sendPasswordFile = function(req, res, next) {
  var id = req.params.id;
  var link = "http://elancuryy.herokuapp.com/api/user/forgotpassword/"+id;
  User.findById(id,function(err, user){
    if(user != null && user != ""){
    console.log(link);
    res.status(200).sendFile(path.resolve(__dirname, '../views', 'index.html'));
    console.log("sendfile");
    return next();
  }
  else {
    res.status(200).send("Sorry ,You are not an authorised user");
    return next();
  }
});
}

//Resetting Password
exports.changePassword = function(req,res,next){
 var id = req.body.id;
 var password = req.body.password;
 User.findById(id,function(err, user){
   if(user != null && user != ""){
     user.password = password;
     user.save(function(err, user)
       {
        if(err) return next(err);
         console.log(user.name);
         res.status(200).send("Password Successfully resetted"+ user.password);
         console.log(user.password);
         return next();
       });
      }
   else {
   res.status(200).send("Invalid user");
   return next();
 }
});
}

//Logout user
exports.logout = function(req,res,next){
  var id = req.params.id;
  User.findById(id,function(err,user){
    if(user!= null && user!= ""){
       res.status(200).send("Logged out Successfully");
       return next();
     }
     else {
       res.status(200).send("Invalid User");
       return next();
     }
  });
}
