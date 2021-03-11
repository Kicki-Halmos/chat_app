const mongoose = require('mongoose')
const RoomsSchema = new mongoose.Schema({
    messages:[ {
        type: String,
        required:true
    }]
})

const Rooms = mongoose.model('Rooms', RoomsSchema)

module.exports = Rooms