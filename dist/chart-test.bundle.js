/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Shape; });
class Shape {
	constructor({ type, style, renderType = 'fill', groupId, zIndex = 0, isAnimation = false, isDisplay = true }) {
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
		this.isAnimation = isAnimation;

		this._render = null;
	}

	setRender(render) {
		this._render = render;
		this.startAnimation();
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
		if(!this.isDisplay)
			return;

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



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return max; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return min; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return sum; });
/* unused harmony export range */
/* unused harmony export nice */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return linearTick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getTextBoundingRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return uuid; });
function max(array) {
	return Math.max.apply({}, array);
}

function min(array) {
	return Math.min.apply({}, array);
}

function sum(array) {
	return array.reduce((pre, cur) => pre + cur, 0);
}

function range(array) {
	return max(array) - min(array);
}

function almostEquals(x, y, epsilon) {
	return Math.abs(x - y) < epsilon;
}

function nice(range, round) {
	var exponent = Math.floor(Math.log10(range));
	var fraction = range / Math.pow(10, exponent);
	var niceFraction;

	if (round) {
		if (fraction < 1.5) {
			niceFraction = 1;
		} else if (fraction < 3) {
			niceFraction = 2;
		} else if (fraction < 7) {
			niceFraction = 5;
		} else {
			niceFraction = 10;
		}
	} else if (fraction <= 1.0) {
		niceFraction = 1;
	} else if (fraction <= 2) {
		niceFraction = 2;
	} else if (fraction <= 5) {
		niceFraction = 5;
	} else {
		niceFraction = 10;
	}

	return niceFraction * Math.pow(10, exponent);
}

function linearTick(min, max) {
	var ticks = [];
	// To get a "nice" value for the tick spacing, we will use the appropriately named
	// "nice number" algorithm. See http://stackoverflow.com/questions/8506881/nice-label-algorithm-for-charts-with-minimum-ticks
	// for details.
	var niceRange = nice(max - min, false);
	var spacing = nice(niceRange / (11 - 1), true);

	var niceMin = Math.floor(min / spacing) * spacing;
	var niceMax = Math.ceil(max / spacing) * spacing;

	var numSpaces = (niceMax - niceMin) / spacing;
	if (almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
		numSpaces = Math.round(numSpaces);
	} else {
		numSpaces = Math.ceil(numSpaces);
	}
	// Put the values into the ticks array
	ticks.push(niceMin);
	for (var j = 1; j < numSpaces; ++j) {
		ticks.push(niceMin + (j * spacing));
	}
	ticks.push(niceMax);

	return ticks;
}

function getTextBoundingRect({ context, x = 0, y = 0, text, rotate, fontSize, textAlign, textBaseline }) {
		let rectX = 0;
		let rectY = 0;
		let rectWidth = context.measureText(text).width;
		let rectHeight = fontSize;

		switch (textAlign) {
			case 'left':
				rectX = x;
				break;
			case 'center':
				rectX = x - rectWidth/2;
				break;
			case 'right':
				rectX = x - rectWidth;
				break;
		}
		switch (textBaseline) {
			case 'top':
				rectY = y;
				break;
			case 'middle':
				rectY = y - rectHeight/2;
				break;
			case 'bottom':
				rectY = y - rectHeight;
				break;
		}

		let pointArray = [{ x: rectX, y: rectY },
		{ x: rectX + rectWidth, y: rectY },
		{ x: rectX, y: rectY + rectHeight },
		{ x: rectX + rectWidth, y: rectY + rectHeight }];

		let rotatedPointArray = pointArray.map(function (point) {

			let _x = x + Math.cos(rotate)*(point.x - x) - Math.sin(rotate)*(point.y - y);
			let _y = x + Math.sin(rotate)*(point.x - x) + Math.cos(rotate)*(point.y - y);

			return {
				x: _x,
				y: _y
			};
		}, this);

		let xArray = rotatedPointArray.map((point) => point.x);
		let yArray = rotatedPointArray.map((point) => point.y);

		rectX = min(xArray);
		rectY = min(yArray);
		rectWidth = max(xArray) - rectX;
		rectHeight = max(yArray) - rectY;

		return {
			x: rectX,
			y: rectY,
			width: rectWidth,
			height: rectHeight
		}
}

let uid = 0;
function uuid() {
	return uid++;
}



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
	// t: current time, b: begInnIng value, c: change In value, d: duration
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Text; });



class Text extends __WEBPACK_IMPORTED_MODULE_1__shape__["a" /* Shape */] {
	constructor({ x, y, value, rotate = 0, style, renderType = 'fill', groupId, zIndex }) {
		super({
			type: 'text',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex
		});

		this.x = x;
		this.y = y;
		this.value = value.toString();

		this.rotate = rotate;
	}

	isPointIn(context, x, y) {
		let { x: _x, y: _y, width: _w, height: _h } = this.getBoundingRect(context);

		return (x > _x) && (x < _x + _w) && (y > _y) && (y < _y + _h);
	}

