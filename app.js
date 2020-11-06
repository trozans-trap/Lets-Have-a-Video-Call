const express = require('express');
const app = express();
const server = require('http').Server(app);
const {v4: uuidv4} = require('uuid');
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug: true
});
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Db config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log('MongoDb Connected...'))
    .catch(err => console.log(err));


const mainRouter= require('./routes/signup');

app.set('view engine','ejs')
app.use(express.static('public'));

app.use('/peerjs', peerServer);


app.use('/', mainRouter);



app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId: req.params.room})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
        socket.on('message',message => {
            io.to(roomId).emit('createMessage',message)
        })
    })
})


server.listen(3050);