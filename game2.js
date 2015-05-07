//rewrite splitting functions into opponent and player turns. //declare empty deck
var Deck = [];

//create card object constructor
function Card(name, type, remedyFor, distance, speedLimit, numinDeck) {
    this.name = name;
    this.type = type;
    this.distance = distance;
    this.speedLimit = speedLimit;
    this.numinDeck = numinDeck;
    this.cardInfo = function () {     
        return  this.name;
    };
	this.disabled = false;
	this.remedyFor = remedyFor; 
}

//function to create additional copies of cards
function copyCard(d) {
    var length = d.length;
    for (i = 0; i < length; i++) {
        numofCopies = d[i].numinDeck;
        for (var j = 1; j < numofCopies; j++) {
            var newCard = jQuery.extend(true, {}, d[i]);
            d.push(newCard);
        }
    }
}

//define cards

Deck = [
new Card("Limite De Vitesse 50", "speed limit", null, 0, 50, 4),
new Card("Fin De Limite", "remedy", "Limite De Vitesse 50", 0, 200, 6),
new Card("Accident", "hazard", null, 0, 0, 3),
new Card("Reparations", "remedy", "Accident", 0, 0, 6),
new Card("Panne d'Essence", "hazard", null, 0, 0, 3),
new Card("Essence", "remedy", "Panne d'Essence",  0, 0, 6),
new Card("Creve", "hazard", null, 0, 0, 3),
new Card("Roue De Secours", "remedy", "Creve", 0, 0, 6),
new Card("Stop", "hazard", null, 0, 0, 5),
new Card("Roulez", "remedy", "Stop", 0, 0, 14),
new Card("25KM", "travel", null, 25, 0, 10),
new Card("50KM", "travel", null, 50, 0, 10),
new Card("75KM", "travel", null, 75, 0, 10),
new Card("100KM", "travel", null, 100, 0, 12),
new Card("200KM", "travel", null, 200, 0, 4),
new Card("As Du Volant", "safety", "Accident", 0, 0, 1),
new Card("Citerne d'Essence", "safety", "Panne d'Essence", 0, 0, 1),
new Card("Increvable", "safety", "Creve", 0, 0, 1),
new Card("Vehicule Prioritaire", "safety", "Stop", 0, 0, 1)];


//populate deck with correct number of copies
copyCard(Deck);

//shuffle deck using modern Fisher-Yates method
function shuffle(){
	for (var i = 0; i < Deck.length; i++) {
		var j = Math.floor((Math.random() * (Deck.length - i)) + i);
		var tmp = Deck[j];
		Deck[j] = Deck[i];
		Deck[i] = tmp;
	}
}

//set up players
function Player(name) {
	this.name = name;
    this.playState = "stop";
    this.speedLimit = 200;
    this.hand = [];
    this.disabledCards = [];
	this.prohibitedCards = [];
    this.score = 0;
	this.activeCards = ["Stop"];
	this.bonus = 0;
    this.changeSpeedLimit = function (newlimit) {
        if (newlimit > 0) {
            speedLimit = newlimit;
        }
    },
    this.safetyEffect = function (card) {
        switch (card.name) {
            case "As Du Volant":
                this.prohibitedCards.push("Limite De Vitesse 50");
                this.speedLimit = 200;
                break;
            case "Citerne d'Essence":
                this.prohibitedCards.push("Pan d'Essence");
                this.playState = "go";
                break;
            case "Increvable":
                this.prohibitedCards.push("Creve");
                this.playState = "go";
                break;
            case "Vehicule Prioritaire":
                this.prohibitedCards.push("Stop");
                this.playState = "go";
                break;
        }
    };
}

var opponent = new Player("opponent");
var player = new Player("player");


//deal cards - player hand and opponent arrays
function deal(){
for (i = 0; i < 12; i++) {
	var cardToDeal = Deck.shift();
    if (i % 2 === 0) {
        opponent.hand.push(cardToDeal);
    } 
	else {
        player.hand.push(cardToDeal);
    }
}
}
//create draw card function
function drawCard() {
    var cardDrawn = Deck.shift();
    activePlayer.hand.push(cardDrawn);
}

