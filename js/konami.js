/* -----
KONAMI CODE
----- */

// LISTENER
if (window.addEventListener) {
	var keys = [];
	const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Konami code

	window.addEventListener(
		"keydown",
		function(e) {
			keys.push(e.keyCode);
			if (containCode(keys, konami) && keys.length >= konami.length) {
				setKonamiMode();
			}
		},
		true
	);
}

// ACTIVATION DU KONAMI CODE
function setKonamiMode() {
	modeGOT = true; // Variable utilisée dans script.js

	// Styling
	document.querySelector("h1").innerHTML = "Game of Frogs".toUpperCase();
	document.querySelector("h1").style.color = "skyblue";
	[...document.querySelectorAll("strong")].map(
		el => (el.style.color = "skyblue")
	);
	document.querySelector("#art").style.border = "5px solid skyblue";
	document.querySelector("#canvas").style.border = "5px solid skyblue";
	changePixelColor("lightseagreen", "skyblue");
	changePixelColor("lightgreen", "skyblue");
	changePixelColor("sandybrown", "white");
	[...document.querySelectorAll("button")].map(el => el.classList.add("got"));
}

// Fonction de changement de pixel
function changePixelColor(oldColor, newColor) {
	[...document.querySelectorAll(`.${oldColor}`)].map(pixel => {
		pixel.classList.remove(oldColor);
		pixel.classList.add(newColor);
	});
}

// Fonction pour vérifier si l'utilisateur a tapé une combinaison de touches (entre autres le Konami code)
function containCode(keys, codeArr) {
	var firstIndex = keys.indexOf(codeArr[0]);
	let result = true;
	for (let i = firstIndex; i < firstIndex + codeArr.length; i++) {
		result = result && keys[i] === codeArr[i - firstIndex];
	}
	return result;
}
