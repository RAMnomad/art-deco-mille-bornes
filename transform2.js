
$(document).ready(function () {
    //on clicking the Play Game button, set up board for play
    $("#play").click(function () {
        $(".main").animate({
            "padding": "0"
        });
        $("header").animate({
            "width": "100%"
        });
        $("header").children().animate({
            "height": "70px",
                "margin": "0"
        });
        $("header").find("h1").animate({
            "font-size": "36px",
                "text-align": "left"
        });
        $("#tagline").css({
            "display": "none"
        });
        $("#deck").animate({
            "margin-left": "10px",
                "margin-top": "260px"
        });
        //remove buttons
        $(".buttons").hide(1);


        //play animation functions
        window.dealPlayerCard = function(div) {
            $(div).show();
			$(div).children(".back").show().addClass("animated rollInPlayer");
        }

        window.dealOpponentCard= function(){
			var div = ".opponent";
			$(div).show();
			$(div).children(".back").show().addClass("animated rollInOpponent").delay(500).slideUp(600).fadeOut();
        }
        //add text and image and display card face
        window.displayCard = function(div,i) {
			
            $(div).children(".back").hide();
            $(div).find(".front").show().addClass("animated flip flipInY");
            $(div).find(".top-left").text(player.hand[i].name).show();
            $(div).find(".bottom-right").text(player.hand[i].name).show();
			var img = '<img src = "images/' + player.hand[i].name + '.png" width = "145" />';
			$(div).find(".center").append(img);
        }
        var currentChild;


        //deal out cards one at a time
        $(this).css({
            "display": "flex"
        });
       
        var index = 0;
        var o = setInterval(function () {
                var currentChild = $(".opponent").children(".card").eq(index);
				dealOpponentCard(currentChild,index);
            }, 300);
        var p = setInterval(function () {
				var currentChild = $(".player").children(".card").eq(index);
                dealPlayerCard(currentChild, index);
                index++;
            
        }, 300);

        if (index == opponent.hand.length - 1) clearInterval(o);
        if (index == player.hand.length - 1) clearInterval(p);

        setTimeout(function () {
			$("div.opponent.hand").slideUp().fadeOut();
			$(".player").children(".card").css({
                "margin-right": "-15px"
            }).each(function () {
                $(this).children(".back").hide(1);
            });
             // getPlayerCards();
			for (i=0; i<player.hand.length;i++){            
                currentChild = $(".player").find(".card").eq(i);
                displayCard(currentChild, i);
				currentChild.css({"box-shadow" : 
				"3px 3px 10px black", "border-radius" : "10px",
				"-moz-border-radius":"10px", "-webkit-border-radius":"10px"});
			}
			$(".player").find("button").show();
			 runGame();
        }, 000);
		
    });
	
	window.announceTurn = function(){
		if(activePlayer==player)
			var text = "Your Turn";
		else
			text = "Opponent's Turn";
		$(".main").append($("<div>", {class:"notify"})).children(".notify").unbind().text(text).fadeIn(3000).fadeOut().remove();
	console.log(text);
	}
	
	window.playerSelectCard = function(text){
		var clicked;
		var playerChoice = "update";
		$(".main").append($("<div>", {class:"notify"})).children(".notify").unbind().text(text).fadeIn().delay(3000).fadeOut().remove();
			
		$(".player").find(".front").click(function(){
			spliceIndex = $(this).parent(".card").index();
			if (clicked){
				clicked = false; 
				playerChoice = "discard";
			}
			return playerChoice;

		});
		$("button").click(function(){
			clicked = true;
			playerChoice = "discard";
			spliceIndex = null;
			return playerChoice;
		});
	}
	
	window.updatePlayArea = function(thisPlayer, index){
		var fromPlayArea = "." + activePlayer.name + " .play-area";
		var toPlayArea = "." + thisPlayer.name + " .play-area";
		$(fromPlayArea).find(".card").eq(index).detach().appendTo(toPlayArea).show();
	}
	
	window.updateScore = function(plScore, oppScore){
		var oldOppScore = $(".scores").children(".opp").text();
		$(".scores").children(".opp").text(oppScore+oldOppScore);
		var oldPlScore = $(".scores").children(".pl").text();
		$(".scores").children(".pl").text(plScore+oldPlScore);
		
	}
	
	
	window.toggleCards = function(indexes){
		$(".player").find(".front").removeClass("disabled");
		for (var i = 0; i<indexes.length; i++){
			$(".player").find(".front").eq(indexes[i]).addClass("disabled");
		}
		
	}
	window.removeCard = function(){
		var thisPlayer = "." + activePlayer;
		$(thisPlayer).children(".card").eq(spliceIndex).remove();
		
	}
	
	window.toggleDiscardButton = function(){
		var button = $(".player").find("button");
		if (disable)
			button.disable;
		else 
			button.removeProp("disabled");	
	}
	
	
    $("#instructions").click(function () {
        $(".lightbox").show();
        $("#rules").show();
    });

    $("#highscores").click(function () {
        $(".lightbox").show();
        $("#leaderboard").show();
    });
    $(".close").click(function () {
        $(".lightbox").hide();
        $("#rules").hide();
        $("#leaderboard").hide();
    });

});