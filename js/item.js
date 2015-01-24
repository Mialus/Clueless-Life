/**
 *	item.js
 *		
 *	Design of items (objects) inside a scene
 */

function Item(_id, _desc, _spInScene, _x, _y, _spInInventory) {

	// id of the object
	this.id = _id;
	
	// description of the object
	this.description = _desc;

	// getter for the description of the object (can be overriden)
	this.getDescription = function() { return this.description; } 

	// getter for the action word of the interactive area (can be overriden)
	this.getActionWord = function() { return "Use"; }

	// sprite of the object in the scene
	this.spriteInScene = new Image();
	if (_spInScene != null) { 
		this.spriteInScene.src = _spInScene; 
	}

	// coordinates
	this.x = _x;
	this.y = _y;

	// returns the z-index of the object 
	this.getZIndex = function() { return 1; }

	// sprite of the object in the inventory
	this.spriteInInventory = _spInInventory; 	
	
	this.spriteInInventoryImg = new Image();
	if (_spInInventory != null) {
		this.spriteInInventoryImg.src = _spInInventory;	
	}
	
	// check if the object is visible in the scene
	this.isVisible = function() { return !game.getInventory().containsItem(this.id); }

	// closest point to the item	
	this.getClosestPoint = function() { return (_spInInventory != null) ? new Point(this.x,this.y) : null; }

	// orientation of the character when facing the object
	this.getOrientation = function() { return null; }

	/**
	 *	Computes the code that displays the image of the object as the pointer
	 */
	this.getCodeToDisplayImageAsCursor = function() {		
		return 'url(' + this.spriteInInventory + ') ' + Math.floor(this.spriteInInventoryImg.width / 2) + ' 10, auto';	
	}

	
	// function to execute when the object is used
	this.onUseInScene = null; 
	
	// function to execute when the object is used
	this.onUseInInventory = null; 
	
	// function to execute when the object is used with another object
	this.onUseWithInScene = null;
	
	// function to execute when the object is used with another object
	this.onUseWithInInventory = null;
	
	// function to execute when the object is looked in the scene
	this.onLookAtInScene = null;
	
	// function to execute when the object is looked in the inventory
	this.onLookAtInInventory = null;
	
	
	this.toString = function() {
		return _id + " (" + this.getZIndex() + ")";	
	}
}


function InteractiveArea(_id, _desc, _point, _radius, _audioUri) {

	this.id = _id;

	// description of the interactive area
	this.description = _desc;

	// getter for the description of the interactive area (can be overriden)
	this.getDescription = function() { return this.description; } 

	// getter for the action word of the interactive area (can be overriden)
	this.getActionWord = function() { return "Use"; }

	// id of the area
	this.isVisible = function() { return true; }
	
	// position of the area
	var position = _point;
	this.getPosition = function() { return position; }
	
	// radius of the area
	var radius = _radius;
	this.getRadius = function() { return radius; }
	
    // the audio file associated with the element
    this.audioBuffer = null;
    if (_audioUri) {
        var _this = this;
        game.audio.load(_audioUri, function (buffer) {_this.audioBuffer = buffer;});
    }
    
	// closest point to the area
	this.getClosestPoint = function() { return position; }

	// orientation of the character when facing the area
	this.getOrientation = function() { return null; }
	
	// function to execute when the object is used
	this.onUse = null; 
	
	// function to execute when the object is used with another object
	this.onUseWith = null;
	
	// function to execute when the object is looked in the scene
	this.onLookAt = null;
		
    this.playAudio = function (callback) {
        if (this.audioBuffer) {
            source = game.audio.play(this.audioBuffer);
            if (callback) {
                source.onended = callback;
            }
        }
    };
    
}


/**
 *	Class encapsulating scene elements
 */
function SceneElement(_sprite, _x, _y) {
	
	this.x = _x;
	
	this.y = _y;

	this.spriteInScene = new Image();
	this.spriteInScene.src = _sprite;
	
	this.getZIndex = function() {
		return 1;	
	}	
		
	this.isVisible = function() {
		return true;	
	}
	
	this.toString = function() {
		return _sprite + " (" + this.getZIndex() + ")";	
	}
} 



function Inventory() {
	
	// Existing items in the inventory
	var items = [];
	
	// adds an item to the inventory
	this.addItem = function(it) {
		items[items.length] = it;
	}
		
	// returns the ith item
	this.getItem = function(i) {
		return (i < items.length) ? items[i] : null;
	}	
	
	// checks if the inventory contains a given item
	this.containsItem = function(id) {
		for (var i in items) {
			if (items[i].id == id) {
				return true;	
			}	
		}	
		return false;
	} 
	
	// removes the item from the inventory
	this.removeItem = function(id) {
		// identifies the item
		var idx = -1;
		for (var i in items) {
			if (items[i].id == id) {
				item = items[i];
				idx = i;
			}
		}
		if (idx == -1) {
			return;
		}
		// if corresponds to the selected object, 
		// 1. unselect it, and 2. change pointer if necessary
		game.onInventory = 0;	
		if (items[idx] == game.getSelectedObject()) {
			game.setSelectedObject(null);
			if (game.currentAction == game.USE_WITH) {
				game.nextAction();
				game.updateActionLine();
			}
		}
		// remove item from inventory
		items.splice(idx,1);		
		// update inventory display
		this.updateInDisplay();	
	}
	
		
	// update inventory in display
	this.updateInDisplay = function() {
		for (var i=0; i < 7; i++) {
			var htmlCode = "";
			var b = document.getElementById("bcInv" + i);
			if (i < items.length) {
				htmlCode = "<img src='" + items[i].spriteInInventory + "'>";
				if (items[i] != null) {
					b.style.visibility = "visible";
					if (items[i] == game.getSelectedObject()) {
						b.style.backgroundColor = "#FCBA5F";
					}
					else {
						b.style.backgroundColor = "#FFFFFF";
					}
				}
			}	 
			else {
				b.style.visibility = "hidden";	
			}
			b.innerHTML = htmlCode;
		}
	}
	
	this.updateInDisplay();	
}



function Message(_txt, _color, _x, _y, _duration) {
	
	// Text of the message
	this.text = _txt;
	// Color of the message
	this.color = _color;
	// X coordinate of the message
	this.x = _x;
	// Y coordinate of the message
	this.y = _y;
	
	
	/**
	 *	Computes the duration for displaying the text. Depends on the length of the text. 
	 *	Cannot be less than 2000 (2s)
	 *	@param 	String	s	the text to be displayed
	 *	@return 	int		duration in seconds (2000 at least) + 1000 for each 25 chars over 50 chars
	 */
	this.getDurationForText = function(s) {
		if (s.length < 50) {
			return 3000;
		}
		return 3000 + Math.floor((s.length - 50) / 25) * 1000;
	}

	// Duration of the message
	this.duration = (_duration == -1) ? this.getDurationForText(_txt) : _duration;

		
}

