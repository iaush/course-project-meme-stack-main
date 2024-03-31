const { Schema, model, ObjectId } = require('mongoose');
var bcrypt = require('bcryptjs');
const saltRounds = 10;

var UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
    },
    hashed_password: {
      type: String,
      select: false
    },
    anonymous: Boolean,
    modules: [{
      type: ObjectId,
      ref: 'Module'
    }]
  },
  {
    methods: {
      // Method attached to the user model so we can verify
      // user password to the hashed password
      validateUser(password) {
        return bcrypt.compare(password, this.hashed_password);
      },
      toJSON() {
        // Method to return object to frontend
        var user = this.toObject();
        delete user.hashed_password;
        delete user._id;
        delete user.__v;
        return user;
      },
    },
  }
);

var User = model('User', UserSchema);

module.exports = User;
