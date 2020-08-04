function iniciaGl(){
	canvas = document.getElementById('game-surface');
	cvtb = new  CanvasVTB(canvas);
	gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
};
function iniciaShader(vertexShaderText, fragmentShaderText) {
	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}
	
	
	// Vertex Position
    program.vertexPositionAttribute = gl.getAttribLocation(program, "vertPosition");
    gl.enableVertexAttribArray(program.vertexPositionAttribute);

    // Normals
    program.vertexNormalAttribute = gl.getAttribLocation(program, "vertNormal");
    gl.enableVertexAttribArray(program.vertexNormalAttribute);
    
    // Texture
    program.textureCoord = gl.getAttribLocation(program, "vertTexCoord");
    gl.enableVertexAttribArray(program.textureCord);
	
	
	
	// MVP matrices
    program.pMatrixUniform = gl.getUniformLocation(program, "mProj");
    program.vMatrixUniform = gl.getUniformLocation(program, "mView");
    program.mMatrixUniform = gl.getUniformLocation(program, "mWorld");
	
	// Tell OpenGL state machine which program should be active.
	gl.useProgram(program);
};
function iniciarTextura(SusanImage) {
	//
	// Create texture
	//
	texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		SusanImage
	);
	gl.bindTexture(gl.TEXTURE_2D, null);
}