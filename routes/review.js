const express = require('express')
const router = express.Router({mergeParams : true})
const {reviewSchema} = require('../schemas') 
const Campgrounds = require('../models/campground')
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('./../utils/catchAsync')

const validateReview = (req, res, next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg , 400)
    }else{
        next()
    }
}

router.post('/' ,  validateReview,catchAsync(async (req , res)=>{
    const campground = await Campgrounds.findById(req.params.id)
    console.log(campground.reviews);
    const review  = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success' , 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`)

}))


router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id , reviewId} = req.params
    await Campgrounds.findByIdAndUpdate(id , {$pull : { reviews : reviewId }})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success' , 'Deleted new Review')
    res.redirect(`/campgrounds/${id}`)
}))



module.exports = router