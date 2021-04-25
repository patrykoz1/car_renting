const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
    {
        userID: { type: String, required: true },
        carID: { type: String, required: true },
        status: {type:String,required:true},
        dateStart: {type:String,required:true},
        dateFinish:{type:String,required:true},
        numberOfDays: {type:Number,required:true},
        total: {type:Number,required:true},

    },
    { collection: 'orders' }
)

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
