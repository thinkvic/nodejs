var express = require('express');
var app = express();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require("mongodb");

var db;


console.log(process.versions);

// Connect to the database before starting the application server.
// mongodb.MongoClient.connect(MONGO, function (err, database) {
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 6000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

  // require('./routes/send2');
  var mailbyinterval=require('./routes/mail3');
  // step, interval min, start
  mailbyinterval(3,720, db);
});




// app.set('port', (process.env.PORT || 1000));

// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  // response.render('pages/index2');
  //response.render('index', { title: 'my Heroku' });
  // response.sendFile(path.join(__dirname+'/index.html'));
  response.sendFile('index.html');

});





var http = require("http");
console.log("http");

setInterval(function () {
  http.get("http://xxx.herokuapp.com/");
  console.log("called every 25 min");
}, 1500000); // every 25 minutes (1500 000)
