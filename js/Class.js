// CLASSE
// Générique
class Component {
	constructor(x, y, w, h, src) {
		const img = document.createElement("img");
		img.onload = () => {
			this.img = img;

			this.w = w;
			this.h = h;

			this.x = x;
			this.y = y;
		};
		img.src = src;
	}

	draw() {
		if (!this.img) return; // if `this.img` is not loaded yet => don't draw
		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
	}
}

// SOUS-CLASSES LVL1
// Personnage
class Frogger extends Component {
	constructor(address) {
		super(63 * 1, H * 0.9, 63, 70, address);
	}
	moveLeft() {
		if (this.x > 0) {
			this.x -= this.w;
		}
	}
	moveRight() {
		if (this.x < W - w) {
			this.x += this.w;
		}
	}
	moveUp() {
		if (this.y > 0) {
			this.y -= this.h;
		}
	}
	moveDown() {
		if (this.y < H - h) {
			this.y += this.h;
		}
	}
}

// Support
class Ground extends Component {
	constructor(x, y, w, h, address) {
		super(x, y, w, h, address);
	}

	excludes(person) {
		return this.x > person.x + person.w || person.x > this.x + this.w;
	}
}

// Obstacle
class Obstacle extends Component {
	constructor(x, y, w, h, address) {
		super(x, y, w, h, address);
	}

	hits(person) {
		return (
			!(person.x + person.w < this.x || person.x > this.x + this.w) &&
			Math.round(this.y) === person.y
		);
	}
}

// SOUS-CLASSES LVL2
// Support x1
class Ground1 extends Ground {
	constructor(address) {
		super(-63, 0.1 * H, 63, 70, address);
	}
}

// Support x2
class Ground2 extends Ground {
	constructor(address) {
		super(W, 0.2 * H, 63 * 2, 70, address);
	}
}

// Support x4
class Ground4 extends Ground {
	constructor(address) {
		super(-63 * 4, 0.3 * H, 63 * 4, 70, address);
	}
}

// Obstacle venant de gauche
class LeftObstacle extends Obstacle {
	constructor(y, address) {
		super(-141, y, 141, 70, address);
	}
}

// Onstacle venant de droite
class RightObstacle extends Obstacle {
	constructor(y, address) {
		super(W, y, 141, 70, address);
	}
}
