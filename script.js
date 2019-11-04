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
let gameover, win, raf;
let frames = 0;
let ranking = [];
let rankingLine;

/* ---- 
ACTIONS UTILISATEUR
---- */
document.getElementById("btn-start").onclick = function() {
	startGame();
};

document.getElementById("btn-ranking").onclick = function() {
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
};

/* ---- 
HELPER FUNCTIONS
---- */
function animLoop() {
	frames++;
	draw();

	// EN CAS DE VICTOIRE
	if (win) {
		let name = window.prompt("GG! Indiquer votre nom :");
		ranking.push({ nom: name, score: points });
		ranking.sort(comparer);
		// console.log(ranking);
	}

	// CAS NOMINAL
	if (!gameover && !win) {
		raf = requestAnimationFrame(animLoop);
		points++;
	}
}

function comparer(a, b) {
	return a.score - b.score;
}

function draw() {
	ctx.clearRect(0, 0, W, H);

	// CHAUSSEE DEPART
	ctx.fillStyle = "rgb(151,151,151)";
	ctx.fillRect(0, H * 0.9, W, H * 0.1);
	// ROUTE
	ctx.fillStyle = "rgb(110,110,110)";
	ctx.fillRect(0, H * 0.5, W, H * 0.4);
	// RIVE BAS
	ctx.fillStyle = "rgb(223,172,79)";
	ctx.fillRect(0, H * 0.4, W, H * 0.1);
	// EAU
	ctx.fillStyle = "rgb(17,167,254)";
	ctx.fillRect(0, H * 0.1, W, H * 0.3);
	// RIVE HAUT
	ctx.fillStyle = "rgb(223,172,79)";
	ctx.fillRect(0, 0, W, H * 0.1);

	// LIGNE DE ROUTE 1
	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.strokeStyle = "white";
	ctx.setLineDash([35, 50]);
	ctx.moveTo(0, H * 0.6);
	ctx.lineTo(W, H * 0.6);
	ctx.stroke();
	ctx.closePath();

	// LIGNE DE ROUTE 2
	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.strokeStyle = "sandybrown";
	ctx.setLineDash([]);
	ctx.moveTo(0, H * 0.7);
	ctx.lineTo(W, H * 0.7);
	ctx.stroke();
	ctx.closePath();

	// LIGNE DE ROUTE 3
	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.strokeStyle = "white";
	ctx.setLineDash([35, 50]);
	ctx.moveTo(0, H * 0.8);
	ctx.lineTo(W, H * 0.8);
	ctx.stroke();
	ctx.closePath();

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

	lilypads1.forEach(function(lilypad) {
		if (lilypad.x > W) {
			lilypads1 = lilypads1.filter(el => el !== lilypad);
		}
		lilypad.x += 2;
		lilypad.draw();
	});

	lilypads2.forEach(function(lilypad) {
		if (lilypad.x < -63) {
			lilypads2 = lilypads2.filter(el => el !== lilypad);
		}
		lilypad.x -= 1;
		lilypad.draw();
	});

	lilypads4.forEach(function(lilypad) {
		if (lilypad.x > W) {
			lilypads4 = lilypads4.filter(el => el !== lilypad);
		}
		lilypad.x += 3;
		lilypad.draw();
	});

	// NON SUPPORT DES NENUPHARS
	for (lilypad of lilypads1) {
		if (lilypad.excludes(frogger)) {
			console.log("drowned L1");
			gameover = true;
		}
	}

	for (lilypad of lilypads2) {
		if (lilypad.excludes(frogger)) {
			console.log("drowned L2");
			gameover = true;
		}
	}

	for (lilypad of lilypads4) {
		if (lilypad.excludes(frogger)) {
			console.log("drowned L4");
			gameover = true;
		}
	}

	// FROGGER
	frogger.draw();

	// VOITURES ET CAMIONS
	if (frames % 200 === 0) {
		truckRight = new TruckRight();
		trucksRight.push(truckRight);
	}

	if (frames % 200 === 0) {
		carRight = new CarRight();
		carsRight.push(carRight);
		carLeft = new CarLeft();
		carsLeft.push(carLeft);
	}

	if (frames % 150 === 0) {
		truckLeft = new TruckLeft();
		trucksLeft.push(truckLeft);
	}

	carsLeft.forEach(function(car) {
		if (car.x > W) {
			carsLeft = carsLeft.filter(el => el !== car);
		}
		car.x += 3;
		car.draw();
	});

	carsRight.forEach(function(car) {
		if (car.x < -153) {
			carsRight = carsRight.filter(el => el !== car);
		}
		car.x -= 5;
		car.draw();
	});

	trucksLeft.forEach(function(truck) {
		if (truck.x > W) {
			trucksLeft = trucksLeft.filter(el => el !== truck);
		}
		truck.x += 5;
		truck.draw();
	});

	trucksRight.forEach(function(truck) {
		if (truck.x < -141) {
			trucksRight = trucksRight.filter(el => el !== truck);
		}
		truck.x -= 7;
		truck.draw();
	});

	// COLLISIONS VOITURES ET CAMIONS
	for (obstacle of carsLeft) {
		if (obstacle.hits(frogger)) {
			console.log("crashed CL");
			gameover = true;
		}
	}

	for (obstacle of carsRight) {
		if (obstacle.hits(frogger)) {
			console.log("crashed CR");
			gameover = true;
		}
	}

	for (obstacle of trucksLeft) {
		if (obstacle.hits(frogger)) {
			console.log("crashed TL");
			gameover = true;
		}
	}

	for (obstacle of trucksRight) {
		if (obstacle.hits(frogger)) {
			console.log("crashed TR");
			gameover = true;
		}
	}

	// RESULTAT
	if (frogger.y === 0 && !gameover) {
		win = true;
		document.querySelector(".txt").style.color = "green";
		document.querySelector(".txt").innerHTML = "Bravo !".toUpperCase();
		document.querySelector(".ost-main").pause();
		document.querySelector(".ost-win").play();
	}

	if (gameover) {
		document.querySelector(".txt").style.color = "red";
		document.querySelector(
			".txt"
		).innerHTML = "Essaie encore".toUpperCase();
		document.querySelector(".ost-main").pause();
		document.querySelector(".ost-gameover").play();
	}

	// POINTS
	ctx.fillStyle = "black";
	ctx.font = "60px sans-serif";
	ctx.textAlign = "end";
	ctx.fillText(points, 550, 55);
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
		cancelAnimationFrame(raf);
	}

	gameover = false;
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

	raf = requestAnimationFrame(animLoop);
	document.querySelector(".ost-main").play();
}
