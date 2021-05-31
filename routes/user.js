const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')

router.get('/' , async (req , res , next)=>{
    res.render('users/register');
} )

router.post('/register' , async (req ,res)=>{
    const {email , username , password}=req.body
    const user = new User({email , username})
    const registeredUser = await User.register(user , password)
    req.flash('success' , 'Welcome to yelpcamp')
    res.redirect('/campgrounds')
} )

module.exports = router