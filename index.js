(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let counter = 0;

const Ball = function({
    x,
    y,
    isUpdated
}) {    
    this._x = x;
    this._y = y;
    this._id = counter++;
    this._color = this.getColor();
    this._diameter = this.getDiameter();
    this._speed = this.getSpeed();
    this._sin = this.getSin();
    this._cos = this.getCos();
    this._isUpdated = isUpdated;
}

Ball.prototype.getX = function() {
    return this._x;
}

Ball.prototype.getY = function() {
    return this._y;
}

Ball.prototype.getId = function() {
    return this._id;
}

Ball.prototype.getColor = function() {
    const letters = '0123456789ABCDEF';
    this._color = '#';

    for (var i = 0; i < 6; i++) {
        this._color += letters[Math.floor(Math.random() * 16)];
    }
    
    return this._color;
}

Ball.prototype.getDiameter = function() {
    return this._diametr = Math.floor(Math.random() * (200 - 50) + 50);
}

Ball.prototype.getSpeed = function() {
    return this._speed = Math.floor(Math.random() * (50 - 10) + 10);
}

Ball.prototype.getSin = function() {
    return this._sin = Math.sin(Math.floor(Math.random() * 360) * Math.PI / 180);
}

Ball.prototype.getCos = function() {
    return this._cos = Math.cos(Math.floor(Math.random() * 360) * Math.PI / 180);
}

Ball.prototype.getIsUpdated = function() {
    return this._isUpdated;
}

module.exports = Ball;
},{}],2:[function(require,module,exports){
const Ball = require('./Ball');

const Controller = function(model, view) {
    this._model = model;
    this._view = view;
}

Controller.prototype.init = function() {
    this._view.init();
    
    this._view.onCanvasMouseDown(this.onMouseDown.bind(this));

    setInterval(this.animateFrame.bind(this), 40);
}

Controller.prototype.onMouseDown = function(x, y) {
    const ball = new Ball({x, y});

    this._tempX = x;
    this._tempY = y;

    this._model.addBall(ball);
}

Controller.prototype.animateFrame = function() {
    this._view._ctx.clearRect(0, 0, this._view._canvas.width, this._view._canvas.height, 1000);
    
    let arr = this._model.getBalls();

    for(let i = 0; i < arr.length; i++) {
        this._view.drawBall(arr[i]);
    }
}

module.exports = Controller;
},{"./Ball":1}],3:[function(require,module,exports){
const Model = function() {
    this._balls = [];
}

Model.prototype.getBalls = function() {
    return [...this._balls];
}

Model.prototype.addBall = function(ball) {
    this._balls.push(ball);
}

Model.prototype.deleteBall = function(id) {
    this._balls = this._balls.filter(ball => ball.id !== id);
}

Model.prototype.clearBalls = function() {
    this._balls = [];
}

module.exports = Model;
},{}],4:[function(require,module,exports){
const View = function () {
    this._root = document.getElementById('root');
    this._canvas = null;
    this._ctx = null;
}

View.prototype.init = function() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');

    const canvasWrapper = document.createElement('div');
    canvasWrapper.classList.add('wrapper__canvas-wrapper');

    this._canvas = this.constructCanvas();
    this._ctx = this._canvas.getContext('2d');
    canvasWrapper.append(this._canvas);
    wrapper.append(canvasWrapper);

    this._root.append(wrapper);
}

View.prototype.constructCanvas = function() {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', '1280');
    canvas.setAttribute('height', '720');
    canvas.classList.add('canvas-wrapper__canvas');

    return canvas;
}

View.prototype.onCanvasMouseDown = function(callback) {
    this._canvas.onmousedown = function(e) {
        const { layerX, layerY } = e;

        callback(layerX, layerY);
    }
}

View.prototype.drawBall = function(ball) {
    let xunits = ball._sin * ball._speed;
    let yunits = ball._cos * ball._speed;

    if (ball._x > this._canvas.width || ball._x < 0) {
        xunits = Math.PI / 180 - ball._sin;
    } else if (ball._y > this._canvas.height || ball._y < 0) {
        yunits = Math.PI / 360 - ball._cos;
    }

    ball._x += xunits;
    ball._y += yunits;

    this._ctx.strokeStyle = ball._color;
    this._ctx.fillStyle = ball._color;
    this._ctx.beginPath();
    this._ctx.arc(ball._x, ball._y, ball._diameter / 2, 0, 2 * Math.PI);
    this._ctx.closePath();
    this._ctx.fill();
    this._ctx.stroke();
}

module.exports = View;
},{}],5:[function(require,module,exports){
const Model = require('./Model');
const View = require('./View');
const Controller = require('./Controller');

const initialize = () => {
    const model = new Model();
    const view = new View();
    const controller = new Controller(model, view);

    controller.init();
}

initialize();
},{"./Controller":2,"./Model":3,"./View":4}]},{},[5]);
