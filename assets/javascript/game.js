// Make sure the DOM has been loaded before we start Javascript
$("document").ready(function(){

	// ====== Star Wars Force Heros ======
	/*
	Version: 1.0
	Description:
		This is a Star Wars Role Playing Game
		The Player will get to pick their favorite hero and battle against
		the remaining heros to see who is truly the best in the Star Wars
		Universe!
		*/

	// ====== Game Variables ======
	var	characters =[
		{	
			name: "Obi Wan Kenobi",
			attackPower: 6,
			counterAttackPower: 10,
			hitPoints: 120,
			img: "assets/images/obi_wan.jpg"
		},
		{	
			name: "Darth Maul",
			attackPower: 7,
			counterAttackPower: 20,
			hitPoints: 180,
			img: "assets/images/darth_maul.jpg"
		},
		{	
			name: "Luke Skywalker",
			attackPower: 8,
			counterAttackPower: 5,
			hitPoints: 100,
			img: "assets/images/luke_skywalker.jpg"
		},
		{	
			name: "Darth Sidious",
			attackPower: 6,
			counterAttackPower: 10,
			hitPoints: 150,
			img: "assets/images/darth_sidious.jpg"
		},
	];
	var isGameOver = false;
	var currentAttackPower = 0;
	var currentAttackGrowth = 0;
	var defenderCounterAttack = 0; 
	var chooseHero = true;
	var chooseEnemy = false;
	var hero = {};
	var defender = {};
	var lightsaberOn = new Howl({ src:['assets/sounds/lightsaber_on.wav']});
	var lightsaberOff = new Howl({ src:['assets/sounds/lightsaber_off.wav']});
	var clash = [new Howl({ src:['assets/sounds/clash1.wav']}), new Howl({ src:['assets/sounds/clash2.wav']}), new Howl({ src:['assets/sounds/clash3.wav']}), new Howl({ src:['assets/sounds/clash4.wav']})];
	var vader = new Howl({ src:['assets/sounds/darthvader_failedme.wav']});
	var yoda = new Howl({ src:['assets/sounds/yoda_doordonot.wav']});
	$("#attack").hide();
	$("#reset").hide();



	// ====== Game Functions ======

	function initGame(){
		
		isGameOver = false;
		currentAttackPower = 0;
		currentAttackGrowth = 0;
		heroHP = 0;
		defenderHP = 0;
		defenderCounterAttack = 0; 
		chooseHero = true;
		chooseEnemy = false;
		hero = {};
		defender = {};
		$("#attack").hide();
		$("#characters").show();
		$("#status-window").text("Select Your Hero!");
		$("#hero").html("");
		$("#defender").html("");
		$("#enemies").html("");
		$("#reset").hide();
		$("#game-window").hide();
		runGame();
		
	}

	// function runGame
	function runGame(){
		if(chooseHero === true){
			// loop through characters array and display avaiable characters
			for(var i = 0; i < characters.length; i++){
				//store each new character object in a variable
				var character = $("<div>");
				//update with object info
				character.addClass("character characterInfo");
				character.html( "<p>" + characters[i].name + "</p>" +
					"<img src='" + characters[i].img + "' >" +
					"<p>" + characters[i].hitPoints + "</p>"
				);
				character.attr({
					"data-name": characters[i].name,
					"data-img": characters[i].img,
					"data-hp": characters[i].hitPoints,
					"data-attack": characters[i].attackPower,
					"data-counter": characters[i].counterAttackPower,
				});
				//display to the .characters class div

				$("#characters").append(character);

				updateHero();
				
			}
				
		} else if(chooseHero === false && chooseEnemy === true) {
			
			updateDefender();

			$("#characters").html("");


		} else if(chooseHero === false && chooseEnemy === false){
			$(".character").each(function(index, value){
				$(value).off();
			});
		}
	}

	// Moves Player Hero into Hero section.
	// Updates the display
	// Stores Hero Data into the Hero Object
	function updateHero(){
		$(".character").on("click", function(){
				// Load Hero Data into Hero object for use in the game
				hero = { 
					name:$(this).attr("data-name"),
					img:$(this).attr("data-img"),
					attackPower:parseInt($(this).attr("data-attack")),
					counterAttackPower:parseInt($(this).attr("data-counter")),
					hitPoints:parseInt($(this).attr("data-hp")) 
				};
				currentAttackGrowth = hero.attackPower;
				// Turn off the ability to click another hero
				chooseHero = false;
				// Turn on the ability to click another hero
				chooseEnemy = true;
				$(this).removeClass("character");
				$(this).addClass("hero");
				$(this).off();
				$(this).html(
					"<p>" + hero.name + "</p>" +
					"<img src='" + hero.img + "' >" +
					"<p>" + hero.hitPoints + "</p>"
					);
				$("#hero").append($(this));
				lightsaberOn.play();
				runGame();
				$("#characters").hide();
				$("#game-window").show();
				$("#status-window").text("Select An Enemy!");
			});
	}

	// Moves Player Defender into Hero section.
	// Updates the display
	// Stores Defender Data into the Hero Object

	function updateDefender(){
		$(".character").each(function(index, value){
			$(value).off();
			$(value).addClass("enemies");
			$("#enemies").append($(".enemies"));
		});

		$(".enemies").on("click", function(){
			defender = { 
				name:$(this).attr("data-name"),
				img:$(this).attr("data-img"),
				attackPower:parseInt($(this).attr("data-attack")),
				counterAttackPower:parseInt($(this).attr("data-counter")),
				hitPoints:parseInt($(this).attr("data-hp")) 
			};
			// Turn on the ability to click another hero
			chooseEnemy = false;
			$(this).removeClass("character enemies");
			$(this).addClass("defender");
			$(this).off();
			$(this).html(
				"<p>" + defender.name + "</p>" +
				"<img src='" + defender.img + "' >" +
				"<p>" + defender.hitPoints + "</p>"
				);
			$("#defender").append($(this));
			$("#attack").show();
			$("#status-window").text("Let The Battle Begin!");
			runGame();
		});
	}

	// Attack
	// Main game Logic
	$("#attack").off().on("click", function(){
		if(chooseEnemy === false){
			for(var i = 0; i < clash.length; i++){
				clash[i].stop();
			}
			clash[Math.floor(Math.random() * clash.length)].play();
			defender.hitPoints -= hero.attackPower;
			$("#status-window").text( hero.name +" attacked " + defender.name +" for " + hero.attackPower);
			hero.attackPower += currentAttackGrowth;
			if(defender.hitPoints <= 0 && hero.hitPoints > 0){
				$("#defender").html("");
				$("#status-window").text("You defeated " + defender.name + "! Pick Another Enemy!");
				chooseEnemy = true;
				if($(".enemies").length === 0){
					$("#status-window").text( "You won!");
					yoda.play();
					resetGame();

				}
			} else {
				console.log("Enemy Counter Attack");
				hero.hitPoints -= defender.counterAttackPower;
				$("#status-window").html( $("#status-window").text() + "<br>" +defender.name +" attacked " + hero.name +" for " + defender.counterAttackPower);
				if(hero.hitPoints <= 0){
					console.log("You lost");
					$("#status-window").text( "You Lose!");
					vader.play();
					resetGame();
				}
			}
			runGame();
			updateDisplay();
		}
	});

	function updateDisplay(){
		$(".hero").html(
				"<p>" + hero.name + "</p>" +
				"<img src='" + hero.img + "' >" +
				"<p>" + hero.hitPoints + "</p>"
				);
		$(".defender").html(
				"<p>" + defender.name + "</p>" +
				"<img src='" + defender.img + "' >" +
				"<p>" + defender.hitPoints + "</p>"
				);
	}

	function resetGame(){
		$("#attack").hide();
		$("#reset").show();
		$("#reset").off().on("click", function(){
			lightsaberOff.play();
			initGame();
		});

	}
	// Initialize Game
	initGame();
});