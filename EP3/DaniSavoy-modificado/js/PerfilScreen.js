var PerfilScreen = function(){
	
	this.id = "perfil";
	this.canvas = document.getElementById(this.id);
	this.gl = WebGLUtils.setupWebGL(this.canvas);
	
	this.tipoSelector = document.getElementById("tipoPerfil");
	this.segmentSelector = document.getElementById("segmentosPerfil");
	this.sigmaSelector = document.getElementById("sigmaPerfil");
	this.grauSelector = document.getElementById("grauPerfil");
	this.bar = document.getElementById("perfilBar");
	this.zerar = document.getElementById("zerarPerfil");
	
	this.controls;
	this.segments;
	
	var gl = this.gl;
	var projectionMatrix = mat4();
	var modelViewMatrix = mat4();
	
	this.setup = function(){	
		gl.clearColor(0, 0, 0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		this.program = initShaders(gl, "2d-vertex-shader", "2d-fragment-shader");
		gl.useProgram(this.program);
		
		this.resize();
		
		this.setupUniforms();
		this.setupAttributes();
	}
	
	this.setupUniforms = function(){
		var modelViewMatrixLoc = gl.getUniformLocation(this.program, "modelViewMatrix");
		var projectionMatrixLoc = gl.getUniformLocation(this.program, "projectionMatrix");

	
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	
		gl.uniform1f(gl.getUniformLocation(this.program,"pointSize"), 8.0);
		gl.uniform4f(gl.getUniformLocation(this.program,"color"), 1.0,0.3,0.3,1.0);
	}
	
	this.setupAttributes = function(){
		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
		
		this.vPosition = gl.getAttribLocation(this.program, "vPosition");
		gl.vertexAttribPointer(this.vPosition, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.vPosition);
	}
	
	this.drawControls = function(){
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(this.controls), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(this.vPosition);
		
		gl.uniform1f(gl.getUniformLocation(this.program,"pointSize"), 7.0);
		gl.uniform4f(gl.getUniformLocation(this.program,"color"), 1.0,0.3,0.3,1.0);
		
		gl.drawArrays(gl.POINTS, 0, this.controls.length);
		gl.drawArrays(gl.LINE_LOOP, 0, this.controls.length);
	}
	
	this.drawSegments = function(){
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(this.segments), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(this.vPosition);
		
		gl.uniform1f(gl.getUniformLocation(this.program,"pointSize"), 3.0);
		gl.uniform4f(gl.getUniformLocation(this.program,"color"), 1.0,1.0,1.0,1.0);
		
		gl.drawArrays(gl.POINTS, 0, this.segments.length);
		gl.drawArrays(gl.LINE_STRIP, 0, this.segments.length);
	}
	
	this.resize = function(e){
		// var w = window.innerWidth*0.33;
		var w = 350;
		var h = window.innerHeight-30;
		
		this.canvas.setAttribute("width",w);
		this.canvas.setAttribute("height",h);
		
		gl.viewport( 0, 0, this.canvas.width, this.canvas.height );
		
		this.volume.update(w,h);
		
		projectionMatrix = this.volume.getProjection();
		
	}
	
	this.draw = function(){
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		this.drawControls();
		this.drawSegments();
	}
	
	this.setup();
}

PerfilScreen.prototype = new Screen;