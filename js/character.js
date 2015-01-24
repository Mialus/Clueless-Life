/**
 * Class character
 */

/**
 *	@param	Image	file
 * 	@param	int		ratio
 *	@param	int		direction		0 to 7, 0 is the north
 *	@param	bool	isRunning		boolean to activate animation
 *	@param	callback
 */
function Character(imgSprite, arret, movement, callback){
	
	var img = imgSprite;
	
	// ---- Animation ---- //

	/** Animation used for the movement of the character (object indexed by the 8 possible directions) */	
	var animation = movement;
	
	/** Animation used for a standing character (object indexed by the 8 possible directions) */	
	var positionArret = arret;
	
	/** Current animation of the character */
	var currentAnimation = null;
	
	/** 
	 *	Returns the current animation of the character 
	 */
	this.getCurrentAnimation = function() {
		return currentAnimation;
	}
	
	/** Direction in which the character is oriented (expecting "N", "NE", "E", "SE", "S", "SW", "W", "NW") */
	var direction = direction;
	
	/**
	 *	Sets the direction in which the character is oriented.
	 *	@param 		String		newDir 		the new direction (expecting "N", "NE", "E", "SE", "S", "SW", "W", "NW")	
	 */
	this.setDirection = function(newDir) {
		direction = newDir;	
		currentAnimation = (isRunning) ? animation[direction] : positionArret[direction];
	}
	
	/** 
	 *	Returns the current direction of the character.
	 */
	this.getDirection = function() {
		return direction;	
	}
	
	/** z-index of the character (default 0) */ 
	var zIndex = 0;

	/** 
	 *	Sets the z-index of the character 
	 *	@param		int		newZ		the new z-index value
	 */
	this.setZIndex = function(newZ) {
		zIndex = newZ;	
	}
	
	/**
	 *	Returns the z-index of the character
	 */
	this.getZIndex = function() {
		return zIndex;	
	}
	
	// initial values
	direction = "SW";
	currentAnimation = positionArret[direction];	
	
	/** Status of the character (running <=> walking) */
	var isRunning = 0;
	
	/**
	 *	Sets the movement status of the character
	 *	@param		bool	newRun		the new value for the running attribute (0 : stopped, 1 : walking). 
	 */
	this.setRunning = function(newRun) {
		isRunning = newRun;	
		currentAnimation = (isRunning) ? animation[direction] : positionArret[direction];
	}


	// ---- Character display ----//

	/** 	
 	 * Draws the character on the map
 	 */
	this.draw = function(context, destX, destY, ratio) {
		if (this.isVisible()) {
			currentAnimation.setRatio(ratio);
			currentAnimation.draw(context, destX, destY);
		}
	}


	/**
	 *	Ticks the character (looks for an update)
	 *	@return 	bool	true if the character has changed and should be redrawn 
	 */
	this.tick = function() {
		return currentAnimation.tick();
	}

	/** 
	 * 	Returns the placement of the character
	 */
	this.getCharacterInfos = function() {
		return currentAnimation.getCharacterInfos();	
	}
	
	/**
	 *	Indicates if the character is visible or not.
	 */
	this.isVisible = function() { 
		return true;
	} 
}


/**
 * Class animation
 */

/**
 * Contructeor, create an animation of an image
 * 	@param	Image	_img					image of the associated spritesheet
 * 	@param	int		_sourceHeight			height of a sprite frame
 * 	@param	int		_sourceWidth				widt of a sprite frame
 * 	@param	int		_sourceSpriteSheetX		Vertical offset for the sprite
 * 	@param	int		_sourceSpriteSheetY		Horizontal offset for te sprite
 * 	@param	ini		_nbFrames 				Number of frames composing the animation
 * 	@param	int		_decX					Horizontal offset between 2 frames
 * 	@param	int		_decY					Vertical offset between 2 frames
 * 	@param	bool 	_flip					flip teh sprite
 *	@param	float	_ratio					zoom ration
 */
