
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
			console.log("Displaying:", player.hand[i].name);
            $(div).find(".bottom-right").text(player.hand[i].name).show();
			var img = '<img src = "images/' + player.hand[i].name + '.png" width = "130" />';
			$(div).find(".center").empty().append(img);
        }
        var currentChild;


        //deal out cards one at a time
     
       
        var index = 0;
        var o = setInterval(function () {
                var currentChild = $(".opponent").children(".card").eq(index);
				dealOpponentCard(currentChild,index);
            }, 500);
        var p = setInterval(function () {
				var currentChild = $(".player").children(".card").eq(index);
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
                currentChild = $(".player").find(".card").eq(i);
                displayCard(currentChild, i);
				currentChild.css({"box-shadow" : 
				"3px 3px 10px black", "border-radius" : "10px",
				"-moz-border-radius":"10px", "-webkit-border-radius":"10px"});
			}
			$(".play-area").css({"display":"flex"});
			$("button").show();
			$(".scores").show();
			 runGame(drawCard);
        }, 4000);
		
    });
	window.announce = function(text){
		
		$(".notify").text(text).show().delay(2000).fadeOut();
		
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
		console.log("Clicked is", clicked);
		spliceIndex = $(this).closest(".card").index();
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
		console.log("Playarea function");
		if (activePlayer == opponent){
			var findWhat = ".card:hidden";
		}
		else{
			findWhat = ".card";
		}
		var fromPlayArea = "div." + activePlayer.name + ".hand";
		var toPlayArea = "div." + thisPlayer.name + ".play-area";
		console.log("Card going to: ", toPlayArea);
		$this = $(fromPlayArea).find(findWhat).eq(spliceIndex);
		if (activePlayer == opponent){
			$this.find(".top-left").text(activePlayer.hand[spliceIndex].name);
			$this.find(".bottom-right").text(activePlayer.hand[spliceIndex].name);
			var img = '<img src = "images/' + opponent.hand[spliceIndex].name + '.png" width = "130" />';
			$this.find(".center").empty().append(img);
			var a = $this.find("top-left").text()
			console.log(a);
		}
		$this.clone()
			.appendTo(toPlayArea).removeClass("animated flip flipInY disabled").show()
			.children(".back").hide().children(".front").show();
		
		$(fromPlayArea).find(".card").eq(spliceIndex).detach().appendTo(fromPlayArea).hide();
		setTimeout(function(){
		switchp(drawCard);
		},0);
	}
	
	window.cleanUp = function(){
		$(".player.hand").children(".card:hidden").eq(1).remove();
		$(".opponent.hand").children(".card:hidden").eq(7).remove();
	}
		
	window.updateScore = function(switchp){
		$(".scores").children("#opp").text(opponent.score);
		$(".scores").children("#pl").text(player.score);
		switchp(drawCard);
	}
	
	
	window.toggleCards = function(choose){
		console.log("toggle card function");
		$(".player.hand").find(".front").removeClass("disabled");
		for (var i = 0; i<player.hand.length; i++){
			if (player.hand[i].disabled)
				$(".player.hand").find(".front").eq(i).addClass("disabled");
		}
		if (choose !== undefined)
			choose(updateCards,discardACard);
	}
	window.removeCard = function(scores){
		console.log("remove card function");
		var hand = "." + activePlayer.name + ".hand";
		$(hand).children(".card").eq(spliceIndex).appendTo(".player.hand").hide();
		scores(switchPlayers);
	}
	window.removeFromActiveArea = function(name, thisPlayer){
		var area = "." + thisPlayer + ".play-area";
		$(area).find(".top-left:contains(name)").closest(".card").remove();
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