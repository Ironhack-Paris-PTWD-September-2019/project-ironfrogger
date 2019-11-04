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

class CarLeft extends Component {
	constructor() {
		super(-153, 0.7 * H, 153, 70, "img/car_from_left.png");
	}

	hits(person) {
		return (
			!(person.x + person.w < this.x || person.x > this.x + this.w) &&
			Math.round(this.y) === person.y
		);
	}
}

class CarRight extends Component {
	constructor() {
		super(W, 0.6 * H, 153, 70, "img/car_from_right.png");
	}

	hits(person) {
		return (
			!(person.x + person.w < this.x || person.x > this.x + this.w) &&
			Math.round(this.y) === person.y
		);
	}
}

class Frogger extends Component {
	constructor() {
		super(63 * 3, H * 0.9, 63, 70, "img/frogger.png");
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

class Lilypad extends Component {
	constructor() {
		super(-63, 0.1 * H, 63, 70, "img/lilypad.png");
	}

	excludes(person) {
		return (
			person.x + person.w < this.x &&
			person.x > this.x + this.w &&
			Math.round(this.y) === person.y
		);
	}
}

class Lilypad2 extends Component {
	constructor() {
		super(W, 0.2 * H, 63 * 2, 70, "img/lilypad2.png");
	}

	excludes(person) {
		return (
			person.x + person.w < this.x &&
			person.x > this.x + this.w &&
			Math.round(this.y) === person.y
		);
	}
}

class Lilypad4 extends Component {
	constructor() {
		super(-63 * 4, 0.3 * H, 63 * 4, 70, "img/lilypad4.png");
	}

	excludes(person) {
		return (
			person.x + person.w < this.x &&
			person.x > this.x + this.w &&
			Math.round(this.y) === person.y
		);
	}
}

class TruckLeft extends Component {
	constructor() {
		super(-141, 0.8 * H, 141, 70, "img/truck_from_left.png");
	}

	hits(person) {
		return (
			!(person.x + person.w < this.x || person.x > this.x + this.w) &&
			Math.round(this.y) === person.y
		);
	}
}

class TruckRight extends Component {
	constructor() {
		super(W, 0.5 * H, 141, 70, "img/truck_from_right.png");
	}

	hits(person) {
		return (
			!(person.x + person.w < this.x || person.x > this.x + this.w) &&
			Math.round(this.y) === person.y
		);
	}
}
