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
router.post('/order/:id', (req, res) =>{
let order = Order.findById(req.params.id);
order.status="confirmed";
order.save();
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

module.exports = router;
