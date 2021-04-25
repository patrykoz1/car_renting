const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');
const Order = require('../models/Order');

const bcrypt = require('bcrypt');
const passport = require('passport');

router.post('/order/:len', async function(req, res){
    console.log("Daty z tworzenia");
    console.log(req.body.start);
    console.log(req.body.end);
const order = new Order({
    userID: req.user.id,
    carID: req.body.carID,
    status: "0",
    dateStart: req.body.start,
    dateFinish:req.body.end,
    numberOfDays:req.params.len,
    total: req.params.len * req.body.price,
})
    console.log("Tworze ordera!");
    await order.save();
    console.log("Nizej parametry...")
    console.log(req.body);
    console.log(order.total);
    var ds = new Date(req.body.start).toISOString().split('T')[0];
    var de = new Date(req.body.end).toISOString().split('T')[0];
    let days =[];
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
        day.setDate(day.getDate()+1);//TUTAJ ZMIANA UWAGAAA
        var dayend=day.toISOString().slice(0, 10)+"T00:00";
        days.push(dayend);
        days.shift();

    }
    console.log('days');
    console.log(days);
    var car = await Car.findByIdAndUpdate(order.carID,{ "$addToSet": { "reserved": days } },
    { "new": true, "upsert": true },
    function (err, managerparent) {
        if (err) throw err;
        console.log(managerparent);
    });
    console.log(car['reserved']);
    //car.reserved.push(days);
    await car.save();
    console.log(car);
    console.log(order);
    console.log("Raz jeszcze..");
    console.log(car['reserved']);

    req.flash('success_msg',"Pozytywnie dodano zlecenie!");
    res.render('thank',{user:req.user});



});

//confirmation
router.post('/confirmOrder/:id', async function (req, res) {
    try{
    console.log(req.params.id);
    var order = await Order.findById(req.params.id);
    console.log(order);
    order.status="2";
    await order.save();
    }
    catch (exc){console.log("Blad w order confirm")}
    res.redirect('back');
});

//confirmByUser
router.post('/confirmOrderByUser/:id', async function (req, res) {
    try{
        console.log(req.params.id);
        var order = await Order.findById(req.params.id);
        console.log(order);
        order.status="1";
        await order.save();
    }
    catch (exc){console.log("Blad w order confirmByUser")}
    res.redirect('back');
});


