const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Order = require("../models/Order");

router.get('/admin',  async function (req,res) {
    if(!req.user){res.redirect('/index')}
    if(req.user.type_of=="Admin"){
        var order = await Order.find({"status":"1"});//takeAll with status 1
        var order_old = await Order.find({"status":"2"});//takeAll with status 1

        //console.log(order);
        res.render('admin' ,{user:req.user, orders:order,orders_old:order_old});

    }
    else{
        console.log("jest else!");

        res.redirect('/index')//redirect to main site if not admin
    }

});

module.exports = router;
