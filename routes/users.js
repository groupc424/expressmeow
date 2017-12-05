var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Add New User
router.get('/createaccount', function(req, res){
	res.render('createaccount');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Add New User
router.post('/createaccount', function(req, res){
	var fullname = req.body.fullname;
	var useremail = req.body.useremail;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2; 
	var votes = 0;

	// Validation
	req.checkBody('fullname', 'Name is required').notEmpty();
	req.checkBody('useremail', 'Email is required').notEmpty();
	req.checkBody('useremail', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('createaccount',{
			errors:errors
		});
	} else {
		var newUser = new User({
			fullname: fullname,
			useremail:useremail,
			username: username,
			password: password,
			votes: votes,
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		res.redirect('/users/login');
		req.flash('success_msg', 'You\'ve successfully created an account and can now login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/dashboard', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;