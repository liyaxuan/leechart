class Base {
	constructor({ data, x, y, width, height, render }) {
		this.data = data;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.render = render;

		this.onclick = function () {};
		this.onmousemove= function () {};
		this.onmouseover = function () {};
		this.onmouseout = function () {};
	}

	color(color) {
		this.color = color;
	}

	getShape() {
		let self = this;
		this.shapeArray = this.computeShape();
		this.shapeArray.forEach((shape, index) => {
			shape.addEventListener('click', function (context, x, y) {
				self.onclick(context, x, y, index);
			});

			shape.addEventListener('onmousemove', function (context, x, y) {
				self.onmousemove(context, x, y, index);
			});

			shape.addEventListener('mouseover', function (context, x, y) {
				self.onmouseover(context, x, y, index);
			});

			shape.addEventListener('mouseout', function (context, x, y) {
				self.onmouseout(context, x, y, index);
			});
		}, this);
		return this.shapeArray;
	}
}

export { Base }