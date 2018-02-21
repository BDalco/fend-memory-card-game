
// Create a list that holds all of your cards
let cardLists = ["fa-paper-plane-o", "fa-diamond", "fa-bicycle", "fa-anchor", "fa-leaf", "fa-bolt", "fa-bomb", "fa-cube"];

/*
 * Game global variable declarations
 */

let moveCounter = 0;
let matches = 0;
let flippedCards = [];
let gameStart = false;
let seconds = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 // Create the cards for the board
function createCard(card) {
    $('#deck').append(`<li class="card"><i class="fa ${card}"></i></li>`);
}

// Timer object via jQuery from https://albert-gonzalez.github.io/easytimer.js/
var timer = new Timer();
timer.addEventListener('secondsUpdated', function (e) {
    $('#timer').html(timer.getTimeValues().toString());
});

// Randomize the cards for the game
function randomizeCards() {
    for (let i = 0; i < 2; i++) {
        cardLists = shuffle(cardLists);
        cardLists.forEach(createCard);
    }
}

// Disable click of the open Cards
function disableClick() {
    flippedCards.forEach(function (card) {
        card.off('click');
    });
}
// enable click on the open card
function enableClick() {
    flippedCards[0].click(flipCard);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Animation CSS from - https://github.com/daneden/animate.css/
$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  },
});

// Flip cards over and add them to array to compare
function flipCard() {

	if (gameStart === false) {
		gameStart = true;
		timer.start();
	}

	if (flippedCards.length === 0) {
		$(this).toggleClass("show open").animateCss('flipInY');
		flippedCards.push($(this));
		disableClick();
	}
	else if (flippedCards.length === 1) {
		movesCounter();
		starCounter();
		$(this).toggleClass("show open").animateCss('flipInY');
		flippedCards.push($(this));
		setTimeout(cardMatch, 1500);
	}
}

// Checks to see if the cards match
function cardMatch() {
	if (flippedCards[0][0].firstChild.className === flippedCards[1][0].firstChild.className) {
		console.log("Cards Match, Hooray!");
		flippedCards[0].addClass("match").animateCss('pulse');
		flippedCards[1].addClass("match").animateCss('pulse');
		disableClick();
		clearCards();
		setTimeout(checkWin, 1000);
	}
	else {
		flippedCards[0].toggleClass("show open").animateCss('shake');
		flippedCards[1].toggleClass("show open").animateCss('shake');
		enableClick();
		clearCards();
	}
}

// Count the number of moves
function movesCounter() {
	moveCounter += 1;
	if (moveCounter === 1) {
		$('#moves').html(`${moveCounter} Move`);
	}
	else {
		$('#moves').html(`${moveCounter} Moves`);
	}
}

// Checks number of moves to determine how many stars the user should have
function starCounter() {
	if (moveCounter === 20) {
		removeStar();
	}
	else if (moveCounter === 30) {
		removeStar();
	}
}

// Create the Stars for the game
function createStars() {
	for (let i = 0; i < 3; i++) {
		$('#stars').append('<li><i class="fa fa-star"></i></li>');
	}
}

// Removes star for too many moves
function removeStar() {
	$('#stars').children()[0].remove();
	$('#stars').append('<li><i class="fa fa-star-o"></i></li>');
}

// Clears the flipped cards array
function clearCards() {
	flippedCards = [];
}

// Check to see if the player won
function checkWin() {
	matches += 1;
	if (matches === 8) {
		showFinalScore();
	}
}

// Shows the winning score from https://www.w3schools.com/howto/howto_css_modals.asp
function showFinalScore() {
	// Pause the timer
	timer.pause();

	// Get the modal
	const modal = document.getElementById('myModal');

	let scoreBoard = `
		<div class="scoreboard-content">
			<span class="close" id="closeGame">&times;</span>
			<h2> Congratulations, you have won the game! </h2>
		<div class="scoreboard-row">
			<span class="scoreboard-results"><strong>Moves:</strong> ${moveCounter}</span>
			<span class="scoreboard-results"><strong>Time:</strong> ${timer.getTimeValues().toString()}</span>
		</div>
			<div class="scoreboard-row">
				<div class="star"><i class="fa fa-star fa-3x"></i></div>
				<div class="star"><i class="fa ${ (moveCounter > 30) ? "fa-star-o" : "fa-star"}  fa-3x"></i></div>
				<div class="star"><i class="fa ${ (moveCounter > 20) ? "fa-star-o" : "fa-star"} fa-3x"></i></div>
			</div>
			<div class="scoreboard-row">
				<h3>Would you like to play again?</h3>
				<i class="fa fa-repeat fa-2x restart" id="restartScoreboard"></i>
			</div>
		</div>
	`

	// display the results
	modal.style.display = "block";

	$('#scoreBoard').append($(scoreBoard));


	// When the user clicks on (x), close the modal and restarts the game
	$("#closeGame").click(function(){
		modal.style.display = "none";
	    resetGame();
	})

	// Resets the game by clicking the reset button
	$("#restartScoreboard").click(function(){
		modal.style.display = "none";
    	resetGame();
	});

	// When the user clicks anywhere outside of the modal, close it and restarts the game
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	        resetGame();
	    }
	}
}

// Resets the game by clicking the reset button
$("#restart").click(function(){
    resetGame();
});

// Initialize function / Starts the game
function startGame() {
    randomizeCards();
    createStars();
    $('.card').click(flipCard);
}

// Resets Game
function resetGame() {
	moveCounter = 0;
	matchFound = 0;
	gameStart = false;
	seconds = 0;
	timer.stop();
	$('#deck').empty();
	$('#stars').empty();
	$('#moves').html("0 Moves");
	$('#timer').html("00:00:00");
	startGame();
}

// Starts the Game
startGame()
