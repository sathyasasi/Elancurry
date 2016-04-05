exports.response = function(status,data){
  this.status = status;
  this.data = data;
}


exports.error = function(error, req, res){
  console.log("Error:" + error);
  res.status(400);
  res.json({
    'status': 'Error',
      'code': 400,
      'errors': error
  });
}

exports.respondWithData = function(data){
  //this.data = data;
  //this.status = status;
  this.data = data;
}
