if (window.addEventListener) {
	var keys = [];
	// konami = "38,38,40,40,37,39,37,39,66,65";
	const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

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

function setKonamiMode() {
	modeGOT = true;

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

	// Game
}

function changePixelColor(oldColor, newColor) {
	[...document.querySelectorAll(`.${oldColor}`)].map(pixel => {
		pixel.classList.remove(oldColor);
		pixel.classList.add(newColor);
	});
}

function containCode(keys, codeArr) {
	var firstIndex = keys.indexOf(codeArr[0]);
	let result = true;
	for (let i = firstIndex; i < firstIndex + codeArr.length; i++) {
		result = result && keys[i] === codeArr[i - firstIndex];
	}
	return result;
}
