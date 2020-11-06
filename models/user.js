const mongoose = require('mongoose');

const UserSchema  = new mongoose.Schema ({
    name:{
        type:String ,  
        required: true,
       },
    number : {
        type: number,
        required: true,
    },
    email: {
        type: email,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
    
})

const User = mongoose.model('User',UserSchema);
module.exports = User;