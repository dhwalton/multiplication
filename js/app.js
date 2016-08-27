var tableMin = 1;
var tableMax = 15;
var answerMax = 5;
var fadeSpeed = 500;
var correctSounds = [];
var incorrectSounds = [];
var game = {
	answerMax: 5,
	currentTable: 4,
	currentMultiplier: 4,
	answers: [],
	
	shuffleArray:function(arr) {
		var i = 0, 
			j = 0, 
			temp = null;

		for (i = arr.length - 1; i > 0; i--) {
        	j = Math.floor(Math.random() * (i + 1));
        	temp = arr[i];
        	arr[i] = arr[j];
       	 	arr[j] = temp;
		}
	},

	// generate question string
	generateQuestion:function() {
		var newMultiplier = this.currentMultiplier;

		// make sure the problem is a new one
		while (newMultiplier == this.currentMultiplier) {
			newMultiplier = Math.floor((Math.random() * tableMax) + 1);
		}
		this.currentMultiplier = newMultiplier;

		// randomize the order in which the problem will display
		if (Math.floor((Math.random() * 2) + 1) == 1) {
			return (this.currentMultiplier + " x " + this.currentTable);
		} else {
			return (this.currentTable + " x " + this.currentMultiplier);
		}
	},

	// make answer array
	generateAnswers:function() {
		this.answers = [];

		// make incorrect answers
		this.answers.push(this.currentMultiplier * (this.currentTable + 1));
		this.answers.push(this.currentMultiplier * (this.currentTable + 2));
		this.answers.push(this.currentMultiplier * (this.currentTable + 3));
		this.answers.push(this.currentMultiplier * this.currentTable + Math.floor((Math.random() * 10)));
		this.answers.push(this.currentMultiplier + 1);

		if (this.currentMultiplier + this.currentTable != this.currentMultiplier * this.currentTable) this.answers.push(this.currentMultiplier + this.currentTable);
		if (this.currentMultiplier > 1) this.answers.push(this.currentTable * (this.currentMultiplier - 1));
		if (this.currentMultiplier > 2) this.answers.push(this.currentTable * (this.currentMultiplier - 2));
		if (this.currentMultiplier > 3) this.answers.push(this.currentTable * (this.currentMultiplier - 3));

		//randomize the answers
		this.shuffleArray(this.answers);

		// truncate the array to answerMax length
		for (var i = this.answers.length; i > this.answerMax; i--) {
			//console.log("array length: " + this.answers.length)
			this.answers.pop();
		}
		
		// replace first element with the correct answer
		this.answers[0] = this.currentMultiplier * this.currentTable;

		// randomize again
		this.shuffleArray(this.answers); 
	}

};

// initialize the board
function initializeGame() {
	// generate table selection buttons
	$('#numbers').html('');
	for (var i = tableMin; i <= tableMax; i++) {
		if (i == game.currentTable) {
			$('#numbers').append('<button id="active">' + i + '</button>');
		} else {
			$('#numbers').append('<button>' + i + '</button>');
		}
	}

	// generate answer buttons
	$('#answers').html('');
	for (var i=0; i<answerMax; i++) {
		$('#answers').append('<button>ANS</button>');
	}
}


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}


// show the current question
function showQuestion() {
	$('#question').html(game.generateQuestion());
}

function showAnswers() {
	game.generateAnswers();

	$('#answers > button').each(function(index){
		$(this).text(game.answers[index]);
	});
}

function newGame() {
	showQuestion();
	showAnswers();
}

function setAudio() {
	correctSounds.push(new sound("sounds/groovy.mp3"));
	correctSounds.push(new sound("sounds/correct.mp3"));
	correctSounds.push(new sound("sounds/tada.mp3"));

	incorrectSounds.push(new sound("sounds/ohno.mp3"));
	incorrectSounds.push(new sound("sounds/uhoh.mp3"));
	incorrectSounds.push(new sound("sounds/horns.mp3"));
}

$(document).ready(function(){
	// get audio files
	setAudio();

	// intialize game
	initializeGame();

	// start a new game on load
	newGame();

	// click the table buttons (switch to a different table)	
	$('#numbers button').click(function(){
		game.currentTable = parseInt(this.textContent);
		$('#active').removeAttr("id");
		$(this).attr("id","active");
		newGame();
	});

	// click the answer buttons
	$('#answers button').click(function(e){
		e.preventDefault();
		if (this.textContent == game.currentTable * game.currentMultiplier) {
			// right answer
			console.log("User clicked " + this.textContent + " - CORRECT");

			// inform the user they are right
			$('#right').fadeIn(fadeSpeed/2);

			// random correct sound
			correctSounds[Math.floor(Math.random() * incorrectSounds.length)].play();

			setTimeout(function(){
				$('#right').fadeOut(fadeSpeed);
				// move to the next question
				showQuestion();
				showAnswers();
			}, fadeSpeed);			

		} else {
			// wrong answer
			console.log("User clicked " + this.textContent + " - INCORRECT");

			// random incorrect sound
			incorrectSounds[Math.floor(Math.random() * incorrectSounds.length)].play();

			// inform the user to try again
			$('#wrong').fadeIn(fadeSpeed/2);
			setTimeout(function(){
				$('#wrong').fadeOut(fadeSpeed);
			}, fadeSpeed);
		}
	});
});