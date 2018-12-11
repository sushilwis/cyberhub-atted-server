var express = require('express');
const socketIO = require('socket.io');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const http = require('http');
var methodOverride = require('method-override');
const {Users} = require('./config/users');
var config = require('./config/config');

var index = require('./routes/index');
var app = express();
var PORT = process.env.PORT || 3000;
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();



io.on('connection', (socket) => {
  // console.log('New user connected');

  socket.on('join', (params, callback) => {
    console.log('join called.');
    console.log(params);
    // if (!isRealString(params.name) || !isRealString(params.room)) {
    //   return callback('Name and room name are required.');
    // }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    io.to(socket.id).emit('attedStatus', true);
    // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    // socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    // socket.broadcast.to(params.room).emit('updateUserList', users.getUserList(params.room));
    callback();
  });

  // socket.on('createMessage', (message, callback) => {
  //   var user = users.getUser(socket.id);

  //   if (user && isRealString(message.text)) {
  //     io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
  //   }

  //   callback();
  // });

  // socket.on('createLocationMessage', (coords) => {
  //   var user = users.getUser(socket.id);

  //   if (user) {
  //     io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));  
  //   }
  // });

  socket.on('forceDisconnect', () => {
    
    io.to(socket.id).emit('disconnect');
    var user = users.removeUser(socket.id);

    if(user){
      socket.disconnect();
    }    

    // if (user) {
    //   io.to(user.room).emit('updateUserList', users.getUserList(user.room));
    //   io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    // }
  });
  

});












//database connection
mongoose.connect(config.localDB, {useNewUrlParser: true, useCreateIndex: true}, ()=>{
  console.log('Connected to database...');
});
mongoose.Promise = global.Promise;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));


app.use('/attendance', index);

app.get('*', (req, res, next)=>{
    res.redirect('/');
});






  
  // // catch 404 and forward to error handler
  // app.use(function(req, res, next) {
  //   var err = new Error('Not Found');
  //   err.status = 404;
  //   next(err);
  // });
  
  // // error handler
  // app.use(function(err, req, res, next) {
  //   // set locals, only providing error in development
  //   res.locals.message = err.message;
  //   res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  //   // render the error page
  //   res.status(err.status || 500);
  //   res.render('error');
  // });







server.listen(PORT, function () {
	console.log('Express server started on port ' + PORT + '!');
});
