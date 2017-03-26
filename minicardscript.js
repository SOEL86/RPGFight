$(document).ready(function(){
	
	//create deck
	var cards = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
	
	//create players
	var player1 = new player($("#goblin"),30,[]);
	var player2 = new player($("#walker"),30,[]);
	
	//hide win message
	$("#p1_wins").hide();
	$("#p2_wins").hide();
	
	//on click "Fight!" button
	$("button").click(function(){
		//hide button
		hidebutton();
		//hide previous cards
		$(".p1_draw").remove();
		$(".p2_draw").remove();
		//hide win message
		$("#p1_wins").hide();
		$("#p2_wins").hide();
		//revive players
		player1.name.removeClass("rotateleft");
		player2.name.removeClass("rotateright");
		player1.hp = 30;
		player2.hp = 30;
		$("#p1_hp").html(player1.hp);
		$("#p2_hp").html(player2.hp);
		//reset player positions
		player1.name.css({"left":"0","bottom":"0"});
		player2.name.css({"right":"0","bottom":"0"});
		//charge forwards
		player1.name.animate({left:"+=400px"}, 400);
		player2.name.animate({right:"+=400px"}, 400);
		//shuffle deck
		shuffle(cards);
		//split deck and place in players hand
		$("body").append("<div class='p1_draw'></div>");
		for (i=0;i<10;i++){
			player1.hand[i] = cards[i];
			$(".p1_draw").append("<div class='minicard' id='p1"+i+"'></div>");
		}
		$(".p1_draw").animate({top:"0px",opacity:"1"},200);
		
		$("body").append("<div class='p2_draw'></div>");
		for (i=0;i<10;i++){
			player2.hand[i] = cards[i+10];
			$(".p2_draw").append("<div class='minicard' id='p2"+i+"'></div>");
		}
		$(".p2_draw").animate({top:"0px",opacity:"1"},200);
		//reset to turn 1
		var t = 0;
		//create SFX
		var jab = new Audio("Jab.wav");
		//set attack speed
		var game = setInterval(function(){
		//play attack sound
		jab.play();
		//get results from current turn
		var result = turn(t,player1,player2);
		//player 1 wins
		if(result[0] == 1){
			player2.name.animate({bottom:"+=10px"}, 100);
			player2.name.animate({bottom:"-=10px"}, 100);
			player1.name.animate({left:"+=100px"}, 100);
			player1.name.animate({left:"-=100px"}, 100);
			$("#p1_hp").html(player1.hp);
			$("#p2_hp").html(player2.hp);
			var position = player2.name.position();
			$("body").append("<div class='damage' id='temp'>"+result[1]+"</div>");
			$(".damage").css({"left": position.left,"top":position.top}).animate({left:"+=50px",top:"-=50px",opacity:"0"},900,function(){$("#temp").remove();});	
		}
		//player 2 wins
		if(result[0]==2){
				player1.name.animate({bottom:"+=10px"}, 100);
				player1.name.animate({bottom:"-=10px"}, 100);
				player2.name.animate({right:"+=100px"}, 100);
				player2.name.animate({right:"-=100px"}, 100);
				$("#p1_hp").html(player1.hp);
				$("#p2_hp").html(player2.hp);
				var position = player1.name.position();
				$("body").append("<div class='damage' id='temp'>"+result[1]+"</div>");
				$(".damage").css({"left": position.left,"top":position.top}).animate({left:"-=50px",top:"-=50px",opacity:"0"},900,function(){$("#temp").remove();});		}
		//draw
		if(result[0]==0){
				player1.name.animate({left:"+=100px"}, 100);
				player1.name.animate({left:"-=100px"}, 100);
				player2.name.animate({right:"+=100px"}, 100);
				player2.name.animate({right:"-=100px"}, 100);
				$("#p1_hp").html(player1.hp);
				$("#p2_hp").html(player2.hp);
		}
		//player died
		if(!bothAlive(player1,player2)){
			endgame(player1,player2);
			clearInterval(game);
		}
		//out of cards
		if(t == 8){
			endgame(player1,player2);
			clearInterval(game);
		}
		//next turn
		t=t+2;
		},2000);
	});
});

//player
function player(name, hp, hand){
	this.name = name;
	this.hp = hp;
	this.hand = hand;
}
//turn
function turn(t,player1,player2){
				//$(".p1_draw").remove();
				//$("body").append("<div class='p1_draw'><div class='card' id='first'>"+player1.hand[t]+"</div><div class='card'>"+player1.hand[t+1]+"</div></div>");
				//$(".p1_draw").animate({top:"0px",opacity:"1"},200);	
				$("#p1"+t).css("background-image","none").html(player1.hand[t]);
				$("#p1"+t).animate({top:"+=10px"},200);
				$("#p1"+(t+1)).css("background-image","none").html(player1.hand[t+1]);
				
				$("#p2"+t).css("background-image","none").html(player2.hand[t]);
				$("#p2"+t).animate({top:"+=10px"},200);
				$("#p2"+(t+1)).css("background-image","none").html(player2.hand[t+1]);
		
	//add top two card values for both players
	var player1_turn_total = player1.hand[t]+player1.hand[t+1];
	var player2_turn_total = player2.hand[t]+player2.hand[t+1];
	//compare values and pick winner
	if(player1_turn_total > player2_turn_total){
		//deal damage
		var damage = player1_turn_total - player2_turn_total;
		player2.hp = player2.hp - damage;
		//give result
		return [1,damage];
	} 
	if(player2_turn_total > player1_turn_total){
		var damage = player2_turn_total - player1_turn_total;
		player1.hp = player1.hp - damage;
		return [2,damage];
		//result draw means zero damage
	} else return [0,0];
}
//when a player dies
function endgame(player1,player2){
	//create death sound
	var audio = new Audio("Slap.wav");
	//player 1 has died
	if(player1.hp < 1 && player2.hp > 0){
		//play death sound
		audio.play();
		//fall over animation
		player1.name.addClass("rotateleft");
		//display win message
		$("#p2_wins").show();
		//winner steps back
		player2.name.animate({right:"0"}, 2000, function(){showbutton();});
	} else {
		//player 2 has died
		if(player2.hp < 1 && player1.hp > 0){
			audio.play();
			player2.name.addClass("rotateright");
			$("#p1_wins").show();
			player1.name.animate({left:"0"}, 2000, function(){showbutton();});
		//neither player won
		} else {
			player1.name.animate({left:"0"}, 2000, function(){showbutton();});
			player2.name.animate({right:"0"}, 2000, function(){showbutton();});
		}
	}
}
//show fight button
function showbutton(){
	$("button").show();
}
//hide fight button
function hidebutton(){
	$("button").hide();
}
//checks that both players are alive, returns false if not
function bothAlive(player1,player2) {
	if(player1.hp>0){
		if(player2.hp>0){
			return 1;
		} else return 0;
	} else return 0;
}
//randomises deck
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}