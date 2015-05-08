//declare empty deck
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
				var a = this.activeCards.indexOf("Limite De Vitesse 50")
				if (a != -1){
					this.activeCards.splice(a,1);
					removeFromActiveArea("Limite De Vitesse 50", activePlayer.name);
				}
                break;
            case "Citerne d'Essence":
                this.prohibitedCards.push("Panne d'Essence");
                
				a = this.activeCards.indexOf("Panne d'Essence");
				if (a != -1){
					this.playState = "go";
					this.activeCards.splice(a,1);
					removeFromActiveArea("Panne d'Essence", activePlayer.name);
				}
                break;
            case "Increvable":
                this.prohibitedCards.push("Creve");
                
				a = this.activeCards.indexOf("Creve");
				if (a != -1){
					this.playState = "go";
					this.activeCards.splice(a,1);
					removeFromActiveArea("Creve", activePlayer.name);
				}
                break;
            case "Vehicule Prioritaire":
                this.prohibitedCards.push("Stop");
                
				a = this.activeCards.indexOf("Stop");
				if (a != -1){
					this.playState = "go";
					this.activeCards.splice(a,1);
					removeFromActiveArea("Stop", activePlayer.name);
				}
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
function drawCard(disable) {
	console.log("Draw function");
    var cardDrawn = Deck.shift();
    activePlayer.hand.push(cardDrawn);
	console.log (activePlayer.name, "drew:", cardDrawn.name, activePlayer.hand[6].name);
	console.log(activePlayer.name, " hand length: ",activePlayer.hand.length);
	disable(toggleCards);
	
}

