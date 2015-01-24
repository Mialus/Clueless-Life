
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
		alert("Attendez d'être dans le jeu pour lancer cette action.");
		return;
	}
	game.removeAllMessages();
	game.setCharacterOrientation("S");
	game.getCurrentScene().redraw();
	game.messagesToDisplay.push(new Message("Pour jouer, c'est simple.", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("Cliquer sur le bouton gauche fait défiler les actions possibles :", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("1. \"Aller vers\", symbolisée par <img src='./images/cursor.png'>", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("2. \"Regarder/Examiner\", symbolisés par <img src='./images/yeux.png'>", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("3. \"Utiliser/Prendre/Parler à\", symbolisés par <img src='./images/main.png'>", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("4. \"Utiliser (l'objet de l'inventaire sélectionné) avec\", symbolisé par une icône de l'objet sélectionné.", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("Notez que cette dernière action n'est disponible que si un objet de l'inventaire est sélectionné.", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("Une fois l'action choisie, on cliquera du bouton gauche sur la zone de jeu où on souhaite effectuer l'action.", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("Et moi, j'effectuerai cette action choisie.", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("Ces actions peuvent également s'appliquer aux objets de l'inventaire. ", COLOR_JORIS, -1, -1, -1));
	game.messagesToDisplay.push(new Message("En cas de doute, la ligne de texte en bas de la scène de jeu vous permettra de visualiser l'action en cours et l'objet sur laquelle on l'applique.", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("Quand je suis en train de parler, comme là maintenant,", COLOR_JORIS, -1, -1, -1));		
	game.messagesToDisplay.push(new Message("vous pouvez passer au dialogue suivant, en cliquant du bouton gauche,", COLOR_JORIS, -1, -1, -1));	
	game.messagesToDisplay.push(new Message("sans attendre que j'aie fini.", COLOR_JORIS, -1, -1, -1));	
	game.messagesToDisplay.push(new Message("Allez-y essayez.", COLOR_JORIS, -1, -1, 5000));	
	game.messagesToDisplay.push(new Message("Pratique hein ?", COLOR_JORIS, -1, -1, -1));	
	game.messagesToDisplay.push(new Message("Allez, je vous donne un dernier conseil :", COLOR_JORIS, -1, -1, -1));
	game.messagesToDisplay.push(new Message("Si vous êtes bloqué(e), n'hésitez pas à balayer la zone de jeu avec la souris.", COLOR_JORIS, -1, -1, -1));
	game.messagesToDisplay.push(new Message("Si vous rencontrez un objet avec lequel vous pouvez interagir, il sera signalé dans la ligne de texte. ", COLOR_JORIS, -1, -1, -1));
	game.messagesToDisplay.push(new Message("N'ayez crainte, ce jeu respecte la philosophie des jeux d'aventure proposée par LucasArts &reg;", COLOR_JORIS, -1, -1, -1));
	game.messagesToDisplay.push(new Message("il est impossible d'être bloqué, ou de mourir, et toutes les actions que vous pourrez effecter sont prévues.", COLOR_JORIS, -1, -1, -1));
	game.messagesToDisplay.push(new Message("Amusez-vous bien :-)", COLOR_JORIS, -1, -1, -1));
	game.displayMessages();
}




