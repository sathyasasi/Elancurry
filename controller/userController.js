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
  res.send(400,{user:'phone is missing'});
  return next();
} else {
  var phone = registeringUser.phone;
  if(phone.substr(0, 3) != '+91' && phone.split(phone.substr(0, 3))[1].length != 10) {
    res.send(400,{user:'Phone number should belong to India.'});
    return next();
  }
}

if(typeof registeringUser.email == 'undefined' || registeringUser.email == ''){
    res.send(400,{user:'email is missing'});
    return next();
  }

  User.findOne({'phone': registeringUser.phone}, function(err, user){
    if(err){
    res.send(400,{user:'error lookingup phone'});
    return next();
  }
    if(user){
      res.send(400,{user:'phone already exists'});
      return next();
    } else if(!user){
      User.findOne({'email': registeringUser.email}, function(err, user){
        if(err){
        res.send(400,{user:'error lookingup email'});
        return next(); }
        if(user){
          res.send(400,{user:'email already exists'});
          return next();
        } else if(!user){
          registeringUser.status = 'Active';
          User.create(registeringUser, function(err, loggedInUser){
            if(err) error.processError(err, req, res);
            if(!loggedInUser){
              res.send(400,{user:'error saving in user'});
              return next();
            }
            if(loggedInUser){
              loggedInUser.createSession(function(err, user){
                if(err){
                  res.send(400,{user:'error logging in user'});
                  return next();
                } else if(user){
                  user.password = '';
                  JSON.stringify(user);
                  res.send(200,{user: user});
                  //res.send(new Response.respondWithData(user));
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
  var phone = req.body.phone;
  var password = user.password;

  if(typeof user.phone == 'undefined' || user.phone == ''){
    res.send(400,{user:'phone is missing'});
    return next();
  } else {
    var phone = user.phone;
    if(phone.substr(0, 3) != '+91' && phone.split(phone.substr(0, 3))[1].length != 10) {
      res.send(400,{user:'Phone number should belong to India.'});
      return next();
    }
  }

if(typeof user.password == 'undefined' || user.password == ''){
      res.send(400,{user:'password is missing'});
      return next();
    }


  User.findOne({'phone': user.phone}  || {'password': user.password}, function(err, user){
    if(err){
      res.send(400,{user:'error lookingup user'});
      return next();
    } else if(!user) {
      res.send(400,{user:'No user exists'});
      return next();
    } else if(user){
        //  var existing = common.decrypt(user.password);
          if (password !== user.password) {
              console.log(Response.statusCode);
          res.send(400,{user:'Password is wrong'});
          return next();
        } else {
        user.createSession(function(err, user){
          if(err){
            res.send(400,{user:'error logging in user'});
            return next();
          } else if(user){
            console.log(Response.statusCode);
              res.send(200,{user: user});
              //res.send(new Response.respondWithData(user));
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
     res.send(200,{user: user});
     return next();
   }
   else{
     res.send(400,{user:'invalid user'});
     return next();
   }

 });
}

//update user details
/*exports.updateuser = function(req, res, next){
  var user = req.user;
  var data = req.body.user;

  user.name = data.name;
  user.email = data.email;
  user.phone = data.phone;
  user.address = data.address;
  user.updatedAt = new Date();
  user.save(function(err, user){
    if(err){
      res.send(400,{user:'error updating user profile'});
      return next();
    } else {
      res.send(200,{user: user});
      return next();
    }
  });
}*/

exports.updateuser = function(req, res, next){
  var user = req.body.user;
  var id = req.body.id;
  var name = req.body.name;
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
      res.send(200, {user: user});
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
    res.send(400,{user:'Error looking up for email'});
    return next();
  } else if(user) {
    mail.sendMail(user.email, 0, user.name, user._id, function(result){
        if(result == 1){
          res.send(400,{user:'Error sending mail'});
          return next();
        }
        else {
        res.send(200,{user:'MailSent'});
        return next();
      }
      });
  }
  else {
    res.send(400,{user:'No user found'});
    return next();
  }
});

}

//sending the password file
exports.sendPasswordFile = function(req, res, next) {
  debugger;
  var id = req.params.id;
  var link = "http://127.0.0.1:52320/api/user/sendfile"+id;
  User.findById(id,function(err, user){
    if(user != null && user != ""){
    console.log(link);
      res.send(200,{user:path.join(__dirname, '../views', 'index.html')});
      //res.send(200,{user:'index.html',root: path.join(__dirname, '../views')});

   //res.sendFile(200,{user: path.resolve(__dirname, '../views', 'index.html')});

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
 User.findById(id,function(err, user){
 if(err) return next(err);
 user.password = password;
 user.save(function(err, user)
   {
    if(err) throw err;
     console.log(user.name);
     res.send(200, {user: "Password Successfully resetted"+ user.password});
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
