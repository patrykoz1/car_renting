const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');


/* GET users listing. */
router.get('/add', (req, res) =>
    res.render('register',{isLoggedIn:isLoggedIn()}));
router.get('/login', (req, res) =>
    res.render('login',{isLoggedIn: req.user.isLoggedIn}));

//Register Handle