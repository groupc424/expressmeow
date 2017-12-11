var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var multer = require('multer');
var util = require('util')
var upload = multer({limits: {fileSize: 2000000 },dest:'/dashboard'})

var User = require('../models/user');

// Bring to voting(index) page
//generate random pet
router.get('/', function(req, res){
	User.findRandom().limit(1).exec(function (err, results) {
		if (err) console.log(err);
		else console.log(results);
		});

	var filter = {}; 
	var fields = { petname: 1, location: 1 };
	var options = { skip: 1, limit: 1 };
	User.findRandom(filter, fields, options, function (err, results) {
		if (err) console.log(err);
		else console.log(results);
	});

	User.syncRandom(function (err, result) {
		console.log(result.updated);
	});

	res.render('voting')
});



// Submitvote
router.post('/voting', function(req, res){
	var vote = req.body.vote;

	// randomize images 
});

// Bring logged in user to dash
router.get('/dashboard', ensureAuthenticated, function(req, res){
	res.render('dashboard', 
		{ username: req.user.username,
			fullname: req.user.fullname,
			useremail: req.user.useremail, 
			location: req.user.location,
			petname : req.user.petname,
			pettype : req.user.pettype,
			petdesc : req.user.petdesc,
			picture : req.user.picture 
		});
});

// update information page
router.get('/updateinfo', ensureAuthenticated, function(req, res){
	res.render('updateinfo', 
		{ username : req.user.username,
			fullname : req.user.fullname,
			useremail : req.user.useremail,
			location : req.user.location,
			petname : req.user.petname,
			pettype : req.user.pettype,
			petdesc : req.user.petdesc,
			picture : req.user.picture
		});
});

router.post('/updateinfo', ensureAuthenticated, upload.single('picture'), function(req, res){
	var newImg = fs.readFileSync(req.file.path);
	var encImg = newImg.toString('base64');
	var newpicture = {
      contentType: req.file.mimetype,
      size: req.file.size,
      img: Buffer(encImg, 'base64')
   }
		User.update({username: req.user.username}, {
			fullname : req.body.newfullname,
			useremail : req.body.newuseremail, 
			location : req.body.newlocation,
			petname : req.body.newpetname,
			pettype : req.body.newpettype,
			petdesc : req.body.newpetdesc,
			picture : newpicture 
			}, function (err){
				if (err) console.log(err);
				res.render('/updateinfo', {
					username : req.user.username,
					fullname : req.user.fullname,
					useremail : req.user.useremail,
					location : req.user.location,
					petname : req.user.petname,
					pettype : req.user.pettype,
					petdesc : req.user.petdesc,
					picture : req.user.picture
				}); 
			});

	req.flash('success_msg', 'You\'ve updated your information');
	res.redirect('/dashboard');
});

router.get('/updateinfo/:picture', function(req, res, next){
	var petpicture = req.params.picture;
	User.findOne({ username : petpicture}, function(err, result) {
		if (err) return next (err);
		res.contentType(image.contentType);
		res.send(image.img);
	});
});


/*// Form POST picture
router.post('/updateinfo', upload.single('image'), function (req, res) { 
   var newImg = fs.readFileSync(req.file.path);
   var encImg = newImg.toString('base64');
   // name it
   var image = {
      contentType: req.file.mimetype,
      size: req.file.size,
      img: Buffer(encImg, 'base64')
   }

   var errors = req.validationErrors();
   let temp_username = req.body.username;

   if(errors) {
		res.render('updateinfo',{
			errors:errors
		});
	} else {
		User.update(
			{ 'users.username' : temp_username },
			{ '$set' : { 'users.$.picture' : image }},
			function(err,result){
				if (!err) {
					console.log(result);
				}
			});
		}
	});*/


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	} 
}


module.exports = router;
