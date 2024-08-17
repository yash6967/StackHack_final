const mongoose = require('mongoose');
const { number } = require('zod');


//showtime schema
const showtimeSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    movieid: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    movieName:{type:String, ref:'Movie',required:false},
    theatreid: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    theatreName:{type:String, ref:'Movie',required:false},
    //ticketPrice: { type: Number, required: true },
    showdate: { type: Date, required: true },
    daytime :{type: String , required:true},
    city:{type: String , required:true}
    
  }, { timestamps: true });
  
  //showtime model 
  const showtimeModel = mongoose.model('Showtime', showtimeSchema);

  module.exports = showtimeModel;
    