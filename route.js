var userController = require('./controller/userController.js');
var reports = require('./controller/reports.js');
var menu = require('./controller/menu.js');



module.exports = function (app){

 app.get('/', function(req, res) {
    res.send(200, {Welcome: true});
  });

app.post('/api/user/signup', userController.signupuser);
app.post('/api/user/login', userController.loginuser);
app.get('/api/user/viewprofile/:id',userController.viewProfile);
app.post('/api/userupdate',userController.updateuser);
app.get('/api/user/forgotpassword/:email',userController.forgotPassword);
app.get('/api/user/sendfile/:id',userController.sendPasswordFile);
app.post('/api/user/changepassword',userController.changePassword);
app.post('/api/user/logout/:id',userController.logout);

app.post('/api/addmenu',menu.addmenu);
app.post('/api/updatemenu',menu.updatemenu);
app.get('/api/viewmenu/:id',menu.viewmenu);
app.del('/api/deletemenu/:id',menu.deletemenu);

app.post('/api/addpurchase',reports.addpurchase);
app.get('/api/user/purchase/:id',reports.viewuserPurchase);
app.post('/api/viewdatelist',reports.purchaselist);
}
