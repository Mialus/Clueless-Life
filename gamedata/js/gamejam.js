/** 
 *	Game data
 *	
 */

var COLOR_PERSO = "#AACCFF";
var COLOR_JORIS = "#AACCFF";

var imgPerso = new Image();
imgPerso.src = "./gamedata/images/spritesheet-perso.png";
imgPerso.onerror = function() { alert("Error while loading spritesheet: " + imgPerso.src); };


//*** Main character ***//
var arret = new Object();
arret["N"] = new Animation(imgPerso, 290, 100, 0, 520, 1, 0, 0, 0, 1);
arret["NE"] = new Animation(imgPerso, 290, 100, 0, 660, 1, 111, 0, 0, 1);
arret["E"] = new Animation(imgPerso, 290, 100, 0, 260, 1, 103, 0, 0, 1);
arret["SE"] = arret["E"];
arret["S"] = new Animation(imgPerso, 290, 100, 0, 140, 1, 78, 0, 0, 1);
arret["SW"] = new Animation(imgPerso, 290, 100, 0, 10, 1, 78, 0, 0, 1);
arret["W"] = arret["SW"];
arret["NW"] = new Animation(imgPerso, 290, 100, 0, 370, 1, 111, 0, 0, 1);

var movement = new Object();
movement["N"] = new Animation(imgPerso, 282, 80, 1124, 0, 11, 80, 0, 0, 1);
movement["E"] = new Animation(imgPerso, 269, 121, 855, 0, 12, 121, 0, 1, 1);
movement["W"] = new Animation(imgPerso, 269, 121, 855, 0, 12, 121, 0, 0, 1);
movement["S"] = new Animation(imgPerso, 285, 85, 292, 0, 12, 85, 0, 0, 1);
movement["SE"] = new Animation(imgPerso, 275, 121, 579, 0, 12, 122, 0, 1, 1);
movement["SW"] = new Animation(imgPerso, 275, 121, 579, 0, 12, 122, 0, 0, 1);
movement["NW"] = new Animation(imgPerso, 290, 111, 1407, 0, 12, 111, 0, 0, 1);
movement["NE"] = new Animation(imgPerso, 290, 111, 1407, 0, 12, 111, 0, 1, 1);


var perso = new Character(imgPerso, arret, movement, null, "gamedata/sounds/footstep-marble.mp3");


var chapters = [ 
	// chapitre 1
	{ "splashScreen": "./gamedata/images/1/chapitre1.png",
  	  "title" : "Clueless baby", 
	  "after" : function() {
        alert("Chapter not available");
      }
	},
	// chapitre 2				
	{ "splashScreen": "./gamedata/images/2/chapitre2.jpg",
	  "title" : "Clueless teenagers",
	  "after" : function() {
            alert("Champter not available.");   
      }
	},
    // chapitre 3
    { "splashScreen" : "./gamedata/images/3/chaptre3.jpg",
      "title" : "Clueless parents",
      "after" : function() {
        game.setCurrentScene("ch3-chambre");
        game.loadWithLocation(null);
    }
    }
        
];
		


initGame = function(canvas) {
	
	// game
	game = new Game();
    
    game.audio.load("gamedata/sounds/atmo-thunder-rain.mp3", function (buffer) {
        game.audio.play(buffer, 0.1, true);
        
    });
    perso.loadAudio();
    
	initGameChap3(canvas);
	
	return game;
}	


/*************************************************************************
 *	CHAPITRE 3 - Clueless Parents
 *************************************************************************/
