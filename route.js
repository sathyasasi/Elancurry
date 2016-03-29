var customerController = require('./controller/customerController.js');
var reports = require('./controller/reports.js');



module.exports = function (app){

 app.get('/', function(req, res) {
    res.send(200, {Welcome: true});
  });

app.post('/api/customer/signup', customerController.signupcustomer);
app.post('/api/customer/login', customerController.logincustomer);
app.get('/api/customer/forgotpassword/:email',customerController.forgotPassword);
app.get('/api/customer/sendfile/:id',customerController.sendPasswordFile);
app.post('/api/customer/changepassword',customerController.changePassword);
app.post('/api/customer/logout/:id',customerController.logout);
app.post('/api/addpurchase',reports.addpurchase);
app.post('/api/viewdatelist',reports.viewdatelist);
}
