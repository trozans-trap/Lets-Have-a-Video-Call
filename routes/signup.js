const express = require('express');
const router = express.Router();
const { ensureAuthenticated }= require('../authenticate');
const loginController = require('../controller/login');

router.get('/home',(req,res)=>{
    res.render('home');
})

router.post('/home', loginController.postLogin);

router.get('/signup',(req,res)=>{
    res.render('signup');
})

router.post('/signup', loginController.postSignup);

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard');
});

router.post('/join',ensureAuthenticated ,(req,res)=>{
    let link = req.body.link;
    let s = link.split("/");
    if(s.length>1 && s[0]=='http:'){
        link = s[s.length -1];
    }
    console.log(link);
    res.redirect(link);
});

router.get('/logout',(req,res)=>{
    req.logout();
    // req.flash('success_msg','You are logged out')
    res.redirect('/home');
})



module.exports = router;
