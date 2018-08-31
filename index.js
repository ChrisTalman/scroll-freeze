(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: StackItem, ScrollFreezeError, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"StackItem\", function() { return StackItem; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ScrollFreezeError\", function() { return ScrollFreezeError; });\n\r\n;\r\n// Constants\r\nconst CSS_CLASS_NAME = 'bluecewe-scroll-freeze';\r\nconst CSS_CLASS = `\r\n\thtml.` + CSS_CLASS_NAME + ` > body\r\n\t{\r\n\t\tposition: fixed;\r\n\t}\r\n`;\r\n/** Manages a stack of requests for the DOM <body> to be unscrollable. */\r\nclass Manager {\r\n    constructor() {\r\n        this.stackMap = new Map();\r\n        this.stackCount = 0;\r\n        const styleElement = document.createElement('style');\r\n        styleElement.classList.add(CSS_CLASS_NAME);\r\n        document.head.insertBefore(styleElement, document.head.children[0]);\r\n        const stylesheet = Array.from(document.styleSheets).find(stylesheet => stylesheet.ownerNode === styleElement);\r\n        stylesheet.insertRule(CSS_CLASS, 0);\r\n    }\r\n    ;\r\n    /** Adds to the freeze stack. */\r\n    stack() {\r\n        const item = new StackItem(this.stackCount.toString());\r\n        this.stackCount++;\r\n        this.stackMap.set(item.id, item);\r\n        if (this.stackMap.size === 1) {\r\n            this.freeze();\r\n        }\r\n        ;\r\n        return item;\r\n    }\r\n    ;\r\n    /** Freezes body. */\r\n    freeze() {\r\n        document.body.style.top = -(document.documentElement.scrollTop) + 'px'; // Currently resets top when class is removed.\r\n        document.documentElement.classList.add(CSS_CLASS_NAME);\r\n    }\r\n    ;\r\n    /** Removes from freeze stack. */\r\n    unstack(item) {\r\n        const id = typeof item === 'string' ? item : item.id;\r\n        this.stackMap.delete(id);\r\n        if (this.stackMap.size === 0) {\r\n            this.unfreeze();\r\n        }\r\n        ;\r\n    }\r\n    ;\r\n    /** Unfreezes body. */\r\n    unfreeze() {\r\n        document.documentElement.classList.remove(CSS_CLASS_NAME);\r\n        const pixelsAsNumber = pixelsStringToNumber(document.body.style.top);\r\n        window.scrollTo(0, pixelsAsNumber);\r\n    }\r\n    ;\r\n}\r\n;\r\n/** An item on the freeze stack. */\r\nclass StackItem {\r\n    constructor(id) {\r\n        this.initialiseProperties(id);\r\n    }\r\n    ;\r\n    initialiseProperties(id) {\r\n        this.id = id;\r\n    }\r\n    ;\r\n    /** Removes the item from the freeze stack. */\r\n    unstack() {\r\n        instance.unstack(this.id);\r\n    }\r\n    ;\r\n}\r\n;\r\nfunction pixelsStringToNumber(string) {\r\n    const matches = string.match(/-?([\\d]+)/);\r\n    let numberMatch = null;\r\n    if (matches) {\r\n        numberMatch = matches[1];\r\n    }\r\n    ;\r\n    if (!numberMatch) {\r\n        ScrollFreezeError.throw({ message: '[Pixels String To Number] No number found.', code: 'missing' });\r\n    }\r\n    ;\r\n    const number = parseFloat(numberMatch);\r\n    return number;\r\n}\r\n;\r\nclass ScrollFreezeError extends Error {\r\n    static throw(parameters) {\r\n        throw new this(parameters);\r\n    }\r\n    ;\r\n    constructor(parameters) {\r\n        super(parameters.message);\r\n        this.code = parameters.code;\r\n    }\r\n    ;\r\n}\r\n;\r\n;\r\nconst instance = new Manager();\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (instance);\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ });
});