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
/******/ 	return __webpack_require__(__webpack_require__.s = 25);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Shape; });


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
		let func = __WEBPACK_IMPORTED_MODULE_0__util_easing__["a" /* default */].easeInOutQuad;

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



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return max; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return min; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return sum; });
/* unused harmony export range */
/* unused harmony export nice */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return linearTick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return getTextBoundingRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return unique; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return uuid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getCol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return group; });
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

function linearTick(min, max, count = 11) {
	var ticks = [];
	// To get a "nice" value for the tick spacing, we will use the appropriately named
	// "nice number" algorithm. See http://stackoverflow.com/questions/8506881/nice-label-algorithm-for-charts-with-minimum-ticks
	// for details.
	var niceRange = nice(max - min, false);
	var spacing = nice(niceRange / (count - 1), true);

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

function group(data, resultDim, dim1, dim2) {
	let dim1Array = unique(getCol(data, dim1));
	let dim2Array = dim2 ? unique(getCol(data, dim2)) : [];

	let result = [];

	data.forEach((item) => {
		let i = dim1Array.findIndex(dim1Item => dim1Item === item[dim1]);		
		result[i] = result[i] || [];
		if(dim2) {
			let j = dim2Array.findIndex(dim2Item => dim2Item === item[dim2]);
			result[i][j] = item[resultDim];
		}
		else
			result[i].push(item[resultDim]);
	});

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

		rectX = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* min */])(xArray);
		rectY = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* min */])(yArray);
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
		context.save();
		for(let attr in this.style)
			context[attr] = this.style[attr];

		if(this.rotate !== 0) {
			context.translate(this.x, this.y);
			context.rotate(this.rotate);
			context.fillText(this.value, 0, 0);		
		}
		else {

			context.fillText(this.value, this.x, this.y);
		}
		context.restore();	
	}
}



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Rect; });



class Rect extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ x, y, width, height, style, renderType, groupId, zIndex }) {
		super({
			type: 'rect',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex
		});

		this.x = x;
		this.originalY = y;
		this.y = y;
		this.width = width;
		this.originalHeight = height;
		this.height = height;
	}

	buildPath(context) {
		context.rect(this.x, this.y, this.width, this.height);		
	}
}



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Circle; });



class Circle extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ x, y, r, style, renderType, groupId, zIndex }) {
		super({
			type: 'circle',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex
		});

		this.x = x;
		this.y = y;
		this.originalR = r;
		this.r = r;
	}

	buildPath(context) {
		context.arc(this.x, this.y, this.r, 0, 2*Math.PI);
	}
}



/***/ }),
/* 6 */
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
		if(shape.groupId && this.shapeGroup[shape.groupId]) {
			this._removeItem(this.shapeGroup[shape.groupId], shape);
		}
	}

	getContext() {
		return this.context;
	}

	requestRender() {
		this.isDirty = true;
	}

	clear() {
		this.shapeLayer.forEach((layer, index, array) => {
			layer.forEach((shape, index, array) => {
				array[index] = null;
			});
			array[index] = null;
		});

		this.shapeLayer = [];

		for(let group in this.shapeGroup) {
			this.shapeGroup[group].forEach((shape, index, array) => {
				array[index] = null;
			})

			delete this.shapeGroup[group];		
		}

		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Line; });




class Line extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ pointArray, isDashed = false, style, groupId, zIndex }) {
		super({
			type: 'line',
			style: style,
			renderType: 'stroke',
			groupId: groupId,
			zIndex: zIndex
		});

		this.originalPointArray = pointArray;
		this.pointArray = pointArray.map(({ x, y }) => {
			return { x: x, y: y }
		});

		this.isDashed = isDashed;
	}

	buildPath(context) {
		let pointArray = this.pointArray.map(({ x, y }) => {
			return { x, y }
		});

		if(context.lineWidth === 1 && this.pointArray.length === 2) {
			let sp = this.pointArray[0];
			let ep = this.pointArray[1];

			// 竖线
			if(sp.x === ep.x && sp.x%1 !== 0.5) {
				let x = Math.round(sp.x) + 0.5;
				pointArray = [{ x: x, y: sp.y },{ x: x, y: ep.y }];
			}
			// 横线
			if(sp.y === ep.y && sp.y%1 !== 0.5) {
				let y = Math.round(sp.y) + 0.5;
				pointArray = [{ x: sp.x, y: y },{ x: ep.x, y: y }];
			}			
		}

		pointArray.forEach(({ x, y }, index, array) => {
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

				    context.lineTo(x, y);
				}
				/* 实线 */
				else {
					context.lineTo(x, y);			
				}				
			}
		}, this);

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape_rect__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_circle__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shape_text__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__theme_macaron__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_util__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Legend; });






