const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    messages:[ {
        id: {
            type: mongoose.ObjectId
            
        },
        date: {
            type: String
        },
        message_sender: {
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            
        },
        message: {
        type: String,
        
        }
    }]
})

const Room = mongoose.model('Room', RoomSchema)

module.exports = Room