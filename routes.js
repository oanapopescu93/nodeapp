var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next){
	console.log("Hello friend");
	res.render('index', {layout: 'layout.hbs', template: 'home-template'});
});

router.get('/game01', function(req, res, next){
  console.log('Request for game01 recieved');
  res.render('game01', {layout: 'layout.hbs', template: 'game01-template'});
});

router.get('/contact', function(req, res, next){
  console.log('Request for contact page recieved');
  res.render('contact', {layout: 'layout.hbs', template: 'contact-template'});
});

module.exports = router;