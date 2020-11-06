const User = require('../models/user');

exports.postLogin = async (req,res)=>{
        let { email,password } = req.body;
        await User.findOne({email: email}).then((user)=>{
              if(user){

              }else{
                  
              }
        })
        console.log(email,password);
        res.send(req.body);
}


exports.postSignup = async (req,res)=>{
    let { name, number, email,password } = req.body;
    await User.findOne({email: email}).then(async (guest)=>{
        if(guest){

        }else{
            const newUser = new User({
                name,
                number,
                email,
                password
            });
            await newUser.save().then((user)=>{
                res.send(user);
            }).catch(err => res.status(500).json(err));
        }
    }).catch(err=> res.status(500).json(err));
    console.log(name,number,email,password);
    res.send(req.body);
}