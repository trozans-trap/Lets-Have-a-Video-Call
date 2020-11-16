const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//Local User Model
const User = require('./models/user');

exports.passsport = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) =>{
            //Match user
            User.findOne({ email: email })
              .then(user => {
                  if(!user){
                      return done(null, false, { message: 'That email is not registerd'});
                  }

                  //Match password
                  bcrypt.compare(password, user.password, (err, isMatch)=>{
                      if(err) throw err;

                      if(isMatch) {
                          return done(null, user);
                      } else {
                          return done(null, false, { message: 'password incorrect'});
                      }
                  });
              })
               .catch(err => console.log(err));
        })
    );

    passport.serializeUser( (user, done)=>{
       done(null, user);
    });
    passport.deserializeUser( (id, done)=>{
      User.findById(id, (err, user)=> {  
        done(err, user);
       });
    });

}

exports.ensureAuthenticated =  (req, res, next)=>{
        if(req.isAuthenticated()){
            return next();
        }
        res.send('error_msg Please log in to view this resource');
        // res.redirect('/users/login');
    }