	getBoundingRect(context) {
		let rectX = 0;
		let rectY = 0;
		let rectWidth = context.measureText(this.value).width;
		let rectHeight = parseInt(/\d+/.exec(context.font)[0]);

		switch (context.textAlign) {
			case 'left':
				rectX = this.x;
				break;
			case 'center':
				rectX = this.x - rectWidth/2;
				break;
			case 'right':
				rectX = this.x - rectWidth;
				break;
		}
		switch (context.textBaseline) {
			case 'top':
				rectY = this.y;
				break;
			case 'middle':
				rectY = this.y - rectHeight/2;
				break;
			case 'bottom':
				rectY = this.y - rectHeight;
				break;
		}

		let pointArray = [{ x: rectX, y: rectY },
		{ x: rectX + rectWidth, y: rectY },
		{ x: rectX, y: rectY + rectHeight },
		{ x: rectX + rectWidth, y: rectY + rectHeight }];

		let rotatedPointArray = pointArray.map(function (point) {
			let x = point.x;
			let y = point.y;

			let m = this.x;
			let n = this.y;

			let a = this.rotate;

			let _x = m + Math.cos(a)*(x - m) - Math.sin(a)*(y - n);
			let _y = n + Math.sin(a)*(x - m) + Math.cos(a)*(y - n);

			return {
				x: _x,
				y: _y
			};
		}, this);

		let xArray = rotatedPointArray.map((point) => point.x);
		let yArray = rotatedPointArray.map((point) => point.y);

		rectX = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* min */])(xArray);
		rectY = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* min */])(yArray);
		rectWidth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(xArray) - rectX;
		rectHeight = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(yArray) - rectY;

		return {
			x: rectX,
			y: rectY,
			width: rectWidth,
			height: rectHeight
		}
	}

	render(context) {
		for(let attr in this.style)
			context[attr] = this.style[attr];

		if(this.rotate !== 0) {
			context.save();
			context.translate(this.x, this.y);
			context.rotate(this.rotate);
			context.fillText(this.value, 0, 0);
			context.restore();			
		}
		else {
			context.fillText(this.value, this.x, this.y);
		}
	}
}



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape_shape__ = __webpack_require__(0);


class LeeRender {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.shapeLayer = [];
		this.shapeGroup = {};

		let self = this;

		this.canvas.onclick = function (event) {
			let rect = self.canvas.getBoundingClientRect();
			let x = event.clientX - rect.left;
			let y = event.clientY - rect.top;

			self.shapeLayer.reverse().forEach(function (layer) {
				layer.forEach(function (shape) {
					if(shape.isPointIn(self.context, x, y))
						shape.onclick.forEach((callback) => callback(self.context, x, y));					
				});
			});
		};

		let preMouseOverX = 0;
		let preMouseOverY = 0;

		this.canvas.onmousemove = function (event) {
			let rect = self.canvas.getBoundingClientRect();
			let x = event.clientX - rect.left;
			let y = event.clientY - rect.top;

			self.shapeLayer.forEach(function (layer) {
				layer.forEach(function (shape) {
					let isPreIn = shape.isPointIn(self.context, preMouseOverX, preMouseOverY);
					let isCurIn = shape.isPointIn(self.context, x, y);

					if(isCurIn)
						shape.onmousemove.forEach((callback) => callback(self.context, x, y));
					if(isCurIn && !isPreIn)
						shape.onmouseover.forEach((callback) => callback(self.context, x, y));
					if(!isCurIn && isPreIn)
						shape.onmouseout.forEach((callback) => callback(self.context, x, y));
				});
			});

			preMouseOverX = x;
			preMouseOverY = y;
		};

		this.isDirty = false;

		setInterval((function () {
			if(this.isDirty) {
				this.render();
				this.isDirty = false;
			}		
		}).bind(this), 1000/60);
	}

	_addShape(shape) {
		shape.setRender(this);

		this.shapeLayer[shape.zIndex] = this.shapeLayer[shape.zIndex] || [];
		this.shapeLayer[shape.zIndex].push(shape);
		if(shape.groupId) {
			this.shapeGroup[shape.groupId] = this.shapeGroup[shape.groupId] || [];
			this.shapeGroup[shape.groupId].push(shape);
		}
	}

	addShape(shape) {

		if(shape instanceof __WEBPACK_IMPORTED_MODULE_0__shape_shape__["a" /* Shape */]) {
			this._addShape(shape);
		}
		else if(Array.isArray(shape)) {
			shape.forEach((shape) => {
				if(shape instanceof __WEBPACK_IMPORTED_MODULE_0__shape_shape__["a" /* Shape */])
					this._addShape(shape);
			}, this);
		}
	}

	_removeItem(array, item) {
		let isFound = false;
		for(let i = 0; i < array.length; i++) {
			if(array[i] === item || isFound) {
				array[i] = array[i + 1];
				isFound = true;
			}
		}
		if(isFound)
			array.pop();		
	}

	removeShape(shape) {
		this._removeItem(this.shapeLayer[shape.zIndex], shape);
		if(shape.groupId && this.shapeGroup[shape.groupId])
			this._removeItem(this.shapeGroup[shape.groupId], shape);
	}

	getContext() {
		return this.context;
	}

	requestRender() {
		this.isDirty = true;
	}

	render() {
		let context = this.context;

		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.shapeLayer.forEach(function (layer) {
			layer.forEach(function (shape) {
				shape.render(context);
			})	
		});	
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LeeRender;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Circle; });



class Circle extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ x, y, r, style, renderType, groupId, zIndex, isAnimation }) {
		super({
			type: 'circle',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex,
			isAnimation: isAnimation
		});

		this.x = x;
		this.y = y;
		this.originalR = r;
		this.r = r;
	}

	animate(currentTime, duration) {
		let currentR = __WEBPACK_IMPORTED_MODULE_1__util_easing__["a" /* default */].easeInCubic(null, currentTime, 0, this.originalR, duration);
		this.r = Math.min(currentR, this.originalR);
	}

	buildPath(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.r, 0, 2*Math.PI);
	}

	isPointIn(context, x, y) {
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}
}



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Rect; });



class Rect extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ x, y, width, height, style, renderType, groupId, zIndex, isAnimation }) {
		super({
			type: 'rect',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex,
			isAnimation: isAnimation
		});

		this.x = x;
		this.originalY = y;
		this.y = y;
		this.width = width;
		this.originalHeight = height;
		this.height = height;
	}

	buildPath(context) {
		context.beginPath();
		context.rect(this.x, this.y, this.width, this.height);		
	}

	animate(currentTime, duration) {
		let currentHeight = __WEBPACK_IMPORTED_MODULE_1__util_easing__["a" /* default */].easeInCubic(null, currentTime, 0, this.originalHeight, duration);
		this.height = Math.min(currentHeight, this.originalHeight);
		this.y = this.originalY + this.originalHeight - this.height;
	}

	isPointIn(context, x, y) {
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}
}



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Line; });




