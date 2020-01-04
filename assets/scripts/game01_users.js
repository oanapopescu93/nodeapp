var socket = io();
var username_game01 = $('#username_game01').text();
// console.log('game01', username_game01);

var users_data = [];
var check_game01 = {};

$(document).ready(function(){	
	var game01 = new mygame01('game01');
	game01.ready();
	socket.emit('username_game01', username_game01);	
});

function mygame01(idstring){
	var self = this;	
	
	this.ready = function(){
		load_check_boxes(idstring);
		
		$('body').on('click', '.check_box', function (e) {
			click_check_boxes($(e.currentTarget));
		});
	}
	function load_check_boxes(idstring){
		$('#' + idstring).append('<div class="check_container"></div>');
		for(var i=0; i<3; i++){
			$('#' + idstring + ' .check_container').append('<div class="check_row_'+ i +' check_row"></div>');
			for(var j=0; j<3; j++){
				$('#' + idstring + ' .check_container .check_row_'+i).append('<div id="check_box_' + i + '_' + j + '" class="check_box"><span></span></div>'); 
			}
		}
	}
	function click_check_boxes(check_box){
		console.warn('users_data', users_data, username_game01);
		for(var i in users_data){
			if(users_data[i].player == username_game01){
				
				var my_user = users_data[i];
				console.warn('user este',  my_user);

				if(my_user.allow == "allow"){
					if(my_user.turn == "1"){
						var id_text = check_box.attr('id');				
						check_game01 = {};
						check_game01 = {user:  my_user.player, box: id_text, icon: my_user.check, turn: my_user.turn};
						console.warn('clicked',  check_game01);
						if($('#'+check_game01.box).find('span').text() == ""){
							socket.emit('check_game01', check_game01);
						} else {
							alert("You can not check there.");
						}
												
					} else {
						alert("It is not your turn yet.");
					}
				} else {					
					alert("You can't play now. Player " + users_data[0].player + " is playing now with " + users_data[1].player);
				}				
				
							
			}
		}			
	}
}

socket.on('check_game01', function(data) {	
	console.log('oana00', data);
	$('#'+data.box).addClass('clicked');
	$('#'+data.box).find('span').text(data.icon);
	win_game01(data);
});

socket.on('win_game01', function(data) {	
	console.warn('The winner is ', data);
	$('#game01_winner').empty();
	$('#game01_winner').append('The winner is ', data);
});	

function win_game01(data){
	var box = data.box;
	var current_icon = data.icon;	
	check_win_game01(box, current_icon);
}

function check_win_game01(box, current_icon){	
	var box_array = box.split("_");
	var i = parseInt(box_array[2]);
	var j = parseInt(box_array[3]);	
	if(check_horizontal(i, j, current_icon)){
		console.warn('horizontal win', current_icon, username_game01);
		socket.emit('win_game01', current_icon);
	} else if(check_vertical(i, j, current_icon)){
		console.warn('vertical win', current_icon, username_game01);	
		socket.emit('win_game01', current_icon);
	} else if(check_diagonal01(i, j, current_icon)){
		console.warn('diagonal01 win', current_icon, username_game01);
		socket.emit('win_game01', current_icon);
	} else if(check_diagonal02(i, j, current_icon)){
		console.warn('diagonal02 win', current_icon, username_game01);
		socket.emit('win_game01', current_icon);
	}
}

function check_horizontal(i, j, current_icon){
	var win = false;
	var all = 0;
	
	$('.check_row_' + i + ' .check_box').each(function() {
		if($(this).find('span').text() == current_icon){			
			all++;
		}		
	});	
	
	if(all == $('.check_row_' + i + ' .check_box').length){
		win = true;
	} 
	
	return win
}
function check_vertical(i, j, current_icon){
	var win = false;
	var all = 0;
	
	$('.check_row').each(function(k) {
		if($(this).find('#check_box_' + k + '_' + j).find('span').text() == current_icon){			
			all++;
		}		
	});	
	
	if(all == $('.check_row').length){
		win = true;
	} 
	
	return win
}

function check_diagonal01(i, j, current_icon){
	var win = false;
	var all = 0;
	var matrix_length = $('.check_row').length;
	
	var a = find_diagonal_head('01', i, j, matrix_length)[0]-1;
	var b = find_diagonal_head('01', i, j, matrix_length)[1]-1;
	
	while (a < matrix_length-1 && b < matrix_length-1) {
		a++
		b++
		if($('#check_box_' + a + '_' + b).find('span').text() == current_icon){			
			all++;			
		}
		if(all == $('.check_row').length){
			win = true;
		} 
	}
	
	return win
}

function check_diagonal02(i, j, current_icon){
	var win = false;
	var all = 0;
	var matrix_length = $('.check_row').length;
	
	var a = find_diagonal_head('02', i, j, matrix_length)[0]-1;
	var b = find_diagonal_head('02', i, j, matrix_length)[1]+1;	

	while (a < matrix_length-1 && b > 0) {
		a++
		b--
		if($('#check_box_' + a + '_' + b).find('span').text() == current_icon){			
			all++;	
		}
		if(all == $('.check_row').length){
			win = true;
		}
	}
	
	return win
}

function find_diagonal_head(diagonal, a, b, matrix_length){	
	if(diagonal == "01"){
		while (a > 0 && b > 0) {
			a--
			b--	
		}
		return [a, b];
	} else {		
		while (a > 0 && b < matrix_length-1) {
			a--
			b++	
		}
		return [a, b];
	}
	
}

socket.on('chatlist_game01', function(data) {	
	console.log('aaa', data);
	users_data = data;
	$('#user_list_game01 ul').empty();
	for(var i in data){
		$('#user_list_game01 ul').append('<li>' + data[i].player + '</li>');
	}	
});