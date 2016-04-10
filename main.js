var gl;
var shaderProgram;

var piramideVertexPositionBuffer;
var piramideVertexColorBuffer;
var piramideNormalBuffer;

var mMatrix = mat4();
var pMatrix = mat4();
var vMatrix = mat4();

var uLightPosition = vec3(0.0, 0.0, 1.0);
var uCameraPosition = vec3(0.0, 0.0, -10.0);

// Iniciar o ambiente quando a página for carregada
$(function() {
    var canvas = $('#canvas')[0];
    $(canvas).width(window.innerWidth);
    $(canvas).height(window.innerHeight);

    iniciarGL(canvas); // Definir como um canvas 3D
    iniciarShaders(); // Obter e processar os Shaders
    iniciarBuffers(); // Enviar o triângulo e quadrado na GPU
    iniciarAmbiente(); // Definir background e cor do objeto
    tick();
});	

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function tick() {
    requestAnimFrame(tick);
    animar();
}

function iniciarGL(canvas) {
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;   

        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    catch (e) {
        if (!gl) console.log("Não pode inicializar WebGL, desculpe");
    }
}

function iniciarShaders() {
    var vertexShader = getShader(gl, "#shader-vs");
    var fragmentShader = getShader(gl, "#shader-fs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("Não pode inicializar shaders");
    }

    gl.useProgram(shaderProgram);

    // Vertex Position
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // Vertex Color
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    // Normals
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    // Light Position
    shaderProgram.lightPosition = gl.getUniformLocation(shaderProgram, "uLightPosition");    
    gl.uniform3fv(shaderProgram.lightPosition, uLightPosition);

    // Camera Position
    shaderProgram.cameraPosition = gl.getUniformLocation(shaderProgram, "uCameraPosition");    
    gl.uniform3fv(shaderProgram.cameraPosition, uCameraPosition);

    // MVP matrices
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
    shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");


}

function getShader(gl, id) {
    var shaderScript = $(id)[0];

    if (!shaderScript) return null;

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") shader = gl.createShader(gl.FRAGMENT_SHADER);
    else if (shaderScript.type == "x-shader/x-vertex") shader = gl.createShader(gl.VERTEX_SHADER);
    else return null;

    gl.shaderSource(shader, shaderScript.text);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function iniciarBuffers() {
    piramideVertexPositionBuffer = gl.createBuffer();
    piramideVertexPositionBuffer.itemSize = 3;
    piramideVertexPositionBuffer.vertices = [
        // Frente
         0.0 			, 1.0 , 0.0  			, 
        -Math.sqrt(0.5) , 0.0 , Math.sqrt(0.5)	,
         Math.sqrt(0.5) , 0.0 , Math.sqrt(0.5)  ,

        // Direita
         0.0 			, 1.0 , 0.0  			, 
         Math.sqrt(0.5) , 0.0 ,  Math.sqrt(0.5) ,
         Math.sqrt(0.5) , 0.0 , -Math.sqrt(0.5) ,
        // Trás
         0.0 			, 1.0 , 0.0  			, 
         Math.sqrt(0.5) , 0.0 , -Math.sqrt(0.5) , 
        -Math.sqrt(0.5) , 0.0 , -Math.sqrt(0.5) ,
        // Esquerda
         0.0 			, 1.0 , 0.0  			,  
        -Math.sqrt(0.5) , 0.0 , -Math.sqrt(0.5) , 
        -Math.sqrt(0.5) , 0.0 ,  Math.sqrt(0.5) ,

        // Frente
        0.0				, -1.0 , 0.0			, 
       -Math.sqrt(0.5)	,  0.0 , Math.sqrt(0.5) ,
        Math.sqrt(0.5)	,  0.0 , Math.sqrt(0.5) ,
        // Direita
        0.0				, -1.0 , 0.0			, 
        Math.sqrt(0.5) ,  0.0 ,  Math.sqrt(0.5) ,
        Math.sqrt(0.5) ,  0.0 , -Math.sqrt(0.5) ,
        // Trás
        0.0				, -1.0 , 0.0			, 
        Math.sqrt(0.5) ,  0.0 , -Math.sqrt(0.5) , 
       -Math.sqrt(0.5) ,  0.0 , -Math.sqrt(0.5) ,
        // Esquerda
        0.0				, -1.0 , 0.0			,  
       -Math.sqrt(0.5) ,  0.0 , -Math.sqrt(0.5) , 
       -Math.sqrt(0.5) ,  0.0 ,  Math.sqrt(0.5)
    ];
    piramideVertexPositionBuffer.numItems = piramideVertexPositionBuffer.vertices.length / piramideVertexPositionBuffer.itemSize;
	gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(piramideVertexPositionBuffer.vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, piramideVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);


    piramideVertexColorBuffer = gl.createBuffer();
    piramideVertexColorBuffer.itemSize = 4;
    piramideVertexColorBuffer.cores = [
        // Frente
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        //DIREITA
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        //TRAZ
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        //ESQUERDA
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,

        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,

        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,

        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
    ];
    piramideVertexColorBuffer.numItems = piramideVertexColorBuffer.cores.length / piramideVertexColorBuffer.itemSize;
    gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(piramideVertexColorBuffer.cores), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, piramideVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    piramideNormalBuffer = gl.createBuffer();
    piramideNormalBuffer.itemSize = 3;
    piramideNormalBuffer.normals = getNormals(piramideVertexPositionBuffer.vertices);
    piramideNormalBuffer.numItems = piramideNormalBuffer.normals.length / piramideNormalBuffer.itemSize;
    gl.bindBuffer(gl.ARRAY_BUFFER, piramideNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(piramideNormalBuffer.normals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.normals, piramideNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
}

function iniciarAmbiente() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Posiciona a câmera para visualizar o tetraedro
    pMatrix = perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    vMatrix = translate([0, 0.0, -10.0]);

    // Posiciona o tetraedro no topo da tela
    mMatrix = translate([0.0, 3.0, 0.0]);
    
}

function desenharCena() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Envia o MVP para a GPU
    setMatrixUniforms();
    console.log($("[name=pause]").is(':checked'));
    desenha_poligono(piramideVertexPositionBuffer.vertices, piramideVertexColorBuffer.cores, $("[name=mode]:checked").val());
    //gl.drawArrays(gl.TRIANGLES, 0, piramideVertexPositionBuffer.numItems);// smooth
    
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, flatten(pMatrix));
    gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, flatten(vMatrix));
    gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, flatten(mMatrix));
}


