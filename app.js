var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session =require('express-session')
 

var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();
var fileUpload=require('express-fileupload')
var hbs = require('express-handlebars');
const hb = hbs.create({})

// view engine setup
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');


// //engine path setted to partial
// app.engine("hbs",hbs.engine({extname:"hbs",defaultLayout:"layout",layoutsDir:_dirname+"/views/layout",partialsDir:_dirname+'/views/partial'}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hb.handlebars.registerHelper('eq', function (a, b) {
  return a == b;
});


app.use(session({secret:"Key",cookie:{maxAge:600000000},resave:false,saveUninitialized:true}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())

app.use('/', adminRouter);
app.use('/', usersRouter); 

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

module.exports = app;