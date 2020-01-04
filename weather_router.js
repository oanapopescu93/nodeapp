var express = require("express");
var router03 = express.Router();
var https = require("https");

var country = "";
var city = "";
var loc = {};
var result = "";

var apiKey = "68dd1425d11943d29d1425d11913d279";
var lat = "44.4732783";
var lon = "26.1243366";
var url = "/v3/wx/forecast/daily/5day?geocode="+lat+","+lon+"&format=json&units=m&language=en-US&apiKey="+apiKey;

weather_result(url);

router03.get('/weather', function(req, res, next){
	var result01 = JSON.parse(result);	
	console.log('---------------result02------------------'+result01.dayOfWeek);   
	res.render('weather', {layout: 'layout.hbs', template: 'weather-template', weather_country: "Romania", weather_city: "Bucharest", weather_obj: result});
});

router03.get('/weather/:country', function(req, res, next){
	console.log('members, router01', req.params.country, req.params.city);
	var result01 = JSON.parse(result);	
	console.log('---------------result03------------------'+result01.dayOfWeek);   
	res.render('weather', {layout: 'layout.hbs', template: 'weather-template', weather_country: req.params.country, weather_city: "", weather_obj: result});
});

router03.get('/weather/:country/:city', function(req, res, next){
	console.log('members, router01', req.params.country, req.params.city);
	var result01 = JSON.parse(result);	
	console.log('---------------result03------------------'+result01.dayOfWeek);   
	res.render('weather', {layout: 'layout.hbs', template: 'weather-template', weather_country: req.params.country, weather_city: req.params.city, weather_obj: result});
});

router03.post('/weather/submit', function(req, res, next) {
	country = req.body.country; 
	city = req.body.city;		
	var result01 = JSON.parse(result);	
	console.log('---------------result04------------------'+result01.dayOfWeek);   
	console.log('location', country, city);	
	if(typeof city != "undefined"){
		res.redirect('/weather/'+country+'/'+city);
	} else {
		res.redirect('/weather/'+country);
	}
});

module.exports = router03;

function weather_result(url){
	console.warn('weather_result')
	var options = {
		hostname: 'api.weather.com',
		port: 443,
		path: url,
		method: 'GET'
	};

	var request = https.request(options, function(res) {	
		res.setEncoding('utf8');
		
		res.on('data', function(d) {
			if (res.statusCode === 200) {
				result = result + d;
			} else {
				console.log('404');
			}			
		})
		
		res.on('end', function () {
			var result01 = JSON.parse(result);
			console.log('---------------result01------------------'+result01.dayOfWeek);   
		});
		
		request.on('error', function(e) {
			console.log("panic, panic, panic")
			console.error(e);	
		});
		
	})

	request.end();
}

// router.get('/:id', (req, res, next) => {
    // rest.getJSON({
        // host: host,
        // path: `/posts/${req.params.id}`,
        // method: 'GET'
    // }).then(({status, data}) => {
        // res.json(data);
    // }, (error) => {
        // next(error);
    // });
// });

