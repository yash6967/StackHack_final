const mongoose = require('mongoose')

const adminRequestSchema = new mongoose.Schema({
    requestList :{type: [mongoose.Schema.Types.ObjectId], ref: 'User'}
})

const adminRequestModel = mongoose.model('AdminRequests',adminRequestSchema);

module.exports =     adminRequestModel;
