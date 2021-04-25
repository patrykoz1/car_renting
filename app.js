var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv/config');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const app = express();
// Passport Config
require('./config/passport')(passport);
//app.use(express.static(path.join(__dirname, 'public/images')));
console.log(__dirname);

// DB Config
const db = require('./config/keys').mongoURI;
/*(async () => {
    try {
        await mongoose.connect(
    process.env.DB_CONNECTION,
    {useNewUrlParser:true},
    ()=>console.log('connected to DB')
    );}
catch (exc){console.log('conn error!')}
})()*/
async function foo() {
    try {
    console.log("Proba polaczenia");
await mongoose.connect(
    process.env.DB_CONNECTION,
    {useNewUrlParser:true},
    ()=>console.log('connected to DB')

)}catch (err){    console.log("Error during connection: "+err);
}}
foo();
mongoose.connection.on('error', err => {
    console.log("Error after connection: "+err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//body parser
//app.use(express.bodyParser());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/orders', require('./routes/orders'));
app.use('/cars', require('./routes/cars'));
app.use('/admin', require('./routes/admin'));


app.use("/", express.static(__dirname + '/public/images'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use("/cars/images", express.static(__dirname + '/public/images'));
app.use("images", express.static(__dirname + '/public/images'));
app.use( express.static( "public" ) );



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var rule = new schedule.RecurrenceRule();

rule.day = new schedule.Range(0, 59, 1);
/*
schedule.scheduleJob({hour: 2, minute: 6}, async function(){
    //
    var id_cars=Order.find({"dateFinish": new Date.toISOString().slice(0, 10)}).select('carID -_id').exec(); //format like "2018-08-03"
    //we have ids of
    for(var x in id_cars){
        var car = Car.findById(x).exec();
        car.available=true;
        await car.save();
    }
    console.log("JP!!");
});
*/

module.exports = app;
