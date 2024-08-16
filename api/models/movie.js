const mongoose = require('mongoose');
const {Schema} = mongoose;

/* SCHEMA of movie*/

const movieSchema = new Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },

    title: { 
        type: String, 
        required: true},

    photos: {
        type: [String]},

    languages: {
        type: [String], 
        required: true},

    length: {
        type: String,
        required: true,
        validate: {
          validator: function(v) {
            return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(v);},
          message: props => `${props.value} is not a valid time format!`}},
    
    genre: { 
        type: [String],
        required: true },
    
    certificate: { 
        type: String,
        required: true },

    director: { 
        type: String},

    releaseDate: { 
        type: Date,
        required: true},

    description: { 
        type: String,
        required: true},

    // cast: { 
    //     type: [String]},

    // crew: { 
    //     type: [String]},

    
});

/* User model */

const movieModel = mongoose.model('Movie', movieSchema);

module.exports = movieModel;