let r = 3;	
let margin = 6;
let padding = 12;
let fontSize = 12;

class Legend {
	/* 水平方向 left center right */
	/* 竖直方向 top middle bottom */
	constructor({ data, color, x = 0, y = 0, width, height, position = 'top', align = 'center', render }) {
		this.data = data;
		this.color = color;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.position = position;

		this.render = render;
	}

	computeLength() {
		let context = this.render.getContext();
		return this.data.map((category, index, array) => 2*r + margin + context.measureText(category).width);
	}

	computeRow() {
		let lengthArray = this.computeLength();
		let rowIndex = 0;
		let xOffset = 0;

		let rowArray = []

		lengthArray.map((length) => {
			if((xOffset + length) > this.width) {
				/* 放不下, 另起一行 */
				xOffset = 0;
				rowIndex++;	
			}

			rowArray.push({
				rowIndex: rowIndex,
				xOffset: xOffset
			});

			xOffset += (length + margin);
		}, this);

		return rowArray;
	}

	fit() {
		if(this.position === 'top' || this.position === 'bottom') {
			let rowArray = this.computeRow();
			let rowCount = rowArray.slice(-1)[0].rowIndex + 1;
			let boundingHeight = (rowCount - 1)*(margin + fontSize) + fontSize;
			this.height = Math.max(this.height, boundingHeight + 2*padding);
		}
		/* 左右方向排列的图例 */
		else if (this.position === 'left' || this.position === 'right') {
			let lengthArray = this.computeLength();
			let maxLegendWidth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__util_util__["b" /* max */])(lengthArray);
			this.width = Math.max(this.width, maxLegendWidth + 2*padding);
		}
	}

	computeShape() {
		let lengthArray = this.computeLength();
		let shapeArray = [];

		if(this.position === 'top' || this.position === 'bottom') {
			let rowArray = this.computeRow();
			let rowCount = rowArray.slice(-1)[0].rowIndex + 1;

			let boundingWidth = rowArray.reduce((pre, cur, curIndex) => Math.max(cur.xOffset + lengthArray[curIndex], pre), 0);
			let boundingHeight = (rowCount - 1)*(fontSize + margin) + fontSize;

			rowArray.forEach(function (item, index) {
				let y = this.y + this.height/2 - boundingHeight/2 + fontSize/2 +  item.rowIndex*(fontSize + margin);
				
				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_circle__["a" /* Circle */]({
					x: this.x + this.width/2 - boundingWidth/2 + item.xOffset + r,
					y: y,
					r: r,
					style: {
						fillStyle: this.color[index]
					},
					renderType: 'fill'
				}));

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_2__shape_text__["a" /* Text */]({
					x: this.x + this.width/2 - boundingWidth/2 + item.xOffset + 2*r + margin,
					y: y,
					value: this.data[index],
					style: {
						textBaseline: 'middle',
						textAlign: 'left'
					}	
				}));
			}, this);		
		}

		else if(this.position === 'left' || this.position === 'right') {
			lengthArray.forEach(function (length, index) {
				let y = this.y + fontSize/2 + index*(fontSize + margin);

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_circle__["a" /* Circle */]({
					x: this.x + r,
					y: y,
					r: r,
					style: {
						fillStyle: this.color[index]
					},
					renderType: 'fill'
				}));

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_2__shape_text__["a" /* Text */]({
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

	getWidth() {
		this.fit();
		return this.width;
	}

	getHeight() {
		this.fit();
		return this.height;
	}

	getShape() {
		this.fit();
		this.shapeArray = this.computeShape();
		return this.shapeArray;
	}
}



/***/ }),
/* 10 */,
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Polygon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return RegularPolygon; });


class Polygon extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ vertexArray, style, renderType, groupId, zIndex }) {
		super({
			type: 'polygon',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex
		});

