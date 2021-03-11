const express = require('express')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')



const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/slack')
    .then(() => console.log('connected to db'))
    .catch(error => console.log(error))


app.set('views', path.join(__dirname, 'views'));
app.set('view enginge', 'ejs')

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended:true}))

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/dashboard', require('./routes/dashboard'))

io.on("connection", (socket) => {
    socket.on("join room", (data) => {
        const room_name = data.room_name
        socket.join(room_name)
    

    socket.on("chat message", message => {
        io.to(room_name).emit("chat message", message)

    })
})
    
    socket.on('disconnect', ()=>{
        console.log('disconnected')
      
    })
})

/*app.get('/dashboard/:name', (req,res) => {
    res.render('rooms.ejs', {channelname:req.params.name, channelname_header:req.params.name.toUpperCase()})
    io.on('connection', (socket) => {
        console.log("connected");
       
        socket.on('chat message', message => {
            console.log('recieved: ' + message)
            
            io.emit('chat message', message)
    
            /*Backend.findByIdAndUpdate("6049f9131a00733f0166a85f", {$push: {messages: message}}, {useFindAndModify:false}, 
            function(err, result){
                if(err){
                    console.log(err)
                }
                else {
                    console.log(result)
                }
            } )
    
        socket.on('disconnect', ()=>{
            console.log('disconnected')
          
        })
    })
})
})*/

    

server.listen(3000)
