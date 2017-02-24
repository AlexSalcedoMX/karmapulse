var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var moment = require('moment');
var mongoose = require('mongoose');
var config = require('./config.json');


mongoose.connect(config.connectionString)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));

server.listen(3000, function () {
  console.log('Inició servidor')
})

require('./router.js')(app, moment);
require('./socketio/eventos.js')(io);