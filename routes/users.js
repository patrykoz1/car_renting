const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

/* GET users listing. */
router.get('/register',
    function (req,res){
        console.log(req.user);
        res.render('register', {user: req.user} )
    });

router.get('/login',
    function (req, res) {
    res.render('login', {user: req.user} )
    });

//Register Handle


router.post('/register',(req,res)=>{
    const {name,surname,email,password}=req.body;
    let errors=[];

    if(!name || !email || !password || !surname){
        errors.push({msg:'Wypełnij wszystkie pola!'});
    }

    if(errors.length>0){
        res.render('register',{
            errors,name,surname,email,password
        });

    }
    else{
        User.findOne({email:email}).then(user => {
            if(user){
                errors.push({msg:'Email jest już w uzyciu!'});
                res.render('register',{
                    errors,name,surname,email,password
                });
            }else{
                const newUser= new User({
                    name,surname,email,password
                });
                newUser.type_of="Customer";
                bcrypt.genSalt(10, (err,salt) =>
                    bcrypt.hash(newUser.password,salt,(err,hash) => {
                        if (err){
                            res.redirect('/users/register');

                        }

                        newUser.password = hash;
                        newUser.save().then(user => {
                            req.flash(
                                'success_msg',
                                'Zostałeś zarejestrowany! Możesz się zalogować!'
                            );
                            res.redirect('/users/login');
                        }).catch(err => console.log(err));

                    }))}});}})
// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/index',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Zostałeś wylogowany');
    res.redirect('/index');
});

module.exports = router;
