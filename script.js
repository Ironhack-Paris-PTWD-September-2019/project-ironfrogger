/* ---- 
DECLARATIONS DES VARIABLES
---- */
let $canvas = document.getElementById("canvas");
let ctx = $canvas.getContext("2d");
const W = canvas.width; // 567
const H = canvas.height; // 700
const w = 64;
const h = 70;
let evilMode = false;
let frogger, leftObstacle, rightObstacle;
let ground1, ground2, ground4;
let grounds1, grounds2, grounds4;
let groundImgURL, groundImgURL2, groundImgURL4;
let froggerImgURL,
	fluidImgURL,
	downSideImgURL,
	topSideImgURL,
	sideroadImgURL,
	lifeImgURL;
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
document.getElementById("btn-start").onclick = function() {
	if (evilMode) {
		nbLives = 1;
	}
	if (gameover === true) {
		nbLives = evilMode ? 1 : 3;
		gameover = false;
	}
	startGame();
};

document.getElementById("btn-ranking").onclick = function() {
	displayRanking();
};

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
	document.querySelector(".ost-move").play();
};

/* ---- 
HELPER FUNCTIONS
---- */
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
		document.querySelector("#btn-start").innerHTML = "RETRY";
	}

	// NOMINAL
	if (!lost && !win && !gameover) {
		raf = requestAnimationFrame(animLoop);
		points++;
	}
}

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

function checkLostOnHit(objects, person) {
	for (object of objects) {
		if (object.hits(person)) {
			lost = true;
		}
	}
}

function comparer(a, b) {
	return a.score - b.score;
}

function displayGameover() {
	document.querySelector(".txt").style.color = "red";
	document.querySelector(".txt").innerHTML = "QQN D'AUTRE".toUpperCase();
	document.querySelector("#btn-start").innerHTML = "RESTART";
	document.querySelector(".ost-main").pause();
	document.querySelector(".ost-gameover").play();
}

function displayLost() {
	if (evilMode) {
		document.querySelector(".txt").style.color = "red";
		document.querySelector(".txt").innerHTML = "V. Morghulis".toUpperCase();
	} else {
		document.querySelector(".txt").style.color = "orange";
		document.querySelector(
			".txt"
		).innerHTML = "Essaie encore".toUpperCase();
	}
	document.querySelector(".ost-main").pause();
	document.querySelector(".ost-gameover").play();
}

function displayRanking() {
	document.getElementById("art").style.display = "none";
	removeAllChildren(document.querySelector(".ranking"));
	if (ranking.length === 0) {
		rankingLine = document.createElement("p");
		rankingLine.style.color = "red";
		rankingLine.style.lineHeight = "2em";
		if (evilMode) {
			rankingLine.innerHTML = "Tous sont morts. <br>Bien fait.";
		} else {
			rankingLine.innerHTML =
				"Personne dans le classement. <br>Sois le premier !";
		}

		document.querySelector(".ranking").appendChild(rankingLine);
	} else {
		ranking.map((el, i) => {
			rankingLine = document.createElement("p");
			rankingLine.innerHTML = `${i + 1} - ${el.nom.toUpperCase()} : ${
				el.score
			}`;
			document.querySelector(".ranking").appendChild(rankingLine);
		});
	}
}

function displayScore() {
	ctx.font = "60px sans-serif";
	ctx.textAlign = "end";
	if (evilMode) {
		ctx.fillStyle = "red";
	} else {
		ctx.fillStyle = "white";
	}
	ctx.fillText(points, 550, 55);
}

function displayWin() {
	if (evilMode) {
		document.querySelector(".txt").style.color = "red";
		document.querySelector(".txt").innerHTML = "Hellking!".toUpperCase();
	} else {
		document.querySelector(".txt").style.color = "green";
		document.querySelector(".txt").innerHTML = "Bravo !".toUpperCase();
	}
	document.querySelector(".ost-main").pause();
	document.querySelector(".ost-win").play();
}

