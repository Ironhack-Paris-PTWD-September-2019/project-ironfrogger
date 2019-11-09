/* ---- 
DECLARATIONS DES VARIABLES
---- */
let $canvas = document.getElementById("canvas");
let ctx = $canvas.getContext("2d");
const W = canvas.width; // 567
const H = canvas.height; // 700
const w = 64;
const h = 70;
let frogger, carLeft, carRight, truckLeft, truckRight;
let lilypad1, lilypad2, lilypad4;
let lilypads1, lilypads2, lilypads4;
let carsLeft, carsRight, trucksLeft, trucksRight;
let lost, win, raf;
let frames = 0;
let ranking = [];
let rankingLine;
let water, grass1, grass2, sideroad, heart;
let nbLives = 3;
let gameover = false;

/* ---- 
ACTIONS UTILISATEUR
---- */
document.getElementById("btn-start").onclick = function() {
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
		}, 4000);
	}

	// 1 VIE EN MOINS
	if (lost && !gameover && !win) {
		document.querySelector("#btn-start").innerHTML = "RETRY";
	}

	if (!lost && !win && !gameover) {
		// NOMINAL
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
	document.querySelector(".txt").innerHTML = "Laisse tomber".toUpperCase();
	document.querySelector("#btn-start").classList.add("disabled");
	[...document.querySelectorAll(".eye")].map(
		eye => (eye.style.backgroundColor = "red")
	);

	document.querySelector("#btn-start").disabled = true;
	document.querySelector(".ost-main").pause();
	document.querySelector(".ost-gameover").play();
}

function displayLost() {
	document.querySelector(".txt").style.color = "orange";
	document.querySelector(".txt").innerHTML = "Essaie encore".toUpperCase();
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
		rankingLine.innerHTML =
			"Personne dans le classement. <br>Sois le premier !";
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
	ctx.fillStyle = "white";
	ctx.font = "60px sans-serif";
	ctx.textAlign = "end";
	ctx.fillText(points, 550, 55);
}

function displayWin() {
	document.querySelector(".txt").style.color = "green";
	document.querySelector(".txt").innerHTML = "Bravo !".toUpperCase();
	document.querySelector(".ost-main").pause();
	document.querySelector(".ost-win").play();
}

function draw() {
	ctx.clearRect(0, 0, W, H);

	sideroad.draw();
	drawPath("rgb(110,110,110)", 0, H * 0.5, W, H * 0.4); // ROUTE
	grass1.draw(); // RIVE BAS
	water.draw(); // EAU
	grass2.draw(); // RIVE HAUT
	drawLine("white", 10, 0, H * 0.6, W, H * 0.6, [35, 50]); // LIGNE DE ROUTE 1
	drawLine("sandybrown", 10, 0, H * 0.7, W, H * 0.7, []); // LIGNE DE ROUTE 2
	drawLine("white", 10, 0, H * 0.8, W, H * 0.8, [35, 50]); // LIGNE DE ROUTE 3

	for (let i = 0; i < nbLives; i++) {
		heart.x = i * 70;
		heart.draw();
	}

	// NENUPHARS
	if (frames % 200 === 0) {
		lilypad1 = new Lilypad();
		lilypads1.push(lilypad1);
	}

	if (frames % 150 === 0) {
		lilypad2 = new Lilypad2();
		lilypads2.push(lilypad2);
	}

	if (frames % 100 === 0) {
		lilypad4 = new Lilypad4();
		lilypads4.push(lilypad4);
	}

	updateLeftObjects(lilypads1, W, 2);
	updateRightObjects(lilypads2, -63 * 2, -3);
	updateLeftObjects(lilypads4, W, 4);

	checkLostIfDrown(frogger, 0.1 * H, lilypads1);
	checkLostIfDrown(frogger, 0.2 * H, lilypads2);
	checkLostIfDrown(frogger, 0.3 * H, lilypads4);

	// FROGGER
	frogger.draw();

	// VOITURES ET CAMIONS
	if (frames % 150 === 0) {
		truckRight = new TruckRight();
		trucksRight.push(truckRight);
		truckLeft = new TruckLeft();
		trucksLeft.push(truckLeft);
	}

	if (frames % 70 === 0) {
		carRight = new CarRight();
		carsRight.push(carRight);
		carLeft = new CarLeft();
		carsLeft.push(carLeft);
	}

	updateLeftObjects(carsLeft, W, 8);
	updateRightObjects(carsRight, -153, -7);
	updateLeftObjects(trucksLeft, W, 5);
	updateRightObjects(trucksRight, -141, -7);

	checkLostOnHit(carsLeft, frogger);
	checkLostOnHit(carsRight, frogger);
	checkLostOnHit(trucksLeft, frogger);
	checkLostOnHit(trucksRight, frogger);

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
	ctx.clearRect(0, 0, W, H);
	if (raf) {
		cancelAnimationFrame(raf);
	}

	lost = false;
	win = false;
	points = 0;
	document.querySelector(".txt").innerHTML = "";
	frogger = new Frogger();
	carsLeft = [];
	carsRight = [];
	trucksLeft = [];
	trucksRight = [];
	lilypads1 = [];
	lilypads2 = [];
	lilypads4 = [];
	water = new Component(0, H * 0.1, W, H * 0.3, "img/water.png");
	grass1 = new Component(0, H * 0.4, W, H * 0.1, "img/grass1.jpeg");
	grass2 = new Component(0, 0, W, H * 0.1, "img/grass2.jpeg");
	sideroad = new Component(0, H * 0.9, W, H * 0.1, "img/sideroad.jpeg");
	heart = new Component(0, 0, 70, 70, "img/heart.png");

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
