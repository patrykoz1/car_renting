const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

const index = function (req,res){
    res.render('main', {user: req.user } )
};

const about = function (req,res){
    res.render('about', {user: req.user } )
};

const userOrders = async function (req,res){
    const UId = req.
    //const orders = await Order.find({userID:});
    //console.log(req.user);
    console.log(usr);
    res.render('main', {user: req.user, orders: order});
};
/*{ name: 'john'}

module.exports={
    index, about
}*/