initGameChap3 = function(canvas) {

	// --- Scene Chambre ---- //

	var ch3chambre = new Scene("ch3-chambre", "la chambre de bébé", canvas, "gamedata/images/chambreEnfant_couleur1.jpg");
	ch3chambre.addCharacter("perso", new CharacterDisplay("perso", perso, meshChambre(), new Point(70, 460, 1.2)), true);
    game.addScene(ch3chambre);

    var ch3couloir = new Scene("ch3-couloir", "le couloir", canvas, "gamedata/images/couloir.jpg");
    ch3couloir.setDarkness(0.05);
    ch3couloir.addCharacter("perso", new CharacterDisplay("perso", perso, meshCouloir(), new Point(602, 476, 1.2)), true);
    game.addScene(ch3couloir);
    
    var sePoutre = new SceneElement("./gamedata/images/poutre.png", 396, 115);
	sePoutre.getZIndex = function() { return 8; };
	ch3couloir.addSceneElement(sePoutre);
	
    var iaInterrupteur = new InteractiveArea("iaInterrupteur", "l'interrupteur", new Point(620, 230), 8, "gamedata/sounds/switch.mp3");
    iaInterrupteur.getClosestPoint = function() { 
        return new Point(583, 411);
    }
    iaInterrupteur.getOrientation = function() {
        return "NE";   
    }
    iaInterrupteur.onLookAt = function() {
        var msg = game.getVariableValue("couloirAllume") == 1 ? "C'est l'interrupteur du couloir." : "Il y a bien quelque chose, mais je ne vois rien.";
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message(msg, COLOR_PERSO, -1, -1, -1));
		game.displayMessages();
    }
    iaInterrupteur.getDescription = function() {
        return game.getVariableValue("couloirAllume") == 1 ? "l'interrupteur" : "le truc en plastique sur le mur";   
    }
    iaInterrupteur.onUse = function() {
        var newDarkness = (game.getVariableValue("couloirAllume") == 1) ? 0.05 : 1;
        game.getCurrentScene().setDarkness(newDarkness);  
        game.getCurrentScene().redraw();
        game.setVariableValue("couloirAllume", 1 - game.getVariableValue("couloirAllume"));   
        iaInterrupteur.playAudio();
    }
    ch3couloir.addInteractiveArea(iaInterrupteur);
        
    // passages
    var paCouloirChambre = new Passage(501, 205, ch3chambre, new Point(70, 460, 1.2));
    paCouloirChambre.isVisible = function() {
        return game.getVariableValue("couloirAllume") == 1;   
    }
    ch3couloir.addPassage(paCouloirChambre);
    
    var paChambreCouloir = new Passage(46, 461, ch3couloir, new Point(472, 292, 0.5));
    ch3chambre.addPassage(paChambreCouloir);
    
    // variables
    game.setVariableValue("couloirAllume", 0);
    
}



meshCouloir = function() {
 
    var m = new Mesh();
    
    var pChambre1 = new Point(472, 292, 0.5);
    var pChambre2 = new Point(519, 381, 1);
    var pSortie = new Point(602, 476, 1.2);
    
    m.addSegment(new Segment(pChambre1, pChambre2, 0.5));
    m.addSegment(new Segment(pChambre2, pSortie, 0.8));
    
    return m;    
}



meshChambre = function() { // TODO check

	var m = new Mesh();
	
	var pGauche = new Point(70, 460, 1.2);
	var pEtagere = new Point(198, 415, 1.1);
	var pCoffre = new Point(311, 400, 1.1);
	var pArmoire = new Point(446, 370, 1);
    var pTapis = new Point(350, 440, 1.2);
	var pEnFace = new Point(499, 448, 1.2);
	var pDroite = new Point(756, 454, 1.2);
	var pBerceau = new Point(735, 405, 1.05);
    var pTableLanger = new Point(832, 402, 1.1);
    
	m.addSegment(new Segment(pGauche, pEtagere, 0.9));
	m.addSegment(new Segment(pEtagere, pCoffre, 0.9));
	m.addSegment(new Segment(pArmoire, pCoffre, 0.9));
	m.addSegment(new Segment(pArmoire, pTapis, 0.9));
	m.addSegment(new Segment(pCoffre, pTapis, 0.9));
	m.addSegment(new Segment(pEtagere, pTapis, 0.9));
	m.addSegment(new Segment(pGauche, pTapis, 0.9));
	m.addSegment(new Segment(pArmoire, pEnFace, 0.9));
    m.addSegment(new Segment(pTapis, pEnFace, 0.9));
    m.addSegment(new Segment(pDroite, pEnFace, 0.9));
    m.addSegment(new Segment(pDroite, pBerceau, 0.9));
    m.addSegment(new Segment(pTableLanger, pBerceau, 0.9));
    m.addSegment(new Segment(pTableLanger, pDroite, 0.9));
    
    
    
    
	return m;
}


	