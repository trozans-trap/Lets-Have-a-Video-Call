const express = require('express');
const router = express.Router();
const loginController = require('../controller/login');

router.get('/home',(req,res)=>{
    res.render('home');
})

router.post('/home', loginController.postLogin);

router.get('/signup',(req,res)=>{
    res.render('signup');
})

router.post('/signup', loginController.postSignup);

module.exports = router;