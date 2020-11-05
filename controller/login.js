exports.postLogin = (req,res)=>{
        let { email,password } = req.body;
        console.log(email,password);
        res.send(req.body);
}


exports.postSignup = (req,res)=>{
    let { name, number, email,password } = req.body;
    console.log(name,number,email,password);
    res.send(req.body);
}