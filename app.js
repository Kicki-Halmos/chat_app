const express = require('express')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')
const mongoose = require("mongoose");
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const User = require('./models/user')
require('./config/passport')(passport)

//db
mongoose.connect('mongodb://localhost:27017/slack')
    .then(() => console.log('connected to db'))
    .catch(error => console.log(error))

//views
app.set('views', path.join(__dirname, 'views'));
app.set('view enginge', 'ejs')

app.use('/public', express.static(path.join(__dirname, 'public')));

//bodyparser
app.use(express.urlencoded({extended:true}))

// Sessions
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Flash
app.use(flash())
app.use((request, response, next) => {
    response.locals.success_msg = request.flash('success_msg')
    response.locals.error_msg = request.flash('error_msg')
    response.locals.error = request.flash('error')
    next()
})

//routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/dashboard', require('./routes/dashboard'))

let users = []
//socket
io.on("connection", (socket) => {
    socket.on("dashboard", async data => {
         users.push(data.name)
        //console.log('connect' + users)
        io.emit('dashboard', users)
        
    })
  

    socket.on("join room", async data => {
        const room_name = await data.room_name
        const name = await data.name
        //console.log(name)
        //console.log(room_name)
        await socket.join(room_name)
    

    socket.on("chat message", async message => {
        io.to(room_name).emit("chat message", message)
        console.log(name)
        const user = await User.findOne({name:name}).exec()
        console.log(user)

    })
})

    
    socket.on('disconnect', () =>{
       users = []
      
    })
})



server.listen(3000)
