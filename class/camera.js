var Camera = function() {
	// Inicializadores
	this.position = vec3(0.0, 0.0, -10.0);
	this.view = translate([0, 0.0, -20.0]);
	this.projection = perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
}

Camera.prototype.rotate = function(radians, axis) {	this.view = mult(this.view, rotate(radians, axis)); }
Camera.prototype.translate = function(v) {	this.view = mult(this.view, translate(v)); }