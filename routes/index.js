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
    if(req.user){
    console.log("ID z vara: "+req.user.id);}
    var cars;
    var dt= new Date(Date.now()).toISOString().split('T')[0].concat("T00:00");

    var ds=new Date().toISOString().split('T')[0];
    var de=new Date().toISOString().split('T')[0];

    days =[];
    const dateMove = new Date(ds);

    if(ds==de){
        var day=new Date(ds);
        day.setDate(day.getDate()+1);
        var dayend=day.toISOString().slice(0, 10)+"T00:00";
        days.push(dayend);
    }
    else{
        while (ds < de) {
            ds = dateMove.toISOString().slice(0, 10);
            days.push(ds+"T00:00");
            dateMove.setDate(dateMove.getDate() + 1);
        };
        var day=new Date(de);
        day.setDate(day.getDate()+1);
        var dayend=day.toISOString().slice(0, 10)+"T00:00";
        days.push(dayend);
        days.shift();

    }

    var cars = await Car.find({"reserved":{
            $nin:days}});


    res.render('main', {user: req.user, cars: cars,date: dt,ds:dt,de:dt,len:1 } )
});


router.get('/thank', function(req,res){
    res.render('thank', {user: req.user } )
});


router.get('/about', function(req,res){
    res.render('about', {user: req.user } )
});

router.get('/userOrders', async function  (req,res) {
    if(req.user){
    var UId = req.user.id;
    console.log("UID z vara: "+UId);
    var orders = await Order.find({userID: UId});
    //orders=['1'];
    res.render('user_account', {user: req.user, orders: orders});}
    else{
        res.redirect("/index");
    }
});

module.exports = router;