		this.vertexArray = vertexArray;
	}

	buildPath(context) {
		this.vertexArray.forEach(function (vertex) {
			context.lineTo(vertex.x, vertex.y);
		}, this);
		context.lineTo(this.vertexArray[0].x, this.vertexArray[0].y);
	}
}

class RegularPolygon extends Polygon {
	constructor({ x, y, r, vertexNumber, style, renderType }) {
		super({
			vertexArray: new Array(vertexNumber).fill(0).map(function (item, index) {
				let radian = 2*Math.PI/vertexNumber;
				return {
					x: x + r*Math.cos(Math.PI/2 - index*radian),
					y: y - r*Math.sin(Math.PI/2 - index*radian)
				}
			}),
			style: style,
			renderType: renderType
		});
	}
}



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_line__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shape_text__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LinearAxis; });




class LinearAxis {
	constructor({ data, type = 'linear', chartType, x = 0, y = 0, width, height, bodyHeight, bodyWidth, position = 'left', space = 0, isBeginAtZero = false, isGrid = true, isReverse = false, render }) {
		this.data = data;
		/* 数据相关的 */

		this.type = type;
		this.chartType = chartType;
		/* 位置相关 */
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.position = position;
		this.space = space;
		this.isGrid = isGrid;
		this.isBeginAtZero = isBeginAtZero;
		this.isReverse = isReverse;

		this.bodyWidth = bodyWidth;
		this.bodyHeight = bodyHeight;
	
		this.render = render;
	}

	/* 有 data 就可以计算 tick, 不受文本 rotate 的影响 */
	computeTick() {
		let tickArray = [];

		if(this.type === 'linear') {
			tickArray = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["h" /* linearTick */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* min */])(this.data), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(this.data));

