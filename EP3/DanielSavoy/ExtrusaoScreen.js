var ExtrusaoScreen = function(){

	this.id = "solido";
	this.canvas = document.getElementById(this.id);
	this.gl = WebGLUtils.setupWebGL(this.canvas);
	this.scaleSelector = document.getElementById("scalePerfil");
	this.rx = document.getElementById("rotateX");
	this.ry = document.getElementById("rotateY");
	this.rz = document.getElementById("rotateZ");
	
	this.segments = [];
	
	var gl = this.gl;
	var projectionMatrix = mat4();
	var modelViewMatrix = mat4();
	
	this.setup = function(){	
		gl.clearColor(0.2, 0.2, 0.2, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		this.program = initShaders(gl, "3d-vertex-shader", "2d-fragment-shader");
		gl.useProgram(this.program);
		
		this.resize();
		
		this.setupUniforms();
		this.setupAttributes();
	}
	
	this.updateMatrix = function(m){
		modelViewMatrix = mult(m,modelViewMatrix);
		this.setupUniforms();
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
		gl.vertexAttribPointer(this.vPosition, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.vPosition);
	}
	
	this.drawSegments = function(){
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(this.segments), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(this.vPosition);
		
		gl.uniform1f(gl.getUniformLocation(this.program,"pointSize"), 3.0);
		gl.uniform4f(gl.getUniformLocation(this.program,"color"), 1.0,1.0,1.0,1.0);
		
		gl.drawArrays(gl.POINTS, 0, this.segments.length);
		//gl.drawArrays(gl.LINE_STRIP, 0, this.segments.length);
	}
	
	this.resize = function(e){
		var w = window.innerWidth*0.33;
		var h = window.innerHeight-30;
		
		this.canvas.setAttribute("width",w);
		this.canvas.setAttribute("height",h);
		
		gl.viewport( 0, 0, this.canvas.width, this.canvas.height );
		
		this.volume.update(w,h);
		
		projectionMatrix = this.volume.getProjection();
		
	}
	
	this.draw = function(){
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		this.drawSegments();
	}
	
	this.setup();


}

ExtrusaoScreen.prototype = new Screen;