let $canvas = document.getElementById("canvas");
let ctx = $canvas.getContext("2d");
const W = canvas.width; // 567
const H = canvas.height; // 700
const w = 64;
const h = 70;
let frogger, carLeft, carRight, truckLeft, truckRight;
let lilypad;
let carsLeft, carsRight, trucksLeft, trucksRight;
let gameover, win, raf;
let frames = 0;
let ranking = [];
let rankingLine;

function draw() {
	ctx.clearRect(0, 0, W, H);
	/* ---- 
    BACKGROUND
    ---- */
	// Chaussée
	ctx.fillStyle = "rgb(151,151,151)";
	ctx.fillRect(0, H * 0.9, W, H * 0.1);
	// Route
	ctx.fillStyle = "rgb(110,110,110)";
	ctx.fillRect(0, H * 0.5, W, H * 0.4);
	// Mare 1
	ctx.fillStyle = "rgb(223,172,79)";
	ctx.fillRect(0, H * 0.4, W, H * 0.1);
	// Eau
	ctx.fillStyle = "rgb(17,167,254)";
	ctx.fillRect(0, H * 0.1, W, H * 0.3);
	// Mare 2
	ctx.fillStyle = "rgb(223,172,79)";
	ctx.fillRect(0, 0, W, H * 0.1);

	// Ligne de route 1 - dash
	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.strokeStyle = "white";
	ctx.setLineDash([35, 50]);
	ctx.moveTo(0, H * 0.6);
	ctx.lineTo(W, H * 0.6);
	ctx.stroke();
	ctx.closePath();

	// Ligne de route 2 - trait plein
	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.strokeStyle = "sandybrown";
	ctx.setLineDash([]);
	ctx.moveTo(0, H * 0.7);
	ctx.lineTo(W, H * 0.7);
	ctx.stroke();
	ctx.closePath();

	// Ligne de route 3 - dash
	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.strokeStyle = "white";
	ctx.setLineDash([35, 50]);
	ctx.moveTo(0, H * 0.8);
	ctx.lineTo(W, H * 0.8);
	ctx.stroke();
	ctx.closePath();

	// // Nénuphars
	// lilypad = document.querySelector("#lilypad");
	// // Ligne 1 - 3 d'affilée
	// ctx.drawImage(lilypad, 0, 0.3 * H);
	// ctx.drawImage(lilypad, lilypad.width, 0.3 * H);
	// ctx.drawImage(lilypad, 2 * lilypad.width, 0.3 * H);
	// // LIgne 2 - 2 d'affilée
	// ctx.drawImage(lilypad, 3 * lilypad.width, 0.2 * H);
	// ctx.drawImage(lilypad, 4 * lilypad.width, 0.2 * H);
	// // Ligne 3 - 1 sur 2
	// ctx.drawImage(lilypad, 2 * lilypad.width, 0.1 * H);
	// ctx.drawImage(lilypad, 4 * lilypad.width, 0.1 * H);
	// ctx.drawImage(lilypad, 6 * lilypad.width, 0.1 * H);

	// Frogger
	frogger.draw();

	// Animation
	// Voitures et camions venant de la gauche
	if (frames % 200 === 0) {
		truckRight = new TruckRight();
		trucksRight.push(truckRight);
	}

	if (frames % 100 === 0) {
		carRight = new CarRight();
		carsRight.push(carRight);
	}

	if (frames % 150 === 0) {
		truckLeft = new TruckLeft();
		trucksLeft.push(truckLeft);
	}

	if (frames % 50 === 0) {
		carLeft = new CarLeft();
		carsLeft.push(carLeft);
	}

	carsLeft.forEach(function(car) {
		if (car.x > W) {
			carsLeft = carsLeft.filter(el => el !== car);
		}
		car.x += 10;
		car.draw();
	});

	carsRight.forEach(function(car) {
		if (car.x < -153) {
			carsRight = carsRight.filter(el => el !== car);
		}
		car.x -= 10;
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
		truck.x -= 5;
		truck.draw();
	});

	for (obstacle of carsLeft) {
		if (obstacle.hits(frogger)) {
			console.log("crashed CL");
			gameover = true;
			// document.querySelector(".ost-main").pause()
			// document.querySelector(".ost-gameover").play()
		}
	}

	for (obstacle of carsRight) {
		if (obstacle.hits(frogger)) {
			console.log("crashed CR");
			gameover = true;
			// document.querySelector(".ost-main").pause()
			// document.querySelector(".ost-gameover").play()
		}
	}

	for (obstacle of trucksLeft) {
		if (obstacle.hits(frogger)) {
			console.log("crashed TL");
			gameover = true;
			// document.querySelector(".ost-main").pause()
			// document.querySelector(".ost-gameover").play()
		}
	}

	for (obstacle of trucksRight) {
		if (obstacle.hits(frogger)) {
			console.log("crashed TR");
			gameover = true;
			// document.querySelector(".ost-main").pause()
			// document.querySelector(".ost-gameover").play()
		}
	}

	if (frogger.y === 0 && !gameover) {
		win = true;
		// document.querySelector(".ost-main").pause()
		// document.querySelector(".ost-win").play()
	}

	// Points
	ctx.fillStyle = "black";
	ctx.font = "60px sans-serif";
	ctx.textAlign = "end";
	ctx.fillText(points, 550, 55);
}

/* ---- 
MAIN MOVES
---- */
document.onkeydown = function(e) {
	if (!frogger) return;

	console.log("keydown");
	switch (e.keyCode) {
		case 37:
			// left
			frogger.moveLeft();
			break;
		case 38:
			// up
			frogger.moveUp();
			break;
		case 39:
			//right
			frogger.moveRight();
			break;
		case 40:
			// down
			frogger.moveDown();
	}
};

function animLoop() {
	frames++;

	draw();

	if (gameover || win) {
		let name = window.prompt("Indiquer votre nom");
		ranking.push({ nom: name, score: points });
		ranking.sort(comparer);
		// console.log(ranking);
	}

	if (!gameover) {
		raf = requestAnimationFrame(animLoop);
		points++;
	}
}

function startGame() {
	if (raf) {
		cancelAnimationFrame(raf);
	}

	gameover = false;
	win = false;
	points = 0;

	frogger = new Frogger();
	carsLeft = [];
	carsRight = [];
	trucksLeft = [];
	trucksRight = [];

	raf = requestAnimationFrame(animLoop);
	// document.querySelector(".ost-main").play();
}

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

function comparer(a, b) {
	return b.score - a.score;
}

function removeAllChildren(node) {
	let child = node.lastElementChild;
	while (child) {
		node.removeChild(child);
		child = node.lastElementChild;
	}
}
