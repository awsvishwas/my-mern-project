if(process.env.NODE_ENV !== 'Production'){
    require('dotenv').config()
}

const express = require('express')
const app = express();
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')
const User = require('./models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const multer = require('multer')
const {storage} = require('./cloudinary/index')
const upload = multer({storage})
app.engine('ejs', ejsMate)

app.listen(3000, ()=>{
    console.log('Running on Port 3000')
})

const userRoutes = require('./routes/userRoutes')
const campgroundRoutes = require('./routes/campgroundRoutes')
const reviewRoutes = require('./routes/reviewRoutes')

const sessionConfig = {
    secret: 'secretsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

const mongoose = require('mongoose');
const { Session } = require('inspector');
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname,'public')))

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res)=>{
    res.render('home')
})

app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found.', 404))
})

app.use((err, req, res, next)=>{
    const {statusCode=500,} = err
    if(!err.message) err.message='Something Went Wrong!'
    res.status(statusCode).render('error',{err})
})