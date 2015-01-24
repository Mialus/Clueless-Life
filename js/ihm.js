
/** Global variable representing the game itself */
var game = null;

/** Image of the POI (Point Of Interaction) */
var imgPOI = null; 

/** 
 * Set of loaded elements 
 *	  URL (String) --> boolean 
 */
var loaded = new Object();



/** 
 * Initialization function 
 * (loads the game data - especially the 
 */
init = function() {
	canvas = document.getElementById("cvs");
	canvas.addEventListener("click", cvsClick, false);
	canvas.addEventListener("mousemove", cvsMouseOver, false);
	context = canvas.getContext("2d");
	game = initGame(canvas);	
	document.getElementById("btnDemarrer").innerHTML = "Chargement...";
	game.preload(callbackWhenDataIsLoaded,whenLoadingIsFinished);
}


/**
 *	Function to be called each time an image is loaded.
 *	Updates the flags of loaded ressources and triggers the callback when ready. 
 *	@param 	d	String 		the image being loaded
 *	@param	c	function	the callback function to trigger when all ressources have been loaded.
 */
callbackWhenDataIsLoaded = function(d,c) {
	loaded[d] = true;	
	var nbOK = 0;
	var nbTotal = Object.keys(loaded).length;
	var fini = true;	
	for (var i in loaded) {
		if (! loaded[i]) {
			fini = false;
		}
		else {
			nbOK++;	
		}
	}
	if (fini) {
		c();	
	}
	else {
		document.getElementById("btnDemarrer").innerHTML = "Chargement (" + Math.floor(nbOK*100 / nbTotal) + "%)";
	}
}

/** 
 *	To be called when the loading of the ressources is done.
 */
whenLoadingIsFinished = function() {
	loading = false;			
	document.getElementById("btnDemarrer").innerHTML = "Démarrer";
} 


/** Indicates if the splash screen is on */
var splashScreenOn = true;

/** Indicates if the ressources are being loaded */
var loading = true;

/** 
 * Frames per seconds --> should not necessarily been used due to the requestAnimFrame function below.
 */
var fps = 60;

/**
 *	For compatibility issues, replacement of the requestAnimationFrame 
 * 	with a shim layer with setTimeout fallback.
 */
window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / fps);
          };
})();

// Main loop
mainloop = function() {
	
	// callback			
	if (! splashScreenOn) {
		//setTimeout("requestAnimationFrame(mainloop)", 1000/fps);
		setTimeout("requestAnimFrame(mainloop)", 1000/fps);
	}
	
	if (game.getCurrentScene().tick()) {
		// update display
		game.getCurrentScene().redraw();
	}

}


//---------------- USER INTERACTIONS -------------------//

/**
 *	Click inside the canvas.
 */
cvsClick = function(event) {
	
	// skip message if messages are being processed
	if (game.currentTimeout != null && (game.messagesToDisplay.length == 0 || 
										game.messagesToDisplay.length > 0 && game.messagesToDisplay[0] instanceof Message)) {
		game.displayMessages();
		return;	
	}
	
	var newPoint = getPosition(event, game.getCurrentScene().getOFFSET_X(), game.getCurrentScene().getOFFSET_Y());
	game.getCurrentScene().click(newPoint);
}


/**
 *	Mouseover the canvas
 */
cvsMouseOver = function(event) {
	var po = getPosition(event, game.getCurrentScene().getOFFSET_X(), game.getCurrentScene().getOFFSET_Y());
	game.getCurrentScene().mouseover(po);	
}


/**
 *	Click on the objects in the inventory.
 *	@param	i	int		index of the clicked item of the inventory
 */
clickInventory = function(i) {
	var obj = game.getInventory().getItem(i);
	if (obj == null) {
		return;
	}
	if (game.currentAction == game.NO_ACTION) {
		if (game.getSelectedObject() != obj) {
			game.setSelectedObject(obj);
		}
		else {
			game.setSelectedObject(null);	
		}
		game.updateInventoryDisplay();
		return;
	}
	if (game.currentAction == game.LOOK_AT) {
		if (obj.onLookAtInInventory != null) {
			obj.onLookAtInInventory();
		}	
	}
	if (game.currentAction == game.USE) {
		if (obj.onUseInInventory != null) {
			obj.onUseInInventory();
		}	
	}
}


/**
 *	Mouse is over the inventory.
 *	@param 	i	int 	number of inventory object on which the mouse is.
 */
mouseOverInventory = function(i) {
	var obj = game.getInventory().getItem(i);
	if (obj == null) {
		return;
	}
	game.onSomething = obj;
	game.onInventory = 1;
	game.updateActionLine();
}

/**
 *	Mouse is out the inventory.
 */
mouseOutInventory = function() {
	game.onSomething = null;
	game.onInventory = 0;
	game.updateActionLine();
}


