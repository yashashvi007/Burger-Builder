const express = require('express')
const router = express.Router()
const catchAsync = require('./../utils/catchAsync')
const {campgroundSchema} = require('./../schemas')
const Campgrounds = require('../models/campground')
const ExpressError = require('../utils/ExpressError')

const validateCampground = (req , res ,next)=>{
    console.log('aagay ');
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg , 400)
    }else{
        next()
    }
}

router.get('/' ,catchAsync(async (req, res)=>{
    const campgrounds = await Campgrounds.find({})
    res.render('campgrounds/index' , {campgrounds} )
}))

router.get('/new' , async (req, res)=>{
    res.render('campgrounds/new')
})

router.get('/:id' ,catchAsync( async(req, res)=>{
    const campground  = await Campgrounds.findById(req.params.id).populate('reviews')
    if(!campground){
        req.flash('error' , 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show' , {campground} )
}))

router.post('/' , validateCampground , catchAsync( async (req , res , next)=>{
        const campground = new Campgrounds(req.body.campground)
        await campground.save()
        req.flash('success' , 'Successfully created campground')
        res.redirect(`/campgrounds/${campground._id}`)
}))


router.get('/:id/edit' ,catchAsync( async (req, res)=>{
    const campground = await Campgrounds.findById(req.params.id)
    if(!campground){
        req.flash('error' , 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit' , {campground})
}))

router.put('/:id' , validateCampground , catchAsync( async (req, res)=>{
    const {id} = req.params
    const campground = await Campgrounds.findByIdAndUpdate(id , {...req.body.campground})
    req.flash('success' , 'Successfully updated a campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))



router.delete('/:id' , catchAsync( async (req, res)=>{
    const {id} = req.params;
    await Campgrounds.findByIdAndDelete(id)
    req.flash('success' , 'Succesfully deleted the campground')
    res.redirect('/campgrounds')
}))

module.exports = router