			if(this.isZero && tickArray[0] > 0)
				tickArray.unshift(0);
		}
		else if(this.type === 'category') {
			tickArray = this.data.slice(0);
		}

		let length = 0;
		if(/top|bottom/.test(this.position))
			length = this.width;
		else if(/left|right/.test(this.position))
			length = this.height;

		return tickArray.map((tick, index, array) => {
			let position = 0;

			if(this.type === 'category') {
				if(this.chartType === 'bar') {
					let intervalWidth = (length - 2*this.space)/array.length;

					position = this.space + intervalWidth/2 + index*intervalWidth;							
				}
				else {
					let intervalWidth = (length - 2*this.space)/(array.length - 1);
					position = this.space + index*intervalWidth;
				}
			}

			else if(this.type === 'linear') {
				let intervalWidth = (length - 2*this.space)/(array.length - 1);
				position = this.space + index*intervalWidth
			}

			if(this.isReverse)
				position = length - position;

			return {
				value: tick,
				position: position
			};
		}, this);
	}

	/* 计算 label 的旋转 */
	fit() {
		let tickArray = this.computeTick();
		let context = this.render.getContext();

		let limitedLabelWidth = 0;
		let maxLabelWidth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(tickArray.map(tick => context.measureText(tick.value).width ));
		
		/* 水平坐标轴的限制在于宽度 */
		if(/top|bottom/.test(this.position)) {
			let rotate = 0;
			
			let textAlign = 'center';
			let textBaseline = 'top';

			/* 先处理宽度, 计算 rotate */
			let leftWidth = this.width;
			if(this.isSpace) {
				/* 剔除了两端的距离, 将剩下的部分平分 */
				leftWidth = this.width - this.width/(tickArray.length + 1)
			}
			/* 设刻度之间的最小距离为4 */
			limitedLabelWidth = (leftWidth - 4*(tickArray.length - 1))/tickArray.length;

			if(maxLabelWidth > limitedLabelWidth) {
				rotate = Math.acos(limitedLabelWidth/maxLabelWidth);
				textAlign = 'right';
			}
			this.rotate = rotate;

			/* 接下来处理高度, 根据需要进行拓高 */
			let height = tickArray.reduce(function (pre, cur) {
				/* 每个在 rotate 角度下旋转的文本 */
				let { height } = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["i" /* getTextBoundingRect */])({
					context: context,
					text: cur.value,
					rotate: rotate,
					fontSize: 12,
					textAlign:textAlign,
					textBaseLine: textBaseline
				});

				return Math.max(pre, height);
			}, 0);
			let preHeight = this.height;
			this.height = Math.max(preHeight, height + 12);
		}
		/* 竖直坐标轴的限制在于宽度, 不旋转直接拓宽 */
		else if(/left|right/.test(this.position)) {
			this.rotate = 0;
			let preWidth = this.width;
			this.width = Math.max(this.width, maxLabelWidth + 12);
		}
	}

	computeShape() {
		let tickArray = this.computeTick();
		let lineStyle = {
			strokeStyle: '#d9d9d9',
			lineWidth: 1
		};

		let shapeArray = [];
		/* 水平坐标轴 */
		if(/top|bottom/.test(this.position)) {
			/* 轴线 */
			let sx = this.x;
			let sy = this.y;
			let ex = this.x + this.width;
			let ey = sy;
			if(this.position === 'top') {
				ey = sy = this.y + this.height;
			}

			shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
				pointArray: [{ x: sx, y: sy }, { x: ex, y: ey }],
				style: lineStyle,
				zIndex: 1
			}));

			tickArray.forEach((tick) => {
				let sx = this.x + tick.position;
				let sy = this.y;

				let ex = sx;
				let ey = sy + 8;
				if(this.position === 'top') {
					sy = this.y + this.height;
					ey = sy - 8;
				}
					
				/* 刻度线 */
				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
					pointArray: [{ x: sx, y: sy }, { x: ex, y: ey }],
					style: lineStyle,
				}));

				/* label */


				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_2__shape_text__["a" /* Text */]({
					x: sx,
					y: this.position === 'bottom' ? sy + 12 : sy - 12,
					value: tick.value,
					style: {
						textBaseline: this.position === 'bottom' ? 'top' : 'bottom',
						textAlign: this.rotate === 0 ? 'center' : 'right'						
					},
					rotate: -1*this.rotate,
				}));
			}, this);

			/* 网格 */
			if(this.isGrid) {
				let gridArray = tickArray;
				if(this.space !== 0)
					gridArray = [{ value: '', position: 0 }].concat(gridArray).concat({
						value: '',
						position: this.width
					});

				gridArray.forEach((tick) => {
					let sx = this.x + tick.position;
					let sy = this.y;
					let ex = sx;
					let ey = sy - this.bodyHeight;
					if(this.position === 'top') {
						sy = this.y + this.height;
						ey = sy + this.bodyHeight;
					}

					shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
						pointArray: [{ x: sx, y: sy }, { x: ex, y: ey }],
						style: lineStyle,
						isDashed: true
					}));
				}, this);				
			}
		}
		/* 竖直坐标轴 */
		else if(/left|right/.test(this.position)) {
			let sx = this.x + this.width;
			let sy = this.y + this.height;
			let ex = sx;
			let ey = this.y;
			if(this.position === 'right') {
				ex = sx = this.x;
			}

			shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
				pointArray: [{ x: sx, y: sy }, { x: ex, y: ey }],
				style: lineStyle,
				zIndex: 1
			}));

			tickArray.forEach((tick, index) => {
				let sx = this.x + this.width;
				let sy = this.y + this.height - tick.position;
				let ex = sx - 8;
				let ey = sy;
				if(this.position === 'right') {
					sx = this.x;
					ex = this.x + 8;
				}

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
					pointArray: [{ x: sx, y: sy }, { x: ex, y: ey }],
					style: lineStyle
				}));

				let tsx = this.x + this.width - 12;
				let tsy = this.y + this.height - tick.position;
				if(this.position === 'right') {
					tsx = this.x + 12;
				}

				let textAlign = this.position === 'left' ? 'right' : 'left'

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_2__shape_text__["a" /* Text */]({
					x: tsx,
					y: tsy,
					value: tick.value,
					style: {
						textBaseline: 'middle',
						textAlign: textAlign
					},
					rotate: this.rotate					
				}));
			}, this);

			if(this.isGrid) {
				let gridArray = tickArray;
				if(this.space !== 0)
					gridArray = [{ value: '', position: 0 }].concat(gridArray).concat({
						value: '',
						position: this.height
					});

				gridArray.forEach((tick) => {
					let sx = this.x + this.width;
					let sy = this.y + this.height - tick.position;
					let ex = sx + this.bodyWidth;
					let ey = sy;
					if(this.position === 'right') {
						sx = this.x;
						ex = sx - this.bodyWidth
					}

					shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
						pointArray: [{ x: sx, y: sy }, { x: ex, y: ey }],
						style: lineStyle,
						isDashed: true
					}));
				}, this);				
			}
		}

		return shapeArray;
	}

	getWidth() {
		this.fit();
		return this.width;
	}

	getHeight() {
		this.fit();
		return this.height;
	}

	getShape() {
		this.fit();
		return this.computeShape();		
	}
}



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_line__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shape_circle__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shape_polygon__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shape_text__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ThetaAxis; });