function disableCards(){
	//check play state
	console.log(activePlayer.playState);
	if (activePlayer.playState == "stop"){
	//check for hazards and limits and disable cards
		activePlayer.disabledCards.push("25KM", "50KM", "75KM", 
					"100KM", "200KM", "Essence", 
					"Reparations", "Roue De Secours", 
					"Roulez");
		for (i = 0; i< activePlayer.activeCards;i++){
			switch (activePlayer.activeCards[i].name){
					case "Stop": remedy = "Roulez";break;
					case "Accident": remedy = "Reparations";break;
					case "Panne d'Essence": remedy = "Essence";break;
					case "Creve": remedy = "Roue De Secours";break;
			}
			if(remedy !== null){
				for (j = 0; j<activePlayer.disabledCards.length; j++){
					if (activePlayer.disabledCards[j] == remedy){
						array.splice(j,1);
					}
				}
			}
		}
	}
	else{
		activePlayer.disabledCards.push("Essence", 
					"Reparations", "Roue De Secours", 
					"Roulez");
	}
	for (i = 0;i<activePlayer.hand.length;i++){
		for (j =0; j<activePlayer.disabledCards.length; j++){
			if (activePlayer.hand[i].name == activePlayer.disabledCards[j]){
				activePlayer.hand[i].disabled = true;
				indexarray.push(i);
			}
		}
	}
	toggleCards(indexarray);

	console.log(activePlayer.disabledCards);
	console.log(indexarray);
	indexarray.length = 0;
	
}

var opponentTurn = function(nextTurn){
	console.log(activePlayer.name);
	
	announceTurn();	 
	for(i=0; i<opponent.hand.length; i++){
		player.hand[i].disabled = true;
		opponent.hand[i].disabled = false;
	}
	opponent.disabledCards.length = 0;
	opponent.disabledCards.concat(player.prohibitedCards.slice(0));
	
	//draw and determine last card index
	drawCard();
	console.log(opponent.hand);
	//draw card animation call
	dealOpponentCard();
	disableCards();

	//find priority of play
	setTimeout(function(){
	if (activePlayer.playState == "stop"){
		if(passivePlayer.playState=="stop")
			priority = "movement";
		else
			priority = "obstacles";
	}
	if (activePlayer.playState == "go"){
		if(passivePlayer.playState == "stop" || passivePlayer.score + 50 <= activePlayer.score)
			priority = "movement";
		else
			priority = "obstacles";
	}
		
	for (i = 0; i< activePlayer.activeCards.length;i++){
		if (priority == "movement"){						
			switch (activePlayer.activeCards[i].name){
				case "Stop": checkValue = "Roulez";break;
				case "Accident": checkValue = "Reparations";break;
				case "Panne d'Essence": checkValue = "Essence";break;
				case "Creve": checkValue = "Roue De Secours";break;
				default: checkValue = null;
			}
		}
		if (priority == "obstacles"){
			
		}
	}
	
	console.log(priority);
	
	for (i = 0;i<activePlayer.hand.length;i++){
		if(!activePlayer.hand[i].disabled){
			if (checkValue!==null){
				if(activePlayer.hand[i].name == checkValue)
					spliceIndex = i;
				
				if (spliceIndex === null){
					if (activePlayer.hand[i].name == "Limite De Vitesse")
						spliceIndex = i;
					
				}
			}
			if (checkValue === null || spliceIndex === null){
				if (activePlayer.hand[i].distance>0){
					if(spliceIndex === null)
						spliceIndex = i;
					
					else if (activePlayer.hand[i].distance > activePlayer.hand[spliceIndex].distance)
						spliceIndex = i;															
				}
				else if (spliceIndex === null && activePlayer.hand[i].type == "safety")
					spliceIndex = i;
			}
		}
	}
	},2000);
	console.log(spliceIndex);
	if (spliceIndex == null)
		discardACard();
	else		
		updateCards();
	updateScore(player.score, opponent.score);
	console.log(opponent.hand);
	if (opponent.score>=gameEndScore)
		alert("You lost this time. Race Again?");
	else{
		activePlayer = player;
		passivePlayer = opponent;
		nextTurn(opponentTurn);	
	}
	
}
		