class Line extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ pointArray, isDashed = false, style, groupId, zIndex, isAnimation }) {
		super({
			type: 'line',
			style: style,
			renderType: 'stroke',
			groupId: groupId,
			zIndex: zIndex,
			isAnimation: isAnimation
		});

		this.originalPointArray = pointArray;
		this.pointArray = pointArray.map(({ x, y }) => {
			return { x: x, y: y }
		});
		this.isDashed = isDashed;
	}

	animate(currentTime, duration) {
		let yArray = this.originalPointArray.map(({ x, y }) => y);
		let maxY = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util_util__["b" /* max */])(yArray);

		this.pointArray = this.originalPointArray.map(({ x, y }) => {
			let dY = Math.abs(maxY - y);
			let currentY = maxY - __WEBPACK_IMPORTED_MODULE_2__util_easing__["a" /* default */].easeInCubic(null, currentTime, 0, dY, duration);
			return {
				x: x,
				y: Math.max(currentY, y)
			};
		});
	}

	buildPath(context) {
		context.beginPath();
		
		if(context.lineWidth === 1) 
			for(let i = 0, p = this.pointArray[i], np = this.pointArray[i + 1]; i < this.pointArray.length - 1; i++) {
				// 竖线
				if(Math.round(p.x) === Math.round(np.x)) {
					p.x = np.x = Math.round(np.x) + 0.5;
				}
				// 横线
				if(Math.round(p.y) === Math.round(np.y)) {
					p.y = np.y = Math.round(np.y) + 0.5;
				}				
			}

		this.pointArray.forEach(({ x, y }, index, array) => {
			if(index === 0)
				context.moveTo(x, y);
			else {
				let pp = array[index - 1];

				// /* 对 1px 进行坐标对齐 */
				// if(context.lineWidth === 1) {
				// 	// 竖线
				// 	if(Math.round(pp.x) === Math.round(x)) {

				// 		x = pp.x = Math.round(pp.x) + 0.5;

				// 	}
				// 	// 横线
				// 	if(Math.round(pp.y) === Math.round(y)) {

				// 		y = pp.y = Math.round(pp.y) + 0.5;

				// 	}
				// }

				/* 虚线 */
				if(this.isDashed) {
				    let dashLen = 5;  
				    let dx = x - pp.x;
				    let dy = y - pp.y;
				    var num = Math.floor(Math.sqrt(Math.pow(dx, 2)+  Math.pow(dy, 2))/dashLen);

				    for(let i = 0; i < num; i++) {
				    	let _x = pp.x + (dx)/num*i;
				    	let _y = pp.y + (dy)/num*i;

				        context[i%2 == 0 ? 'moveTo' : 'lineTo'](_x, _y);  
				    }  
				}
				/* 实线 */
				else {
					context.lineTo(x, y);			
				}				
			}
		}, this);
	}

	isPointIn(context, x, y) {
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}
}



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
	color: [
	    '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
	    '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
	    '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
	    '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
	],
	axis: {
		tick: {
			length: 8,
			margin: 4,
			color: '008acd'
		},
		label: {
			color: '#008acd'
		},
		grid: {
			color: '#eeeeee'
		}
	},
	legend: {
		shape: 'rect',
		width: 12,
		/* shape: 'circle'
		r: 6 */
		margin: 4
	}
});

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_line__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shape_text__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LinearAxis; });




class LinearAxis {
	constructor({ data, x, y, width, length, bodyHeight, bodyWidth, position = 'left', isSpace = false, isGrid = true, context }) {
		this.data = data;
		/* 数据相关的 */
		if(typeof this.data[0] === 'number') {
			this.dataType = 'linear';
		}
		else if(typeof this.data[0] === 'string') {
			this.dataType = 'category';
		}

		/* 位置相关 */
		this.x = x;
		this.y = y;
		this.width = width;
		this.length = length;
		this.position = position;
		this.isSpace = isSpace;
		this.isGrid = isGrid;

		this.bodyWidth = bodyWidth;
		this.bodyHeight = bodyHeight;
	
		this.context = context;

		this.update();
	}

	update() {
		this.tickArray = this.computeTick();
		this.fit();
		this.shapeArray = this.computeShape();		
	}

