/**
 *	Scene.js
 *		
 *	Design of a scene of the game
 */


/**
 * Constructor, creates a scene, with a given mesh associated to the main character.
 * 	@param 	_mesh		The mesh to consider
 *	@param	_bg			The background image to use
 */
function Scene(_name, _desc, _cvs, _bg, _ambients) {
	
	// scene name
	var name = _name;
	this.getName = function() { return name; }
	
	// scene description
	var description = _desc;
	this.getDescription = function() { return description; }
	
	// canvas object
	var canvas = _cvs;
	var CVS_WIDTH = canvas.width;
	var CVS_HEIGHT = canvas.height;
		
	// background image properties
	var BG_WIDTH = 0;
	var BG_HEIGHT = 0; 	
		
	// offset used to manage scrolling
	var OFFSET_X = 0;
	this.getOFFSET_X = function() { return OFFSET_X; }
	var OFFSET_Y = 0;
	this.getOFFSET_Y = function() { return OFFSET_Y; }
	
	// context used for drawing.
	var context = canvas.getContext("2d");
	
	// set of passages
	var passages = [];

	// set of objects 
	var objects = [];
	
	// set of interactive areas
	var interactiveAreas = [];
	
	// set of scene elements
	var sceneElements = [];
	
	// stack of objects/scene elements to display
	var displayStack = [];
	
	// set of characters appearing in the scene
	var characters = new Object();
	
	// id of the character played by the player
	var playedCharacter = "";
	
    // ambient sounds
    if (_ambients) {
        var _this = this;
        for (var i = 0; i < _ambients.length; i++) {
            var ambient = _ambients[i];
            (function (ambient) {
                game.audio.load(ambient.uri, function (buffer) {
                    _this.addAmbient(ambient.uri, buffer, ambient.volume);
                });
            } (ambient));
        }
    }
	/**
	 * 	Adds a character to the scene
	 */
	this.addCharacter = function(id, charDisplay, isPlayed) { 
		characters[id] = charDisplay;
		if (isPlayed) {
			playedCharacter = id;	
		}
	}
	
	/** 
	 *	Retrieves the current character display object
	 */
	this.getPlayerDisplay = function() {
		return characters[playedCharacter];	
	}
	
	/**
	 *	Sets the character orientation
	 */
	this.setCharacterOrientation = function(no) {
		characters[playedCharacter].getCharacterObj().setDirection(no);
	}
	/** 
	 * 	Returns the placement of the character
	 */
	this.getCharacterInfos = function() {
		return characters[playedCharacter].getCharacterObj().getCharacterInfos();	
	}

	/** Action to do when we enter the scene */
	this.onEntry = null;

	var imgBG = null;
	this.getBackgroundImage = function() { return _bg; }  


    var darkness = 1;
    this.setDarkness = function(d) {
           darkness = d;
    }
    
	/**
	 *	@param startingPoint 
	 */
	this.loadWithLocation = function(startingPoint) {
		
        if (startingPoint == null) {
            startingPoint.getPlayerDisplay().getDefaultPosition();   
        }
        
		this.getPlayerDisplay().setCurrentPoint(new Point(startingPoint.x, startingPoint.y, startingPoint.zoom));
		
		imgBG = new Image();	
		imgBG.src = _bg;
		imgBG.onload = function() {
			// background image 
			canvas.style.backgroundImage = "url(" + _bg + ")";
			BG_WIDTH = imgBG.width;
			BG_HEIGHT = imgBG.height; 
			game.getCurrentScene().redraw();
			game.updateInventoryDisplay();
			game.currentAction = 0;
			game.updateCursorAndActionLine();
		};
		imgBG.onerror = function() { console.log("Error while loading background: " + imgBG.src); };

        //for (var p in ambientSounds) { if (ambientSounds.hasOwnProperty(p)) {
        if (ambientSounds && ambientSounds.length > 0) {
            game.audio.play(ambientSounds[0].buffer, ambientSounds[0].volume, ambientSounds);
        }
        //}}
        
		if (this.onEntry != null) {
			this.onEntry();	
		}	
	}
	
	
	
	/** 
	 *	Redraws the scene 
	 */
	this.redraw = function() {
		
		// clears context
		context.clearRect(0, 0, CVS_WIDTH, CVS_HEIGHT);
		
		var currentPoint = this.getPlayerDisplay().getCurrentPoint();
		
		// update offsets
		OFFSET_X = CVS_WIDTH / 2 - currentPoint.x;
		if (OFFSET_X > 0) {
			OFFSET_X = 0;	
		}	
		if (OFFSET_X < CVS_WIDTH - BG_WIDTH) {
			OFFSET_X = CVS_WIDTH - BG_WIDTH;	
		}
		
		OFFSET_Y = CVS_HEIGHT / 2 - currentPoint.y;
		if (OFFSET_Y > 0) {
			OFFSET_Y = 0;	
		}
		if (OFFSET_Y < CVS_HEIGHT - BG_HEIGHT) {
			OFFSET_Y = CVS_HEIGHT - BG_HEIGHT;	
		}
		
		context.fillStyle = "#FFFFFF";
		context.strokeStyle = "#FFFFFF";
		context.lineWidth = 2;
		
		// positionning of the background
		canvas.style.backgroundPosition = "" + OFFSET_X + "px " + OFFSET_Y + "px";
		
		var zPerso = this.getPlayerDisplay().getZIndex();
		
		// display the visible passages :
        /*
		for (var i in passages) {
			if (passages[i].isVisible()) {
				context.drawImage(imgPOI, passages[i].point.x + OFFSET_X - imgPOI.width/2, passages[i].point.y + OFFSET_Y - imgPOI.height/2);
			}
		}
        */

			
		// display the visible objects on the back of the character
		for (var i in displayStack) {
			if (displayStack[i].getZIndex() <= zPerso && displayStack[i].isVisible()) {
					context.drawImage(displayStack[i].spriteInScene, displayStack[i].x + OFFSET_X, displayStack[i].y + OFFSET_Y);						
			}
		}

		// display of the character 
		// TODO --> consider several characters
		this.getPlayerDisplay().drawCharacter(context, OFFSET_X, OFFSET_Y);

		// display the visible objects on top of the character
		for (var i in displayStack) {
			if (displayStack[i].getZIndex() > zPerso && displayStack[i].isVisible()) {
					context.drawImage(displayStack[i].spriteInScene, displayStack[i].x + OFFSET_X, displayStack[i].y + OFFSET_Y);						
			}
		}
        
        if (darkness < 1) {
            context.fillStyle = "rgba(0,0,32," + (1-darkness) +")";
            context.fillRect(0, 0, CVS_WIDTH, CVS_HEIGHT);
        }
	}
	

	
	/**
	 *	Called when the scene is clicked
	 *	@param 	clickedPoint	the point that has just been clicked
	 */
	this.click = function(clickedPoint) {

		// check what to do next, and where it has to be done		
		var actionAndDestination = this.getActionWhenPointIsReached(clickedPoint);
		
		// if nothing has to be done => return
		if (actionAndDestination == null) {
			return;
		}

		return this.getPlayerDisplay().click(clickedPoint, actionAndDestination);		
	}
		
	
	/**
	 *	Called when a mouseover event is triggered on the scene
	 *	@param	Point	clickedPoint	point on which the mouse is (incorectly named)
	 */
	this.mouseover = function(clickedPoint) {

		// look for passages (only if the current action is "go to" ie. NO_ACTION)
		if (game.currentAction == game.NO_ACTION) {
			for (var i in passages) {
				if (passages[i].isVisible() && clickedPoint.distanceTo(passages[i].point) < 18) {
					game.onSomething = passages[i];
					game.updateActionLine();
					return;
				}
			}
		}
		// look for an interactive area
		for (var i in interactiveAreas) {		
			if (interactiveAreas[i].isVisible() && 
				interactiveAreas[i].getPosition().distanceTo(clickedPoint) <= interactiveAreas[i].getRadius()) {
				game.onSomething = interactiveAreas[i];
				game.updateActionLine();
				return;
			}
		}	
		// look for a visible object
		for (var i=objects.length - 1; i >= 0; i--) {
			if (objects[i].isVisible() && 
				clickedPoint.x >= objects[i].x && clickedPoint.x <= objects[i].x + objects[i].spriteInScene.width &&
				clickedPoint.y >= objects[i].y && clickedPoint.y <= objects[i].y + objects[i].spriteInScene.height) {
				game.onSomething = objects[i];
				game.updateActionLine();
				return;
			}
		}	
		// by default: clears the action line		
		game.onSomething = null;
		game.updateActionLine();
	}
	
	
	
	/**	
	 *	Computes the action to perform when a given point is clicked. 
	 *	Also returns the point that has to be reached to perform the action (if any).
	 *	@param	clickedPoint	Point	the point that was clicked
	 *	@return		{ Action action : null if none, Point destination : closest point of the mesh by default }  
	 *				null if 
	 */
	this.getActionWhenPointIsReached = function(clickedPoint) {	
		
		// passages (only when NO_ACTION is set)
		if (game.currentAction == game.NO_ACTION) {
			// clicked on a POI --> change scene
			for (var i in passages) {
				if (passages[i].isVisible() && clickedPoint.distanceTo(passages[i].point) < 18) {
					var act = new Action("passage", new Passage(passages[i].point.x,passages[i].point.y, passages[i].toScene, passages[i].startingPoint));
					var dest = characters[playedCharacter].getCharacterMesh().getClosestPointAndSegment(clickedPoint);
					return { "action" : act, "destination" : dest, "orientation" : passages[i].orientation };
				}
			}
		}		
		
		// interactive area (same as for objects)
		for (var i in interactiveAreas) {
			// an interactive area has been clicked
			if (interactiveAreas[i].isVisible() && 
				interactiveAreas[i].getPosition().distanceTo(clickedPoint) <= interactiveAreas[i].getRadius()) {
				// --> which destination?
				var dest = characters[playedCharacter].getCharacterMesh().getClosestPointAndSegment((interactiveAreas[i].getClosestPoint() == null) ? clickedPoint : interactiveAreas[i].getClosestPoint()); 
				// --> which action?
				if (game.currentAction == game.NO_ACTION) {
					return { "action": null, "destination" : dest, "orientation" : interactiveAreas[i].getOrientation() };	
				}				
				if (game.currentAction == game.LOOK_AT) {
					var act = (interactiveAreas[i].onLookAt != null) ?
						new Action("lookat", interactiveAreas[i].onLookAt) :
						new Action("say", new Message("There is nothing to look at.", COLOR_JORIS, -1, -1, -1)); 					
					return { "action" : act, 
							 "destination" : dest,
							 "orientation" : interactiveAreas[i].getOrientation() };	
				}
				if (game.currentAction == game.USE) {
					var act = (interactiveAreas[i].onUse != null) ? 
						new Action("use", interactiveAreas[i].onUse) :
						new Action("say", new Message("I can not use that.", COLOR_JORIS, -1, -1, -1)); 						
					return { "action": act, 
							 "destination" : dest,
							 "orientation" : interactiveAreas[i].getOrientation() };					
				}	
				if (game.currentAction == game.USE_WITH) {
					var act = (interactiveAreas[i].onUseWith != null) ?
						new Action("use_with", interactiveAreas[i].onUseWith) :
						new Action("say", new Message("No, these two don't fit together.", COLOR_JORIS, -1, -1, -1)); 
					return { "action": act, 
							 "destination" : dest,
							 "orientation" : interactiveAreas[i].getOrientation() };					
				}	
			}		
		}	

		// objects 
		for (var i=objects.length - 1; i >= 0; i--) {
			// a visible object has been clicked
			if (objects[i].isVisible() && 
				clickedPoint.x >= objects[i].x && clickedPoint.x <= objects[i].x + objects[i].spriteInScene.width &&
				clickedPoint.y >= objects[i].y && clickedPoint.y <= objects[i].y + objects[i].spriteInScene.height) {
				// --> which destination?
				var dest = characters[playedCharacter].getCharacterMesh().getClosestPointAndSegment((objects[i].getClosestPoint() == null) ? clickedPoint : objects[i].getClosestPoint()); 
				// --> which action?
				if (game.currentAction == game.NO_ACTION) {
					return { "action": null, "destination" : dest, "orientation" : objects[i].getOrientation() };	
				}				
				if (game.currentAction == game.LOOK_AT) {
					var act = (objects[i].onLookAtInScene != null) ? 
								new Action("lookat", objects[i].onLookAtInScene) : 
								new Action("say", new Message("I can not see that.", COLOR_JORIS, -1, -1, -1)); 
					return { "action" : act, 
							 "destination" : dest, 
							 "orientation" : objects[i].getOrientation() };	
				}
				if (game.currentAction == game.USE) {
					var act = (objects[i].onUseInScene != null) ? 
						new Action("use", objects[i].onUseInScene) :  
						new Action("say", new Message("I can't use that.", COLOR_JORIS, -1, -1, -1)); 
					return { "action": act, 
							 "destination" : dest,
							 "orientation" : objects[i].getOrientation() };					
				}	
				if (game.currentAction == game.USE_WITH) {
					var act = (objects[i].onUseWithInScene != null) ? 
						new Action("use_with", objects[i].onUseWithInScene) : 
						new Action("say", new Message("No, these two don't fit together.", COLOR_JORIS, -1, -1, -1)); 
					return { "action": act, 
							 "destination" : dest, 
							 "orientation" : objects[i].getOrientation() };					
				}	
			}	
		}
		
		
		// by default: just go to the destination if no action is selected
		if (game.currentAction == game.NO_ACTION) {
			return { "action" : null, "destination" : this.getPlayerDisplay().getCharacterMesh().getClosestPointAndSegment(clickedPoint) } ;	
		}
		
		return null;
	}		
		

	/**
	 *	Computes the next point if the character is moving. 
	 */
	this.tick = function() {

		// return value
		var ret = false;
		// transfers tick to each character		
		for (var i in characters) {
			ret = ret || characters[i].tick();
		}
		
		return ret;	
	}
	
	
	/**
	 *	Adds a passage to another scene
	 *	@param p	Passage		the passage to add
	 */
	this.addPassage = function(p) {
		passages[passages.length] = p;	
	}


	/**
	 *	Adds an item to a scene
	 *	@param p	Item		the item to add
	 */
	this.addObject = function(o) {
		objects[objects.length] = o;	
		this.addToDisplayStack(o);		
	}


	/**
	 *	Adds an interactive area to a scene
	 *	@param ia	InteractiveArea		the interactive area to add
	 */
	this.addInteractiveArea = function(ia) {
		interactiveAreas[interactiveAreas.length] = ia;	
	}
	
	
	/**
	 *	Adds a given scene element to a scene
	 *	@param	sc	SceneElement	the scene element to add
	 */
	this.addSceneElement = function(se) {
		sceneElements[sceneElements.length] = se;	
		this.addToDisplayStack(se);
	}


	/**
	 *	Pushes a target point into the stack of points to be reached.
	 */
	this.addTargetPoint = function(p) {
		targetPoint.push(p);
	}


	/**
	 *	Preloads the images (registers the images in a set)
	 */
	this.preload = function() {
		loaded[_bg] = false;	
	}
	
	/** Adds an element to the display stack */
	this.addToDisplayStack = function(o) {
		for (var i in displayStack) {
			if (displayStack[i].getZIndex() > o.getZIndex()) {
				displayStack.splice(i, 0, o);
				return;	
			}	
		}	
		displayStack[displayStack.length] = o;
	}

	this.printDisplayStack = function() {
		for (var i in displayStack) {
			console.log(i + "/" + displayStack.length + " = " + displayStack[i]);
				
		}	
	}

    /** audio stuff */
    
    var ambientSounds = [];
    
    this.addAmbient = function (key, buffer, volume) {
        ambientSounds.push({key: key, buffer: buffer, volume: volume});
    }
    
    this.removeAmbient = function (key) {
        //ambientSounds[key] = null;
    }
    
    this.stop = function () {
        game.audio.stop();
    }
}


