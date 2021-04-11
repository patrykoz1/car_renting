const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');
const bcrypt = require('bcrypt');
const passport = require('passport');
//const indexController = require('../controllers/indexController')
const Order = require("../models/Order");
/* GET home page. */
/*
router.get('/index', indexController.index);
router.get('/about', indexController.about);
router.get('/about/:id', indexController.about);
*/
router.get('/index', async function (req,res) {
    console.log(req.user);
    var usr;
    try{
    usr = await User.find({ });
         console.log(usr);

    console.log("cars "+usr);}
    catch (exc){
        console.log("exc in route" + exc);
    }
    res.render('main', {user: req.user, cars:usr } )
});

router.get('/about', function(req,res){
    res.render('about', {user: req.user } )
});

router.get('/userOrders', async function  (req,res) {
    var UId = req.user._id;
    console.log(req.user);
    var orders = await Order.find({userID: UId});
    res.render('user_account', {user: req.user, orders: orders});
});


module.exports = router;
