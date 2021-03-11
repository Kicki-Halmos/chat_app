const express = require('express')

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

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


app.get('/frontend', (req,res) => {
    res.render('frontend.ejs', {channelname:'frontend'})
})

app.get('/backend', (req,res) => {
    res.render('backend.ejs', {channelname:'backend'})
})

app.get('/databasteknik', (req,res) => {
    res.render('databasteknik.ejs', {channelname:'databasteknik'})
})

io.on('connection', (socket) => {
    console.log("connected");
   
    socket.on('chat message', message => {
        console.log('recieved: ' + message)
        
        io.emit('chat message', message)
    })

    socket.on('disconnect', ()=>{
        console.log('disconnected')
      
    })
})



server.listen(3000)
