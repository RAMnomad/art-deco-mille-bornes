$(document).ready(function(){
//declare empty deck
var Deck = [];	

//create card object constructor
function Card(name, type, distance, speedLimit, numInDeck){
	this.name = name;
	this.type = type;
	this.distance = distance;
	this.speedLimit = speedLimit;
	this.numInDeck = numInDeck;
	makeDeck(this);
}

//deck building function
function makeDeck(var insertCard){
		for ( var i = 0; i< insertCard.numInDeck; i++){
			Deck.push(Card);
		}
}
		
//define cards
var limit50 = new Card("Limite De Vitesse 50", "speed limit", 0 , 50, 4); 	
var endOfLimit = new Card("Fin De Limite", "remedy", 0, 200, 6);
var accident = new Card("Accident", "hazard", 0, 0, 3);
var repairs = new Card("Reparations", "remedy", 0, 0, 6);
var outOfGas = new Card("Panne d'Essence", "hazard", 0, 0, 3);
var gasoline = new Card("Essence", "remedy", 0, 0, 6);
var flatTire = new Card ("Creve", "hazard", 0, 0, 3);
var spare = new Card("Roue De Secours", "remedy", 0, 0, 6);
var stop = new Card("Stop", "hazard", 0, 0, 5);
var roll = new Card("Roulez", "remedy", 0, 0, 14);
var distance25 = new Card("25KM", "travel", 25, 0, 10);
var distance50 = new Card("50KM", "travel", 50, 0, 10);
var distance75 = new Card("75KM", "travel", 75, 0, 10);
var distance100 = new Card("100KM", "travel", 100, 0, 12);
var distance200 = new Card("200KM", "travel", 200, 0, 4);
var drivingAce = new Card("As Du Volant", "safety", 0, 0, 1);
var extraTank = new Card("Citerne d'Essence", "safety", 0, 0, 1);
var punctureProof = new Card("Increvable", "safety", 0, 0, 1);
var rightOfWay = new Card("Vehicule Prioritaire", "safety", 0,0,1);


//shuffle deck
for (var card in Deck){
	
}


//set up players
function Player(){
	playState:"stop",
	speedLimit:200,
	hand:[],
	prohibitedCards: [],
	changeSpeedLimit: function(newlimit){
		if (newlimit>0){
			speedLimit = newlimit;
		}
	safetyEffect: function(card){
		switch(card.name){
			case "As Du Volant": 
				prohibitedCards.push("Limite De Vitesse 50");
				speedLimit = 200;
				break;
			case "Citerne d'Essence":
				prohibitedCards.push("Pan d'Essence");
				playState: "go";
				break;
			case "Increvable":
				prohibitedCards.push("Creve");
				playState:"go";			
				break;
			case "Vehicule Prioritaire":
				prohibitedCards.push("Stop");
				playState: "go";
				break;
		}
	}
	}
}
var opponent = new Player;
var player1 = new Player;
	

//deal cards - player hand and opponent arrays
for (var i = 0; i<10; i+2){
	if (i%2 === 0){
	opponent.hand[i/2] = Deck[i];
	}
	else{
		player1.hand[(i-1)/2] = Deck[i];
	}
}


//draw card

//disable unplayable cards

//on click play card
$("player hand card").on("click", function(){}
//opponent turn
	//if player ahead- play attack, else play distance
	
	//interrupt with coup fourres

//track active effects	
	
//keep score


//offer extension at 700 pts


//end game at 1000 pts



});