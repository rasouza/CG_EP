var Camera = function(pos) {
	// Inicializadores
	this.position = pos;
	this.view = mat4();
	this.projection = perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
}

Camera.prototype.rotate = function(radians, axis) {	this.view = mult(this.view, rotate(radians, axis)); }
Camera.prototype.translate = function(v) {	this.view = mult(this.view, translate(v)); }