function draw() {
	ctx.clearRect(0, 0, W, H);

	sideroad.draw();
	if (evilMode) {
		drawPath("rgb(0,0,0)", 0, H * 0.5, W, H * 0.4); // ROUTE
		ctx.font = "70px Lalezar";
		ctx.textAlign = "center";
		ctx.fillStyle = "#404040";
		ctx.fillText("HIGHWAY", W / 2, H * 0.6 - 10);
		ctx.fillText("TO", W / 2, H * 0.7 - 10);
		ctx.fillText("HELL", W / 2, H * 0.8 - 10);
		ctx.fillText("ROAD 666", W / 2, H * 0.9 - 10);
	} else {
		drawPath("rgb(110,110,110)", 0, H * 0.5, W, H * 0.4); // ROUTE
	}

	downSide.draw(); // RIVE BAS
	fluid.draw(); // FLUIDE
	topSide.draw(); // RIVE HAUT
	if (!evilMode) {
		drawLine("white", 10, 0, H * 0.6, W, H * 0.6, [35, 50]); // LIGNE DE ROUTE 1
		drawLine("sandybrown", 10, 0, H * 0.7, W, H * 0.7, []); // LIGNE DE ROUTE 2
		drawLine("white", 10, 0, H * 0.8, W, H * 0.8, [35, 50]); // LIGNE DE ROUTE 3
	}

	for (let i = 0; i < nbLives; i++) {
		life.x = i * 70;
		life.draw();
	}

	// SUPPORTS
	if (evilMode) {
		groundImgURL = "img/evil/rock.png";
		groundImgURL2 = "img/evil/rock2.png";
		groundImgURL4 = "img/evil/rock4.png";
	} else {
		groundImgURL = "img/lilypad.png";
		groundImgURL2 = "img/lilypad2.png";
		groundImgURL4 = "img/lilypad4.png";
	}

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
	if (frames % 150 === 0) {
		if (evilMode) {
			rightObstacleImgURL = "img/evil/nyancat_right.png";
			leftObstacleImgURL = "img/evil/nyancat_left.png";
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
		if (evilMode) {
			rightObstacleImgURL = "img/evil/nyancat_right.png";
			leftObstacleImgURL = "img/evil/nyancat_left.png";
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

function drawPath(color, x0, y0, width, height) {
	ctx.fillStyle = color;
	ctx.fillRect(x0, y0, width, height);
}

function exclude(currentLilypad) {
	return currentLilypad.excludes(frogger);
}

function removeAllChildren(node) {
	let child = node.lastElementChild;
	while (child) {
		node.removeChild(child);
		child = node.lastElementChild;
	}
}

function startGame() {
	if (raf) {
		console.log("cancel RAF");
		cancelAnimationFrame(raf);
	}

	lost = false;
	win = false;
	points = 0;
	document.querySelector(".txt").innerHTML = "";

	leftObstacles = [];
	rightObstacles = [];
	grounds1 = [];
	grounds2 = [];
	grounds4 = [];

	if (evilMode) {
		froggerImgURL = "img/evil/frog.png";
		fluidImgURL = "img/evil/lava.png";
		downSideImgURL = "img/evil/ground2.png";
		topSideImgURL = "img/evil/ground1.png";
		sideroadImgURL = "img/evil/ground1.png";
		lifeImgURL = "img/evil/skull.png";
	} else {
		froggerImgURL = "img/frogger.png";
		fluidImgURL = "img/water.png";
		downSideImgURL = "img/grass1.jpeg";
		topSideImgURL = "img/grass2.jpeg";
		sideroadImgURL = "img/sideroad.jpeg";
		lifeImgURL = "img/heart.png";
	}

	frogger = new Frogger(froggerImgURL);
	fluid = new Component(0, H * 0.1, W, H * 0.3, fluidImgURL);
	downSide = new Component(0, H * 0.4, W, H * 0.1, downSideImgURL);
	topSide = new Component(0, 0, W, H * 0.1, topSideImgURL);
	sideroad = new Component(0, H * 0.9, W, H * 0.1, sideroadImgURL);
	life = new Component(0, 0, 70, 70, lifeImgURL);

	raf = requestAnimationFrame(animLoop);
	document.querySelector(".ost-main").play();
}

function updateLeftObjects(objects, limit, vx) {
	objects.forEach(function(object) {
		if (object.x > limit) {
			objects = objects.filter(el => el !== object);
		}
		object.x += vx;
		object.draw();
	});
}

function updateRightObjects(objects, limit, vx) {
	objects.forEach(function(object) {
		if (object.x < limit) {
			objects = objects.filter(el => el !== object);
		}
		object.x += vx;
		object.draw();
	});
}
