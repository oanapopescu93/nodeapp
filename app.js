var express = require("express");
var path = require("path");
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');

var routes = require("./routes");
var router01 = require("./members");
var router02 = require("./game01_members");
var router03 = require("./weather_router");

var app = express();
var port = process.env.PORT || 3000;
//var http = require('http').Server(app);
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.set("port", port);
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/include/', partialsDir: __dirname + '/views/include/partials/'}));
app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/assets', express.static('assets'));

app.use(routes);
app.use(router01);
app.use(router02);
app.use(router03);

var user_join = [];
var users = [];
var text01 = 'The user is offline or does not exist';
var text02 = 'Please type a user ( /w username message )';

var user_join_game01 = [];
var users_game01 = [];
var check = 'O';

io.on('connection', function(socket) { 
	//console.log('connection');   
	socket.on('username', function(username) {
        socket.username = username;
		users[socket.username] = socket;
		//console.log('users', users);
		user_join.push(socket.username);
		io.emit('is_online', '<p class="user_join">' + socket.username + ' join the chat...</p>');
		io.emit('chatlist', chatlist(user_join));
    });	
	socket.on('disconnect', function(username){
		io.emit('is_online', '<p>' + socket.username + ' left the chat...</p>');
		var removed;
		for (var i in user_join){
			if(user_join[i] == socket.username){
				removed = user_join.splice(i,1);
			}
		}
		io.emit('chatlist', chatlist(user_join));
	});
	socket.on('chat_message', function(message) {
		var text = message.trim();
		if(text.substr(0,3) === '/w '){			
			text = text.substr(3);
			var index = text.indexOf(" ");
			if(index != -1){
				var name = text.substring(0, index);
				var text = text.substring(index+1);
				//console.log('1', name);
				//console.log('2', text);	
				var match = false; 					
				for (var i in user_join){
					if(user_join[i] == name){	
						match = true;
					}
				}
				if(match){	
					//console.log('user', name, socket.username)
					users[name].emit('chat_message', chatMessage(socket.username + ' ', text));
					users[socket.username].emit('chat_message', chatMessage(socket.username + ' ', text));
				} else {
					users[socket.username].emit('chat_message', chatMessage('', text01));
				}
			} else {
				users[socket.username].emit('chat_message', chatMessage('', text02));
			}			
		} else {	
			io.emit('chat_message', chatMessage(socket.username, message));
		}
	});
	
	
	socket.on('username_game01', function(username_game01) {
        socket.username_game01 = username_game01;			
		
		user_join_game01.push({player: socket.username_game01});		
		users_game01[socket.username_game01] = socket;
		
		for(var i in user_join_game01){
			if(i<2){
				user_join_game01[i].allow = "allow";
				user_join_game01[i].turn = "0";
			} else {
				user_join_game01[i].allow = "not allow";
			}			
		}
		
		user_join_game01[0].turn = "1";
				
		if(check == 'X'){
			check = 'O';
			user_join_game01[user_join_game01.length-1].check = check;
		} else {
			check = 'X';
			user_join_game01[user_join_game01.length-1].check = check;
		}
		
		console.log('user_join_game0111', user_join_game01, user_join_game01.length);	
		
		io.emit('chatlist_game01', chatlist(user_join_game01));
    });
	socket.on('disconnect', function(username_game01){
		var removed;		
		for (var i in user_join_game01){
			if(user_join_game01[i].player == socket.username_game01){
				removed = user_join_game01.splice(i,1);
				console.log('disconnect', user_join_game01, user_join_game01[i].player);
			}
		}	
		for(var i in user_join_game01){
			if(i<2){
				user_join_game01[i].allow = "allow";
				user_join_game01[i].turn = "0";
			} else {
				user_join_game01[i].allow = "not allow";
			}			
		}
		io.emit('chatlist_game01', chatlist(user_join_game01));
	});
	
	socket.on('check_game01',function(data){
		var user = data.user;
		var box = data.box;
		var icon = data.icon;
		var turn = data.turn;
		
		//console.log('oana1a', user, box, icon, turn);
		//console.log('oana1b', data, user_join_game01);
		for (var i in user_join_game01){
			 
			if(user_join_game01[i].player == data.user){
				user_join_game01[i].turn = "0";
				data.turn = "0";
				
				if(typeof user_join_game01[parseInt(i)+1] != "undefined"){
					if(user_join_game01[parseInt(i)+1].allow == "allow"){
						user_join_game01[parseInt(i)+1].turn = "1"
					} else {
						if(typeof user_join_game01[parseInt(i)-1] != "undefined"){
							user_join_game01[parseInt(i)-1].turn = "1"
						}
					}
				} else {
					if(typeof user_join_game01[parseInt(i)-1] != "undefined"){
						user_join_game01[parseInt(i)-1].turn = "1"
					}
				}
				
			}
		}
		//console.warn('oana1c', user_join_game01);
		io.emit('chatlist_game01', chatlist(user_join_game01));
		io.emit('check_game01', data);
	});
	
	socket.on('win_game01',function(data){
		var icon = data;
		var winner = "";
		for(var i in user_join_game01){
			if(user_join_game01[i].check == icon){
				winner = user_join_game01[i].player;
				console.log('win_game01', icon, winner);
			}
		}
		io.emit('win_game01', winner);
	});

	
	//socket_route_action(socket,'check_game01',checkGame(data));
});

// function checkGame (data){
	// var user = data.user;
	// var box = data.box;
	// var icon = data.icon;
	// console.log('oana', user, box, icon);
	// io.emit('check_game01', data);
// };

function chatlist(user_join){
	return user_join;
}

function chatMessage(from, text){
	if(text === text01 || text === text02){
		return {from, text};
	} else {
		return {from, text, time: new Date().getTime()};
	}    
};

function socket_route_action(socket,route,action) {
	socket.on(route,action);
}

//app.listen(app.get("port"), '10.3.0.145', function(){
http.listen(app.get("port"), 'localhost', function(){
	console.log("Server started on port " + app.get("port") + " on dirname " + __dirname);
});