	/* 有 data 就可以计算 tick, 不受文本 rotate 的影响 */
	computeTick() {
		let tickArray = [];

		if(this.dataType === 'linear') {
			tickArray = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["e" /* linearTick */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* min */])(this.data), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(this.data));
		}
		else if(this.dataType === 'category') {
			tickArray = this.data.slice(0);
		}

		return tickArray.map((tick, index, array) => {
			let position = 0;

			if(this.isSpace)
				position = (index + 1)*this.length/(array.length + 1);
			else
				position = index*this.length/(array.length - 1);

			return {
				value: tick,
				position: position
			};
		}, this);
	}

	/* 计算 label 的旋转 */
	fit() {
		let context = this.context;

		let limitedLabelWidth = 0;
		let maxLabelWidth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(this.tickArray.map(tick => context.measureText(tick.value).width ));

		
		/* 水平坐标轴的限制在于长度 */
		if(this.position === 'top' || this.position === 'bottom') {
			let rotate = 0;
			
			let textAlign = 'center';
			let textBaseline = 'top';

			/* 先计算 rotate */
			let leftLength = this.length;
			if(this.isSpace) {
				/* 剔除了两端的距离, 将剩下的部分平分 */
				leftLength = this.length - this.length/(this.tickArray.length + 1)
			}
			/* 设刻度之间的最小距离为4 */
			limitedLabelWidth = (leftLength - 4*(this.tickArray.length - 1))/this.tickArray.length;

			if(maxLabelWidth > limitedLabelWidth) {
				rotate = Math.acos(limitedLabelWidth/maxLabelWidth);
				textAlign = 'right';
			}
			this.rotate = rotate;

			/* 接下来处理宽度 */
			let width = this.tickArray.reduce(function (pre, cur) {
				/* 每个在 rotate 角度下旋转的文本 */
				let { height } = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["f" /* getTextBoundingRect */])({
					context: context,
					text: cur.value,
					rotate: rotate,
					fontSize: 12,
					textAlign:textAlign,
					textBaseLine: textBaseline
				});

				return Math.max(pre, height);
			}, 0);
			let preWidth = this.width;
			this.width = Math.max(preWidth, width + 12);
			if(this.position === 'bottom')
				this.y -= (this.width - preWidth);

			this.bodyHeight -= (this.width - preWidth);
		}
		/* 竖直坐标轴的限制在于宽度, 不旋转直接拓宽 */
		else if(this.position === 'left' || this.position === 'right') {
			this.rotate = 0;
			let preWidth = this.width;
			this.width = Math.max(this.width, maxLabelWidth + 12);
			if(this.position === 'right')
				this.x -= (this.width - preWidth);

			this.bodyWidth -= (this.width - preWidth);
		}
	}

	computeShape() {
		let lineStyle = {
			strokeStyle: '#d9d9d9',
			lineWidth: 1
		};

		let shapeArray = [];
		/* 水平坐标轴 */
		if(this.position === 'top' || this.position === 'bottom') {
			/* 轴线 */

			shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
				pointArray: [{ x: this.x, y: this.y }, { x: this.x + this.length, y: this.y }],
				style: lineStyle,
				zIndex: 1
			}));

			this.tickArray.forEach((tick) => {
				let x = this.x + tick.position;
				let y = this.y;
				/* 刻度线 */
				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
					pointArray: [{ x: x, y: y }, { x: x, y: y + 8 }],
					style: lineStyle,
				}));

				/* label */
				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_2__shape_text__["a" /* Text */]({
					x: this.x + tick.position,
					y: this.y + 12,
					value: tick.value,
					style: {
						textBaseline: 'top',
						textAlign: this.rotate === 0 ? 'center' : 'right'						
					},
					rotate: -1*this.rotate,
				}));
			}, this);

			/* 网格 */
			if(this.isGrid)
				this.tickArray.forEach((tick) => {
					let x = this.x + tick.position;
					let y = this.y;

					shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
						pointArray: [{ x: x, y: y }, { x: x, y: y - this.bodyHeight }],
						style: lineStyle,
						isDashed: true
					}));
				}, this);
		}
		/* 竖直坐标轴 */
		else if(this.position === 'left' || this.position === 'right') {
			shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
				pointArray: [{ x: this.x + this.width, y: this.y }, { x: this.x + this.width, y: this.y + this.length }],
				style: lineStyle,
				zIndex: 1
			}));

			this.tickArray.forEach((tick, index) => {
				let x = this.x + this.width;
				let y = this.y + this.length - tick.position;

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
					pointArray: [{ x: x, y: y }, { x: x - 8, y: y }],
					style: lineStyle
				}));

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_2__shape_text__["a" /* Text */]({
					x: this.x + this.width - 12,
					y: this.y + this.length - tick.position,
					value: tick.value,
					style: {
						textBaseline: 'middle',
						textAlign: 'right'
					},
					rotate: this.rotate					
				}));
			}, this);

			if(this.isGrid) {
				this.tickArray.forEach((tick) => {
					let x = this.x + this.width;
					let y = this.y + this.length - tick.position;

					shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
						pointArray: [{ x: x, y: y }, { x: x + this.bodyWidth, y: y }],
						style: lineStyle,
						isDashed: true
					}));
				}, this);				
			}
		}

		return shapeArray;
	}

	getWidth() {
		return this.width;
	}

	getShape() {
		this.update();
		return this.shapeArray;
	}
}



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape_circle__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_text__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__theme_macaron__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_util__ = __webpack_require__(1);
/* unused harmony export Legend */





class Legend {
	constructor({ data, x, y, width, length, position = 'top', context }) {
		this.data = data;
		this.x = x;
		this.y = y;
		this.width = width;
		this.length = length;

		this.position = position;

		this.context = context;

		this.update();
	}

	color(color) {
		this.color = color;
	}

	update() {
		this.fit();
		this.shapeArray = this.computeShape();
	}

