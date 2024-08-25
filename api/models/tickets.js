const mongoose = require('mongoose');
const { number } = require('zod');


//tickets schema
const ticketsSchema = new mongoose.Schema({
    booking_code:{type: String , required:true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    showtimeId: {type: mongoose.Schema.Types.ObjectId, ref: 'showtime'},
    daytime :{type: String , required:true},
    seatNumber: {type:String , required:true},
    ticketPrice: Number,
    
  }, { timestamps: true });
  
  //tickets model 
  const ticketsModel = mongoose.model('Tickets', ticketsSchema);

  module.exports = ticketsModel;
    