class ThetaAxis {
	constructor({ type = 'polar', thetaData, rData, x, y, width, height, tickCount = 5 }) {
		this.type = type;
		this.thetaData = thetaData;
		this.rData = rData;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		

		this.tickCount = tickCount;
	}

	computeShape() {

		let cx = this.x + this.width/2;
		let cy = this.y + this.height/2;
		let r = Math.min(this.width, this.height)/2 - 2*12;

		let tickArray = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["h" /* linearTick */])(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(this.rData), this.tickCount);
		let shapeArray = [];
		this.thetaData.forEach((item, index, array) => {
			let interval = 2*Math.PI/array.length;

			let radian = 3/2*Math.PI + index*interval;

			let x = cx + r*Math.cos(radian);
			let y = cy + r*Math.sin(radian);

			shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
				pointArray: [{ x: cx, y: cy }, { x: x, y: y }],
				style: {
					lineWidth: 1,
					strokeStyle: '#d9d9d9'					
				},
				isDashed: true
			}));
			if(this.type === 'polar')
				radian += interval/2;
			let textX = cx + (r + 12)*Math.cos(radian);
			let textY = cy + (r + 12)*Math.sin(radian);

			shapeArray.push(new __WEBPACK_IMPORTED_MODULE_4__shape_text__["a" /* Text */]({
				x: textX,
				y: textY,
				value: item,
				rotate: 1/2*Math.PI + radian,
				style: {
					textAlign: 'center',
					textBaseline: 'bottom',	
					fillStyle: '#222222'	
				}
			}));
		});

		let T = this.type === 'polar' ? __WEBPACK_IMPORTED_MODULE_2__shape_circle__["a" /* Circle */] : __WEBPACK_IMPORTED_MODULE_3__shape_polygon__["b" /* RegularPolygon */];

		tickArray.forEach((tick, index, array) => {
			shapeArray.push(new T({
				x: cx,
				y: cy,
				r: index*r/(array.length - 1),
				vertexNumber: this.thetaData.length,
				renderType: 'stroke',
				style: {
					lineWidth: 1,
					strokeStyle: index === array.length - 1 ? '#d9d9d9' : '#d9d9d9'
				}
			}));

			shapeArray.push(new __WEBPACK_IMPORTED_MODULE_4__shape_text__["a" /* Text */]({
				x: cx ,
				y: cy - index*r/(array.length - 1),
				value: tick,
				style: {
					textAlign: 'center',
					textBaseline: 'middle'
				}
			}));
		}, this);

		return shapeArray;
	}

	getShape() {
		return this.computeShape();
	}
}



/***/ }),
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_leerender__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_axis_linear__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_axis_theta__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_legend_legend__ = __webpack_require__(9);






let data = ['first class', 'second class', 'third class', 'forth class', 'fifth class'].map(function (item) {
	return {
		color: item,
		value: 100 + 100*Math.random()
	}
});

let leeRender = new __WEBPACK_IMPORTED_MODULE_0__src_leerender__["a" /* LeeRender */](document.querySelector('#leerender'));
let context = leeRender.getContext();

// let polarAxis = new PolarAxis({
//  type: 'radar'
// 	thetaData: ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.'],
// 	rData: data.map(item => item.value),
// 	x: 50,
// 	y: 50,
// 	width: 400,
// 	height: 400
// });

// leeRender.addShape(polarAxis.getShape());

let thetaAxis = new __WEBPACK_IMPORTED_MODULE_2__src_axis_theta__["a" /* ThetaAxis */]({
	type: 'radar',
	thetaData: ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.'],
	rData: data.map(item => item.value),
	x: 50,
	y: 50,
	width: 400,
	height: 400
});

leeRender.addShape(thetaAxis.getShape());








leeRender.render();



/***/ })
/******/ ]);