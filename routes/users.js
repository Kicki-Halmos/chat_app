const express = require('express')
const User = require('../models/user')

const router = express.Router()

router.get('/login', (req,res) =>{
    const newUser = new User({
        name: 'kickiroo', 
        email: 'kickihalmos@gmail.com', 
        password: 'blablabla'
    })

    newUser.save()
    .then( value => {
        
        res.end('You have been registerd')   
    })
    
    .catch(error => console.log(error))
    //res.end('login here')
});
    


router.get('/register', (req,res) =>{
    res.end('register here')
})

module.exports = router