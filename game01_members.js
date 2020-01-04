var express = require("express");
var router02 = express.Router();

var user;
var pass = "nothing";

router02.get('/game01/:user', function(req, res, next){
  console.log('game01_members, router02', req.params.user, pass);
  res.render('game01_members', {layout: 'layout.hbs', template: 'game01-template', output: req.params.user});
});

router02.post('/game01/submit', function(req, res, next) {
	user = req.body.user; 
	pass = req.body.pass;
	res.redirect('/game01/'+user);
});

module.exports = router02;