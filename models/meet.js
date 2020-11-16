const mongoose = require('mongoose');

const MeetSchema  = new mongoose.Schema ({
    name:{
        type:String ,  
        required: true,
       },
    email: {
        type: String,
        required: true,
    },
    link:{
        type: String,
        required: true,
    }
    
})

const Meet = mongoose.model('Meet',MeetSchema);
module.exports = Meet;