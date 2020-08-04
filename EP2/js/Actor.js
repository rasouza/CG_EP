// http://klauslaube.com.br/2011/05/16/fazendo-javascript-oo-de-forma-facil.html
Actor = function(model,position = [0,0,0]) {
    
    this.mMatrix = mult(mat4(),rotate(-90,[1,0,0]));
    this.mMatrix = mult(this.mMatrix,translate(position));
    this.Model;
    this.Vertices;
    this.Indices;
    this.TexCoords;
    this.Normals;
    
    this.vertexBufferObject;
    this.texCoordVertexBufferObject;
    this.indexBufferObject;
    this.normalBufferObject;
    
    this.inicializaBuffer(model);
    
    this.children = [];
    

    this.passo = -0.1;
    this.passoFilho = -0.1;
    this.time = 0;
    this.timeFilho = 0;
    
};
Actor.prototype.inicializaBuffer = function(Model) {
    this.Model = Model;
    //
	// Create buffer
	//
	this.Vertices = this.Model.meshes[0].vertices;
	this.Indices = [].concat.apply([], this.Model.meshes[0].faces);
	this.TexCoords = this.Model.meshes[0].texturecoords[0];
	this.Normals = this.Model.meshes[0].normals;

	this.vertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.Vertices), gl.STATIC_DRAW);

	this.texCoordVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.TexCoords), gl.STATIC_DRAW);

	this.indexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.Indices), gl.STATIC_DRAW);

	this.normalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.Normals), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferObject);
	gl.vertexAttribPointer(
		program.vertexPositionAttribute, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(program.vertexPositionAttribute);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordVertexBufferObject);
	gl.vertexAttribPointer(
		program.textureCoord , // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0
	);
	gl.enableVertexAttribArray(program.textureCoord);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBufferObject);
	gl.vertexAttribPointer(
		program.vertexNormalAttribute,
		3, gl.FLOAT,
		gl.TRUE,
		3 * Float32Array.BYTES_PER_ELEMENT,
		0
	);
	gl.enableVertexAttribArray(program.vertexNormalAttribute);
    
};


Actor.prototype.update = function(axis = [0,0,1],speedRotation =1) {
    // controle de animacao
    this.time += 0.01;
    this.timeFilho += 0.01;
    if(this.time >= 1){
        this.time = 0;
        this.passo = -this.passo;
    }

    if(this.timeFilho >= 0.5){
        this.timeFilho = 0;
        this.passoFilho = -this.passoFilho;
    }

    // aplicacao da animacao
    var dad_transform = translate([0,0,  this.passo]);

    this.mMatrix = mult(this.mMatrix, dad_transform);

    for (var i = 0; i < this.children.length; i++) {

		var son_transform2 = rotate(100,[0, 0, 1]);
		
		this.children[i].mMatrix = mult(this.children[i].mMatrix,son_transform2);
		this.children[i].mMatrix = mult(this.children[i].mMatrix,dad_transform);
        this.children[i].pushMarix();
    }
    
    this.pushMarix();
};


Actor.prototype.pushMarix = function(axis = [0,0,1],speedRotation =1) {
	gl.drawElements(gl.TRIANGLES, this.Indices.length, gl.UNSIGNED_SHORT, 0);
	gl.uniformMatrix4fv(program.mMatrixUniform, gl.FALSE, flatten(this.mMatrix));
};


