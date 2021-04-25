const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');

const bcrypt = require('bcrypt');
const passport = require('passport');


/* GET cars listing. */
router.get('/search/:name', async(req, res) =>{
    const searched_name = req.params.name;
    var cars= await Car.find( { "authors": { "$regex": searched_name, "$options": "i" } },
        function(err,docs) {
        } )
    console.log(cars);
    res.render('dashboard', {user: req.user} );
});

router.post('/search',async function (req,res){
    var start = req.body.start;
    var stop = req.body.end;
    console.log(start)
    console.log(stop)
    var ds=new Date(start).toISOString().split('T')[0];
    var de=new Date(stop).toISOString().split('T')[0];
    console.log(ds)
    console.log(de)
    days =[];
    const dateMove = new Date(ds);

    if(ds==de){
        //days.push((new Date(ds).getDate()+1).toISOString().slice(0, 10)+"T00:00");
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
    console.log("dat days"+days);

    var cars = await Car.find({"reserved":{
            $nin:days}});
    var dt= new Date(Date.now()).toISOString().split('T')[0].concat("T00:00");

    res.render('main', {user: req.user, cars: cars,date:dt,ds:(days[0]),de:(days[days.length-1]),len:days.length} );
});

router.get('/getAll', async(req, res) =>{
    const usr=await Car.find({});
    console.log("TUUTT?");
    console.log(usr);
    res.render('main', {user: req.user, cars:usr} );

});
router.get('/get/:id/:start/:end/:len', async(req, res) =>{

    if(req.params.start===undefined||req.params.end===undefined){
        console.log("Hier");
        req.flash('error_msg', 'Podaj daty!');
        res.redirect('/index');
    }
    else {
        console.log("zaaaaaaaaaa");
        const id = req.params.id;
        const car = await Car.findById(id);
        console.log(req.params);
        var ds = new Date(req.params.start).toISOString().split('T')[0];
        var de = new Date(req.params.end).toISOString().split('T')[0];

        var day=new Date(ds);
        day.setDate(day.getDate()+1);
        var daystart=day.toISOString().slice(0, 10)+"T00:00";

        day=new Date(de);
        day.setDate(day.getDate()+1);
        var daystop=day.toISOString().slice(0, 10)+"T00:00";

        console.log("UWAGAAAAAAAAAAAAAAAAAAAAA");
        console.log(req.params.len);

        console.log("samochod to: "+car);
        res.render('car', {user: req.user, car: car, ds: daystart, de: daystop,len: req.params.len});
    }
});

function f1(){}
//demo
router.get('/get', async function (req, res) {
    var x = await f1();
    res.render('car', {user: req.user} );

});

router.get('/getAvailable', async function (req, res) {
    var x = await f1();
    res.render('car', {user: req.user} );

});

module.exports = router;
