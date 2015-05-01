var router = require('express').Router();
module.exports = router;

router.get('/', function(req, res, next){
	res.json('you are in the user');
});

router.post('/', function(req, res, next){

});