var playerTurn = function(playerSelectCard){
	announceTurn();
	console.log(activePlayer.name);
//set child div equal to last index of the hand
	drawCard(player);
	console.log(activePlayer.hand);
	var lastCard = player.hand.length - 1;
	var currentChild = $(".player").children(".card").eq(lastCard);
	
	dealPlayerCard(currentChild);
	displayCard(currentChild, lastCard);	
	
	for(i=0; i<player.hand.length; i++){
		player.hand[i].disabled = false;
	}
	player.disabledCards.length = 0;
	player.disabledCards.concat(opponent.prohibitedCards.slice(0));
	disableCards();

	var choice = playerSelectCard('Choose a Card to Play or Click the Discard button');
	if (choice == "discard")
		discardACard();
	else 
		updateCards();
	
	updateScore(player.score, opponent.score);
	if (player.score>=gameEndScore)
		alert("You won! Ready for a rematch?");
	else{
		activePlayer = player;
		passivePlayer = opponent;
		nextTurn(playerTurn);	
	}
}

	//update score and active effects
	var updateCards = function(){
		//remove card from hand
		cardToPlay = activePlayer.hand.splice(spliceIndex, 1)[0];	
		
		switch (cardToPlay.name){
			case "Limite De Vitesse 50": passivePlayer.changeSpeedLimit(50);
			updatePlayArea(passivePlayer,spliceIndex);
			break;
			
			case "Fin De Limite" : activePlayer.changeSpeedLimit(200);
			removeCard();
			break;
			
			case "Accident"||"Panne d'Essence"||"Creve"||"Stop": passivePlayer.playState = "stop"; 
				passivePlayer.activeCards.push(cardToPlay.name);
				updatePlayArea(passivePlayer,spliceIndex);
				break;
				//TODO: Program Coup Fourre
			
			case "Reparations"||"Essence"||"Roue De Secours"||"Roulez": 
				for (i=0;i<activePlayer.activeCards.length;i++){
					if (activePlayer.activeCards[i] == cardToPlay.name){
						activePlayer.activeCards.splice(i, 1);
					}
				};
				
				break;
					
            case "25KM" ||"50KM" ||"75KM"||"100KM"||"200KM":  activePlayer.score += cardToPlay.distance; 
			break;
				
				
			case "As Du Volant"||"Citerne d'Essence"||"Increvable"||"Vehicule Prioritaire":
			activePlayer.safetyEffect(cardToPlay);break;
		}	

	}
	var discardACard = function(removeCard){
		//discard 
		
		if (activePlayer.hand.length >6){
			if (activePlayer == opponent){
				for (i = 0; i< activePlayer.hand.length; i++){
					if(activePlayer.hand[i].disabled && activePlayer.hand[i].distance<50)
						discard = activePlayer.hand.splice(i,1)[0];
						removeCard(i);
				}
			}
			else{
				if (spliceIndex = null){
				playerSelectCard("Choose a Discard");
				}
				else
				discard = activePlayer.hand.splice(spliceIndex,1)[0];
				removeCard(spliceIndex);
			}
			console.log(discard);
		}
	}
			
			//switch players and reset variables for next turn
	
	
//set final score to 1000
var gameEndScore = 1000;

//declare variables
var checkValue, cardToPlay, priority, discard, remedy, spliceIndex;
var indexarray=[];
var activePlayer, passivePlayer;
	//start turn sequence	
function runGame() {
    if (Math.round(Math.random()) === 0) {
        activePlayer = player; 
		passivePlayer = opponent;
		playerTurn(opponentTurn);
    } 
	else {
        activePlayer = opponent;
		passivePlayer = player;
		opponentTurn(playerTurn);
    }
	
		
 }
 //add player name to highscores
shuffle();
deal();