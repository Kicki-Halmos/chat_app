const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PrivateChatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        
    }],
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

const PrivateChat = mongoose.model('PrivateChat', PrivateChatSchema)

module.exports = PrivateChat