const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const user_jwt = require('../middleware/user_jwt');
const jwt = require('jsonwebtoken');

router.get('/',user_jwt,async(req, res, next) => {
    try{
        const user = await User.findById(req.user.id).select('-password')
        res.status(200).json({
            success: true,
            user: user
        })
    }catch(error){
        console.log(error.message)
        res.json(500).json({
            msg: "Server Error"
        })
        next()
    }
})

router.post('/register',async (req, res, next) => {
   const { userName, email, password } = req.body

   try{
    let user_exist = await User.findOne({ email : email })
    if(user_exist){
        res.json({
            success: false,
            msg: 'User allredy exist'
        })
    }else{
        let user = new User()

        user.userName = userName
        user.email = email
    
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
    
        let size = 200
        user.avatar = "https://gravatar.com/avatar/?s="+size+"&d=retro"
    
        await user.save()

        const payload = {
            user: {
                id : user.id
            }
        }

        jwt.sign(payload, process.env.jwtUserSecret, {
            expiresIn: 360000
        },(error, token) =>{
            if(error) throw error
            res.status(200).json({
                success: true,
                token: token
            })
        })
    }

   }catch(error){
    console.log(error)
   }
})

router.post('/login', async(req, res, next) => { 
    const email = req.body.email; 
    const password = req.body.password;

    try{
        let user = await User.findOne({
            email: email
        });
    
    if(!user) {
        res.status(400).json({
            success: false,
            msg: 'User not exists go & register to continue'
        });
    }
    
    const isMatch = await bcrypt.compare (password, user.password)
    if(!isMatch) {
        res.status(400).json({
            success: false,
            msg: 'Invalid Password'
        });
    }

    const payload = {
        user: {
            id : user.id
        }
    }

    jwt.sign(payload, process.env.jwtUserSecret, {
        expiresIn: 360000
    },(error, token) =>{
        if(error) throw error
        res.status(200).json({
            success: true,
            token: token,
            user: user,
            msg: "User loged in"
        })
    })

    }catch(error) {
        console.log(error.message); res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
})

module.exports = router;