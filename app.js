const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const {campgroundSchema , reviewSchema } = require('./schemas')

const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

const methodOverride = require('method-override')

const campgrounds = require('./routes/campground')
const review = require('./routes/review')


app.engine('ejs' , ejsMate)
app.set('view engine' ,'ejs')
app.set('views' , path.join(__dirname , 'views'))

app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname , 'public')))

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




app.get('/' , (req, res)=>{
    res.render('home')
})

app.use('/campgrounds' , campgrounds)
app.use('/campgrounds/:id/reviews' , review)



app.all('*' , (req, res , next)=>{
    next(new ExpressError('Page not found' , 404))
})

app.use((err , req, res ,next)=>{
    const {statusCode = 500 } = err
    if(!err.message) err.message = 'Something went very wrong'
    res.status(statusCode).render('error' , {err})
})


app.listen(3000 , ()=>{
    console.log('Serving on port 3000');
})