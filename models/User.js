const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        type_of: {type:String,required:true}
    },
    { collection: 'users' }
)

const User = mongoose.model('User', UserSchema);

module.exports = User;