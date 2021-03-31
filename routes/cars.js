const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');

const bcrypt = require('bcrypt');
const passport = require('passport');


/* GET cars listing. */
router.get('/search/:name', (req, res) =>{
    const searched_name = req.params.name;
    var cars=Car.find( { "authors": { "$regex": searched_name, "$options": "i" } },
        function(err,docs) {
        } )
    console.log(cars);
    res.render('dashboard', {user: req.user} );


});
router.get('/getAll', async(req, res) =>{
    const usr=await User.find({});
    //console.log(req.user);
    console.log(usr);
    res.render('main', {user: req.user, users:usr} );

});
router.get('/get/:id', async(req, res) =>{
    const id = req.params.id;
    const car = await Car.findById(id);
    res.render('car', {user: req.user, car: car} );

});

module.exports = router;
