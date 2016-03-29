var mailer = require("nodemailer");

// Use Smtp Protocol to send Email
var smtpTransport = mailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "sathya29mca@gmail.com",
        pass: "cardrice"
    }
});

function sendMail(to, body, name, id, callback){
  var html = '', subject = '';

  switch(body){
    case 0:
      link = "http://127.0.0.1:27017/api/customer/forgotpassword/"+id
      subject = "Elancurry - Forgot Password",
      html = "Hello " + name + ", <br> Please click <a href="+ link + ">here</a> to change your password";
      break;
  }

  var mail = {
      from: "Elancurry  <noreply.sasi29mca@gmail.com>",
      to: to,
      subject: subject,
      html: html
  }

  smtpTransport.sendMail(mail, function(error, response){
      if(error){
          console.log(error);
          callback(1);
      } else{
          console.log("Mail sent: " + response.message);
          smtpTransport.close();
          callback(0);
      }
  });
}

exports.sendMail = sendMail;
