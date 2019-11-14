/* ---- 
DECLARATIONS DES VARIABLES
---- */
let $canvas = document.getElementById("canvas");
let ctx = $canvas.getContext("2d");
const W = canvas.width; // 567px
const H = canvas.height; // 700px
const w = 64;
const h = 70;
const $art = document.querySelector("#art");
const $btnStart = document.querySelector("#btn-start");
const $canvas = document.querySelector("#canvas");
const $gotOstGameover = document.querySelector(".got-ost-gameover");
const $gotOstMain = document.querySelector(".got-ost-main");
const $h1 = document.querySelector("h1");
const $ostGameover = document.querySelector(".ost-gameover");
const $ostMain = document.querySelector(".ost-main");
const $ostMove = document.querySelector(".ost-move");
const $ostWin = document.querySelector(".ost-win");
const $ranking = document.querySelector(".ranking");
const $txt = document.querySelector(".txt");
let modeGOT = false;
let frogger, leftObstacle, rightObstacle;
let ground1, ground2, ground4;
let grounds1, grounds2, grounds4;
let groundImgURL, groundImgURL2, groundImgURL4;
let froggerImgURL, fluidImgURL, downSideImgURL, topSideImgURL, lifeImgURL;
let rightObstacleImgURL, leftObstacleImgURL;
let leftObstacles, rightObstacles;
let lost, win, raf;
let frames = 0;
let ranking = [];
let rankingLine;
let fluid, downSide, topSide, sideroad, life;
let nbLives = 3;
let gameover = false;

/* ---- 
ACTIONS UTILISATEUR
---- */
// Clic sur bouton "START"
document.getElementById("btn-start").onclick = function() {
	if (modeGOT) {
		nbLives = 1;
	}
	if (gameover === true) {
		nbLives = modeGOT ? 1 : 3;
		gameover = false;
	}
	startGame();
};

// Clic sur bouton "CLASSEMENT"
document.getElementById("btn-ranking").onclick = function() {
	displayRanking();
};

// Actions sur les flèches directionnelles
document.onkeydown = function(e) {
	if (!frogger) return;

	console.log("keydown");
	switch (e.keyCode) {
		case 37:
			frogger.moveLeft();
			break;
		case 38:
			frogger.moveUp();
			break;
		case 39:
			frogger.moveRight();
			break;
		case 40:
			frogger.moveDown();
	}
	$ostMove.play();
};

/* ---- 
HELPER FUNCTIONS
---- */

// Fonction d'animation
function animLoop() {
	frames++;
	draw();

	// VICTOIRE
	if (win) {
		setTimeout(function() {
			let name = window.prompt("GG! Indiquer votre nom :");
			ranking.push({ nom: name, score: points });
			ranking.sort(comparer);
		}, 2000);
	}

	// 1 VIE EN MOINS
	if (lost && !gameover && !win) {
		$btnStart.innerHTML = "RETRY";
	}

	// NOMINAL
	if (!lost && !win && !gameover) {
		raf = requestAnimationFrame(animLoop);
		points++;
	}
}

// Fonction pour vérifier si la grenouille est dans l'eau
function checkLostIfDrown(person, lineHeight, objects) {
	if (person.y === lineHeight) {
		if (
			objects.length === 0 ||
			(objects.length !== 0 && objects.every(exclude))
		) {
			lost = true;
		}
	}
}

// Fonction pour vérifier si la grenouille a été percutée
function checkLostOnHit(objects, person) {
	for (object of objects) {
		if (object.hits(person)) {
			lost = true;
		}
	}
}

// Fonction utilisée pour le classement (car tri sur tableau d'objets avec attributs nom et score)
function comparer(a, b) {
	return a.score - b.score;
}

// Fonction pour modifier l'IHM en cas de gameover (modes normal et Konami)
function displayGameover() {
	$btnStart.innerHTML = "RESTART";
	if (modeGOT) {
		$txt.style.color = "skyblue";
		$txt.innerHTML = "V. Morghulis".toUpperCase();
		$gotOstMain.pause();
		$gotOstGameover.play();
	} else {
		$txt.style.color = "red";
		$txt.innerHTML = "Oh non...".toUpperCase();
		$ostMain.pause();
		$ostGameover.play();
	}
}

// Fonction pour modifier l'IHM en cas de perte d'une vie (mode normal seulement)
function displayLost() {
	if (!modeGOT) {
		$txt.style.color = "orange";
		$txt.innerHTML = "Essaie encore".toUpperCase();
		$ostMain.pause();
		$ostGameover.play();
	}
}

