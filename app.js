const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')

const ExpressError = require('./utils/ExpressError')

const methodOverride = require('method-override')

const campgroundsRoutes = require('./routes/campground')
const reviewsRoutes = require('./routes/review')
const usersRoutes = require('./routes/user')

const session = require('express-session')
const flash = require('connect-flash')

const passport = require('passport')
const LocalStrategy = require('passport-local')

const User = require('./models/user')

app.engine('ejs' , ejsMate)
app.set('view engine' ,'ejs')
app.set('views' , path.join(__dirname , 'views'))

app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname , 'public')))

const sessionConfig = {
    secret : 'svhariedyiakakichutgandmaru',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req ,res, next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

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

app.use('/' , usersRoutes)
app.use('/campgrounds' , campgroundsRoutes)
app.use('/campgrounds/:id/reviews' , reviewsRoutes)

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