/** 
 *	Game data
 *	
 */

var COLOR_PERSO = "#AACCFF";

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


var perso = new Character(imgPerso, arret, movement, null);


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
	}
];
		


initGame = function(canvas) {
	
	// game
	game = new Game();
	
	initGameChap3(canvas);
	
	return game;
}	


/*************************************************************************
 *	CHAPITRE 3 - Clueless Parents
 *************************************************************************/
initGameChap3 = function(canvas) {

	// --- Scene Chambre ---- //
	var ch3chambre = new Scene("ch3-chambre", "la chambre de bébé", canvas, "gamedata/images/chambre.png");
	ch3chambre.addCharacter("perso", new CharacterDisplay("perso", perso, meshChambre(), new Point(100, 660, 1)), true);
	game.addScene(ch3chambre);
	
	/** Scene elements */
	var terre1 = new SceneElement("./gamedata/images/2/terre1.png", 460, 506);
	terre1.getZIndex = function() { return 8; };
	ade.addSceneElement(terre1);
	var terre2 = new SceneElement("./gamedata/images/2/terre2.png", 460, 457);
	terre2.getZIndex = function() { return 6; };
	ade.addSceneElement(terre2);
	var terre3 = new SceneElement("./gamedata/images/2/terre3.png", 451, 399);
	terre3.getZIndex = function() { return 4; };
	ade.addSceneElement(terre3);
	var coin = new SceneElement("./gamedata/images/2/coin.png", 1, 444);
	coin.getZIndex = function() { return 20; };
	ade.addSceneElement(coin);
	
	/** Interactive areas */
	var iaIsidore = new InteractiveArea("iaIsidore", "la statue", new Point(1110, 378), 110);
	iaIsidore.getOrientation = function() { return "SE"; };
	iaIsidore.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("C'est sûrement une statue d'Isidore de Séville<br>le saint patron des informaticiens et d'Internet.", COLOR_JORIS, -1, -1, -1));
		game.messagesToDisplay.push(new Message("Il a l'air désespéré.", COLOR_JORIS, -1, -1, -1));
		game.messagesToDisplay.push(new Message("C'est peut-être en lien avec la conception<br>désastreuse de cette base de donnée.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	ade.addInteractiveArea(iaIsidore);
	
	
	// ---- Scene Hall B ---- //
	var hallB = new Scene("ch2-hallB", "le hall du batiment B", canvas, "gamedata/images/2/hall-B.jpg");
	hallB.addCharacter("perso", new CharacterDisplay("perso", perso, meshHallB(), new Point(461, 554, 1.1)), true);
	game.addScene(hallB);
	
	var iaOrdi = new InteractiveArea("iaOrdi", "l'ordinateur en libre service", new Point(933,225), 35);
	iaOrdi.getOrientation = function() { return "NE"; };
	iaOrdi.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("C'est un ordinateur sur lequel on peut avoir accès à Internet.", COLOR_JORIS, -1, -1, -1));
		game.messagesToDisplay.push(new Message("Tout du moins à l'intranet de l'Université.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	iaOrdi.onUse = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Je dois insérer ma carte d'étudiant pour pouvoir l'utiliser.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	iaOrdi.onUseWith = function() {
		if (game.getSelectedObject().id == "carteEtudiant") {
//			var act = new Action("passage", new Passage(0, 0, ent, new Point(640, 460)));
//			act.execute(game);
			return;
		}		
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Non, ça ne fonctionne pas.", COLOR_JORIS, -1, -1, -1));
		game.messagesToDisplay.push(new Message("Je dois insérer ma carte d'étudiant pour pouvoir l'utiliser.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	hallB.addInteractiveArea(iaOrdi);	
	
	var iaPorte = new InteractiveArea("iaPorte", "la porte vers l'extérieur", new Point(507, 206), 60);
	iaPorte.getOrientation = function() { return "NW"; }
	iaPorte.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("C'est la porte vers la liberté.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	iaPorte.onUse = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Le samedi après-midi, elle est verrouillée.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	hallB.addInteractiveArea(iaPorte);
	
	
	// ---- Hall batiment C ---- //
	var hallC = new Scene("ch2-hallC", "le hall du batiment C", canvas, "gamedata/images/2/hall-C.jpg");
	hallC.addCharacter("perso", new CharacterDisplay("perso", perso, meshHallC(), new Point(245, 533, 1)), true);
	game.addScene(hallC);
	
	var iaDistributeur = new InteractiveArea("iaDistributeur", "le distributeur", new Point(765, 183), 35);
	iaDistributeur.getOrientation = function() { return "E"; }
	iaDistributeur.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Ce distributeur est enfermé dans un caisson anti-vandalisme.", COLOR_JORIS, -1, -1, -1));
		game.messagesToDisplay.push(new Message("Je ne compte plus les pièces qui sont coincées dessous.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	iaDistributeur.onUse = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Non merci, je n'ai pas faim, ni soif.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	hallC.addInteractiveArea(iaDistributeur);
	
	var iaDessousDistributeur = new InteractiveArea("iaDessousDistributeur","le dessous du distributeur", new Point(737, 292), 5);
	iaDessousDistributeur.getOrientation = function() { return "E"; }	
	iaDessousDistributeur.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Si seulement j'avais quelque chose d'assez fin pour aller là-dessous...", COLOR_JORIS, -1, -1, -1));
		game.messagesToDisplay.push(new Message("Je trouverais peut-être un trésor.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	hallC.addInteractiveArea(iaDessousDistributeur);
	
	var iaMeso = new InteractiveArea("iaMeso","le logo du Mésocentre de Calcul", new Point(289, 205), 20);
	iaMeso.getOrientation = function() { return "NE"; }
	iaMeso.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("L'ingénieur de recherche qui y travaille est une légende vivante.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	hallC.addInteractiveArea(iaMeso);

	var iaAmphiC = new InteractiveArea("iaAmphiC","l'entrée de l'amphi C", new Point(480, 200), 50);
	iaAmphiC.getOrientation = function() { return "W"; }
	iaAmphiC.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("L'amphi de tous les dangers.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	iaAmphiC.onUse = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Je n'ai rien à faire là dedans.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	hallC.addInteractiveArea(iaAmphiC);

	var iaDAF = new InteractiveArea("iaDAF","le défibrillateur", new Point(850, 180), 20);
	iaDAF.getOrientation = function() { return "E"; };
	iaDAF.getClosestPoint = function() { return new Point(770, 400, 1); };
	iaDAF.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Je me demande si c'est volontaire que le défibrillateur soit aussi proche de l'amphi.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}	
	iaDAF.onUse = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Je suis encore jeune. Je n'en ai pas besoin.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}	
	hallC.addInteractiveArea(iaDAF);


	// ---- Scene Salle café ---- //
	var salleCafe = new Scene("ch2-salle-cafe", "la salle café du labo d'info", canvas, "gamedata/images/2/salle-cafe.jpg");
	salleCafe.addCharacter("perso", new CharacterDisplay("perso", perso, meshSalleCafe(), new Point(512, 351, 1.2)), true);
	
	var objFG = new Item("frontGauche", "le front de Sylvester Stallone", "./gamedata/images/2/frontGauche-inScene.jpg", 618, 78, "./gamedata/images/2/frontGauche-inInventory.jpg");
	objFG.getOrientation = function() { return "NE"; }
	objFG.getClosestPoint = function() { return new Point(564, 447); }
	objFG.onLookAtInScene = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("C'est le front de Sylvester Stallone.", COLOR_JORIS, -1, -1, -1));
		game.messagesToDisplay.push(new Message("Il est à gauche sur l'image.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	objFG.onLookAtInInventory = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("C'est le front de Sylvester Stallone.", COLOR_JORIS, -1, -1, -1));
		game.messagesToDisplay.push(new Message("Il était à gauche sur l'image.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	objFG.getActionWord = function() { return "Prendre"; }
	objFG.onUse = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Je ne peux pas le prendre comme ça.", COLOR_JORIS, -1, -1, -1));
		game.messagesToDisplay.push(new Message("Il faudrait que je le découpe proprement.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	objFG.onUseWith = function(obj) {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Je ne peux pas utiliser cela avec l'image.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}

	salleCafe.addObject(objFG);
	game.allObjects["frontGauche"] = objFG;
	
	var iaFD = new InteractiveArea("frontDroite", "le front de Mr. T.", new Point(643, 83), 6);
	iaFD.getOrientation = objFG.getOrientation;
	iaFD.getClosestPoint = objFG.getClosestPoint;
	iaFD.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("C'est le front de Mr. T.", COLOR_JORIS, -1, -1, -1));
		game.messagesToDisplay.push(new Message("Il est à droite sur l'image.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	iaFD.getActionWord = function() { return "Prendre"; }
	iaFD.onUse = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Je ne peux pas le prendre comme ça.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	iaFD.onUseWith = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Je ne souhaite pas garder ce genre de souvenir.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	salleCafe.addInteractiveArea(iaFD); 
	
	
	var iaBouilloire = new InteractiveArea("iaBouilloire", "la bouilloire", new Point(750, 242), 20);
	iaBouilloire.getOrientation = function() { return "NW"; }
	iaBouilloire.getClosestPoint = function() { return new Point(875, 450); }
	iaBouilloire.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("C'est une bouilloire. Classique, mais efficace.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	iaBouilloire.onUse = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Je me ferais bien un thé, mais là j'ai à faire.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	salleCafe.addInteractiveArea(iaBouilloire);

	var iaNespresso = new InteractiveArea("iaNespresso", "la machine Nespresso&trade;", new Point(810, 220), 40);
	iaNespresso.getOrientation = function() { return "NW"; }
	iaNespresso.getClosestPoint = iaBouilloire.getClosestPoint;
	iaNespresso.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Comme dirait Georges : \"Quoi d'autre ?\"", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	iaNespresso.onUse = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Non, merci. Je ne bois pas de café.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();
	}
	salleCafe.addInteractiveArea(iaNespresso);

	var iaFrigo = new InteractiveArea("iaFrigo", "le réfrigérateur", new Point(1078, 200), 20);
	iaFrigo.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("C'est le réfrigérateur du labo.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();	
	}
	iaFrigo.getActionWord = function() { return "Ouvrir"; }
	iaFrigo.onUse = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Non, merci. J'ai lu cette blague de PhD comics.", COLOR_JORIS, -1, -1, -1));
		game.messagesToDisplay.push(new Message("Je ne souhaite pas me contaminer avec le contenu.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();	
	}
	salleCafe.addInteractiveArea(iaFrigo);

	var iaCongel = new InteractiveArea("iaCongel", "le congélateur", new Point(1089, 63), 30);
	iaCongel.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("C'est un congélateur, il doit bien y faire -18°C.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();	
	}
	iaCongel.getActionWord = function() { return "Ouvrir"; }
	iaCongel.onUse = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Si je l'ouvre pour rien, il va perdre son pouvoir réfrigérant.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();	
	}
	// TODO - onUseWith
	salleCafe.addInteractiveArea(iaCongel);
	
	var iaImprimante = new InteractiveArea("iaImprimante", "l'imprimante HP Laserjet 5200&trade;", new Point(298, 235), 60);
	iaImprimante.getClosestPoint = function() { return new Point(393, 492); }
	iaImprimante.getOrientation = function() { return "NW"; }
	iaImprimante.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Fiable et robuste. Un bon modèle.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();	
	}
	iaImprimante.onUse = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Je n'ai rien à imprimer.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();	
	}
	salleCafe.addInteractiveArea(iaImprimante);
	
	var iaMO = new InteractiveArea("iaMO", "le micro-ondes", new Point(75, 250), 75);
	iaMO.getOrientation = function() { return "NW"; }
	iaMO.onLookAt = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Ce micro-ondes sent étrangement le poisson.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();	
	}
	// TODO modifier onUse + ajouter onUseWith
	iaMO.onUse = function() {
		game.removeAllMessages();
		game.messagesToDisplay.push(new Message("Je ne vais pas le faire tourner à vide.", COLOR_JORIS, -1, -1, -1));
		game.displayMessages();	
	}
	salleCafe.addInteractiveArea(iaMO);
	
	game.addScene(salleCafe);


	// ---- Scene ENT ---- //
	var ent = new Scene("ch2-ent", "l'Espace Numérique de Travail", canvas, "gamedata/images/2/ent.jpg");
	ent.addCharacter("perso", new CharacterDisplay("perso", perso, meshENT(), new Point(1108, 437, 0.9)), true);
		
		
	game.addScene(ent);

}



meshChambre = function() { // TODO check

	var m = new Mesh();
	
	var p1 = new Point(90, 660, 1);
	var p2 = new Point(465, 610, 1);
	var p3 = new Point(771, 522, 0.8);
	var p4 = new Point(715, 650, 0.8);
	var p5 = new Point(1120, 660, 0.8);
	var p6 = new Point(1182, 585, 0.7);
	var p7 = new Point(580, 520, 0.8);
    
	m.addSegment(new Segment(p1, p2, 0.5));
	m.addSegment(new Segment(p2, p3, 0.5));
	m.addSegment(new Segment(p3, p4, 0.8));
	m.addSegment(new Segment(p4, p5, 0.8));
	m.addSegment(new Segment(p6, p7, 0.8));
	
	return m;
}


	