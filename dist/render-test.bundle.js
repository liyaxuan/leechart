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
/******/ 	return __webpack_require__(__webpack_require__.s = 24);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
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

/***/ 2:
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

/***/ 24:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_leerender__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_shape_rect__ = __webpack_require__(5);



let leeRender = new __WEBPACK_IMPORTED_MODULE_0__src_leerender__["a" /* LeeRender */](document.querySelector('#leerender'));
let rect = new __WEBPACK_IMPORTED_MODULE_1__src_shape_rect__["a" /* Rect */]({
	x: 10,
	y: 10,
	width: 200,
	height: 200
})
rect.addEventListener('mousemove', function (context, x, y) {
	console.log(x, y);
})
leeRender.addShape(rect);
leeRender.render();

/***/ }),

/***/ 3:
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

/***/ 5:
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



/***/ })

/******/ });