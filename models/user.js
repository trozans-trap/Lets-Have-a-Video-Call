const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

const UserSchema  = new mongoose.Schema ({
    name:{
        type:String ,  
        required: true,
       },
    number : {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
    
})

UserSchema.plugin(passportLocalMongoose);

// const User = mongoose.model('User',UserSchema);
module.exports = mongoose.model('User',UserSchema);