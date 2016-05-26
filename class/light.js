var Light = function(pos) {
	// Inicializadores
	this.position = pos;

	this.ambient = vec4(0.03,0.03,0.03,1.0);
	this.diffuse = vec4(1.0,1.0,1.0,1.0);
	this.specular = vec4(1.0,1.0,1.0,1.0);
}

Light.prototype.rotate = function(radians, axis) {	this.view = mult(this.view, rotate(radians, axis)); }
Light.prototype.translate = function(v) {	this.view = mult(this.view, translate(v)); }