	fit() {
		let context = this.context;
		
		let r = 6;	
		let margin = 6;
		let fontSize = 12;
		let lengthArray = this.data.map((category, index, array) => 2*r + margin + context.measureText(category).width);

		if(this.postion === 'top' || this.position === 'bottom') {
			let lineIndex = 0;
			let x = 0;
			lengthArray.forEach((length) => {
				if((x + length) > this.length) {
					/* 放不下, 另起一行 */
					x = 0;
					lineIndex++;	
				}
			}, this);

			let totalHeight = lineIndex*(margin + fontSize) + fontSize;
			this.width = Math.max(this.height, totalHeight);
		}
		/* 左右方向排列的图例 */
		else if (this.position === 'left' || this.position === 'right') {
			let maxLegendWidth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util_util__["b" /* max */])(lengthArray);
			this.width = Math.max(this.width, maxLegendWidth);
		}		
	}

	getWidth() {
		return width;
	}

	computeShape() {
		let context = this.context;

		let r = 6;	
		let margin = 6;
		let fontSize = 12;
		let lengthArray = this.data.map((item, index, array) => 2*r + margin + context.measureText(item).width);	

		let shapeArray = [];

		if(this.postion === 'top' || this.position === 'bottom') {
			let lineIndex = 0;
			let x = 0;

			lengthArray.forEach(function (length, index) {
				if((x + length) > this.length) {
					/* 放不下, 另起一行 */
					x = 0;
					lineIndex++;	
				}

				let y = this.y + fontSize/2 + lineIndex*(fontSize + margin);

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_0__shape_circle__["a" /* Circle */]({
					x: this.x + x + r,
					y: y,
					r: r,
					style: {
						fillStyle: this.color[index]
					},
					renderType: 'fill'
				}));

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_text__["a" /* Text */]({
					x: this.x + x + 2*r + margin,
					y: y,
					value: this.data[index],
					style: {
						textBaseline: 'middle',
						textAlign: 'left'
					}	
				}));

				x += length;
			}, this);			
		}

		else if(this.position === 'left' || this.position === 'right') {
			lengthArray.forEach(function (length, index) {
				let y = this.y + fontSize/2 + index*(fontSize + margin);

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_0__shape_circle__["a" /* Circle */]({
					x: this.x + r,
					y: y,
					r: r,
					style: {
						fillStyle: this.color[index]
					},
					renderType: 'fill'
				}));

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_text__["a" /* Text */]({
					x: this.x + 2*r + margin,
					y: y,
					value: this.data[index],
					style: {
						textBaseline: 'middle',
						textAlign: 'left'
					}	
				}));
			}, this);
		}

		return shapeArray;
	}

	getShape() {
		this.update();
		return this.shapeArray;
	}
}



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__geometry_bar__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__geometry_line__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__geometry_point__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__geometry_pie__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__axis_linear__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__legend_legend__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__tooltip_tooltip__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shape_rect__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__leerender__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__theme_macaron__ = __webpack_require__(8);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LeeChart; });











class LeeChart {
	constructor(container, { width = 480, height = 480, padding = { left: 50, right: 50, top: 50, bottom: 50 } } = {} ) {
		this.width = width;
		this.height = height;
		this.padding = padding;

		this.bodyWidth = this.width - this.padding.left - this.padding.right;
		this.bodyHeight = this.height - this.padding.top - this.padding.bottom;

		this.container = container;

		this.container.style = `width: ${this.width}px; height: ${this.height}px; position: relative`;

		this.container.onclick = (function (event) {
			this.backCanvas.onclick(event);
			this.bodyCanvas.onclick(event);
			this.frontCanvas.onclick(event);		
		}).bind(this);

		this.container.onmousemove = (function (event) {
			this.backCanvas.onmousemove(event);
			this.bodyCanvas.onmousemove(event);
			this.frontCanvas.onmousemove(event);	
		}).bind(this);

		['back', 'body', 'front'].forEach(function (prefix, index) {
			let canvas = document.createElement('canvas');
			canvas.width = this.width;
			canvas.height = this.height;
			canvas.style = `position: absolute; z-index: ${index}`;
			this[`${prefix}Canvas`] = canvas;
			this[`${prefix}Render`] = new __WEBPACK_IMPORTED_MODULE_8__leerender__["a" /* LeeRender */](canvas);

			this.container.appendChild(canvas);
		}, this);		
	}

	type(_type) {
		if(/line|point|bar|pie|doughnut|polar|radar/.test(_type))
			this._type = _type;
		return this;
	}

	data(_data) {
		if(Array.isArray(_data))
			this._data = _data;
		return this;
	}

	x(colName) {
		if(/line|point|bar/.test(this._type)) {
			this._xData = this._data.map(item => item[colName]);

			this._xAxis = new __WEBPACK_IMPORTED_MODULE_4__axis_linear__["a" /* LinearAxis */]({
				data: this._xData,
				x: this.padding.left,
				y: this.height - this.padding.bottom,
				width: this.padding.bottom,
				length: this.bodyWidth,
				bodyHeight: this.bodyHeight,
				position: 'bottom',
				isSpace: this._type === 'bar' ? true : false,
				context: this.backRender.getContext()
			});	
		}
			
		return this;
	}

	y(colName) {
		if(/line|point|bar/.test(this._type)) {
			this._yData = this._data.map(item => item[colName]);

			this._yAxis = new __WEBPACK_IMPORTED_MODULE_4__axis_linear__["a" /* LinearAxis */]({
				data: this._yData,
				x: 0,
				y: this.padding.top,
				width: this.padding.left,
				length: this.bodyHeight,
				bodyWidth: this.bodyWidth,
				position: 'left',
				context: this.backRender.getContext()			
			});

			let config = {
				data: this._yData,
				x: this.padding.left,
				y: this.padding.top,
				width: this.bodyWidth,
				height: this.bodyHeight,
				render: this.bodyRender
			};

			if(this._type === 'bar') {
				this._chart = new __WEBPACK_IMPORTED_MODULE_0__geometry_bar__["a" /* BarChart */](config);
			}
			else if(this._type === 'line') {
				this._chart = new __WEBPACK_IMPORTED_MODULE_1__geometry_line__["a" /* LineChart */](config);
			}
			else
				this._chart = new __WEBPACK_IMPORTED_MODULE_2__geometry_point__["a" /* PointChart */](config);		
		}
			
		return this;
	}

	theta(colName) {
		if(/pie|doughnut|polar|radar/.test(this._type)) {
			this._thetaData = this._data.map(item => item[colName]);

			this._chart = new __WEBPACK_IMPORTED_MODULE_3__geometry_pie__["a" /* PieChart */]({
				data: this._thetaData,
				x: this.padding.left,
				y: this.padding.top,
				width: this.bodyWidth,
				height: this.bodyHeight,
				render: this.bodyRender
			})
		}
			
		return this;			
	}

	r(colName) {
		if(/pie|doughnut|polar|radar/.test(this._type))
			this._rData = this._data.map(item => item[colName]);
		return this;
	}

	size(colName) {
		this._sizeData = this._data.map(item => item[colName]);
		return this;
	}