router.post('/order/update/:id', async function (req, res) {

    //try{
    var id = req.params.id;
    var order = await Order.findById(id);
    console.log("Order: "+order);
    var ds=new Date(req.body.dateStart);
    ds.setDate(ds.getDate()+1);
    ds=ds.toISOString().split('T')[0];
    //ds.setDate(ds.getDate()+1);

    var de=new Date(req.body.dateFinish);
    de.setDate(de.getDate()+1);
    de=de.toISOString().split('T')[0];
    //de.setDate(de.getDate()+1);

     //ds=ds.toISOString().split('T')[0];//nowa data
     //de=de.toISOString().split('T')[0];

    var old_start=new Date(order.dateStart);//toISOString().split('T')[0];//await Order.find('id':{}).select('dateStart');
    var old_stop=new Date(order.dateFinish);//toISOString().split('T')[0];//await Order.findById(id).select('dateFinish');

    old_stop.setDate(old_stop.getDate()+1);
    //old_stop=old_stop.toISOString().split('T')[0];
    //old_stop.setDate(old_stop.getDate()+1);

    old_start.setDate(old_start.getDate()+1);
    //old_start=old_start.toISOString().split('T')[0];
    //old_start.setDate(old_start.getDate()+1);

    old_start=old_start.toISOString().split('T')[0];//nowa data
    old_stop=old_stop.toISOString().split('T')[0];

    console.log("old_start: "+old_start);
    console.log("old_stop: "+old_stop);

    console.log("new_start: "+ds);
    console.log("new_stop: "+de);



    await Order.findByIdAndUpdate(id,{'$set': { dateFinish: de+"T00:00" }});//aktualizacja dat
    await Order.findByIdAndUpdate(id,{'$set': { dateStart: ds+"T00:00" }});//aktualizacja dat
    //await order.save();


        //pierwsze musimy usunac stare dni z auta i dodac te nowe po aktualizacji
        //var start=order.startDate;
        //var end = order.finishDate;
        const dateMove = new Date(ds);
        const dateStep = new Date(old_start);
        var days=[];
        var old_days=[];


        if(ds==de){//nowe dni
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
            //days.push(dayend);
            //days.shift();

        }

    //stare dni
    if(old_start==old_stop){
        //days.push((new Date(ds).getDate()+1).toISOString().slice(0, 10)+"T00:00");
        var day=new Date(old_start);
        day.setDate(day.getDate()+1);
        var dayend=day.toISOString().slice(0, 10)+"T00:00";
        old_days.push(dayend);
    }
    else{
        console.log("W PĘTLI!");
        while (old_start < old_stop) {
            old_start = dateStep.toISOString().slice(0, 10);
            old_days.push(old_start+"T00:00");
            dateStep.setDate(dateStep.getDate() + 1);
            console.log("Old days w pętli: ")
            console.log(old_days);

        };
        var day=new Date(old_stop);
        day.setDate(day.getDate()+1);
        var dayend=day.toISOString().slice(0, 10)+"T00:00";
        //old_days.push(dayend);
        //old_days.shift();

    }


    order=await Order.findById(id);
    console.log("order.carID: "+order.carID);
    console.log("old days: " + old_days);
    console.log("days: "+days);

    await Car.updateOne({ _id: order.carID }, { $pullAll: { reserved: old_days } });
    await Car.updateOne({ _id: order.carID }, { $push: { reserved: { $each: days } } });

    var car = await Car.findById(order.carID);
    console.log("car price"+car.price);
    //order.total=days.length*car.price;
    var price=days.length*car.price;
    await Order.findByIdAndUpdate(id,{total: price});
    //await order.save();
//    }

    //catch (exc){console.log("Blad w order patchuUsera")}
    req.flash('success_msg', 'Zamówienie zostało zmienione!');
    res.redirect('back');
});

router.post('/delete/:id', async function (req, res){
    console.log("Jestem tu..");
    try {
        var id = req.params.id;
        console.log("TUTAAAAJ!!!");
        console.log(id);
        var ds= await Order.findById(id).select('dateStart');
        var de= await Order.findById(id).select('dateFinish');
        var order=await Order.findById(id).select('carID');
        ds=ds['dateStart'];
        de=de['dateFinish'];
        var car_id=order['carID'];
        console.log("ds: "+ds);
        console.log("de: "+de);
        console.log("carid: "+car_id);


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
            //days.push(dayend);
            days.pop();
            days.pop();

        }


        console.log(days);

        console.log("Do samochodu dodajemy te dni: ");
        console.log(days);

        await Car.updateOne({ _id: car_id }, { "$pullAll": { "reserved": days } });
        console.log("ID AUTEA");
        console.log(car_id);
        var car= await Car.findById(car_id);
        console.log("Po updacie samochod ma te dni!");
        console.log(car['reserved']);
        var x = await Order.findByIdAndDelete(id);
        //await x.save();
        console.log("USUNAL!");
        //res.redirect('/admin/admin',{user:req.user});
    }catch (exc){console.log("Blad tutaj..")}
    res.redirect('back');

});

//get all orders
router.get('/getAll', async(req, res) =>{
    if(req.user) {//jezeli uzytkownik zostal zalogowany
        const ord = await Order.find({});
        //console.log(req.user);
        //console.log(usr);
        res.render('main', {user: req.user, orders: order});
    }
    else{
        res.redirect('/users/login')
    }

});
/*
var schedule = require('node-schedule');


schedule.scheduleJob({hour: 0, minute: 0}, async function(){
    //
   try{
    var id_cars=Order.find({"dateFinish": new Date().toISOString().slice(0, 10)}).select('carID -_id').exec(); //format like "2018-08-03"
    //we have ids of
    for(var x in id_cars){
        var car = Car.findById(x).exec();
        car.available=true;
        await car.save();
    }}
    catch (exc){console.log("Error in scheduler!");
    }
});
*/
module.exports = router;
