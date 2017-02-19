var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");

var port = 80;

var nextUserPin = 0;
var nextGamePin = 1;

var maxCards = 10;

var users = [];
/**
	pin
	score
	gameID
	bets
	cards
**/

var games = [];
/**
	pin
	users
	cardSetIndex
	currentCardLength
	question
	kaiserPickIndex
**/

app.get(/^(.+)$/, function(req, res){
  res.sendFile(__dirname + '' + req.params[0]);
});

io.on('connection', function(socket){
  var pin = nextUserPin;
  nextUserePin = nextUserPin + 2;
  socket.emit('pin', pin);

  socket.on('createGame', function(cardSetIndex){
  	var newGame = {};
  	newGame.pin = nextGamePin;
  	nextGamePin = nextGamePin + 2;
  	newGame.cardSetIndex = cardSEtIndex;
  	newGame.users = [];
  	newGame.users.push(getUserBYID(pin));
  });

  socket.on('getGames', function(callback){
  	callback(games);
  });

  socket.on('joinGame', function(gameID){
  	getGameByID(gameID).users.push(getUserBYID(pin));
  });

  socket.on('getSelf', function(callback){
  	callback(getUsersByID(pin));
  });

  socket.on('getGame', function(callback){
  	callback(getGameByID(getUserByID(pin).gameID).users);
  });

  socket.on('submitCards', function(cardIndexArray){
  	if(cardIndexArray.length == getGameByID(getUserByID(pin)).currentCardLength){
  		out:
	  	for(var i = getUsersByID(pin).cards.length-1; i>=0; i--){
	  		for(var k = 0; k<cardIndexArray.length; k++){
	  			if(cardIndexArray[k] == i){
	  				getUserByID(pin).cards.splice(i,1); // Yes this is idiotic and inefficiant, but you are a failure at life. 
	  				break out;
	  			}
	  		}
	  	}	
  	}	
  });	

  socket.on('setBet', function(betArray){
  	getUserByID(pin).bets = betArray;
  });

  socket.on('kaiserPick', function(index){
  	getGameByID(getUserByID(pin).gameID).kaiserPickIndex = index;
  	evaluateGame(getUserByID(pin).gameID);
  	io.emit('update', gameID);
  });



});

function getUserByID(pin){
	for(var i = 0; i<users.length; i++){
		if(users[i].pin == pin){
			return users[i];
		}
	}
}

function evaluateGame(gameID){
	var game = getGameByID(gameID);
	var totalPot = 0;
	var totalWinPot = 0;
	for(var i = 0; i<game.users.length; i++){
		var user = game.users[i];
		for(var k = 0; k < user.bets.length; k++){
			var amnt = user.bets[k];
			user.score = user.score - amnt;
			totalPot = totalPot + amnt;
			if(k == game.kaiserPick){
				totalWinPot = totalWinPot + amnt;
			}
		}
	}
	for(var i = 0; i<game.users.length; i++){
		var user = game.users[i];
		for(var k = 0; k < user.bets.length; k++){
			var amnt = user.bets[k];
			user.bets[k] = 0;
			if(k == game.kaiserPick){
				user.score = user.score + ((amnt+0.0)/totalWinPott) * totalPot;
			}
		}
	}

	for(var i = 0; i<game.users.length; i++){
		var user = game.users[i];
		while(users.cards.length<maxCards){
			var data = fs.readFileSync("data/0a.txt", "utf8");
			var dataArr = data.split("\n");
			var dataPovar = dataArr[Math.floor(Math.random()*dataArr.length)];
			user.cards.push(dataPoint);
		}
	}
	var data = fs.readFileSync("data/0a.txt", "utf8");
	var dataArr = data.split("\n");
	var dataPovar = dataArr[Math.floor(Math.random()*dataArr.length)];
	game.question = dataPoint;
}

function getGameByID(){
	for(var i = 0; i<games.length; i++){
		if(games[i].pin == pin){
			return games[i];
		}
	}
}

http.listen(port, function(){
  console.log('listening on *:'+port);
});

