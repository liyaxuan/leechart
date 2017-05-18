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
/******/ 	return __webpack_require__(__webpack_require__.s = 23);
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return max; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return min; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return sum; });
/* unused harmony export range */
/* unused harmony export nice */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return linearTick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return getTextBoundingRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return unique; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return uuid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getCol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getDimData; });
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

function unique(array) {
	let result = [];
	let set = new Set(array);
	for(let item of set.keys())
		result.push(item);
	return result;
}

function getCol(data, col) {
	if(data[0] && data[0][col])
		return data.map(item => item[col]);
	else
		return [];
}

function getDimData(data, dim1, resultDim, dim2) {
	let dim1Array = unique(getCol(data, dim1));
	let dim2Array = dim2 ? unique(getCol(data, dim2)) : [];

	let result = [];

	data.forEach(item => {
		let i = dim1Array.findIndex(dim1Item => dim1Item === item[dim1]);
		result[i] = result[i] || [];
		if(dim2) {
			let j = dim2Array.findIndex(dim2Item => dim2Item === item[dim2]);
			result[i][j] = item[resultDim];
		}
		else
			result[i].push(item[resultDim]);
	}, this);

	return result;	
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

					if(isPreIn && isCurIn)
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
/* 4 */
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

		rectX = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* min */])(xArray);
		rectY = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* min */])(yArray);
		rectWidth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* max */])(xArray) - rectX;
		rectHeight = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* max */])(yArray) - rectY;

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
/* 5 */
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
/* 6 */
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape_circle__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_text__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__theme_macaron__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_util__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Legend; });





class Legend {
	constructor({ data, x, y, width, height, position = 'top', render }) {
		this.data = data;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.position = position;

		this.render = render;

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
		let context = this.render.getContext();
		
		let r = 6;	
		let margin = 6;
		let fontSize = 12;
		let lengthArray = this.data.map((category, index, array) => 2*r + margin + context.measureText(category).width);

		if(this.postion === 'top' || this.position === 'bottom') {
			let lineIndex = 0;
			let x = 0;
			lengthArray.forEach((length) => {
				if((x + length) > this.width) {
					/* 放不下, 另起一行 */
					x = 0;
					lineIndex++;	
				}
			}, this);

			let totalHeight = lineIndex*(margin + fontSize) + fontSize;
			this.height = Math.max(this.height, totalHeight);
		}
		/* 左右方向排列的图例 */
		else if (this.position === 'left' || this.position === 'right') {
			let maxLegendWidth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util_util__["a" /* max */])(lengthArray);
			this.width = Math.max(this.width, maxLegendWidth);
		}		
	}

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

	computeShape() {
		let context = this.render.getContext();

		let r = 6;	
		let margin = 6;
		let fontSize = 12;
		let lengthArray = this.data.map((item, index, array) => 2*r + margin + context.measureText(item).width);	

		let shapeArray = [];

		if(this.position === 'top' || this.position === 'bottom') {
			let lineIndex = 0;
			let x = 0;

			lengthArray.forEach(function (length, index) {
				if((x + length) > this.width) {
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

				x += (length + margin);
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
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_leerender__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_shape_rect__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_legend_legend__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_theme_macaron__ = __webpack_require__(8);





let leeRender = new __WEBPACK_IMPORTED_MODULE_0__src_leerender__["a" /* LeeRender */](document.querySelector('#leerender'));
let legend = new __WEBPACK_IMPORTED_MODULE_2__src_legend_legend__["a" /* Legend */]({
	data: ['first', 'second', 'third', 'forth'],
	x: 50,
	y: 0,
	width: 100,
	height: 20,
	render: leeRender,
	position: 'left'
});

let rect = new __WEBPACK_IMPORTED_MODULE_1__src_shape_rect__["a" /* Rect */]({
	x: 50,
	y: 0,
	width: 100,
	height: 60,
	style: {
		fillStyle: 'rgba(0, 0, 0, 0.16)'
	}
})

legend.color(__WEBPACK_IMPORTED_MODULE_3__src_theme_macaron__["a" /* default */].color.slice(0, 4));

leeRender.addShape(legend.getShape().concat(rect));
leeRender.render();

/***/ })
/******/ ]);