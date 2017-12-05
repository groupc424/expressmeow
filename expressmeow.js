var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

//mongoose
mongoose.connect('mongodb://localhost/meowdb');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var dash = require('./routes/dashboard');

// Init
var app = express();

app.disable('x-powered-by');

// engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
	

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'imyourmom',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator - taken from Middleware Options
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/dashboard', dash);

app.get('/voting', function(req, res){
	res.render('index');
});

app.get('/home', function(req, res){
	res.render('home');
});

app.get('/login', function(req, res){
	res.render('login');
});

app.get('/createaccount', function(req, res){
	res.render('createaccount');
});

app.get('/aboutus', function(req, res){
	res.render('aboutus');
});

app.get('/emailus', function(req, res){
	res.render('emailus');
});

	
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function(){
	console.log("Express started on http://localhost:" + app.get('port') + "Press Ctrl-C to terminate");
});