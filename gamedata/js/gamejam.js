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
        game.audio.play(buffer, 0.2, true);
        
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
	var ch3chambre = new Scene("ch3-chambre", "the baby's bedroom", canvas, "gamedata/images/chambreEnfant_couleur1.jpg", 
        [
            {uri: "gamedata/sounds/cries-01.mp3", volume: 0.5},
            {uri: "gamedata/sounds/cries-02.mp3", volume: 0.5},
            {uri: "gamedata/sounds/cries-03.mp3", volume: 0.5},
            {uri: "gamedata/sounds/cries-04.mp3", volume: 0.5},
            //{uri: "gamedata/sounds/babling-01.mp3", volume: 0.25},
            //{uri: "gamedata/sounds/cough-02.mp3", volume: 0.25},
        ]
    );
    
	ch3chambre.addCharacter("perso", new CharacterDisplay("perso", perso, meshChambre(), new Point(70, 460, 1.2)), true);
    ch3chambre.onEntry = function() {
        if (game.getVariableValue("firstVisitInBedroom") == 1) {
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("The boy's crying... What do we do now?", COLOR_PERSO, -1, -1, -1));
            game.displayMessages();
            game.setVariableValue("firstVisitInBedroom", 0);
        }
    }
    game.addScene(ch3chambre);

    // -- couloir -- //
    var ch3couloir = new Scene("ch3-couloir", "the corridor", canvas, "gamedata/images/couloir.jpg", 
        [
            {uri: "gamedata/sounds/far-cries-01.mp3", volume: 0.1},
            {uri: "gamedata/sounds/far-cries-02.mp3", volume: 0.1},
            {uri: "gamedata/sounds/far-cries-03.mp3", volume: 0.1},
            {uri: "gamedata/sounds/far-cries-04.mp3", volume: 0.1},
            {uri: "gamedata/sounds/far-cries-05.mp3", volume: 0.1},
            {uri: "gamedata/sounds/far-scream-01.mp3", volume: 0.1},
        ]
    );
    ch3couloir.setDarkness(0.05);
    ch3couloir.addCharacter("perso", new CharacterDisplay("perso", perso, meshCouloir(), new Point(602, 476, 1.2)), true);
    game.addScene(ch3couloir);
    
    // -- Scene Cuisine --//
    var ch3cuisine = new Scene("ch3-cuisine", "the kitchen", canvas, "./gamedata/images/cuisine.jpg");
	ch3cuisine.addCharacter("perso", new CharacterDisplay("perso", perso, meshCuisine(), new Point(982, 580, 1.3)), true);
    game.addScene(ch3cuisine);
    

    // -- poutre (à faire disparaitre pour la version finale -- //
    var sePoutre = new SceneElement("./gamedata/images/poutre.png", 396, 115);
	sePoutre.getZIndex = function() { return 8; };
	ch3couloir.addSceneElement(sePoutre);
	

    // -- Interrupteur du couloir -- //
    var iaInterrupteur = new InteractiveArea("iaInterrupteur", "the switch", new Point(620, 230), 8, "gamedata/sounds/switch.mp3");
    iaInterrupteur.getClosestPoint = function() { 
        return new Point(583, 411);
    }
    iaInterrupteur.getOrientation = function() {
        return "NE";   
    }
    iaInterrupteur.onLookAt = function() {
        var msg = game.getVariableValue("couloirAllume") == 1 ? "It's the corridor's switch." : "There is something there, but I can't see what.";
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message(msg, COLOR_PERSO, -1, -1, -1));
		game.displayMessages();
    }
    iaInterrupteur.getDescription = function() {
        return game.getVariableValue("couloirAllume") == 1 ? "the switch" : "a small piece of plastic";   
    }
    iaInterrupteur.onUse = function() {
        var newDarkness = (game.getVariableValue("couloirAllume") == 1) ? 0.05 : 1;
        game.getCurrentScene().setDarkness(newDarkness);  
        game.getCurrentScene().redraw();
        game.setVariableValue("couloirAllume", 1 - game.getVariableValue("couloirAllume"));   
        iaInterrupteur.playAudio();
    }
    ch3couloir.addInteractiveArea(iaInterrupteur);
    
    
    
    /**** CHAMBRE DE BEBE ***/
    
    // -- paquet de couches -- //  
    var iaPaquetCouches = new InteractiveArea("iaPaquetCouches", "the diapers", new Point(880, 277), 10, "gamedata/sounds/take-diaper.mp3");
    iaPaquetCouches.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("This a pile of diapers.", COLOR_PERSO, -1, -1, -1));
		game.displayMessages();           
    }
    iaPaquetCouches.getActionWord = function() { return "Pick"; }
    iaPaquetCouches.isOnUse = false;
    iaPaquetCouches.onUse = function() {
        if (iaPaquetCouches.isOnUse) return;
        
        iaPaquetCouches.isOnUse = true;
        
        if (game.getInventory().containsItem("couchePropre")) {
            game.removeAllMessages();
		    game.messagesToDisplay.push(new Message("I already have one.", COLOR_PERSO, -1, -1, -1));
		    game.displayMessages();    
            iaPaquetCouches.isOnUse = false;
            return;
        }
        //game.addItemToInventory("couchePropre");    
        iaPaquetCouches.playAudio(function () {game.addItemToInventory("couchePropre"); iaPaquetCouches.isOnUse = false;});
    }
    ch3chambre.addInteractiveArea(iaPaquetCouches);

    var iaTableALanger = new InteractiveArea("iaTableALanger", "the baby-changing table", new Point(890, 240), 30);
    iaTableALanger.isVisible = function() {
        return game.getVariableValue("bebeSurTable") == 0;   
    }
    iaTableALanger.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("This is the place diapers are changed.", COLOR_JORIS, -1, -1, -1));	
		game.displayMessages();
    }
    iaTableALanger.onUseWith = function(o) {
        if (game.getSelectedObject().id == "bebe") {
            game.setVariableValue("bebeSurTable", 1);   
            game.removeItemFromInventory("bebe");
            game.getCurrentScene().redraw();
            return;
        }
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("No.", COLOR_JORIS, -1, -1, -1));	
		game.displayMessages();
    }
    ch3chambre.addInteractiveArea(iaTableALanger);
    
    // -- table à langer -- //
    var iaBebeALanger = new Item("bebe", "baby", "./gamedata/images/bebe.png", 830, 190, "./gamedata/images/bebe.png");
    iaBebeALanger.isVisible = function() {
        return game.getVariableValue("bebeSurTable") == 1;   
    }
    iaBebeALanger.onLookAtInScene = function()  {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("I must change his diaper.", COLOR_JORIS, -1, -1, -1));	
		game.displayMessages();
    }
    iaBebeALanger.getActionWord = function() { return "Pick"; }
    iaBebeALanger.onUseInScene = function() {
        game.setVariableValue("bebePris", 1);
        game.setVariableValue("bebeSurTable", 0);
        game.addItemToInventory("bebe");
    }
    iaBebeALanger.onUseWithInScene = function(o)  {
        if ((game.getSelectedObject().id == "lingette" || game.getSelectedObject().id == "couchePropre") && 
                game.getInventory().containsItem("couchePropre") && game.getInventory().containsItem("lingette")) {
            
            game.removeItemFromInventory("couchePropre");
            game.removeItemFromInventory("lingette");
            
            game.audio.load("gamedata/sounds/clean-bottom-back-02.mp3", function (buffer) {
                source = game.audio.play(buffer);
                source.addEventListener("ended", function () {
                    
                    game.audio.load("gamedata/sounds/diaper-scratch-1.mp3", function (buffer) {
                        source = game.audio.play(buffer);
                        source.addEventListener("ended", function () {
                            game.audio.load("gamedata/sounds/diaper-scratch-2.mp3", function (buffer) {
                                game.audio.play(buffer);
                            });
                        });
                    });
                    
                    game.addItemToInventory("coucheSale");
                    game.removeAllMessages();
                    
                    game.messagesToDisplay.push(new Message("You should feel better now.", COLOR_JORIS, -1, -1, -1));	
                    game.displayMessages();
                });
            });
            return;
        }
        game.removeAllMessages();
		game.messagesToDisplay.push(new Message("To change his diaper, I need a new one and some wipes.", COLOR_JORIS, -1, -1, -1));	
		game.displayMessages();
    }
    iaBebeALanger.onUseWithInInventory = function() {
        if (game.getSelectedObject().id == "biberon") {
            if (game.getVariableValue("laitChaud") == 1) {
                game.setVariableValue("bebeNourri", 1);
                game.removeAllMessages();
                game.messagesToDisplay.push(new Message("Now he is fed.", COLOR_JORIS, -1, -1, -1));	
                game.displayMessages();
            }
            else {
                game.removeAllMessages();
                game.messagesToDisplay.push(new Message("The milk is not ready yet.", COLOR_JORIS, -1, -1, -1));	
                game.displayMessages();
            }
            return;
        }
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("Nothing to do with that.", COLOR_JORIS, -1, -1, -1));	
        game.displayMessages();
       }
    game.allObjects["bebe"] = iaBebeALanger;
    ch3chambre.addObject(iaBebeALanger);
    
    // -- berceau avec bébé -- //
    var iaBebeBerceau = new InteractiveArea("iaBebeBerceau", "the baby in cradle", new Point(664, 321), 50);
    iaBebeBerceau.isVisible = function() {
        return game.getVariableValue("bebePris") == 0 && game.getVariableValue("bebeSurTable") == 0;   
    }
    iaBebeBerceau.onLookAt = function() {
        if (game.getVariableValue("bebePleure") == 1) {
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("Hum. He's still crying.", COLOR_JORIS, -1, -1, -1));	
            game.messagesToDisplay.push(new Message("What should I do?", COLOR_JORIS, -1, -1, -1));	
            game.displayMessages();
            return;
        }
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("He is now sleeping peacefully.", COLOR_JORIS, -1, -1, -1));	
        game.displayMessages();
    }
    iaBebeBerceau.getActionWord = function() { return "Pick"; }
    
    var babyIsBabling = false;
    
    iaBebeBerceau.onUse = function() {
        game.addItemToInventory("bebe");
        game.setVariableValue("bebePris", 1);
        
        //TODO stop cry start babyIsBabling
        game.getCurrentScene().stop();
        //{uri: "gamedata/sounds/babling-01.mp3", volume: 0.25}
        game.audio.load("gamedata/sounds/babling-01.mp3", function (buffer) {
            bable = function () {
                babyIsBabling = game.audio.play(buffer, 0.25);
                babyIsBabling.addEventListener("ended", bable);
            };
            bable();
        });
    }
    iaBebeBerceau.onUseWith = function() {
        if (game.getSelectedObject().id == "doudou") {
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("Mission accomplished.", COLOR_JORIS, -1, -1, -1));	
            game.displayMessages();
            game.removeItemFromInventory("doudou");
            game.setVariableValue("doudouTrouve", 1);
            return;
        }
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("There is nothing to do with that.", COLOR_JORIS, -1, -1, -1));	
        game.displayMessages();
    }
    ch3chambre.addInteractiveArea(iaBebeBerceau);


    // -- berceau vide -- //
    var iaBerceauVide = new InteractiveArea("iaBerceauVide", "the empty cradle", new Point(664, 321), 50);
    iaBerceauVide.isVisible = function() {
        return game.getVariableValue("bebePris") == 1 || game.getVariableValue("bebeSurTable") == 1;   
    }
    iaBerceauVide.onLookAt = function() {
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("The cradle is empty.", COLOR_JORIS, -1, -1, -1));	
        game.displayMessages();
    }
    iaBerceauVide.onUseWith = function(o) {
        if (game.getSelectedObject().id == "bebe") {
            game.removeItemFromInventory("bebe");
            game.setVariableValue("bebePris", 0);
            
            //TODO stop babyIsBabling start crying if crying baby
            game.audio.stop(babyIsBabling);
            babyIsBabling = false;
            if (game.getVariableValue("bebePleure") == 1) {
                game.getCurrentScene().startAudio();
            }
            
            return;
        }        
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("No.", COLOR_JORIS, -1, -1, -1));	
        game.displayMessages();
    }
    iaBerceauVide.onUseWith = function() {
        if (game.getSelectedObject().id == "doudou") {
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("Mission accomplished.", COLOR_JORIS, -1, -1, -1));	
            game.displayMessages();
            game.removeItemFromInventory("doudou");
            game.setVariableValue("doudouTrouve", 1);
            return;
        }
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("There is nothing to do with that.", COLOR_JORIS, -1, -1, -1));	
        game.displayMessages();
    }
    ch3chambre.addInteractiveArea(iaBerceauVide);


                                            
    // -- couche sale -- //    
    var coucheSale = new Item("coucheSale", "dirty diaper", null, 0, 0, "./gamedata/images/coucheSale.png");
    coucheSale.onLookAtInInventory = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Ouch. This is f****g disgusting.", COLOR_JORIS, -1, -1, -1));	
		game.messagesToDisplay.push(new Message("I should throw it.", COLOR_JORIS, -1, -1, -1));	
		game.displayMessages();
    }
    coucheSale.onUseInInventory = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("And what am I supposed to do with that?", COLOR_JORIS, -1, -1, -1));	
		game.displayMessages();
    }
    game.allObjects["coucheSale"] = coucheSale;
    
    // -- couche propre -- //
    var couchePropre = new Item("couchePropre", "diaper", null, 0, 0, "./gamedata/images/couche.png");
    couchePropre.onLookAtInInventory = function() { 
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("This is a clean diaper.", COLOR_JORIS, -1, -1, -1));	
		game.displayMessages();
	}
    couchePropre.onUseInInventory = function() { 
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("No. I'm too large for that.", COLOR_JORIS, -1, -1, -1));	
		game.displayMessages();
	}
    game.allObjects["couchePropre"] = couchePropre;

    // -- lingette -- //
    var lingette = new Item("lingette", "wiper", null, 0, 0, "./gamedata/images/lingettes.png");
    lingette.onLookAtInInventory = function() { 
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("This is a wiper.", COLOR_JORIS, -1, -1, -1));	
		game.displayMessages();
	}
    lingette.onUseInInventory = function() { 
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("No, I should use them on the baby.", COLOR_JORIS, -1, -1, -1));	
		game.displayMessages();
	}
    game.allObjects["lingette"] = lingette;

    var iaLingettes = new InteractiveArea("iaLingettes", "the baby-wipers", new Point(837, 266), 20, "gamedata/sounds/take-wipe.mp3");
    iaLingettes.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("This a pack of baby-wipers.", COLOR_PERSO, -1, -1, -1));
		game.displayMessages();           
    }
    iaLingettes.getActionWord = function() { return "Pick"; }
    iaLingettes.isOnUse = false
    iaLingettes.onUse = function() {
        
        if (iaLingettes.isOnUse) return;
        
        iaLingettes.isOnUse = true;
        
        if (game.getInventory().containsItem("lingette")) {
            game.removeAllMessages();
		    game.messagesToDisplay.push(new Message("I already have one.", COLOR_PERSO, -1, -1, -1));
		    game.displayMessages();   
            iaLingettes.isOnUse = false
            return;
        }
        //game.addItemToInventory("lingette");            
        iaLingettes.playAudio(function () {game.addItemToInventory("lingette"); iaLingettes.isOnUse = false;});
    }
    ch3chambre.addInteractiveArea(iaLingettes);
    
    // poubelle
    var iaPoubelle = new InteractiveArea("iaPoubelle", "the bin", new Point(960, 387), 50, "gamedata/sounds/throw-away-diaper.mp3");
    iaPoubelle.onLookAt = function() {
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("Smells like teen spirit.", COLOR_PERSO, -1, -1, -1));
        game.messagesToDisplay.push(new Message("Or maybe not.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages();           
    }
    iaPoubelle.onUse = function() {
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("Somedays, I feel like I'd throw myself in the bin and wait.", COLOR_PERSO, -1, -1, -1));
        game.messagesToDisplay.push(new Message("But not today.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages();           
    }
    iaPoubelle.onUseWith = function() {
        if (game.getSelectedObject().id == "coucheSale") {
            game.removeItemFromInventory("coucheSale");
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("Farewell dirty diaper.", COLOR_PERSO, -1, -1, -1));
            game.displayMessages();   
            game.setVariableValue("bebeChange", 1);
            
            iaPoubelle.playAudio(function () {
                game.audio.load("gamedata/sounds/close-bin.mp3", function (buffer) {
                    game.audio.play(buffer);
                });
            });
        }
    }
    ch3chambre.addInteractiveArea(iaPoubelle);
    
    
    // biberon 
    var biberon = new Item("biberon", "baby's bottle", "./gamedata/images/biberonInScene.png", 182, 156, "./gamedata/images/biberonInInventory.png");
    biberon.getOrientation = function() { return "NW"; }
    biberon.onLookAtInScene = function() {
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("We use this bottle to feed our baby.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages();           
    }
    biberon.onLookAtInInventory = function() {
        if (game.getVariableValue("laitChaud") == 1) {
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("The milk is ready.", COLOR_PERSO, -1, -1, -1));
            game.displayMessages();           
            return;
        }
        if (game.getVariableValue("laitOK") == 1) {
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("I still need to warm it.", COLOR_PERSO, -1, -1, -1));
            game.displayMessages();           
            return;
        }
        if (game.getVariableValue("poudreOK") == 1) {
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("There is powder in it.", COLOR_PERSO, -1, -1, -1));
            game.messagesToDisplay.push(new Message("I should add water to get milk.", COLOR_PERSO, -1, -1, -1));
            game.displayMessages();           
            return;
        }
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("It is empty.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages();           
    }
    biberon.onUseInScene = function() {
        game.addItemToInventory("biberon");           
    }
    biberon.onUseWithInInventory = function() {
        if (game.getSelectedObject().id != "bouteilleEau") {
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("No way.", COLOR_PERSO, -1, -1, -1));
            game.displayMessages();          
            return;
        }
        
        if (game.getVariableValue("laitOK") == 1) {
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("The milk is already ready, Eddy.", COLOR_PERSO, -1, -1, -1));
            game.displayMessages();          
            return;
        }
            
        if (game.getVariableValue("poudreOK") == 1) {
            game.setVariableValue("laitOK", 1);
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("The milk is ready. I now need to warm it.", COLOR_PERSO, -1, -1, -1));
            game.displayMessages(); 
            return;
        }
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("I should first put some milk powder in it.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages();           
        
    }
    game.allObjects["biberon"] = biberon;
    ch3chambre.addObject(biberon);
    
    
    var doudou = new Item("doudou", "the cuddly toy", "./gamedata/images/doudouInScene.png", 730, 402, "./gamedata/images/doudou.png");
    doudou.isVisible = function() {
        return !game.getInventory().containsItem("doudou") && game.getVariableValue("doudouTrouve") == 0;   
    }
    doudou.onLookAtInScene = function() {
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("It's the kid's cuddly toy.", COLOR_PERSO, -1, -1, -1));
        game.messagesToDisplay.push(new Message("I guess he threw it ouf of its bed. Again.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages(); 
    }
    doudou.onUseInScene = function() {
        game.addItemToInventory("doudou");
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("Let's pick it up.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages(); 
    }
    doudou.onLookAtInInventory = function() {
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("I think I should put it back in its bed.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages(); 
    }
    doudou.onUseInInventory = function() {
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("Sometimes I miss my cuddly toy.", COLOR_PERSO, -1, -1, -1));
        game.messagesToDisplay.push(new Message("But now I am a grown up.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages(); 
    }
    game.allObjects["doudou"] = doudou;
    ch3chambre.addObject(doudou);
 
    
    /*****   CUISINE     *****/
        
    // eau 
    var bouteilleEau = new Item("bouteilleEau", "bottle of water", "./gamedata/images/bouteilleEau.png", 792, 270, "./gamedata/images/bouteilleEau.png");
    bouteilleEau.onLookAtInScene = bouteilleEau.onLookAtInInventory = function() {
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("This water is good for the babies.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages();           
    }
    bouteilleEau.getActionWord = function() { return "Pick"; }
    bouteilleEau.onUseInScene = function() {
        game.addItemToInventory("bouteilleEau");   
    }
    game.allObjects["bouteilleEau"] = bouteilleEau;
    ch3cuisine.addObject(bouteilleEau);
    
    
    // poudre 
    var poudreLait = new Item("poudreLait", "milk powder", "./gamedata/images/poudre.png", 392, 275, "./gamedata/images/poudre.png");
    poudreLait.onLookAtInScene = function() {
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("This can be used to produce milk for the baby.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages();           
    }
    poudreLait.onUseWithInScene = function() {
        if (game.getSelectedObject().id != "biberon") {
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("No. It won't work.", COLOR_PERSO, -1, -1, -1));
            game.displayMessages();           
            return;
        }
        game.setVariableValue("poudreOK", 1);
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("OK. Done.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages();           
    }
    game.allObjects["poudreLait"] = poudreLait;
    ch3cuisine.addObject(poudreLait);
    
    // micro-ondes
    var iaMicroOndes = new InteractiveArea("iaMicroOndes", "the microwave", new Point(592, 361), 20);
    iaMicroOndes.getOrientation = function() { return "N"; }
    iaMicroOndes.onLookAtInScene = function() {
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("I don't really know how it works, but it works.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages();           
    }
    iaMicroOndes.onUseWith = function() {
        if (game.getSelectedObject().id == "bebe") {
            game.setCharacterOrientation("S");
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("ARE YOU OUT OF YOUR MIND?!?", COLOR_PERSO, -1, -1, -1));
            game.messagesToDisplay.push(new Message("WHAT IS WRONG WITH YOU?!?", COLOR_PERSO, -1, -1, -1));
            game.messagesToDisplay.push(new Message("HOW CAN YOU POSSIBLY IMAGINE TO DO THAT?!?", COLOR_PERSO, -1, -1, -1));
            game.displayMessages();           
            return;
        }
        if (game.getSelectedObject().id != "biberon") {
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("I don't want to microwave that.", COLOR_PERSO, -1, -1, -1));
            game.messagesToDisplay.push(new Message("It could be dangerous.", COLOR_PERSO, -1, -1, -1));
            game.displayMessages();           
            return;
        }
        game.setVariableValue("laitChaud", 1);
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("The milk is now warm.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages();           
    }
    ch3cuisine.addInteractiveArea(iaMicroOndes);
    
    // robinet
    var iaRobinet = new InteractiveArea("iaRobinet", "the tap", new Point(313, 280), 20);
    iaRobinet.onLookAtInScene = function() {
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("This is a source of water.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages();           
    }
    iaRobinet.onUseWith = function() {
        if (game.getSelectedObject().id == "biberon" && game.getVariableValue("poudreOK") == 1) {
            game.removeAllMessages();
            game.messagesToDisplay.push(new Message("Tap water is not good for babies.", COLOR_PERSO, -1, -1, -1));
            game.displayMessages();           
            return;
        }   
        game.removeAllMessages();
        game.messagesToDisplay.push(new Message("No.", COLOR_PERSO, -1, -1, -1));
        game.displayMessages();           
    }
    ch3cuisine.addInteractiveArea(iaRobinet);
    
    
    
    
    
    /*** passages ***/
    var paCouloirChambre = new Passage(501, 205, ch3chambre, new Point(70, 460, 1.2));
    paCouloirChambre.isVisible = function() { return game.getVariableValue("couloirAllume") == 1; }
    ch3couloir.addPassage(paCouloirChambre);
    
    var paChambreCouloir = new Passage(46, 461, ch3couloir, new Point(472, 292, 0.5));
    ch3chambre.addPassage(paChambreCouloir);
    
    var paCuisineCouloir = new Passage(970, 575, ch3couloir, new Point(602, 476, 1.2));
    ch3cuisine.addPassage(paCuisineCouloir);
    
    var paCouloirCuisine = new Passage(602, 476, ch3cuisine, new Point(970, 575, 1.3));
    paCouloirCuisine.isVisible = function() { return game.getVariableValue("couloirAllume") == 1; }
    ch3couloir.addPassage(paCouloirCuisine);
    
    /*** variables ***/
    game.setVariableValue("firstVisitInBedroom", 1);
    game.setVariableValue("couloirAllume", 0);
    game.setVariableValue("bebePris", 0);
    game.setVariableValue("bebePleure", 1);
    game.setVariableValue("bebeSurTable", 0);
    game.setVariableValue("bebeChange", 0);
    game.setVariableValue("poudreOK", 0);
    game.setVariableValue("laitOK", 0);
    game.setVariableValue("laitChaud", 0);
    game.setVariableValue("bebeNourri", 0);
    game.setVariableValue("doudouTrouve", 0);
}



meshCuisine = function() {
 
    var m = new Mesh();
    
    var pDroite = new Point(982, 580, 1.3);
    var pGauche = new Point(576, 496, 1.3);
    
    m.addSegment(new Segment(pDroite, pGauche, 0.8));
    
    return m;
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


	