var ultimo = 0;
var deltaT = 0;
function animar() {
    var agora = new Date().getTime();
    // Ignora o primeiro frame
    if (ultimo != 0) {
    	deltaT = (agora - ultimo)/1000;
    	pingar();
    }
    ultimo = agora;

    desenharCena();
}

var g = -1;
var h = 3;
var speed = 0;
var cont = 4; // Número maximo de pingos
function pingar() {
	if (cont > 0 && !$("[name=pause]").is(':checked')) {
		speed += g*deltaT;

		mMatrix = mult(mMatrix, translate([0.0, speed, 0.0]));

		// Quando bate no chao
		if (mMatrix[1][3] < -3) {
	    	mMatrix = oldMatrix;
	    	speed = -speed*0.8;
	    	cont--;

	    	divide_poligono(piramideVertexPositionBuffer.vertices);
		}

		oldMatrix = mMatrix;

		// setMatrixUniforms();
	}
}

function divide_triangulo(v) {
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
}

function getNormals(v) {
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

        result.push(n1, n2, n3);
    }

    return flatten(result);
}

function divide_poligono(v) {
	var result = [];
	for (var i = 0; i+9 <= v.length; i += 9)
		result.push(divide_triangulo(v.slice(i, i+9)));

	var vertices = flatten(result);
	piramideVertexPositionBuffer.vertices = vertices;
	piramideVertexPositionBuffer.numItems = vertices.length / piramideVertexPositionBuffer.itemSize;

	var cores = cria_cor(piramideVertexPositionBuffer.numItems);
	piramideVertexColorBuffer.cores = cores;
	piramideVertexColorBuffer.numItems = cores.length / piramideVertexColorBuffer.itemSize;

    var normals = getNormals(piramideVertexPositionBuffer.vertices);
    piramideNormalBuffer.normals = normals;
    piramideNormalBuffer.numItems = normals.length;
}

function desenha_poligono(vertices, cores, type) {
	// Vertices
	piramideVertexPositionBuffer.vertices = vertices;
	piramideVertexPositionBuffer.numItems = vertices.length / piramideVertexPositionBuffer.itemSize;

	gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, piramideVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Normais
    piramideNormalBuffer.normals = vertices;
    piramideNormalBuffer.numItems = piramideNormalBuffer.normals.length / piramideNormalBuffer.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, piramideNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(piramideNormalBuffer.normals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, piramideNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Cores
    piramideVertexColorBuffer.cores = cores;
    piramideVertexColorBuffer.numItems = cores.length / piramideVertexColorBuffer.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cores), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, piramideVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(type, 0, piramideVertexPositionBuffer.numItems);
}

function cria_cor(numItems) {
	var result = []
	for (var i = 0; i < numItems; i++)
		result.push(vec4(0.0, 1.0, 1.0, 1.0));

	return flatten(result);
}
