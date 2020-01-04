var socket = io();
var username = $('#username').text();
console.log('members page', username);

$('#chatform').submit(function(e){
	e.preventDefault(); 
	socket.emit('chat_message', $('#chattext').val());
	$('#chattext').val('');
	return false;
});

socket.emit('username', username);
socket.on('is_online', function(username) {
	$('#chatmessages').append(username);
});
socket.on('chatlist', function(data) {	
	$('#user_list ul').empty();
	for(var i in data){
		$('#user_list ul').append('<li>' + data[i] + '</li>');
	}	
});
socket.on('chat_message', function(data){
	console.warn('data', data);
	if(data.from){
		$('#chatmessages').append('<div class="message message01"><div class="user"><strong>' + data.from + ':</strong></div><div class="text">' + data.text + '</div><div class="date">' + formatDate(data.time) + '</div></div>');
	} else {
		$('#chatmessages').append('<div class="message message02"><div class="user"></div><div class="text">' + data.text + '</div></div>');
	}	
	var objDiv = document.getElementById("chatmessages");
	objDiv.scrollTop = objDiv.scrollHeight;
});

function formatDate(date) {	
	var d = new Date(date);
	console.warn(date);
    var dateString = new Date(d.getTime() - (d.getTimezoneOffset() * 60000 )).toISOString().split(".")[0].replace(/T/g, " ").replace(/-/g, "/");
	return dateString;
}




