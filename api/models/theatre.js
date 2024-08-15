const mongoose = require('mongoose');

//theatre schema
const theatreSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    
    theatreName: { 
        type: String, required: true 
    },
    //city: { type: String, required: true },
    // ticketPrice: { type: Number, required: true }, // Default ticket price
    // rows: { type: Number, required: true },
    // cols: { type: Number, required: true },
    
  });
  
  //theatre model
  const theatreModel = mongoose.model('Theatre', theatreSchema);

  module.exports = theatreModel;