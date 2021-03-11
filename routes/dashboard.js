const express = require('express')

//const app = require('express')();
const router = express.Router()
//const server = require('http').Server(app);
//const io = require('socket.io')(server);    
//io.path("/dashboard/databasteknik");

router.get('/:name', (req,res) => {
    let room_name = req.params.name
    res.render('rooms.ejs', {channelname:room_name, channelname_header:room_name.toUpperCase()})
    
   
})






module.exports = router