// Fonction d'affichage du classement (à la place de la grenouille en pixel art) (modes normal et Konami)
function displayRanking() {
	document.getElementById("art").style.display = "none";
	removeAllChildren($ranking);
	if (ranking.length === 0) {
		rankingLine = document.createElement("p");
		rankingLine.style.lineHeight = "2em";
		if (modeGOT) {
			rankingLine.style.color = "skyblue";
			rankingLine.innerHTML = "Des morts dans GoT. <br>Monnaie courante.";
		} else {
			rankingLine.style.color = "red";
			rankingLine.innerHTML =
				"Personne dans le classement. <br>Sois le premier !";
		}

		$ranking.appendChild(rankingLine);
	} else {
		ranking.map((el, i) => {
			rankingLine = document.createElement("p");
			rankingLine.innerHTML = `${i + 1} - ${el.nom.toUpperCase()} : ${
				el.score
			}`;
			$ranking.appendChild(rankingLine);
		});
	}
}

// Fonction d'affichage du score en haut du canvas
function displayScore() {
	ctx.font = "60px sans-serif";
	ctx.textAlign = "end";
	ctx.fillStyle = "white";
	ctx.fillText(points, 550, 55);
}

// Fonction d'affichage en cas de victoire (modes normal et Konami)
function displayWin() {
	if (modeGOT) {
		$txt.style.color = "skyblue";
		$txt.innerHTML = "Frog King".toUpperCase();
		$gotOstMain.pause();
	} else {
		$txt.style.color = "green";
		$txt.innerHTML = "Bravo !".toUpperCase();
		$ostMain.pause();
	}
	$ostWin.play();
}

// Fonction de dessin du canvas
function draw() {
	ctx.clearRect(0, 0, W, H);

	if (modeGOT) {
		drawPath("black", 0, H * 0.1, W, H * 0.3); // GROUND up
		drawPath("rgb(255,255,255)", 0, H * 0.5, W, H * 0.6); // ROUTE
		ctx.font = "70px Lalezar";
		ctx.textAlign = "center";
		ctx.fillStyle = "lightgray";
		ctx.fillText("You", W / 2, H * 0.6 - 10);
		ctx.fillText("know", W / 2, H * 0.7 - 10);
		ctx.fillText("nothing", W / 2, H * 0.8 - 10);
		ctx.fillText("Jon Snow", W / 2, H * 0.9 - 10);
	} else {
		sideroad.draw();
		drawPath("rgb(110,110,110)", 0, H * 0.5, W, H * 0.4); // ROUTE
		drawLine("white", 10, 0, H * 0.6, W, H * 0.6, [35, 50]); // LIGNE DE ROUTE 1
		drawLine("sandybrown", 10, 0, H * 0.7, W, H * 0.7, []); // LIGNE DE ROUTE 2
		drawLine("white", 10, 0, H * 0.8, W, H * 0.8, [35, 50]); // LIGNE DE ROUTE 3
	}
	fluid.draw(); // FLUIDE
	downSide.draw(); // RIVE BAS
	topSide.draw(); // RIVE HAUT

	for (let i = 0; i < nbLives; i++) {
		life.x = i * 70;
		life.draw();
	}

	// SUPPORTS
	// Ressources graphiques
	if (modeGOT) {
		groundImgURL = "img/got/rock.png";
		groundImgURL2 = "img/got/rock2.png";
		groundImgURL4 = "img/got/rock4.png";
	} else {
		groundImgURL = "img/lilypad.png";
		groundImgURL2 = "img/lilypad2.png";
		groundImgURL4 = "img/lilypad4.png";
	}

	// Affichage
	if (frames % 200 === 0) {
		ground1 = new Ground1(groundImgURL);
		grounds1.push(ground1);
	}

	if (frames % 150 === 0) {
		ground2 = new Ground2(groundImgURL2);
		grounds2.push(ground2);
	}

	if (frames % 100 === 0) {
		ground4 = new Ground4(groundImgURL4);
		grounds4.push(ground4);
	}

	updateLeftObjects(grounds1, W, 2);
	updateRightObjects(grounds2, -63 * 2, -3);
	updateLeftObjects(grounds4, W, 4);

	checkLostIfDrown(frogger, 0.1 * H, grounds1);
	checkLostIfDrown(frogger, 0.2 * H, grounds2);
	checkLostIfDrown(frogger, 0.3 * H, grounds4);

	// FROGGER
	frogger.draw();

	// OBSTACLES
	// Ressources graphiques
	// Affichage
	if (frames % 150 === 0) {
		if (modeGOT) {
			rightObstacleImgURL = "img/got/dragon_right.png";
			leftObstacleImgURL = "img/got/dragon_left.png";
		} else {
			rightObstacleImgURL = "img/truck_from_right.png";
			leftObstacleImgURL = "img/truck_from_left.png";
		}

		rightObstacle = new RightObstacle(0.5 * H, rightObstacleImgURL);
		leftObstacle = new LeftObstacle(0.8 * H, leftObstacleImgURL);

		rightObstacles.push(rightObstacle);
		leftObstacles.push(leftObstacle);
	}

	if (frames % 70 === 0) {
		if (modeGOT) {
			rightObstacleImgURL = "img/got/dragon_right.png";
			leftObstacleImgURL = "img/got/dragon_left.png";
		} else {
			rightObstacleImgURL = "img/car_from_right.png";
			leftObstacleImgURL = "img/car_from_left.png";
		}

		rightObstacle = new RightObstacle(0.6 * H, rightObstacleImgURL);
		leftObstacle = new LeftObstacle(0.7 * H, leftObstacleImgURL);

		rightObstacles.push(rightObstacle);
		leftObstacles.push(leftObstacle);
	}

	updateLeftObjects(leftObstacles, W, 5);
	updateRightObjects(rightObstacles, -141, -7);

	checkLostOnHit(leftObstacles, frogger);
	checkLostOnHit(rightObstacles, frogger);

	// RESULTAT
	if (frogger.y === 0 && !gameover) {
		win = true;
		displayWin();
	}

	if (lost) {
		displayLost();
		nbLives = Math.max(0, nbLives - 1);
	}

	if (nbLives === 0) {
		gameover = true;
	}

	if (gameover) {
		displayGameover();
	}

	// SCORE
	displayScore();
}

