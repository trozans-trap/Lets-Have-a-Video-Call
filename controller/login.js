const User = require('../models/user');
const bcrypt = require('bcryptjs');


exports.postLogin = async (req, res) => {
    let { email, password } = req.body;
    await User.findOne({ email: email})
      .then((user) => {
        if (user) {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err)
                    throw err;
                if (isMatch) {
                    res.send('success');
                }
                else {
                   
                }
            });
        } else {

        }
    })
}


exports.postSignup = async (req, res) => {
    let {
        name,
        number,
        email,
        password
    } = req.body;
    await User.findOne({ email: email })
      .then(async (guest) => {
        console.log("guest",guest);
        if (guest) {
          res.send("user e  xist")
        } else {
            const newUser = new User({
                name,
                number,
                email,
                password
            });

            //Hash Password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, async(err, hash) => {
                    if (err) {

                    }
                    //Set password to hashed
                    newUser.password = hash;
                    //save User
                    await newUser.save().then((user) => {
                        res.send(user);
                    }).catch(err => res.status(500).json(err));
                });
            });
        }
    }).catch(err => res.status(500).json(err));
}