const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const authenticate = require('../authenticate');

exports.postLogin = async (req, res,next) => {
    let { email, password } = req.body;

    await User.findOne({ email: email })
        .then((user) => {
            if (user) {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                  // console.log("in match",err,isMatch)
                    if (err)
                        console.log(err);
                    if (isMatch) {
                        passport.authenticate('local',{
                            successRedirect: '/dashboard',
                            failureRedirect: '/home',
                            // failureFlash: true
                        })(req, res, next);
                        // res.send('success');
                    } else {

                    }
                });
            } else {

            }
        })
    // res.send('sucess');
}


exports.postSignup = async (req, res) => {
    let {
        name,
        number,
        email,
        password
    } = req.body;
    await User.findOne({
            email: email
        })
        .then(async (guest) => {
            console.log("guest", guest);
            if (guest) {
                res.send("user   exist")
            } else {
                const newUser = new User({
                    name,
                    number,
                    email,
                    password
                });

                //Hash Password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, async (err, hash) => {
                        if (err) {

                        }
                        //Set password to hashed
                        newUser.password = hash;
                        //save User
                        await newUser.save().then((user) => {
                            res.redirect('/home')
                        }).catch(err =>
                            res.status(500).json(err));
                    });
                });
            }
        }).catch(err => res.status(500).json(err));
}