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
       // res.status(501).send("ERROR IN FORM");

    }
    else{
        User.findOne({email:email}).then(user => {
            if(user){
                errors.push({msg:'Email jest już w uzyciu!'});
                res.render('register',{
                    errors,name,surname,email,password
                });
                //res.status(501).send("EMAIL IS ALREADY USED");

            }else{
                const newUser= new User({
                    name,surname,email,password
                });
                newUser.type_of="Customer";
                bcrypt.genSalt(10, (err,salt) =>
                    bcrypt.hash(newUser.password,salt,(err,hash) => {
                        if (err){
                            res.redirect('/users/register');
                            //res.status(501).send("ERROR IN PASSWORD");

                        }

                        newUser.password = hash;
                        newUser.save().then(user => {
                            req.flash(
                                'success_msg',
                                'Zostałeś zarejestrowany! Możesz się zalogować!'
                            );
                            res.redirect('/users/login');
                            //res.status(200).send("USER ADDED");

                        }).catch(err => console.log(err));

                    }))}});}})
// Login
router.post('/login', (req, res, next) => {
      passport.authenticate('local', {
        successRedirect: '/index',
        failureRedirect: '/users/login',
        failureFlash: true
    })
    //req.flash('success_msg', 'Zostałeś za');
    (req, res, next);
    /*User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Authorization failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Authorization failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: "Authorization successful",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Authorization failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });*/
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Zostałeś wylogowany');
    res.redirect('/index');
});

module.exports = router;
