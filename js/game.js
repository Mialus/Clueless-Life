/**
 *	Game.js
 *		
 *	Design of a game
 */

function Game() {

	/** Internal variables */
	var variables = new Object();

	/** Scenes of the game */
	var scenes =  new Object();
	
	/** Current scene of the game */
	var currentScene = null;
	
    /** sound engine */
    this.audio = new Audio();
    
	/** Inventory */
	var inventory = new Inventory();
	this.getInventory = function() { return inventory; }
	
	/** Current action */
	this.currentAction = 4;
	
	/** selected object */
	var selectedObject = null;
	
	// Disabling of right button
	document.getElementById("gamearea").oncontextmenu = function(event) {
		if (event.button == 2) {
			game.nextAction();	
		}
		return false;
	}
	
	// List of messages that have to be displayed  
	this.messagesToDisplay = [];
	this.currentTimeout = null;
	
	// set of all existing objects
	this.allObjects = new Object();
	
	
	//---- GAME VARIABLES ---- 
	
	/**
	 *	Retrieves a variable value.	
	 *	@param	n	String		name of the variable
	 *	@return		the variable value
	 */	
	this.getVariableValue = function(n) {
		return variables[n];
	}
	
	/**
	 *	Sets a variable value
	 *	@param 	n	String		name of the variable
	 *	@param	v	Object  	value of the variable
	 */
	this.setVariableValue = function(n, v) {
		variables[n] = v;	
	}
	
	/**
	 *	Returns the variable name values
	 */
	this.getVariableNames = function() {
		var ret = Array();
		for (var i in variables) {
			ret.push(i);	
		}
		return ret;	
	}
	
	
	//---- GAME SCENES ----//
	
	/**
	 *	Add a scene to the game
	 */
	this.addScene = function(sc) {
		scenes[sc.getName()] = sc;
	}
	
	/**
	 *	Retrieves an existing scene by its name
	 *	@param 	n	String		name of the scene 
	 *	@return		Scene		the scene, null is not existing
	 */
	this.getScene = function(n) {
		return (scenes[n]) ? scenes[n] : null;	
	}
	
	
	//----- current scene ----
	
	/**
	 *	retrieves the current scene
	 */
	this.getCurrentScene = function() {
		return currentScene;
	}
	
	/**
	 *	Sets the current scene
	 *	@param scName 	String 	Name of the scene
	 */
	this.setCurrentScene = function(scName) {
        if (currentScene) {
            currentScene.stop();
        }
		currentScene = (this.getScene(scName) != null) ? this.getScene(scName) : currentScene;
	} 
	
	
	/**
	 *	Returns the scenes names
	 */
	 this.getAllScenesNames = function() {
	 	var ret = Array();
	 	for (var i in scenes) {
	 		ret.push(i);
	 	}
	 	return ret;	 		 	
	 }
	
	
	/** 
	 *	Sets the main character orientation in the scene
	 */
	this.setCharacterOrientation = function(or) {
		if (currentScene != null) {
			currentScene.setCharacterOrientation(or);	
		}	
	}
	
	
	
		
	// ----------------------------------- //
	// ------ Management of actions ------ //
	// ----------------------------------- //
	
	/** Constants representing actions */
	this.NO_ACTION = 0;
	this.LOOK_AT = 1;
	this.USE = 2;
	this.USE_WITH = 3;
		
	/** is the cursor on an element (if yes, instantiated with this object) */	
	this.onSomething = null;	
	/** is the cursor on an item of the inventory (0 : false, 1 : true) */
	this.onInventory = 0;
		
	/**
	 *	Change the current action (moves to the next one). 
	 *	Invoked when the user right-clicks on the board.
	 */
	this.nextAction = function() {
		// update the action kind
		this.currentAction = (this.currentAction + 1) % 4;
		if (this.currentAction == this.USE_WITH && selectedObject == null) {
			this.currentAction = 0;	
		}
		this.updateCursorAndActionLine();
	}
	
	
	/**
	 *	Updates the cursor and the action line
	 */
	this.updateCursorAndActionLine = function() {
		this.updateCursor();
		this.updateActionLine();	
	}
	
	
	/**
	 *	Updates the cursor shape depending on the action
	 */
	this.updateCursor = function() {		
		var board = document.getElementById("gamearea");
		switch (this.currentAction) {
			case this.NO_ACTION:
				board.style.cursor = "url(./images/cursor.png) 0 0, auto";
				break;
			case this.LOOK_AT: 
				board.style.cursor = "url(./images/yeux.png) 25 16, auto";
				break;
			case this.USE:
				board.style.cursor = "url(./images/main.png) 3 5, auto";
				break; 	
			case this.USE_WITH:		
				board.style.cursor = selectedObject.getCodeToDisplayImageAsCursor();
				break;
		}
	}


	/**
 	 *	Updates the action line depending on the current action. 
 	 */
	this.updateActionLine = function() {
		var action = (this.onInventory == 0) ? "Aller vers" : "Sélectionner";
		switch (this.currentAction) {
			case this.LOOK_AT: 
				action = "Regarder";
				break;
			case this.USE:
				action = (this.onSomething == null) ? "Utiliser" : this.onSomething.getActionWord();
				break; 	
			case this.USE_WITH:			
				action = "Utiliser " + selectedObject.description + " avec"; 
				break;
		}
		var onWhat = (this.onSomething == null) ? "" : this.onSomething.getDescription();
		document.getElementById("bcActionLine").innerHTML = action + " " + onWhat;
	}


	//--------------- Inventory Management ---------------//

	/**
	 * 	Adds an item to the inventory
	 *	@param 	id	string 	identifier of the object to add to the inventory
	 */
	this.addItemToInventory = function(id) {
		if (this.allObjects[id] != null) {
			inventory.addItem(this.allObjects[id]);
			inventory.updateInDisplay();
			currentScene.redraw();
		}
		else {
			// should not happen if the game is well-coded
			alert("error : " + id + " not found");	
		}	
	}

	/**
	 * 	Removes an item from the inventory
	 *	@param 	id	string 	identifier of the object to remove from the inventory
	 */
	this.removeItemFromInventory = function(id) {
		inventory.removeItem(id);
	}


	/** 
	 *	Update the inventory display
	 */
	this.updateInventoryDisplay = function() {
		inventory.updateInDisplay();
	} 

	/**
	 *	Sets the selected object
	 *	@param 	o 	Item	the item to set as selected object
	 */
	this.setSelectedObject = function(o) {
		selectedObject = o;
	}	
	
	/**
	 *	Retrieves the currently selected object
	 *	@return 	Item	the currently selected object
	 */
	this.getSelectedObject = function() {
		return selectedObject;	
	}
	
	
	/** 
	 *	Display the current list of messages. 
	 */
	this.displayMessages = function() {

		document.getElementById("bcText").innerHTML = "";
		
		// removes the current time out
		if (this.currentTimeout != null) {
			clearTimeout(this.currentTimeout);	
		} 
		// if there are messages left to display
		if (this.messagesToDisplay.length > 0) {
			// removes the first element
			var msg = this.messagesToDisplay.shift(); 
			var duration = (msg.duration) ? msg.duration : 0;
			if (msg instanceof Message) {
				var bcTxt = document.getElementById("bcText");
				var pos = (msg.x == -1 && msg.y == -1) ? 
								getPositionForText() :
								msg;						
				bcTxt.style.color = msg.color;
				bcTxt.style.marginTop = pos.y + "px";
				bcTxt.style.marginLeft = pos.x + "px";
				bcTxt.innerHTML = msg.text;
			}
			else if (msg instanceof Passage) {
				game.setCurrentScene(msg.toScene.getName());
				game.getCurrentScene().loadWithLocation(msg.startingPoint);
				game.setCharacterOrientation(msg.orientation);						
			}
			else if (msg instanceof Point) {
				currentScene.addTargetPoint(msg);		
			}
			else if (msg instanceof Action) {
				msg.execute(game);	
			}
			// recursive call
			this.currentTimeout = setTimeout("game.displayMessages()", msg.duration);  
		}
		// otherwise, clean display
		else {			
			this.currentTimeout = null;
		}
	}
	
	
	/**
	 *	Computes the position for the text to be displayed.
	 */
	getPositionForText = function() {
		var bcTxtWidth = 600;
		var infos = game.getCurrentScene().getCharacterInfos();
		
		infos.x = infos.x - bcTxtWidth / 2;
		if (infos.x < 0) {
			infos.x = 0;				
		}
		var CVS_WIDTH= document.getElementById("cvs").width;
		if (infos.x > CVS_WIDTH - bcTxtWidth) {
			infos.x = CVS_WIDTH - bcTxtWidth;	
		}		
		
		infos.y -= 30;
		if (infos.y < 0) {
			infos.y = 0;	
		}
		
		return infos;
	}
	
	/**
	 *	Suppresses all the messages to be displayed	
	 */
	this.removeAllMessages = function() {
		this.messagesToDisplay = [];	
		this.displayMessages();
	}
	
	
	
	//--------------- Ressource loading management --------------//	
				
	/**
	 *	Preloading of data (references the "loaded" global variable. 
	 */	
	this.preload = function(callbackWhenDataIsLoaded, callbackWhenLoaded) {
		for (var i in scenes) {
			scenes[i].preload();
		}		
		for (var i in chapters) {
			var imgSrc = chapters[i].splashScreen;
			loaded[imgSrc] = false;
		}
		
		loaded['./images/poi.png'] = false;
		loaded['./images/main.png'] = false;
		loaded['./images/cursor.png'] = false;
		loaded['./images/yeux.png'] = false;
		
		for (var imgSrc in loaded) {
			var myImg = new Image();
			myImg.onload = callbackWhenDataIsLoaded(imgSrc, callbackWhenLoaded);
			myImg.src = imgSrc;
			if (imgSrc=='./images/poi.png') {
				imgPOI = myImg;	
			}
		}
	}	
    
}


