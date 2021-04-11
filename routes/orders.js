const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');
const Order = require('../models/Order');

const bcrypt = require('bcrypt');
const passport = require('passport');

router.post('/order', (req, res) =>{
const order = new Order({
    userID: req.params.userID,
    carID: req.params.carID,
    status: "new",
    dateStart: req.params.dateStart,
    dateFinish:req.params.dateFinish,
    total: req.params.total,
});

});

//confirmation
router.post('/confirmOrder/:id', async (req, res) => {
    let order = await Order.findById(req.params.id);
    order.status = "confirmed";
    order.save();
    res.result(200).json({
        message: 'Ok'
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/order/:id', (req, res) =>{
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Order.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    //url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
router.delete('/order/:id', (req, res) =>{
    const id = req.params.id;
    Car.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    //url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
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

module.exports = router;
