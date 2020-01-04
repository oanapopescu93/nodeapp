
$('#weather_form').submit(function (e) { 
		var country = $("#country").value;
		if(country.length == 0) {
			e.preventDefault();    
			alert("Country name can't be blank!!");
			return false;
		}
		
		var city = $("#city").value;
		if($('#cityoption').length > 1) {
			if(city.length == 0) {
				e.preventDefault();    
				alert("City name can't be blank!!");
				return false;
			}
		}
		
		var mylocation = country+','+city;	
		console.warn('mylocation', mylocation);
		var token = "129fbf3f2e1e08";			
		var url_search = "https://eu1.locationiq.com/v1/search.php?key="+token+"&q="+mylocation+"&format=json";	
		create_weather_info(url_search);
			
		return true;	
});	

function create_weather_info(url_search){
	var mybearings = [];
	ajax_location(url_search).then(function(data) {			
		get_location().then(function(data) {				
			mybearings = data;
			//console.warn('mybearings', mybearings);
			var x = document.getElementById("geolocation");
			x.innerHTML = "Latitude: " + mybearings[0].lat + "<br>Longitude: " + mybearings[0].lon;
			
			change_table_weather(mybearings[0].lat, mybearings[0].lon);				
						
		});
	});		
}

function get_json_countries_cities(){
	var url_json = "/assets/json/countries.json";
	$('#country').empty();
	$('#country').append("<option value='' disabled='' selected=''>Select country</option>");
	
	$.getJSON(url_json, function(data) {
		var data_json = data;
		//console.warn('data_json', data_json)
		
		for (var i in data_json) {
			if (data_json.hasOwnProperty(i)) {				
				$('#country').append("<option value="+i+">"+i+"</option>");
			}
		}
		$('#country').on('change', function() {
			$('#city').show();
			$('#city').empty();
			$('#city').append("<option value='' disabled='' selected=''>Select city</option>");
			var country_name = $(this).val();
			var city_name = data_json[country_name];
			for(var i in city_name){
				$('#city').append("<option value="+city_name[i]+">"+city_name[i]+"</option>");
			}
			
		});
	});
}

function ajax_location(url_search){
	return new Promise(function(resolve, reject){
		$.ajax( {
			url: url_search,
			type: 'GET',
			error : function(data) {
				//console.warn('error', data);
				reject('reject');
			},
			success: function (data) {	
				mylocation = JSON.stringify(data)						
				resolve(mylocation);
			}
		});
	});
}

function get_location(){
	return new Promise(function(resolve, reject){				
		mylocation = JSON.parse(mylocation);				
		resolve(mylocation);
	});
}

function change_table_weather(lat, lon){
	var apiKey = "68dd1425d11943d29d1425d11913d279";
	var url_weather_underground = "http://api.weather.com/v3/wx/forecast/daily/5day?geocode="+lat+","+lon+"&format=json&units=m&language=en-US&apiKey="+apiKey;
	//console.warn('lat, lon', lat, lon)
	$.ajax({
        url: url_weather_underground,
        method: 'GET',        
        success: function(data) {
			//console.warn('ajax-data', data)
			var myapi = data;
			var weather = new weatherBroadcast("weatherContainer", myapi);
			if(typeof myapi != "undefined" || myapi != null || myapi != {}){
				$('#weatherContainer').empty();
				weather.ready();
			} else {
				$('#weatherContainer').append('No data');
			}
        },
        error: function(data) {
			//console.warn('ajax-error', data)  
			$('#weatherContainer').append('No data');
        }

      });
}

