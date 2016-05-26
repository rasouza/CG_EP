attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

attribute vec2 vTextureCoord;
varying vec2 textureCoord;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

varying vec3 vNormal;

void main(void) {
	gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
	vNormal = aVertexNormal;
	textureCoord = vTextureCoord;
}