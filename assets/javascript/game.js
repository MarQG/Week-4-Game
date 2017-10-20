// Make sure the DOM has been loaded before we start Javascript
$("document").ready(function(){

	// ====== Star Wars Force Heros ======
	/*
	Version: 3.0
	Description:
		This is a Star Wars Role Playing Game
		The Player will get to pick their favorite hero and battle against
		the remaining heros to see who is truly the best in the Star Wars
		Universe!

	Updates: Added feature for player to change enemy if they are losing.
	*/

	// ====== Game Variables ======
	var	characters =[
		{	
			name: "Obi Wan Kenobi",
			attackPower: 6,
			counterAttackPower: 15,
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
			attackPower: 10,
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

	// ====== initGame() ======
	/* 
		Description: This Initializes All Game Variables back to defaults
	*/
	function initGame(){
		// Tracks Hero Attack Growth
		currentAttackGrowth = 0;
		// Toggles if Player can choose a Hero
		chooseHero = true;
		// Toggles if Player can choose an Enemy as a Defender
		chooseEnemy = false;
		// Hero Object to process attacks
		hero = {};
		// Defender Object to process attacks
		defender = {};
		// Setup initial Game Display
		$("#attack").hide();
		$("#characters").show();
		$("#status-window").text("Select Your Hero!");
		$("#hero").html("");
		$("#defender").html("");
		$("#enemies").html("");
		$("#reset").hide();
		$("#game-window").hide();
		// Call runGame() to Run the Game
		runGame();
		
	}

	// ====== runGame() ======
	/* 
		Description: Setups the game elements and displays them for the
		user. Allows the user to select their hero and begin the game process.
		Handles all branching of game elements on the screen to ensure Player
		can follow the flow of the game and not circumvent or cheat the game.
	*/
	function runGame(){
	// Checks if the player has selected a hero already.
		// if they havent (chooseHero === true)
			// Then load the characters into the character display 
		if(chooseHero === true){
			// loop through characters array and display avaiable characters
			for(var i = 0; i < characters.length; i++){
				// Store each new character object in a variable
				var character = $("<div>");
				// Update with object info
				character.addClass("character characterInfo");
				character.html( "<p>" + characters[i].name + "</p>" +
					"<img src='" + characters[i].img + "' >" +
					'<p>HP: ' + characters[i].hitPoints + '</p>'
				);
				// Load character info into the element to be extracted later.
				character.attr({
					"data-name": characters[i].name,
					"data-img": characters[i].img,
					"data-hp": characters[i].hitPoints,
					"data-attack": characters[i].attackPower,
					"data-counter": characters[i].counterAttackPower,
				});

				// Display to the characters  div
				$("#characters").append(character);

				// Call updateHero() to setup the ability for the player to select a hero.
				updateHero();
				
			}
		// If they have already picked a hero but haven't picked an enemy as a defender
		// (chooseHero === false && chooseEnemy === true)		
		} else if(chooseHero === false && chooseEnemy === true) {
			// Call updateDefender() to setup the ability for the player to select a defender.
			updateDefender();
			// Clear the characters div so the player can't pick another hero and to clean up room on the display
			$("#characters").html("");
		// If they have already picked a hero and a defender then we need to turn off the ability
		// them to click any other enemies.
		// (chooseHero === false && chooseEnemy === false)
		} else if(chooseHero === false && chooseEnemy === false){
			// Loop through each character element and turn off their current click functions
			// $(".character").each(function(index, value){
			// 	$(value).off();
			// });
		}
	}

	// ====== updateHero() ======
	/* 
		Description: This updates the hero object and element based on 
		the users selection. It also tuns off the ability for the Player
		to pick more that one hero.
	*/
	function updateHero(){
		// Attach a click event onto each character element to allow the player to pick one as
		// a hero.
		$(".character").on("click", function(){
				// Load Hero Data into Hero object for use in the game
				hero = { 
					name:$(this).attr("data-name"),
					img:$(this).attr("data-img"),
					attackPower:parseInt($(this).attr("data-attack")),
					counterAttackPower:parseInt($(this).attr("data-counter")),
					hitPoints:parseInt($(this).attr("data-hp")) 
				};
				// Load the hero's attack into currentAttackGrowth so we can use it later to increment our hero's power.
				currentAttackGrowth = hero.attackPower;
				// Turn off the ability to click another hero
				chooseHero = false;
				// Turn on the ability to click an enemy
				chooseEnemy = true;
				// Update the classes on the element
				$(this).removeClass("character");
				$(this).addClass("hero");
				// Remove the click event from this element.
				$(this).off();
				// Update this element with the Hero information.
				$(this).html(
					"<p>" + hero.name + "</p>" +
					"<img src='" + hero.img + "' >" +
					"<p> HP: " + hero.hitPoints + "</p>"
					);
				// Append it to the hero div
				$("#hero").append($(this));
				// Play sound effect
				lightsaberOn.play();
				// Update the Game Displays
				$("#characters").hide();
				$("#game-window").show();
				$("#status-window").text("Select An Enemy!");
				// Return to runGame() to finish game setup.
				runGame();

			});
	}

	// ====== updateDefender() ======
	/* 
		Description: This updates the defebder object and element based on 
		the users selection. It also tuns off the ability for the Player
		to pick more that one defender.
	*/
	function updateDefender(){
		// Update the remaining characters to be enemies
		$(".character").each(function(index, value){
			// Clear their click events
			$(value).off();
			// Add the enemy class.
			$(value).addClass("enemies");
			// Append to the enemies div
			$("#enemies").append($(".enemies"));
		});

		// Attach an click event on each enemy to enable the Player to select one as a defeneder
		$(".enemies").on("click", function(){
			// Load the clecked element's data into the defender object
			defender = { 
				name:$(this).attr("data-name"),
				img:$(this).attr("data-img"),
				attackPower:parseInt($(this).attr("data-attack")),
				counterAttackPower:parseInt($(this).attr("data-counter")),
				hitPoints:parseInt($(this).attr("data-hp")) 
			};
			// Turn off the ability for the Player to select more that one defender
			if(chooseEnemy = true){
				chooseEnemy = false;
				// Update the defender classes
				$(this).removeClass("character enemies");
				$(this).addClass("defender");
				// Remove the click event from this element
				$(this).off();
				// Update this element with defender information
				$(this).html(
					"<p>" + defender.name + "</p>" +
					"<img src='" + defender.img + "' >" +
					"<p> HP: " + defender.hitPoints + "</p>"
					);
				// Append it to the defender div
				$("#defender").append($(this));
				// Update Game Display
				$("#attack").show();
				$("#status-window").text("Let The Battle Begin!");
				// Retunn to the runGame() to finish game setup.

				$(".defender").on("click", function(){
					$(this).removeClass("defender");
					$(this).addClass("character enemies");
					$(this).attr({
						"data-name": defender.name,
						"data-img": defender.img,
						"data-hp": defender.hitPoints,
						"data-attack": defender.attackPower,
						"data-counter": defender.counterAttackPower
					});
					$("#enemies").append($(this));
					chooseEnemy = true;

					$("#defender").empty();
					$("#attack").hide();
					$("#status-window").text("Select An Enemy!");
					runGame();
				});

			}
			
			runGame();
		});
	}

	// ====== Attack Button ======
	/* 
		Description: This button begins running the game logic. It will only be shown once 
		 the runGame() process has been completed enough times to setup the Player Hero 
		 and their defender has been selected. Afterward it will be show to the Player and 
		 they can click it to start the fight between Player Hero and Defender.
	*/
	// Attaches a click event to the attack button
	$("#attack").off().on("click", function(){
	// Check if they have completed selecting their Defender
		// If they have (chooseEnemy === false)
		if(chooseEnemy === false){
			// Then Run the game logic
			// Clear all clash sounds that are not finished playing so it doesnt overload the Player with sound effects
			for(var i = 0; i < clash.length; i++){
				clash[i].stop();
			}

			// Pick a random lightsaber clash sound effect to play each time the user clicks the attack button
			clash[Math.floor(Math.random() * clash.length)].play();
			// Hero Attacks first: Defender looses hit points - Hero's Attack Power
			defender.hitPoints -= hero.attackPower;
			// Update the Status Window of the Hero Attacking.
			$("#status-window").text( hero.name +" attacked " + defender.name +" for " + hero.attackPower );
			// Increase the Hero's Attack Power by the Current Attack Growth
			hero.attackPower += currentAttackGrowth;
			// Check if the Defender Hit Points have reached 0
			// If the Defenders Hit Points hit 0 and the Hero still has Hit Points
			if(defender.hitPoints <= 0 && hero.hitPoints > 0){
				//Then we clearn the Defender div
				$("#defender").html("");
				// Update the Status Window to show the defeat
				$("#status-window").text("You defeated " + defender.name + "! Pick Another Enemy!");
				// Turn on the player ability to select another Enemy
				chooseEnemy = true;
				// Check if their are any enemies left in the enemy div
				if($(".enemies").length === 0){
					// If there are no more enemies
					// Update the Status Window to show the win.
					$("#status-window").text( "You won!");
					// Play Win sound effect
					yoda.play();
					// Call resetGame() to reset the game.
					resetGame();

				}
			// Else If the Defender still has Hit Points then we need to run the Defender's Attack
			} else {
				// Defender Attacks Hero: Hero's Hit Points go down by the Defender's Counter Attack Power
				hero.hitPoints -= defender.counterAttackPower;
				// Update the Status Window with the counter attack.
				$("#status-window").html( $("#status-window").text() + "<br>" +defender.name +" attacked " + hero.name +" for " + defender.counterAttackPower + " damage.");
				// Check if the Hero's Hit Points have reached 0
				if(hero.hitPoints <= 0){
					// If they have
					// Update the Status Window with the loss.
					$("#status-window").text( "You Lose!");
					// Play loss sound effect
					vader.play();
					// Call resetGame() to reset the game.
					resetGame();
				}
			}

			// Call runGame() to make sure we setup another enemy if we need to.
			runGame();
			// Call updateDisplay() to reflect any changes to the Hero and Defender
			updateDisplay();
		}
	});

	// ====== updateDisplay() ======
	/* 
		Description: Updates the hero and defender element each
	*/
	function updateDisplay(){
		// Update any changes the Hero element
		$(".hero").html(
				"<p>" + hero.name + "</p>" +
				"<img src='" + hero.img + "' >" +
				"<p> HP: " + hero.hitPoints + "</p>"
		);
		// Update any changes the Defender element
		$(".defender").html(
				"<p>" + defender.name + "</p>" +
				"<img src='" + defender.img + "' >" +
				"<p> HP: " + defender.hitPoints + "</p>"
		);
	}

	// ====== resetGame() ======
	/* 
		 Description: Resets the game elements when the reset button is pressed so that the Player can play again.
	*/
	function resetGame(){
		// Hide the attack button
		$("#attack").hide();
		// Show the reset button
		$("#reset").show();
		// Attach a click event to the reset button
		$("#reset").off().on("click", function(){
			// Play reset sound effect
			lightsaberOff.play();
			// Reinitialize the game.
			initGame();
		});

	}
	// First Time Game Setup
	// Starts the entire game
	initGame();
});