/**
 *	Retrieves the clicked point from the mouse event
 *	@param	Event	event		The clicked event
 *	@param	int		OFFSET_X	X offset 
 *	@param	int		OFFSET_Y	Y offset
 *	@return	Point				The clicked point	
 */
getPosition = function(event, OFFSET_X, OFFSET_Y) {
	
	// gets the click coordinates
	if (event.x != undefined && event.y != undefined) {
		x = event.x;
		y = event.y;
	}	
	else { // Firefox method to get the position
		x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	x -= canvas.offsetLeft + OFFSET_X; 
	y -= canvas.offsetTop + OFFSET_Y;
	 
	return new Point(x,y);
}


/**
 *	Click on the start button
 */
function clickDemarrer() {
	if (loading) {
		return;
	}
	document.getElementById("btnDemarrer").display = "none"; 
	lancerChapitre(1);
}


/**
 *	Launches the splash screen of the chapter.
 *	@param 	i 	int 	the # chapter to launch.
 */
function lancerChapitre(i) {
	splashScreenOn = true;
	var chap = getChapter(i);

	document.getElementById("bcSplashScreen").style.display = "block";
	document.getElementById("bcSplashScreen").style.background = "#FFF url(" + chap.splashScreen + ") no-repeat center top";
	document.getElementById("gamearea").style.display = "none";	
	
	document.getElementById("bcSplashScreen").innerHTML = "<p class='chapterTitle'>Chapitre " + i + " - " + chap.title + "</p>";
	if (chap.after != null) {
		setTimeout("demarrerChapitre(" + i + ")", 5000);	
	}
}


/**
 *	Retrieves chapter i 
 *	@param	i	int		1..#chapter
 */
getChapter = function(i) {
	return chapters[i-1];
}


/**
 *	Starts chapter i - shows gamearea and hides splash screen 
 *	@param	i	int		1..#chapter
 */
function demarrerChapitre(i) {	
	var chap = getChapter(i);

	document.getElementById("bcSplashScreen").style.display = "none";
	document.getElementById("gamearea").style.display = "block";	

	chap.after();
	splashScreenOn = false;
		
	mainloop();
}



//------------------- FONCTION ------------------/ 

/**
 *	How to play? Short cinematic. 
 */

function commentJouer() {
	if (splashScreenOn || game.messagesToDisplay.length > 0) {
		alert("Please wait to be in the game before launching this action.");
		return;
	}
	game.removeAllMessages();
	game.setCharacterOrientation("S");
	game.getCurrentScene().redraw();
	game.messagesToDisplay.push(new Message("This game is very simple to play.", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("Left-click to unroll all the possible actions:", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("1. \"Walk to\", represented by <img src='./images/cursor.png'>", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("2. \"Look at\", represented by <img src='./images/yeux.png'>", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("3. \"Use/Pick/Talk to\", symbolisés par <img src='./images/main.png'>", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("4. \"Use (the selected object) with\", represented by an icon of the selected object.", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("Notice that this latter is only available if an object is selected in the inventory.", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("Once the action is chosen, left-click on the area on which the action should be executed.", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("And, I'll do that.", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("These actions can also apply to the objects in the inventory. ", COLOR_JORIS, -1, -1, -1));
	game.messagesToDisplay.push(new Message("The text line (below the scene) will help you to visualize the current action and the object on which it applies.", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("When I'm talking, like now,", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("you can move on to the next sentence, by a left-click,", COLOR_JORIS, -1, -1, -1));	
	game.messagesToDisplay.push(new Message("without having to wait the end of the sentence.", COLOR_JORIS, -1, -1, -1));	
	game.messagesToDisplay.push(new Message("Give it a try.", COLOR_JORIS, -1, -1, 5000));	
	game.messagesToDisplay.push(new Message("Useful, isn't it?", COLOR_JORIS, -1, -1, -1));	
	game.messagesToDisplay.push(new Message("Let me give you a last piece of advice :", COLOR_JORIS, -1, -1, -1));
	game.messagesToDisplay.push(new Message("If you are stuck, don't hesistate to wipe the game area with your mouse.", COLOR_JORIS, -1, -1, -1));
	game.messagesToDisplay.push(new Message("If there is an object you can interact with, it will be marked in the text line. ", COLOR_JORIS, -1, -1, -1));
	game.messagesToDisplay.push(new Message("Don't worry, this game conforms the Lucas Arts&reg; philosophy on adventure games:", COLOR_JORIS, -1, -1, -1));
	game.messagesToDisplay.push(new Message("it is not possible to be stuck, or to die, and all the possible actions that you can do have been planned by the game developers.", COLOR_JORIS, -1, -1, -1));
	game.messagesToDisplay.push(new Message("Have fun :-)", COLOR_JORIS, -1, -1, -1));
	game.displayMessages();
}