function Animation(_img, _sourceHeight, _sourceWidth, _sourceSpriteSheetY, _sourceSpriteSheetX,  _nbFrames, _decX, _decY, _flip, _ratio) {

	var img = _img;
	var decX = _decX;
	var decY = _decY;
	var posX = 0;
	var posY = 0;
	var nbFrames = _nbFrames;
	var sourceHeight = _sourceHeight;
	var sourceWidth = _sourceWidth;
	var sourceSpriteSheetX = _sourceSpriteSheetX;
	var sourceSpriteSheetY = _sourceSpriteSheetY;
	var flip = _flip;
	var state = 0; 											// 0, 1, 2, etc. nb_frame -1
	var ratio = _ratio;										// set the ratio of the currently displayed image
	var destHeight = Math.floor(sourceHeight * ratio);		// destination height
	var destWidth = Math.floor(sourceWidth * ratio);		// destination width
	var sourceX = sourceSpriteSheetX						// source X coordinate (recomputed every x frame)
	var sourceY = sourceSpriteSheetY						// source Y coordinate (recomputed every x frame)
	this.x = 0;												// x marks the number of frames during which the same image is displayed

	/**
	 *	Changes the current coordinates of the displayed picture.
	 */
	this.setXY = function(_x, _y) {
		destX = _x;
		destY = _y;
	}

	/**
	 *	Sets the new ratio for image display.
	 */
	this.setRatio = function(nr) {
		ratio = nr;
		destHeight = Math.floor(sourceHeight * ratio);
		destWidth = Math.floor(sourceWidth * ratio);
	}
	
	/**
	 *	Sets the new state of the 
	 */
	this.setState = function(newState) {
		state = newState;	
	}


	/**
	 *	Draws the animation in the context at the given position and prepares next move.
	 *	@param	Context		context		the context on which the animation is drawn
	 *	@param	int			posX		the X position where the center of the character is located
	 *	@param 	int			posY		the Y position where the bottom of the character is located
	 */
	this.draw = function(context, _posX, _posY) {
		posX = _posX;
		posY = _posY;
		// case of a flipped context
        if (flip == 1) {
        	context.save();
        	context.scale(-1,1);	
	        context.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, -posX-(sourceWidth*ratio)/2 , posY- (sourceHeight-20)*ratio, destWidth, destHeight);
			context.restore();	
        }
        else {
	        context.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, posX-(sourceWidth*ratio)/2, posY- (sourceHeight-20)*ratio, destWidth, destHeight);
        }
        // context.fillText(state, posX, posY + 50);
	}
	
	
	/**
	 *	Checks if the character has to be updated
	 */
	this.tick = function() {
        // internal temporisation of the character
        this.x = (this.x + 1) % 2;
		if (this.x != 0) 
			return false;
		
		var newState = (state + 1) % nbFrames;
		
		if (state == newState) 
			return false;
		
		state = newState;
		sourceX = sourceSpriteSheetX + decX * state;
		sourceY = sourceSpriteSheetY + decY * state;
		return true;
	}
	

	/**
	 *	Resets the current animation
	 */
	this.reset = function(){
		sourceX = sourceSpriteSheetX;
		sourceY = sourceSpriteSheetY;
		state = 0;
	}

	
	/** 
	 * 	Returns the placement of the character
	 */
	this.getCharacterInfos = function() {
		return { "x": posX - (sourceWidth*ratio), "y": posY- sourceHeight*ratio };	
	}

}



/**
 *	Display of a character. Gathers all informations about the character.
 *	(associated mesh, object with its animations, current movement, etc.)  
 *	@param		String		_chId		Character ID (i.e. name)
 *	@param		Character	_charObj	Character Object
 *	@param		Mesh		_charMesh	Mesh associated to the character
 */
