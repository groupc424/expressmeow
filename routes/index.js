var express = require('express');
var router = express.Router();

var User = require('../models/user');

// Voting
router.get('/voting', function(req, res){
	res.render('voting');
});

//generate pet


// Submitvote
router.post('/voting', function(req, res){
	var vote = req.body.vote;

	// randomize images 
});


module.exports = router;