var gl;
var canvas;
var cvtb;
var vtrm;
var program;

var vMatrix = mat4();
var pMatrix = mat4();
var texture;

var actor;

var InitDemo = function () {
	loadTextResource('./shaders/shader.vs.glsl', function (vsErr, vsText) {
		if (vsErr) {
			alert('Fatal error getting vertex shader (see console)');
			console.error(vsErr);
		} else {
			loadTextResource('./shaders/shader.fs.glsl', function (fsErr, fsText) {
				if (fsErr) {
					alert('Fatal error getting fragment shader (see console)');
					console.error(fsErr);
				} else {
					loadJSONResource('./model/Susan.json', function (modelErr, modelObj) {
						if (modelErr) {
							alert('Fatal error getting  model (see console)');
							console.error(fsErr);
						} else {
							loadImage('./texture/SusanTexture.png', function (imgErr, img) {
								if (imgErr) {
									alert('Fatal error getting  texture (see console)');
									console.error(imgErr);
								} else { 
									Inicia(vsText, fsText, img, modelObj);
								}
							});
						}
					});
				}
			});
		}
	});
};

var Inicia = function (vertexShaderText, fragmentShaderText, Image, Model) {
	console.log('This is working');

	iniciaGl();
	
	iniciaShader(vertexShaderText, fragmentShaderText);
	
 	actor = new Actor(Model);
 	actor.children.push(new Actor(Model,[3,0,3]));
 	actor.children.push(new Actor(Model,[-3,0,3]));
	
	iniciarTextura(Image);
	
	vMatrix = translate([0,0,-10]);
	pMatrix = perspective(45, canvas.width / canvas.height, 0.1, 100.0);
	

	//
	// Lighting information
	//
	gl.useProgram(program);

	var ambientUniformLocation = gl.getUniformLocation(program, 'ambientLightIntensity');
	var sunlightDirUniformLocation = gl.getUniformLocation(program, 'sun.direction');
	var sunlightIntUniformLocation = gl.getUniformLocation(program, 'sun.color');

	gl.uniform3f(ambientUniformLocation, 0.2, 0.2, 0.2);
	gl.uniform3f(sunlightDirUniformLocation, 3.0, 4.0, -2.0);
	gl.uniform3f(sunlightIntUniformLocation, 0.9, 0.9, 0.9);

	//
	// Main render loop
	//
	// var identityMatrix = new Float32Array(16);
	// mat4.identity(identityMatrix);
	// var angle = 0;
	// var xRotationMatrix = new Float32Array(16);
	// var yRotationMatrix = new Float32Array(16);
	var loop = function () {
		gl.clearColor(0.25, 0.25, 0.25, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.uniformMatrix4fv(program.vMatrixUniform, gl.FALSE, flatten(vMatrix));
		gl.uniformMatrix4fv(program.pMatrixUniform, gl.FALSE, flatten(pMatrix));
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.activeTexture(gl.TEXTURE0);
		
		actor.update([0,0,1]);
		
		vtrm=cvtb.getRotationMatrix();

		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
};

