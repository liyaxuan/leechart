class Shape {
	constructor({ type, style, renderType = 'fill', groupId, zIndex = 0, isAnimation = false }) {
		this.type = type;

		this.style = style;
		this.renderType = renderType;
		this.groupId = groupId;
		this.zIndex = zIndex;

		this.eventTypes = ['click', 'mousemove', 'mouseover', 'mouseout'];
		this.onclick = [];
		this.onmousemove = [];
		this.onmouseover = [];
		this.onmouseout = [];
		
		this._render = null;
		this.isAnimation = isAnimation;
	}

	setRender(render) {
		this._render = render;
		this.startAnimation();
	}

	startAnimation() {
		if(!this.isAnimation || !this.animate)
			return;

		let currentTime = 0;
		let duration = 1000;
		let timer = setInterval((function () {
			if(currentTime >= duration)
				clearInterval(timer);

			this.animate(currentTime, duration);

			this._render.requestRender();
			currentTime += 1000/60;
		}).bind(this), 1000/60);
	}

	addEventListener(eventType, callback) {
		if(this.eventTypes.join(', ').indexOf(eventType) === -1)
			return;
		else
			this['on' + eventType].push(callback.bind(this));
	}

	removeEventListener(eventType, callback) {
		if(this.eventTypes.join(', ').indexOf(eventType) === -1)
			return;
		else {
			let eventQueue = this['on' + eventType];
			let isFound = false;
			for(let i = 0; i < eventQueue.length; i++) {
				if(eventQueue[i] === callback || isFound) {
					eventQueue[i] = eventQueue[i + 1];
					isFound = true;
				}
			}
			if(isFound)
				eventQueue.pop();
		}
	}

	render(context) {
		context.save();
		for(let attr in this.style)
			context[attr] = this.style[attr];
		this.buildPath && this.buildPath(context);
		
		if(this.renderType === 'fillstroke') {
			context.fill();
			context.stroke();
		}
		else
			context[this.renderType]();
		context.restore();
	}
}

export { Shape }