	color(colName) {
		if(this._chart) {
			this._chart.color(__WEBPACK_IMPORTED_MODULE_9__theme_macaron__["a" /* default */].color.slice(0, this._data.length));
		}
		return this;
	}

	fit() {
		let lastWidth = 0;
		let lastHeight = 0;

		do {
			lastWidth = this.bodyWidth;
			lastHeight = this.bodyHeight;

			/* 纵坐标轴 */
			let yAxisWidth = this._yAxis.getWidth();

			/* 更新图表 */
			this.padding[this._yAxis.position] = yAxisWidth;
			this.bodyWidth = this.width - this.padding.left - this.padding.right;

			/* 挤压 x 轴 */
			this._xAxis.x = this.padding.left;
			this._xAxis.length = this.bodyWidth;

			/* 挤压 geometry */
			this._chart.x = this.padding.left;
			this._chart.width = this.bodyWidth;

			/* 横坐标轴 */
			let xAxisHeight = this._xAxis.getWidth();

			this.padding[this._xAxis.position] = xAxisHeight;
			this.bodyHeight = this.height - this.padding.top - this.padding.bottom;

			/* 挤压 y 轴 */
			this._yAxis.y = this.padding.top;
			this._yAxis.length = this.bodyHeight;

			/* 挤压 geometry */
			this._chart.y = this.padding.top;
			this._chart.height = this.bodyHeight;

		} while(lastWidth != this.bodyWidth || lastHeight != this.bodyHeight)
	}

	layout() {
		if(/line|point|bar/.test(this._type)) {
			let backContext = this.backRender.getContext();

			this.fit();

			// let obj = this._xAxis.getBoundingRect(backContext);

			// obj.style = { fillStyle : 'rgba(0, 255, 0, 0.50)' };

			// this.backRender.addShape(new Rect(obj));
			// this.backRender.addShape(new Rect({
			// 	x: this.padding.left,
			// 	y: this.padding.top,
			// 	width: this.bodyWidth,
			// 	height: this.bodyHeight,
			// 	style: {
			// 		fillStyle: 'rgba(255, 0, 0, 0.50)'
			// 	}
			// }));



			this.backRender.addShape(this._xAxis.getShape(backContext));
			this.backRender.addShape(this._yAxis.getShape(backContext));
		}
		else if(/pie|doughnut|polar|radar/.test(this._type)) {
			
		}

		let chartBody = {
			x: this.padding.left,
			y: this.padding.top,
			width: this.bodyWidth,
			height: this.bodyHeight
		};

		this._toolTip = new __WEBPACK_IMPORTED_MODULE_6__tooltip_tooltip__["a" /* ToolTip */]({
			data: { name: '李亚轩', age: 22, weight: 67, height: 183 },
			x: chartBody.x,
			y: chartBody.y,
			chartBody: chartBody,
			render: this.frontRender
		});

		this._chart.onmouseover = (function (context, x, y, index) {
			this._toolTip.data = this._data[index];
			this._toolTip.x = x;
			this._toolTip.y = y;
			this._toolTip.show();
		}).bind(this);

		this._chart.onmousemove = (function (context, x, y, index) {
			this._toolTip.x = x;
			this._toolTip.y = y;
			this._toolTip.update();
		}).bind(this);

		this._chart.onmouseout = (function (context, x, y, index) {
			this._toolTip.hide();	
		}).bind(this);

		this.bodyRender.addShape(this._chart.getShape());

		return this;
	}

	render() {
		this.backRender.requestRender();
		this.bodyRender.requestRender();
		this.frontRender.requestRender();
	}
}



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_rect__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tooltip_tooltip__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BarChart; });





class BarChart extends __WEBPACK_IMPORTED_MODULE_3__base__["a" /* Base */] {
	constructor({ data, x, y, width, height, render }) {
		super({
			data: data,
			x: x,
			y: y,
			width: width,
			height: height,
			render: render
		});
	}

	computeShape() {
		let color = this.color;
		let shapeArray = [];

		let intervalWidth = this.width/(this.data.length + 1);
		let barWidth = intervalWidth*0.4;
		let tickArray = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["e" /* linearTick */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* min */])(this.data), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(this.data));
		let minTick = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* min */])(tickArray);
		let maxTick = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(tickArray);

		let self = this;

		return this.data.map((item, index) => {
			let x = this.x + (index + 1)*intervalWidth - barWidth/2;
			let barHeight = this.height*(item - minTick)/(maxTick - minTick);
			let y = this.y + this.height - barHeight;

			let rect = new __WEBPACK_IMPORTED_MODULE_1__shape_rect__["a" /* Rect */]({
				x: x,
				y: y,
				width: barWidth,
				height: barHeight,
				style: {
					fillStyle: color[index]
				},
				isAnimation: true
			});

			return rect;
		}, this);
	}
}



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_circle__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shape_line__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shape_bezier_curve__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LineChart; });






class LineChart extends __WEBPACK_IMPORTED_MODULE_4__base__["a" /* Base */] {
	constructor({ data, x, y, width, height, render, isBezierCurve = true, isArea = true }) {
		super({
			data: data,
			x: x,
			y: y,
			width: width,
			height: height,
			render: render
		});

		this.isBezierCurve = isBezierCurve;
		this.isArea = isArea;
	}

