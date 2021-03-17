const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PrivateChatSchema = new mongoose.Schema({
    members: [{
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            
        }],
    messages: [{
           message_sender: {
                type: Schema.Types.ObjectId, 
                ref: 'User'  
            },
            message:{
               type: String
            }
        }]
        })


const PrivateChat = mongoose.model('PrivateChat', PrivateChatSchema)

module.exports = PrivateChat