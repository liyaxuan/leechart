import animation from '../util/easing';

class Shape {
	constructor({ type, style, renderType = 'fill', groupId, zIndex = 0, isDisplay = true }) {
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
		
		this.isDisplay = true;

		this.animationArray = [];

		this._render = null;
	}

	setRender(render) {
		this._render = render;
	}

	show() {
		if(!this.isDisplay) {
			this.isDisplay = true;
			this._render.requestRender();
		}
	}

	hide() {
		if(this.isDisplay) {
			this.isDisplay = false;
			this._render.requestRender();
		}
	}

	init(config) {
		for(let attr in config) {
			this[attr] = config[attr];
		}
		return this;	
	}

	when(duration, config, callback = function () {}) {
		this.animationArray.push({ duration, config, callback });
		return this;
	}

	run({ duration, config }) {
		function toEnd(current, begin, end) {
			return end > begin ? Math.min(current, end) : Math.max(current, end);	
		}

		let attrArray = [];
		for(let attr in config) {
			let begin = this[attr];
			let end = config[attr];
			attrArray.push({ attr, begin, end });
		}

		let currentTime = 0;
		let func = animation.easeInOutQuad;

		return new Promise((function (resolve) {
			let timer = setInterval((function () {
				if(currentTime > duration) {
					clearInterval(timer);		
					attrArray.forEach(({ attr, begin, end }) => {
						if(Array.isArray(begin) && Array.isArray(end)) {
							this[attr] = end.map(({ x, y }) => {
								return { x, y }
							});
						}
						else
							this[attr] = end;
					});
					this._render.requestRender();
					resolve();
					return;
				}
					
				attrArray.forEach(({ attr, begin, end }) => {
					if(Array.isArray(begin) && Array.isArray(end)) {
						let current = begin.map((item, index) => {

							let x = func(null, currentTime, item.x, end[index].x - item.x, duration);
							let y = func(null, currentTime, item.y, end[index].y - item.y, duration);

							x = toEnd(x, item.x, end[index].x);
							y = toEnd(y, item.y, end[index].y);

							return { x, y };
						});

						this[attr] = current;
					}
					/* 单值 x y width height r */
					else {
						let current = func(null, currentTime, begin, end - begin, duration);
						this[attr] = toEnd(current, begin, end);					
					}	
				}, this);

				this._render.requestRender();
				currentTime += 1000/60;
			}).bind(this), 1000/60);
		}).bind(this)); 
	}

	start() {
		let self = this;
		return this.animationArray.reduce((pre, cur) => {
			return pre.then(() => self.run(cur));
		}, Promise.resolve());
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

	isPointIn(context, x, y) {
		context.beginPath();
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}

	render(context) {
		if(!this.isDisplay)
			return;

		context.save();
		context.beginPath();
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