/**
 *	Class encapsulating passages from a scene to another scene
 */
function Passage(_x, _y, _toScene, _startingPoint) {
	
	/** Point coords */
	this.point = new Point(_x, _y);
	
	/** visibility */
	this.isVisible = function() { return true; }

	/* Returns the description of the passage (can be overriden) */
	this.getDescription = function() { return this.toScene.getDescription(); }

	/** destination scene */
	this.toScene = _toScene;
	
	/** starting point of the next scene */
	this.startingPoint = new Point(_startingPoint.x, _startingPoint.y, _startingPoint.zoom);	
	
	/** orientation of the character */
	this.orientation = "SE";
	
	/**
	 *	Builds a string that represents the passage from a scene to another.
	 */
	this.toString = function() {
		return "Point = " + this.point + 
				"\nVisible = " + this.isVisible() + 
				"\ntoScene = " + this.toScene.getName() + 
				"\nstartingPoint = " + this.startingPoint;  	
	}
		
}


/** 
 *	Class encapsulating actions characterizing by a kind and a parameter
 */
function Action(_kind, _param) {
	
	/** Kind of action that can be done: "passage", "use", "usewith" */
	this.kind = _kind;
		
	/** Parameter of the action Passage for "passage", Item for "use" */
	this.param = _param;	
	

	/**  
	 *	Executes the action
	 *	@param	g	Game 	the current game
	 */ 
	this.execute = function(g) {	
		if (this.kind == 'passage') {
			g.setCurrentScene(this.param.toScene.getName());
			g.getCurrentScene().loadWithLocation(this.param.startingPoint);
			g.setCharacterOrientation(this.param.orientation);
			return;
		}
		if (this.kind == 'use' || this.kind == 'lookat' || this.kind == 'use_with') {
			this.param();
			return;
		}
		if (this.kind = 'say') {
			g.removeAllMessages();
			g.messagesToDisplay.push(this.param);
			g.displayMessages();
			return;	
		}
	}
}