function CharacterDisplay(_chId, _charObj, _charMesh, _defaultPosition) {

	/** Character ID */
	var chId = _chId;
	/** 
	 *	Getter for character ID
	 *	@return		String		the ID of the character
	 */
	this.getCharacterId = function() { return chId; }
	
	
	/** Character object */
	var charObj = _charObj
	/**
	 *	Getter for character object.
	 *	@return		Character		the character object
	 */
 	this.getCharacterObj = function() { return charObj; }
 	
 	
 	/** Character mesh */
	var charMesh = _charMesh;
	/**
	 *	Getter for character mesh.
	 *	@return		Mesh		the character mesh
	 */
 	this.getCharacterMesh = function() { return charMesh; }
 	
 	
	// default character position
	this.defaultPosition = _defaultPosition;
	
	/**
	 *	Retrieves the default position
	 */
	this.getDefaultPosition = function() { 
		return this.defaultPosition; 
	}


	// movement speed
	var SPEED = 8;
	

	// current point for the character position
	var currentPoint = null;
	this.setCurrentPoint = function(cp) {
		currentPoint = cp;	
	}
	this.getCurrentPoint = function() {
		return currentPoint;	
	}
	
	/** Target point on the character location */
	// targets points (define the path to follow when the character is moving)
	var targetPoint = [];
	var actionWhenPointIsReached = null;		// TODO --> change to a ActionStack (points, actions, 
	var orientationWhenPointIsReached = null;
	
	
	/**
	 *	Returns the Z-Index of the character
	 *	@return		int		the z-index 
	 */
	this.getZIndex = function() {
		return charMesh.getClosestPointAndSegment(currentPoint).segment.getZIndex();	
	}
	
	
	/** 
	 *	Sends a tick to the character. 
	 */
	this.tick = function() {
		
		if (targetPoint.length == 0) {
			return false;
		}
		
		charObj.tick();
		
		var norme = currentPoint.distanceTo(targetPoint[0]);
		
		// TODO optimize segment detection
		var realSpeed = charMesh.getClosestPointAndSegment(currentPoint).segment.getSpeedFactor() * SPEED;
		
		// compute new position relateed to the direction to the target point.
		if (norme < realSpeed) {
			currentPoint.x = targetPoint.x;
			currentPoint.y = targetPoint.y;
			currentPoint.zoom = targetPoint.zoom;
			if (targetPoint.length > 0) {
				// remaining target points
				currentPoint = targetPoint.shift();
			}
			
			if (targetPoint.length == 0) {
				if (orientationWhenPointIsReached != null) {
					charObj.setDirection(orientationWhenPointIsReached);
					orientationWhenPointIsReached = null;		
				}				
				game.getCurrentScene().redraw();
				// target reached
				if (actionWhenPointIsReached != null) {
					actionWhenPointIsReached.execute(game);
					actionWhenPointIsReached = null;
				}
			}
			return;
		}
		
		var vecX = targetPoint[0].x - currentPoint.x;
		var vecY = targetPoint[0].y - currentPoint.y;
		
		var oldDistance = norme;
		
		currentPoint.x = currentPoint.x + (vecX * realSpeed / norme);	
		currentPoint.y = currentPoint.y + (vecY * realSpeed / norme);
		
		var newDistance = currentPoint.distanceTo(targetPoint[0]);
		currentPoint.zoom += ((oldDistance - newDistance) / oldDistance) * (targetPoint[0].zoom - currentPoint.zoom);		
	
		return true;

	}	


	/**
	 * 	Specific drawing of a character using its display.
	 *	
	 */
	this.drawCharacter = function(context, OFFSET_X, OFFSET_Y) {

		// display of the mesh (comment to remove)
		charMesh.display(context, OFFSET_X, OFFSET_Y);		
		
		// display of the character
		if (targetPoint.length > 0) {
			charObj.setRunning(1);
			var orientation = getOrientation(currentPoint, targetPoint[0]);
			charObj.setDirection(orientation);
		}
		else {
			charObj.setRunning(0);
		}
		charObj.draw(context, currentPoint.x + OFFSET_X, currentPoint.y + OFFSET_Y, currentPoint.zoom);
	}


	
	
	/**
	 * 	Called when point is reached
	 *	@param		Point			clickedPoint			location where the click took place
	 *	@param		{Action,Point}	actionAndDestination	pair (action, destination) action to perform when the destination is reached.
	 */
	this.click = function(clickedPoint, actionAndDestination) {	
	
		// computes the action that has to be done when the point has been reached (null if none)
		actionWhenPointIsReached = actionAndDestination.action;

		// computes the orientation when the point has been reached
		orientationWhenPointIsReached = actionAndDestination.orientation;

		// computes the closest point
		var closest = actionAndDestination.destination; 
		
		// computation of the path from the current point to the destination point
		var pDest = closest.point;
		var segDest = closest.segment;
		pDest.zoom = this.getZoom(pDest, segDest.getPoint1(), segDest.getPoint2());
		var segSource = charMesh.getClosestPointAndSegment(currentPoint).segment;
		var pathToTarget = charMesh.getPathFromTo(currentPoint, segSource, pDest, segDest);
		targetPoint = [];
		for (var i=1; i < pathToTarget.length; i++) {
			targetPoint.push(new Point(pathToTarget[pathToTarget.length - 1 - i].x, 
									   pathToTarget[pathToTarget.length - 1 - i].y, 
									   pathToTarget[pathToTarget.length - 1 - i].zoom));
		}
		
	}
			

	/**
	 *	Computes the zoom factor for the point p on segment p1, p2
	 *	@param	p 	the point for which the ratio is computed
	 *	@param 	p1	one extremity of the segment
	 *	@param 	p2	the other extremity of the segment
	 */
	this.getZoom = function(p, p1, p2) {
	
		if (p1.zoom == p2.zoom)
			return p1.zoom;
		
		var distanceP1P2 = p1.distanceTo(p2);
		var distancePP1 = p.distanceTo(p1);
		
		// ratio distance w.r.t. P1
		var ratio = distancePP1 / distanceP1P2;
		return p1.zoom + (ratio * (p2.zoom - p1.zoom));		
	}


	/**
	 *	Computes the orientation of the character for a given vector defined by 2 points
	 *	@param	Point	src		Source point of the vector
	 *	@param	Point	dest	Destination point of the vector
	 *	@return	String			The orientation of the character "N", "NE", "E", "SE", "S", "SW", "W", "NW" 
	 */
	getOrientation = function(src, dest) {
		var y = dest.y - src.y;
		var x = dest.x - src.x;
		var angle = Math.atan2(-y,x);
		if (angle >= -Math.PI/8 && angle <= Math.PI/8) {
			return "E";	
		} 
		if (angle >= Math.PI/8 && angle <= 3*Math.PI/8) {
			return "NE";	
		}
		if (angle >= 3*Math.PI/8 && angle <= 5*Math.PI/8) {
			return "N";	
		}
		if (angle >= 5*Math.PI/8 && angle <= 7*Math.PI/8) {
			return "NW";	
		}
		if (angle <= -Math.PI/8 && angle >= -3*Math.PI/8) {
			return "SE";	
		}
		if (angle <= -3*Math.PI/8 && angle >= -5*Math.PI/8) {
			return "S";	
		}
		if (angle <= -5*Math.PI/8 && angle >= -7*Math.PI/8) {
			return "SW";	
		}
		return "W";
	}


	
	
}