function weatherBroadcast(title, api){
    var self = this; 
	var id = title;
	
	var myapi = api;
	console.warn('api', myapi);
	
	if(typeof myapi != "undefined" || myapi != null){
		var dayOfWeek;
		var daypart;
		var wxPhraseLong;
		var iconCode;
		var temperature;
		
		if(typeof myapi.dayOfWeek != "undefined"){
			dayOfWeek = myapi.dayOfWeek;
		}
		if(typeof myapi.daypart != "undefined"){
			if(typeof myapi.daypart[0].daypartName != "undefined"){
				daypart = myapi.daypart[0].daypartName;
			}
			if(typeof myapi.daypart[0].wxPhraseLong != "undefined"){
				wxPhraseLong = myapi.daypart[0].wxPhraseLong;
			}
			if(typeof myapi.daypart[0].iconCode != "undefined"){
				iconCode = myapi.daypart[0].iconCode;
			}
			if(typeof myapi.daypart[0].temperature != "undefined"){
				temperature = myapi.daypart[0].temperature;
			}
		}	
		
		console.warn('api', dayOfWeek, daypart, wxPhraseLong, iconCode, temperature);
	}	
	
	
	this.ready = function(){    
        self.table_header();
		self.table_body();
	}
	
	this.table_header = function(){
		$('#'+id).append('<table class="weather_table"></table>');
		$('.weather_table').append('<tr class="weather_table_header"></tr><tr class="weather_table_body></tr>');
		$('.weather_table').append('<tr class="weather_table_body"></tr><tr class="weather_table_body></tr>');			
	}
	
	this.table_body = function(){	
		var t = 0;		
		for(var i in dayOfWeek){
			if(typeof dayOfWeek[i] != "undefined"){
				$('.weather_table_header').append('<td>'+dayOfWeek[i]+'</td>');
			} else {
				$('.weather_table_header').append('<td> - </td>');
			}
			
			$('.weather_table_body').append('<td><table class="weather_info" id="weather_info_'+i+'"></table></td>');			
			$('#weather_info_'+i).append('<tr><td>Day</td><td>Night</td></tr>');
			
			if((typeof iconCode[t] != "undefined" && typeof iconCode[t+1] != "undefined") || (typeof iconCode[t] != "null" && typeof iconCode[t+1] != "null")){
				$('#weather_info_'+i).append('<tr><td><img src="//www.wunderground.com/static/i/c/v4/'+iconCode[t]+'.svg" alt="" class="weather_icon"></td><td><img src="//www.wunderground.com/static/i/c/v4/'+iconCode[t+1]+'.svg" alt="" class="weather_icon"></td></tr>');
			} else if(typeof iconCode[t] != "undefined" || typeof iconCode[t] != "null"){
				$('#weather_info_'+i).append('<tr><td> - </td><td>'+iconCode[t+1]+'</td></tr>');
			} else if(typeof iconCode[t+1] != "undefined" || typeof iconCode[t+1] != "null"){
				$('#weather_info_'+i).append('<tr><td>'+iconCode[t]+'</td><td> - </td></tr>');
			}
			
			if((typeof wxPhraseLong[t] != "undefined" && typeof wxPhraseLong[t+1] != "undefined") || (typeof wxPhraseLong[t] != "null" && typeof wxPhraseLong[t+1] != "null")){
				$('#weather_info_'+i).append('<tr><td>'+wxPhraseLong[t]+'</td><td>'+wxPhraseLong[t+1]+'</td></tr>');
			} else if(typeof wxPhraseLong[t] != "undefined"){
				$('#weather_info_'+i).append('<tr><td> - </td><td>'+wxPhraseLong[t+1]+'</td></tr>');
			} else if(typeof wxPhraseLong[t+1] != "undefined"){
				$('#weather_info_'+i).append('<tr><td>'+wxPhraseLong[t]+'</td><td> - </td></tr>');
			}

			if((typeof temperature[t] != "undefined" && typeof temperature[t+1] != "undefined") || (typeof temperature[t] != "null" && typeof temperature[t+1] != "null")){
				$('#weather_info_'+i).append('<tr><td><p class="weather_degree">'+temperature[t]+'</p></td><td><p class="weather_degree">'+temperature[t+1]+'</p></td></tr>');
			} else if(typeof temperature[t] != "undefined"){
				$('#weather_info_'+i).append('<tr><td><p class="weather_degree"> - </p></td><td><p class="weather_degree">'+temperature[t+1]+'</p></td></tr>');
			} else if(typeof temperature[t+1] != "undefined"){
				$('#weather_info_'+i).append('<tr><td><p class="weather_degree">'+temperature[t]+'</p></td><td><p class="weather_degree"> - </p></td></tr>');
			}
			
			t = t+2;
		}	
	}
}

$(document).ready(function(){	
	var country =  $('#weather_country').text();
	var city =  $('#weather_city').text();	
	var mylocation = country+','+city;	
	
	var token = "129fbf3f2e1e08";			
	var url_search = "https://eu1.locationiq.com/v1/search.php?key="+token+"&q="+mylocation+"&format=json";	
	create_weather_info(url_search);
	
	get_json_countries_cities();
});

