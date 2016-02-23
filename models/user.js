var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var userSchema = new Schema({
    username: {type: String, required: true, unique: true, lowercase: true, trim: true, uniqueCaseInsensitive: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true, uniqueCaseInsensitive: true}
});
userSchema.plugin(uniqueValidator);
var userModel = mongoose.model('User', userSchema);

module.exports = userModel;