var disableCards = function(toggle){
	console.log("Disable function");
	//disable hand of non active player 
	if (activePlayer == opponent){
		for (i = 0; i<player.hand.length; i++){
				player.hand[i].disabled = true;
		}
	}
	
	for (i = 0; i<activePlayer.hand.length; i++){
				activePlayer.hand[i].disabled = false;
		}
	
	//reset array of cards to disable
	activePlayer.disabledCards.length = 0;
	
	//check passive player's cards and determine cards to disable
	activePlayer.disabledCards.concat(passivePlayer.prohibitedCards.slice(0));
	if (passivePlayer.speedLimit == 50)
		activePlayer.disabledCards.push("Limite de Vitesse");
	if (passivePlayer.playState == "stop")
		activePlayer.disabledCards.push("Stop", "Creve","Accident","Panne d'Essence");
	
	//check play state
	if (activePlayer.playState == "stop"){
	//check for hazards and limits and disable cards
		console.log(activePlayer.activeCards);
		activePlayer.disabledCards.push("25KM", "50KM", "75KM", 
					"100KM", "200KM", "Essence", 
					"Reparations", "Roue De Secours", 
					"Roulez","Fin De Limite");
	}
	else{
		activePlayer.disabledCards.push("Essence", 
					"Reparations", "Roue De Secours", 
					"Roulez","Fin De Limite");
	}
	for (i = 0; i<activePlayer.activeCards.length;i++){
		console.log(activePlayer.activeCards[i]);
		switch (activePlayer.activeCards[i]){
				case "Limite de Vitesse": remedy = "Fin De Limite";break;
				case "Stop": remedy = "Roulez";console.log(remedy);break;
				case "Accident": remedy = "Reparations";console.log(remedy);break;
				case "Panne d'Essence": remedy = "Essence";console.log(remedy);break;
				case "Creve": remedy = "Roue De Secours";console.log(remedy);break;
				default: remedy = null;
		}
		
		if(remedy != null){
			for (j = 0; j<activePlayer.disabledCards.length; j++){
				if (activePlayer.disabledCards[j] == remedy){
					activePlayer.disabledCards.splice(j,1);
				}
			}
		}
	}
	


	for (i = 0;i<activePlayer.hand.length;i++){
		for (j =0; j<activePlayer.disabledCards.length; j++){
			if (activePlayer.hand[i].name == activePlayer.disabledCards[j]){
				activePlayer.hand[i].disabled = true;
			}
		}
	}
	console.log("The disabled cards: ", activePlayer.disabledCards);
	toggle(chooseCard);

}

	var chooseCard = function(update, discardfunc){
		var lastCard, currentChild;
		lastCard = activePlayer.hand.length - 1;
		console.log("The last card is at index: ", lastCard);
		console.log("Choose card function");
	
	//set child div equal to last index of the hand; deal and display new card.

		if (activePlayer == player){
			currentChild = $(".player.hand").children(".card").eq(6);
			announce("Your turn, please choose a card to play, or click the button to discard");
			setTimeout(function(){
				currentChild.show();
				dealPlayerCard(currentChild, lastCard);
			},1000);
			setTimeout(function(){
				displayCard(currentChild, lastCard);	
			},2000);


		}
		//select best card if active player is opponent 
		else{
			announce("Opponent's turn.");
			//draw card animation call
			currentChild = $(".opponent.hand").children(".card").eq(6);
			dealOpponentCard(currentChild, lastCard);
			currentChild.slideUp(600).fadeOut();
			
			//find priority of play
			
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
					for (i = 0;i<activePlayer.hand.length;i++){
						if(!activePlayer.hand[i].disabled){
							if(activePlayer.hand[i].name == "Creve" || "Stop" || "Panne d'Essence" || "Accident"){
								checkValue =activePlayer.hand[i].name;
							}
						}
					}
				}
			}
			
		
			
			for (i = 0;i<activePlayer.hand.length;i++){
				if(!activePlayer.hand[i].disabled){
					if (checkValue!=null){
						if(activePlayer.hand[i].name == checkValue)
							spliceIndex = i;
						
						if (spliceIndex == null){
							if (activePlayer.hand[i].name == "Limite De Vitesse")
								spliceIndex = i;
							
						}
					}
					if (checkValue == null){
						if (activePlayer.hand[i].distance>0){
							if(spliceIndex == null)
								spliceIndex = i;
							
							else if (activePlayer.hand[i].distance > activePlayer.hand[spliceIndex].distance)
								spliceIndex = i;															
						}
						else if (spliceIndex == null && activePlayer.hand[i].type == "safety")
							spliceIndex = i;
                    }
				}
			}
			if (spliceIndex == null){
				discardfunc(removeCard);
			}
			else{
				setTimeout(function(){
					update(updatePlayArea, removeCard);
				},4000);
			}
		}

	}
	
	//update score and active effects
	var updateCards = function(board,remove){
		console.log("Update cards function");
		//remove card from hand
		
		var param;
		var func;
		switch(activePlayer.hand[spliceIndex].name){
			case "Limite De Vitesse 50": 
				passivePlayer.activeCards.push(activePlayer.hand[spliceIndex].name);
				passivePlayer.changeSpeedLimit(50);
				func = "board";
				param = passivePlayer;
				break;
			
			case "Fin De Limite" : 
				activePlayer.changeSpeedLimit(200);
				func = "board";
				param = activePlayer;
				break;
			
			case "Accident":
			case "Panne d'Essence":
			case "Creve":
			case "Stop": 
				passivePlayer.playState = "stop"; 
				passivePlayer.activeCards.push(activePlayer.hand[spliceIndex].name);
				func = "board";
				param = passivePlayer;
				break;
				//TODO: Program Coup Fourre
			
			case "Reparations":
			case "Essence":
			case "Roue De Secours":
			case "Roulez": 
				activePlayer.playState = "go"
				for (i=0;i<activePlayer.activeCards.length;i++){
					if (activePlayer.activeCards[i] == activePlayer.hand[spliceIndex].remedyFor){
						activePlayer.activeCards.splice(i, 1);
					}
				};
				removeFromActiveArea(activePlayer.hand[spliceIndex].remedyFor, activePlayer.name)
				func = "board";
				param = activePlayer;
				break;
			
					
            case "25KM":
			case "50KM":
			case "75KM":
			case "100KM":
			case "200KM":  
				activePlayer.score += activePlayer.hand[spliceIndex].distance; 
				announce("This racer's gaining speed as she passes marker " + activePlayer.score); 
				func = "remove";
				break;
				
				
			case "As Du Volant":
			case "Citerne d'Essence":
			case "Increvable":
			case "Vehicule Prioritaire":
				activePlayer.safetyEffect(activePlayer.hand[spliceIndex]);
				func = "board";
				param = activePlayer;
				break;
		}	
		if (func == "board"){
			board(param, switchPlayers);
		}
		else
			remove(updateScore);
	}
	
	
	var discardACard = function(remove){
		//discard 
		console.log("Discard function");
		if (activePlayer == opponent){
			for (i = 0; i< activePlayer.hand.length; i++){
				if(activePlayer.hand[i].disabled && activePlayer.hand[i].distance<50){
					discard = activePlayer.hand.splice(i,1);
					announce("Opponent discarded:" + discard[0].name);
					remove(updateScore);
				}
			}
		}
		else{
			if (spliceIndex == null){
			for (i = 0; i<player.hand.length; i++){
				player.hand[i].disabled = false;
			}
			toggleCards();
			announce("Choose a Discard");
			}
			else{
				discard = activePlayer.hand.splice(spliceIndex,1);
				remove(updateScore);
			}
		}
	}
			
			//switch players and reset variables for next turn
	var switchPlayers = function(draw){
		console.log("Switch player function");
		if (discard == null){
			cardToPlay = activePlayer.hand.splice(spliceIndex, 1);	
			announce(cardToPlay.name + " played by " + activePlayer.name);
		}
		if (activePlayer == player){
			
			activePlayer = opponent;
			passivePlayer = player;
		}
		else{
			
			activePlayer = player;
			passivePlayer= opponent;
		}
		checkValue = null;
		remedy = null;
		spliceIndex = null;
		discard = null;
		draw(disableCards);
	}	
	
	
//set final score to 1000
var gameEndScore = 1000;

//declare variables
var checkValue, cardToPlay, priority, discard, remedy, spliceIndex, clicked;

var activePlayer, passivePlayer;
	//start turn sequence	
function runGame(draw) {
	
    
    if (Math.round(Math.random()) === 0) {
        activePlayer = player; 
		passivePlayer = opponent;
		
    } else {
        activePlayer = opponent;
		passivePlayer = player;
		
    }
	setTimeout(function(){
		draw(disableCards);
	},0);
	
}
	//add player name to highscores
 
 shuffle();
	deal();
