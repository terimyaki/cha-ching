var router = require('express').Router();
module.exports = router;
var itemRouter = require('../item');

var db = require('../../../db/firebase');

router.post('/', function(req, res, next){
	//Creates the user
	db.userCreate(req.body.email, req.body.password, function(error, user){
		if(error) return next(error);
		db.fbUserRefByIdCreate(db.createUserId(user.uid)).set({
			name : req.body.name
		}, function(err){
			if(err) return next(err);
			res.json(user.uid);
		});
	});
});

router.delete('/', function(req, res, next){
	//Deletes user
	db.userDelete(req.query.email, req.query.password, function(error){
		if(error) return next(new Error('Error removing user:', error));
		res.status(200);
	});
});

router.put('/:id', function(req, res, next){
	//Edits the user
});

router.use('/item', itemRouter);