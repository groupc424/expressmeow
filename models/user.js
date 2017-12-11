var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var random = require('mongoose-random');


// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	useremail: {
		type: String
	},
	fullname: {
		type: String
	},
	location: {
		type: String
	},
	petname: {
		type: String
	},
	pettype: {
		type: String
	},
	petdesc: {
		type: String
	},
	votes: {
		type: Number
	},
	picture: {}
});

UserSchema.plugin(random, { path: 'r' });

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
