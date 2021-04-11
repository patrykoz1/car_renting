const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
    {
        userID: { type: String, required: true },
        carID: { type: String, required: true },
        status: {type:String,required:true},
        dateStart: {type:Date,required:true},
        dateFinish:{type:Date,required:true},
        total: {type:Number,required:true},

    },
    { collection: 'orders' }
)

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
