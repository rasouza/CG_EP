CanvasVTB = function(canvas) {
	this.canvas = canvas;
	this.width = canvas.width;
	this.height = canvas.height;
	VirtualTrackBall.prototype.setWinSize.call(this, this.width,
			this.height);
	
	this.canvas.addEventListener("mousedown", this.mouseDownHandler(),
			false);
	this.canvas.addEventListener("mouseup", this.mouseUpHandler(), false);
	this.canvas.addEventListener("mousemove", this.mouseMoveHandler(),
			false);
};

CanvasVTB.prototype = new VirtualTrackBall();

CanvasVTB.prototype.constructor = CanvasVTB;

CanvasVTB.prototype.mouseDownHandler = function() {
	var currentObj = this;
	return function(event) {
		currentObj.mousedown = true;
		var rect = currentObj.canvas.getBoundingClientRect();
		currentObj.setRotationStart(event.clientX - rect.left, event.clientY - rect.top);
	};
};

CanvasVTB.prototype.mouseUpHandler = function() {
	var currentObj = this;
	return function(event) {
		currentObj.mousedown = false;
	};
};

CanvasVTB.prototype.mouseMoveHandler = function() {
	var currentObj = this;
	return function(event) {
		if (currentObj.mousedown == true) {
			var rect = currentObj.canvas.getBoundingClientRect();
			var x = event.clientX - rect.left;
			var y = event.clientY - rect.top;
			currentObj.rotateTo(x, y);

			// applyVirtualTrackBallRotaion
			vMatrix.matrix = true;
			vtrm.matrix = true;
			vMatrix = mult(vMatrix, vtrm);
		}
	};
};

