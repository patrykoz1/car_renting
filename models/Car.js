const mongoose = require('mongoose');


const CarSchema = mongoose.Schema({
    mark:{
        type: String,
        required: true,},
    model:{
        type: String,
        required: true,},
    price:{
        type: Number,
        required: true,},
    available: {
        type: Boolean,
        required: true,},
    pic_1:{
        type:String,
        required:true,
    },
    pic_2:{
        type:String,
        required:true,
    },


},
{ collection: 'cars' }
)

const Car = mongoose.model('Car', CarSchema)
module.exports = Car
