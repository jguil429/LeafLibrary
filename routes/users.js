const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAysnc = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAysnc(async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to The Leaf Library');
        res.redirect('/plants');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/plants');
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    req.flash('success', 'Logged out!');
    res.redirect('/plants');
    });
});

module.exports = router;