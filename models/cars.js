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
    }


})

const model = mongoose.model('Cars', CarSchema)
module.exports = model
