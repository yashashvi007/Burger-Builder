const express = require('express')
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {descriptors , places}  = require('./seedHelper')


mongoose.connect('mongodb+srv://yash047:yash047@cluster0.1s7jv.mongodb.net/yelp-campDb?retryWrites=true&w=majority' , {
    useNewUrlParser: true,
    useCreateIndex : true,
    useFindAndModify : true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('COnenction Open!!')
}).catch(err => {
    console.log("Oh no ")
    console.log(err)
})

const rand = array => array[Math.floor(Math.random() * array.length )]

const seedDb = async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const rand100 = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random() * 30)
        const camp = new Campground({
            location : `${cities[rand100].city} , ${cities[rand100].state}`,
            title : `${rand(descriptors)} , ${rand(places)}`,
            image : 'https://source.unsplash.com/collection/483251',
            description : 'skadjasncjbdhbsfahsdbasbachbdfhrbchb cjsackjsab cas casjbcj ajsf bcjkdbs fjab ldjvb jfbv jsdb vjsdvb djskjdbsjk vbds v',
            price  : price
        })
        await camp.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close()
})


