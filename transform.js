
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
		$(".left").hide();
		$(".right").hide();
        $("#tagline").css({
            "display": "none"
        });
        $("#deck").animate({
			"position":"absolute",
			"top":"360px",
            "margin-left": "45px",
        });
		$(".hand").css({
			"display":"flex",
			"position": "absolute",
			"left":"400px"
		});
        //remove buttons
        $(".menu").hide(1);


        //play animation functions
        window.dealPlayerCard = function(div) {
			$(div).children(".back").show().addClass("animated rollInPlayer").css({
				"margin-top":"15px",
                "margin-right": "-45px"
            });
			$(div).show();
        }

        window.dealOpponentCard= function(div){
            $(div).show();
			$(div).children(".back").show().addClass("animated rollInOpponent");
        }
        //add text and image and display card face
        window.displayCard = function(div,i) {
            $(div).children(".back").hide();
            $(div).find(".front").show().addClass("animated flip flipInY");
            $(div).find(".top-left").text(player.hand[i].name).show();
            $(div).find(".bottom-right").text(player.hand[i].name).show();
			var img = '<img src = "images/' + player.hand[i].name + '.png" width = "130" />';
			$(div).find(".center").empty().append(img);
        }
        var currentChild;


        //deal out cards one at a time
     
       
        var index = 0;
        var o = setInterval(function () {
                var currentChild = $(".opponent.hand").children(".card").eq(index);
				dealOpponentCard(currentChild,index);
            }, 500);
        var p = setInterval(function () {
				var currentChild = $(".player.hand").children(".card").eq(index);
                dealPlayerCard(currentChild, index);
                index++;
            
        }, 500);

        if (index == opponent.hand.length - 1) clearInterval(o);
        if (index == player.hand.length - 1) clearInterval(p);

        setTimeout(function () {
			$("div.opponent.hand").children(".card").fadeOut();
			$(".hand").css({"left":"200px"});
			$(".player").children(".card").css({
				"margin-top":"15px",
                "margin-right": "-45px"
            }).each(function () {
                $(this).children(".back").hide(1);
            });
             // getPlayerCards();
			for (i=0; i<player.hand.length;i++){            
                currentChild = $(".player.hand").find(".card").eq(i);
                displayCard(currentChild, i);
				currentChild.css({"box-shadow" : 
				"3px 3px 10px black", "border-radius" : "10px",
				"-moz-border-radius":"10px", "-webkit-border-radius":"10px"});
			}
			$(".play-area").css({"display":"flex"});
			$("button").show();
			$(".scores").show();
			$(".racer-label").show();
			 runGame(drawCard);
        }, 4000);
		
    });
	window.announce = function(text){
		setTimeout(function(){
		$(".notify").empty().text(text).show().delay(2000).fadeOut();
		},0);
	}
	
	window.playerSelectCard = function(update,discard){

			if (clicked){
				clicked = false; 
				discard(removeCard);
			}
			else				
			update(updatePlayArea,removeCard);		
	}
	$(".player").find(".front").click(function(){
		spliceIndex = $(this).closest(".card").index();
		$(".player").find(".front").addClass("clicked");
		playerSelectCard(updateCards, discardACard);
	});
	$("button").click(function(){
		if(activePlayer == player){
			clicked = true;
			spliceIndex = null;
			discardACard(removeCard);
		}
		});
		
	window.updatePlayArea = function(thisPlayer, switchp){
		var fromPlayArea, toPlayArea;
		fromPlayArea = "." + activePlayer.name + ".play-area";
		toPlayArea = "." + thisPlayer.name + ".play-area";
		img = '<img src = "images/' + activePlayer.hand[spliceIndex].name + '.png" width = "130" />'
		$(toPlayArea).children(".card").eq(0).clone()
			.appendTo(toPlayArea).show()
			.find(".top-left").text(activePlayer.hand[spliceIndex].name)
			.siblings(".bottom-right").text(activePlayer.hand[spliceIndex].name)
			.siblings(".center").append(img)
			.closest(".front").show();
		if(activePlayer == player)
			$(".player.hand").children(".card").eq(spliceIndex).detach().appendTo(".player.hand").hide();
		//setTimeout(function(){
		switchp(drawCard);
		//},0);
	}
			
	window.updateScore = function(switchp){
		$(".scores").children("#opp").text(opponent.score);
		$(".scores").children("#pl").text(player.score);
		if (opponent.score>=1000){
			announce("Tough luck, toots. Go chase yourself until you've got what it takes.")
			setTimeout(function(){
			window.location.reload();
			},1000);
		}
		else if (player.score>=1000){
			announce("Now you're on the trolley, Bearcat. You've won! Click play to show us what you got again.")
			setTimeout(function(){
			window.location.reload();
			},1000);
		}
		else
			switchp(drawCard);
	}
	
	
	window.toggleCards = function(choose){
		$(".player.hand").find(".front").removeClass("disabled clicked");
		for (var i = 0; i<player.hand.length; i++){
			if (player.hand[i].disabled)
				$(".player.hand").find(".front").eq(i).addClass("disabled");
		}
		if (choose !== undefined)
			choose(updateCards,discardACard);
	}
	window.removeCard = function(scores){
		var hand = "." + activePlayer.name + ".hand";
		$(hand).children(".card").eq(spliceIndex).appendTo(hand).hide();
		scores(switchPlayers);
	}
	window.removeFromActiveArea = function(cardName, thisPlayer){
		var area = "." + thisPlayer + ".play-area";
		if ($(area).children().length>1)
		$(area).find(".top-left:contains('" + cardName + "')").closest(".card").remove();
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