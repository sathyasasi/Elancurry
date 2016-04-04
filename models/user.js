var mongoose = require('mongoose');

var statustypes = ["Active","Inactive"];


var userSchema = new mongoose.Schema({
  name      : {type: String, required: true},
  email     : {type: String, required: true ,unique: true},
  phone     : {type: String, required: true, unique: true},
  password  : {type: String, required: true},
  address   : {type: String},
  status    : {type:String,enum:statustypes},
  createdAt : {type: Date,default: Date.now},
  updatedAt : {type: Date}
},{collection:'user'});

//Virtual properties
userSchema.path('name').validate(function (value) {
  return value && (value.length >= 3 && value.length <= 64);
}, 'Name should be between 3 and 64 characters long.');

userSchema.path('phone').validate(function (value) {
  return (
    typeof value === 'string' &&
      // India
      (value.substr(0, 3) === '+91' && value.split(value.substr(0, 3))[1].length === 10)
  );
}, 'Phone number should belong to India.');

userSchema.set('toObject', { getters: true, virtuals: true });
userSchema.set('toJSON', { getters: true, virtuals: true });

// Instance methods
userSchema.methods.toJSON = function () {
  return {
    _id: this.id,
    name: this.name,
    phone: this.phone,
    email: this.email,
    password: this.password,
    address: this.address,
    status : this.status,
    createdAt:this.createdAt,
    updatedAt: this.updatedAt,
  };
};

userSchema.methods.createSession = function (cb) {
  this.save(cb);
};

/**
 * Static Methods
 */

// Method to create a user object
userSchema.statics.create = function (userObject, callback) {
  //var self = this;
  //var newUser = new self(userObject);
  //newUser.save(function (error, createdUser) {
  //  callback(error, createdUser);
  //});
  new this(userObject).save(callback); //8-)
};


// Ensure that the thumb rules for user model are followed by... ALL
userSchema.pre('save', function (next) {
  // When there is a problem, populate err and
  // let it passed on to the next() at the end
  var err = null;

  // 1. Validation #1

  next(err);
});

mongoose.model('user', userSchema);
