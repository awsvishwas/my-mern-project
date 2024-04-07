const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const {storeReturnTo} = require('../middleware')
const userController = require('../controllers/users')

router.route('/register')
    .get(userController.renderRegisterUserForm)
    .post(catchAsync(userController.registerUser))

router.route('/login')
    .get(userController.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userController.loginUser)

router.get('/logout', userController.logoutUser); 

module.exports = router