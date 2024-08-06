const mongoose = require('mongoose');
const {Schema} = mongoose;

/* SCHEMA of user */
const userSchema = new Schema({

    name: String,
    email: {type: String, unique: true},
    password: String,

});

/* User model */

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
