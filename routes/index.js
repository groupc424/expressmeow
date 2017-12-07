var express = require('express');
var router = express.Router();

let User = require('../models/user');

// Bring to voting(index) page
router.get('/', function(req, res){
	res.render('voting');
});

//generate random pet


// Submitvote
router.post('/voting', function(req, res){
	var vote = req.body.vote;

	// randomize images 
});

// Bring logged in user to dash
router.get('/dashboard', ensureAuthenticated, function(req, res){
	res.render('dashboard');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	} 
}


module.exports = router;