// Fonction générique de tracé de ligne
function drawLine(color, width, xFrom, yFrom, xTo, yTo, dashwidth = []) {
	ctx.beginPath();
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.setLineDash(dashwidth);
	ctx.moveTo(xFrom, yFrom);
	ctx.lineTo(xTo, yTo);
	ctx.stroke();
	ctx.closePath();
}

// Fonction générique de tracé de rectangle
function drawPath(color, x0, y0, width, height) {
	ctx.fillStyle = color;
	ctx.fillRect(x0, y0, width, height);
}

// Fonction pour vérifier qu'aucun support ne porte la grenouille
function exclude(support) {
	return support.excludes(frogger);
}

// Fonction générique pour supprimer tous les enfants d'une node
function removeAllChildren(node) {
	let child = node.lastElementChild;
	while (child) {
		node.removeChild(child);
		child = node.lastElementChild;
	}
}

// Fonction de lancement du jeu (activable par bouton ou touche entrée)
function startGame() {
	if (raf) {
		console.log("cancel RAF");
		cancelAnimationFrame(raf);
	}

	lost = false;
	win = false;
	points = 0;
	$txt.innerHTML = "";

	leftObstacles = [];
	rightObstacles = [];
	grounds1 = [];
	grounds2 = [];
	grounds4 = [];

	if (modeGOT) {
		froggerImgURL = "img/got/frog.png";
		fluidImgURL = "img/got/night_king.jpg";
		downSideImgURL = "img/got/ground.png";
		topSideImgURL = "img/got/ground.png";
		lifeImgURL = "img/got/daenerys.png";
	} else {
		froggerImgURL = "img/frogger.png";
		fluidImgURL = "img/water.png";
		downSideImgURL = "img/grass1.jpeg";
		topSideImgURL = "img/grass2.jpeg";
		sideroad = new Component(0, H * 0.9, W, H * 0.1, "img/sideroad.jpeg");
		lifeImgURL = "img/heart.png";
	}

	frogger = new Frogger(froggerImgURL);
	fluid = new Component(0, H * 0.1, W, H * 0.3, fluidImgURL);
	downSide = new Component(0, H * 0.4, W, H * 0.1, downSideImgURL);
	topSide = new Component(0, 0, W, H * 0.1, topSideImgURL);
	life = new Component(0, 0, 70, 70, lifeImgURL);

	raf = requestAnimationFrame(animLoop);
	if (modeGOT) {
		$gotOstMain.play();
	} else {
		$ostMain.play();
	}
}

// Fonction de mise à jour des objets et de la liste d'objets venant de *gauche*
function updateLeftObjects(objects, limit, vx) {
	objects.forEach(function(object) {
		if (object.x > limit) {
			objects = objects.filter(el => el !== object);
		}
		object.x += vx;
		object.draw();
	});
}

// Fonction de mise à jour des objets et de la liste d'objets venant de *droite*
function updateRightObjects(objects, limit, vx) {
	objects.forEach(function(object) {
		if (object.x < limit) {
			objects = objects.filter(el => el !== object);
		}
		object.x += vx;
		object.draw();
	});
}