	computeShape(data) {
		let color = this.color;
		let intervalWidth = this.width/(this.data.length - 1);
		let tickArray = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["e" /* linearTick */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* min */])(this.data), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(this.data));
		let minTick = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* min */])(tickArray);
		let maxTick = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(tickArray);

		let lastX = 0;
		let lastY = 0;
		let shapeArray = [];

		let pointArray = this.data.map((item, index) => {
			let x = this.x + index*intervalWidth;
			let pointHeight = this.height*(item - minTick)/(maxTick - minTick);
			let y = this.y + this.height - pointHeight;

			return {
				x: x,
				y: y
			};
		}, this);

		let T = __WEBPACK_IMPORTED_MODULE_2__shape_line__["a" /* Line */];
		if(this.isBezierCurve)
			T = __WEBPACK_IMPORTED_MODULE_3__shape_bezier_curve__["a" /* BezierCurve */];

		let line = new T({
			pointArray: pointArray,
			style: {
				strokeStyle: color[0],
				lineWidth: 2,
			},
			zIndex: 1,
			isAnimation: true			
		});

		return [line].concat(pointArray.map(({ x,y }) => {
			return new __WEBPACK_IMPORTED_MODULE_1__shape_circle__["a" /* Circle */]({
				x: x,
				y: y,
				r: 3,
				style: {
					fillStyle: '#ffffff',
					strokeStyle: color[0],
					lineWidth: 2
				},
				renderType: 'fillstroke',
				zIndex: 2
			});
		}));
	}
}



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_line__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shape_sector__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PieChart; });





class PieChart extends __WEBPACK_IMPORTED_MODULE_3__base__["a" /* Base */] {
	constructor({ data, x, y, width, height, render, type = 'polar' }) {
		super({
			data: data,
			x: x,
			y: y,
			width: width,
			height: height,
			render: render
		});

		this.type = type;
	}

	computeShape() {
		let cx = this.x + this.width/2;
		let cy = this.y + this.height/2;
		let sumData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["d" /* sum */])(this.data);
		let maxData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(this.data);

		let radius = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* min */])([this.width, this.height])/2;
		let lastRadian = 0;
		let color = this.color;

		return this.data.map(function (item, index, array) {
			let radian = 2*Math.PI*item/sumData;
			let r = radius;

			if(this.type === 'polar') {
				radian = 2*Math.PI/array.length;
				r = radius*(item/maxData);
			}

			return new __WEBPACK_IMPORTED_MODULE_2__shape_sector__["a" /* Sector */]({
				x: cx,
				y: cy,
				innerRadius: 0,
				outerRadius: r,
				startRadian: lastRadian,
				endRadian: lastRadian += radian,
				renderType: 'fillstroke',
				style: {
					fillStyle: color[index],
					strokeStyle: '#ffffff',
					lineWidth: 4
				},
				zIndex: 0,
				isAnimation: true
			});
		}, this);
	}
}



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_circle__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PointChart; });




class PointChart extends __WEBPACK_IMPORTED_MODULE_2__base__["a" /* Base */] {
	constructor({ data, x, y, width, height, render }) {
		super({
			data: data,
			x: x,
			y: y,
			width: width,
			height: height,
			render: render
		});
	}
	
	computeShape() {
		let color = this.color;
		let shapeArray = [];

		let intervalWidth = this.width/(this.data.length - 1);
		let barWidth = intervalWidth*0.4;
		let tickArray = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["e" /* linearTick */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* min */])(this.data), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(this.data));
		let minTick = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* min */])(tickArray);
		let maxTick = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(tickArray);

		return this.data.map((item, index) => {
			let x = this.x + index*intervalWidth;
			let pointHeight = this.height*(item - minTick)/(maxTick - minTick);
			let y = this.y + this.height - pointHeight;

			return new __WEBPACK_IMPORTED_MODULE_1__shape_circle__["a" /* Circle */]({
				x: x,
				y: y,
				r: 12,
				renderType: 'fill',
				style: {
					fillStyle: color[index]
				},
				isAnimation: true
			});
		}, this);
	}
}



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BezierCurve; });




class BezierCurve extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ pointArray, style, groupId, zIndex, isAnimation }) {
		super({
			type: 'bezier-curve',
			style: style,
			renderType: 'stroke',
			groupId: groupId,
			zIndex: zIndex,
			isAnimation: isAnimation
		});

		this.originalPointArray = pointArray;
		this.pointArray = pointArray.map(({ x, y }) => {
			return { x: x, y: y }
		});
	}

	buildPath(context) {
		context.beginPath();

		this.pointArray.forEach(({ x, y }, index, array) => {
			if(index === 0)
				context.moveTo(x, y);
			else {
				let midX = (array[index - 1].x + x)/2;
				let preY = array[index - 1].y;
				context.bezierCurveTo(midX, preY, midX, y, x, y);
			}
		});
	}

	animate(currentTime, duration) {
		let yArray = this.originalPointArray.map(({ x, y }) => y);
		let maxY = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util_util__["b" /* max */])(yArray);

		this.pointArray = this.originalPointArray.map(({ x, y }) => {
			let dY = Math.abs(maxY - y);
			let currentY = maxY - __WEBPACK_IMPORTED_MODULE_2__util_easing__["a" /* default */].easeInCubic(null, currentTime, 0, dY, duration);
			return {
				x: x,
				y: Math.max(y, currentY)
			};
		});
	}

	isPointIn(context, x, y) {
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}	
}



/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RoundRect; });


class RoundRect extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ x, y, width, height, r, style, renderType, groupId, zIndex, isDisplay }) {
		super({
			type: 'round-rect',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex,
			isDisplay: isDisplay
		});

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.r = r;
	}

	isPointIn(context, x, y) {
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}

	buildPath(context) {
		context.beginPath();

		context.arc(this.x + this.r, this.y + this.r, this.r, Math.PI, 3/2*Math.PI);
		context.lineTo(this.x + this.width - this.r, this.y);

		context.arc(this.x + this.width - this.r, this.y + this.r, this.r, 3/2*Math.PI, 2*Math.PI);
		context.lineTo(this.x + this.width, this.y + this.height - this.r);

		context.arc(this.x + this.width - this.r, this.y + this.height - this.r, this.r, 0, Math.PI/2);
		context.lineTo(this.x + this.r, this.y + this.height);

		context.arc(this.x + this.r, this.y + this.height - this.r, this.r, Math.PI/2, Math.PI);

		context.closePath();
	}
}



/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape_text__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_round_rect__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_util__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ToolTip; });




