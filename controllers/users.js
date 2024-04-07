const User = require('../models/user')

const renderRegisterUserForm = (req, res)=>{
    res.render('users/register')
}

const registerUser = async (req, res)=>{
    try {
    const {username, email, password} = req.body
    const newUser = new User({username, email})
    const registerUser = await User.register(newUser, password)
    req.login(registerUser, err =>{
        if(err) return next(err)
        req.flash('success', 'Welcome to Yelpcamp!')
        res.redirect('/campgrounds')
    })
    
    }catch(e){
        req.flash('error', e.message)
        res.redirect('register')

        }
}

const renderLoginForm = (req, res)=>{
    res.render('users/login')
}

const loginUser = (req, res)=>{
    req.flash('success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds'; 
    res.redirect(redirectUrl);
}

const logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}


module.exports= {
    renderRegisterUserForm,
    registerUser,
    renderLoginForm,
    loginUser,
    logoutUser
}