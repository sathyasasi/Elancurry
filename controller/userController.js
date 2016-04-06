var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var restify = require('restify');
var bunyan = require('bunyan');
var Response = require('../helpers/response.js');
var error = require('../helpers/errors.js');
var common = require('../helpers/common.js');
var mail = require('../helpers/mail.js');
var User = require('../models/user.js');
var express = require('express');
var app = express();




exports.signupuser = function(req, res, next){
  var registeringUser = req.body.user;

  if(typeof registeringUser.phone == 'undefined' || registeringUser.phone == ''){
  res.send('phone is missing');
  return next();
} else {
  var phone = registeringUser.phone;
  if(phone.substr(0, 3) != '+91' && phone.split(phone.substr(0, 3))[1].length != 10) {
    res.send('Phone number should belong to India.');
    return next();
  }
}

if(typeof registeringUser.email == 'undefined' || registeringUser.email == ''){
    res.send('email is missing');
    return next();
  }

  User.findOne({'phone': registeringUser.phone}, function(err, user){
    if(err){
    res.send('error lookingup phone');
    return next();
  }
    if(user){
      res.send('phone already exists');
      return next();
    } else if(!user){
      User.findOne({'email': registeringUser.email}, function(err, user){
        if(err){
        res.send('error lookingup email');
        return next(); }
        if(user){
          res.send('email already exists');
          return next();
        } else if(!user){
          registeringUser.status = 'Active';
          User.create(registeringUser, function(err, loggedInUser){
            if(err) error.processError(err, req, res);
            if(!loggedInUser){
              res.send('error saving in user');
              return next();
            }
            if(loggedInUser){
              loggedInUser.save(function(err, user){
                if(err){
                  res.send('error logging in user');
                  return next();
                } else if(user){
                  //user.password = '';
                  //user.updatedAt = '';
                  JSON.stringify(user);
                  res.send(new Response.respondWithData(user));
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

exports.loginuser = function(req, res, next){
  var user = req.body.user;
  var password = user.password;

  if(typeof user.phone == 'undefined' || user.phone == ''){
    res.send('phone is missing');
    return next();
  } else {
    var phone = user.phone;
    if(phone.substr(0, 3) != '+91' && phone.split(phone.substr(0, 3))[1].length != 10) {
      res.send('Phone number should belong to India.');
      return next();
    }
  }

if(typeof user.password == 'undefined' || user.password == ''){
      res.send('password is missing');
      return next();
    }


  User.findOne({'phone': user.phone}  || {'password': user.password}, function(err, user){
    if(err){
      res.send('error lookingup user');
      return next();
    } else if(!user) {
      res.send('No user exists');
      return next();
    } else if(user){
          //var existing = common.decrypt(user.password);
          if (password !== user.password) {
          res.send('Password is wrong');
          return next();
        } else {
        user.save(function(err, user){
          if(err){
            res.send('error logging in user');
            return next();
          } else if(user){
            res.send(new Response.respondWithData(user));
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
     res.send(user);
     return next();
   }
   else{
     res.send('invalid user');
     return next();
   }

 });
}
//update user details
exports.updateuser = function(req, res, next){

 var id = req.body.id;
  var email = req.body.email;
  var phone = req.body.phone;
  var address = req.body.address;

  User.findById(id, function(err, user){
   if(err) return next(err);
   user.name = name;
   user.email = email;
   user.phone = phone;
   user.address = address;


   user.save(function(err, user){
     if(err) next(err);
       res.send(user);
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
    res.send('Error looking up for email');
    return next();
  } else if(user) {
    mail.sendMail(user.email, 0, user.name, user._id, function(result){
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
  var link = "http://elancuryy.herokuapp.com/api/user/forgotpassword/"+id;
  User.findById(id,function(err, user){
    if(user != null && user != ""){
    console.log(link);
    app.get('/',function(req, res){
  res.sendfile(path.join(__dirname+'/index.html'));
});
    //res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
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
 console.log("got");
 User.findById(id,function(err, user){
 if(err) return next(err);
 console.log("got1")
 user.password = password;
 user.save(function(err, user)
   {
    if(err) throw err;
     console.log(user.name);
     res.send("Password Successfully resetted"+ user.password);
     console.log(user.password);
     return next();
   });
 });
}

//Logout user
exports.logout = function(req,res,next){
  var id = req.params.id;
  User.findById(id,function(err,user){
    if(user!= null && user!= ""){
       res.send("Logged out Successfully");
       return next();
     }
     else {
       res.send("Invalid User");
       return next();
     }
  });
}
