// http://klauslaube.com.br/2011/05/16/fazendo-javascript-oo-de-forma-facil.html
var Actor = function() {
	// VARIAVEIS DE SHADER 
    this.vertexPositionBuffer;
	this.normalBuffer;
	this.mMatrix = mat4();
	this.shaderProgram;

	// VARIAVEIS DO OBJETO
    this.vertices;
    this.normals;
    this.animation = null;
    this.children = [];

    this.passo = -0.1;
    this.passoFilho = -0.1;
    this.time = 0;
    this.timeFilho = 0;
};
Actor.prototype.inicializaBuffer = function() {
    // Vertices da piramide
    this.vertexPositionBuffer = gl.createBuffer();
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.vertices = this.vertices;
    this.vertexPositionBuffer.numItems = this.vertexPositionBuffer.vertices.length / this.vertexPositionBuffer.itemSize;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexPositionBuffer.vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Normais da piramide
    this.normalBuffer = gl.createBuffer();
    this.normalBuffer.itemSize = 3;
    this.normalBuffer.normals = this.getNormals(this.vertexPositionBuffer.vertices);
    this.normalBuffer.numItems = this.normalBuffer.normals.length / this.normalBuffer.itemSize;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalBuffer.normals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.normals, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
};

Actor.prototype.inicializaObjeto = function(x=0,y=0,z=0) {
	// Posiciona o tetraedro no topo da tela
    this.mMatrix = translate([x, y, z]);
    this.divide_poligono(this.vertexPositionBuffer.vertices);
};

Actor.prototype.update = function() {
    // Vertices
    gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, flatten(this.mMatrix));
    this.vertexPositionBuffer.vertices = this.vertices;
    this.vertexPositionBuffer.numItems = this.vertices.length / this.vertexPositionBuffer.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Normais
    this.normalBuffer.normals = this.vertices;
    this.normalBuffer.numItems = this.normalBuffer.normals.length / this.normalBuffer.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalBuffer.normals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(4, 0, this.vertexPositionBuffer.numItems);

    for (var i = 0; i < this.children.length; i++) {
        this.children[i].update();
    }
};




Actor.prototype.animationUpdate = function(deltaT,propagation = null) {
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
    var dad_transform = translate([0.0, this.passo, 0.0]);

    this.mMatrix = mult(this.mMatrix, dad_transform);

    for (var i = 0; i < this.children.length; i++) {

        if(i %2 == 0)
            var son_transform = translate([this.passoFilho, 0, 0.0]);
        else
            var son_transform = translate([-this.passoFilho, 0, 0.0]);

        var savaMatrix = this.children[i].mMatrix;
        var composicaoPaiFilho = mult(dad_transform,son_transform);

        this.children[i].mMatrix = mat4();
        this.children[i].mMatrix = mult(this.children[i].mMatrix,rotate(10,[0,1,0]));// FAZ A ROTAÇÃO
        this.children[i].mMatrix = mult(this.children[i].mMatrix,savaMatrix);// FAZ A ROTAÇÃO
        this.children[i].mMatrix = mult(this.children[i].mMatrix,composicaoPaiFilho);// FAZ A ROTAÇÃO
    }
};


// FUNCOES ADICIONAIS
Actor.prototype.divide_poligono = function(v) {
	var result = [];
    for (var i = 0; i+9 <= v.length; i += 9)
        result.push(this.divide_triangulo(v.slice(i, i+9)));

    this.vertices = flatten(result);
    this.vertexPositionBuffer.vertices = this.vertices;
    this.vertexPositionBuffer.numItems = this.vertices.length / this.vertexPositionBuffer.itemSize;

    this.normals = this.getNormals(this.vertexPositionBuffer.vertices);
    this.normalBuffer.normals = this.normals;
    this.normalBuffer.numItems = this.normals.length;
};
Actor.prototype.divide_triangulo = function(v) {
	var result = [];

    var m1 = vec3((v[0]+v[3])/2, (v[1]+v[4])/2, (v[2]+v[5])/2);
    var m2 = vec3((v[0]+v[6])/2, (v[1]+v[7])/2, (v[2]+v[8])/2);
    var m3 = vec3((v[3]+v[6])/2, (v[4]+v[7])/2, (v[5]+v[8])/2);

    // === Triangulo de cima ===
    result.push(vec3(v[0], v[1], v[2]));
    result.push(normalize(m1));
    result.push(normalize(m2));

    // === Triangulo da esquerda ===
    result.push(normalize(m1));
    result.push(vec3(v[3], v[4], v[5]));
    result.push(normalize(m3));

    // === Triangulo da esquerda ===
    result.push(normalize(m2));
    result.push(normalize(m3));
    result.push(vec3(v[6], v[7], v[8]));

    // === Triangulo do meio ===
    result.push(normalize(m1));
    result.push(normalize(m2));
    result.push(normalize(m3));

    return flatten(result);
};
Actor.prototype.getNormals = function(v) {
	var result = [];
    var A, B, C;
    var n1, n2, n3;

    // Para cada triangulo, calcula o produto vetorial
    for (var i = 0; i+9 <= v.length; i += 9) {
        A = vec3(v[i], v[i+1], v[i+2]);
        B = vec3(v[i+3], v[i+4], v[i+5]);
        C = vec3(v[i+6], v[i+7], v[i+8]);

        n1 = cross(subtract(B, A), subtract(C, A));
        n2 = cross(subtract(A, B), subtract(C, B));
        n3 = cross(subtract(A, C), subtract(B, C));

        result.push(normalize(n1), normalize(n2), normalize(n3));
    }

    return flatten(result);
};