class ToolTip {
	constructor({ data, x, y, chartBody, render }) {
		this.data = data;
		this.x = x;
		this.y = y;
		this.chartBody = chartBody;	
		this.render = render;

		this.id = `tooltip-${__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__util_util__["a" /* uuid */])()}`;

		this.textArray = [];
		this.shapeArray = [];

		this.isDisplay = false;

		this.update();
	}

	color(color) {
		this.color = color;
	}

	show() {
		if(!this.isDisplay) {
			this.isDisplay = true;
			this.render.addShape(this.getShape());
			
			this.render.requestRender();
		}
	}

	hide() {
		if(this.isDisplay) {
			this.isDisplay = false;
			this.shapeArray.forEach(shape => this.render.removeShape(shape), this);
			
			this.render.requestRender();
		}
	}

	update() {
		this.textArray = this.computeText();
		this.shapeArray = this.computeShape();
	}

	computeText() {
		let textArray = [];
		for(let key in this.data) {
			textArray.push(`${key}: ${this.data[key]}`);
		}
		return textArray;	
	}

	computeShape() {

		let context = this.render.getContext();

		let maxTextWidth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__util_util__["b" /* max */])(this.textArray.map(text => context.measureText(text).width));
		let padding = 6;
		let r = 6;
		let margin = 6;
		let fontSize = 12;

		let width = maxTextWidth + padding*2;
		let height = (this.textArray.length - 1)*(fontSize + margin) + fontSize + 2*padding;

		let x = 0;
		let y = Math.max(this.y - height, this.chartBody.y);
		let xOffset = 6;
		/* 放左边放不下 */
		if(this.x - xOffset - width < this.chartBody.x)
			x = this.x + xOffset
		/* 左边放得下 */
		else
			x = this.x - xOffset - width;

		let roundRect = new __WEBPACK_IMPORTED_MODULE_1__shape_round_rect__["a" /* RoundRect */]({
			x: x,
			y: y,
			width: width,
			height: height,
			r: r,
			style: {
				fillStyle: 'rgba(50,50,50,0.5)'
			},
			groupId: this.id,
			zIndex: 2
		});

		let textArray = this.textArray.map((text, index) => {
			return new __WEBPACK_IMPORTED_MODULE_0__shape_text__["a" /* Text */]({
				x: x + padding,
				y: y + padding + fontSize/2 + index*(fontSize + margin) ,
				value: text,
				style: {
					fillStyle: '#ffffff',
					textAlign: 'left',
					textBaseline: 'middle'
				},
				zIndex: 3,
				groupId: this.id
			})
		}, this);

		return [roundRect].concat(textArray);
	}

	getShape() {
		this.update();
		return this.shapeArray;
	}
}



/***/ }),
/* 19 */,
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_leechart__ = __webpack_require__(11);


let data = ['first class', 'second class', 'third class', 'forth class', 'fifth class'].map(function (item) {
	return {
		color: item,
		value: 100000 + 100000*Math.random()
	}
});

let lineChart = new __WEBPACK_IMPORTED_MODULE_0__src_leechart__["a" /* LeeChart */](document.querySelector('#line'));
let barChart = new __WEBPACK_IMPORTED_MODULE_0__src_leechart__["a" /* LeeChart */](document.querySelector('#bar'));
let pointChart = new __WEBPACK_IMPORTED_MODULE_0__src_leechart__["a" /* LeeChart */](document.querySelector('#point'));
let pieChart = new __WEBPACK_IMPORTED_MODULE_0__src_leechart__["a" /* LeeChart */](document.querySelector('#pie'));

lineChart.type('line').data(data).x('color').y('value').color('color').layout().render();
barChart.type('bar').data(data).x('color').y('value').color('color').layout().render();
pointChart.type('point').data(data).x('color').y('value').color('color').layout().render();
pieChart.type('pie').data(data).theta('value').color('color').layout().render();

/***/ }),
/* 21 */,
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Sector; });



class Sector extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ x, y, innerRadius, outerRadius, startRadian, endRadian, style, renderType, groupId, zIndex, isAnimation }) {
		super({
			type: 'sector',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex,
			isAnimation: isAnimation
		});

		this.x = x;
		this.y = y;
		this.innerRadius = innerRadius;
		this.outerRadius = outerRadius;

		this.originalStartRadian = startRadian;
		this.startRadian = startRadian;

		this.originalEndRadian = endRadian;
		this.endRadian = endRadian;

	}

	animate(currentTime, duration) {
		let currentStartRadian = __WEBPACK_IMPORTED_MODULE_1__util_easing__["a" /* default */].easeOutBounce(null, currentTime, 0, this.originalStartRadian, duration);
		let currentEndRadian = __WEBPACK_IMPORTED_MODULE_1__util_easing__["a" /* default */].easeOutBounce(null, currentTime, 0, this.originalEndRadian, duration);
		this.endRadian = Math.min(currentEndRadian, this.originalEndRadian);
		this.startRadian = Math.min(currentStartRadian, this.originalStartRadian);
	}

	buildPath(context) {
		context.beginPath();

		context.moveTo(this.x + this.innerRadius*Math.cos(this.startRadian),
			this.y + this.innerRadius*Math.sin(this.startRadian));
		context.lineTo(this.x + this.outerRadius*Math.cos(this.startRadian),
			this.y + this.outerRadius*Math.sin(this.startRadian));

		context.arc(this.x, this.y, this.outerRadius, this.startRadian, this.endRadian, false);

		context.lineTo(this.x + this.innerRadius*Math.cos(this.endRadian),
			this.y + this.innerRadius*Math.sin(this.endRadian));

		context.arc(this.x, this.y, this.innerRadius, this.endRadian, this.startRadian, true);
		context.closePath();
	}

	isPointIn(context, x, y) {
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}
}



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Base; });
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



/***/ })
/******/ ]);