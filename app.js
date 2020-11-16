const express = require('express');
const app = express();
const server = require('http').Server(app);
const {
    v4: uuidv4
} = require('uuid');
const io = require('socket.io')(server);
const {
    ExpressPeerServer
} = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

//Db config
const db = require('./config/keys').MongoURI;
//Passport config
const{ passsport , ensureAuthenticated } = require('./authenticate')
// require('./authenticate')(passport);
//Connect to Mongo
mongoose.connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDb Connected...'))
    .catch(err => console.log(err));


const mainRouter = require('./routes/signup');

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(logger('dev'));
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  }));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/peerjs', peerServer);


app.use('/', mainRouter);



app.get('/', ensureAuthenticated,(req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room',ensureAuthenticated ,(req, res) => {
    res.render('room', {
        roomId: req.params.room
    })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        })
    })
})


server.listen(3050);