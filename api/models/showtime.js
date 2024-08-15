const mongoose = require('mongoose');
const { number } = require('zod');


//showtime schema
const showtimeSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    //ticketPrice: { type: Number, required: true },
    showdate: { type: Date, required: true },
    daytime :{type: String , required:true}
    
  }, { timestamps: true });
  
  //showtime model 
  const showtimeModel = mongoose.model('Showtime', showtimeSchema);

  module.exports = showtimeModel;
    